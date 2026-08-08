import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import type { NavigateFunction } from "react-router";
import type { Message, Thread } from "@/types/forum";
import type { MessageDeletionResponse, RestoreResponse } from "@/schemas/forum";
import { useAllowedActions } from "@/hooks/data/useAllowedActions";

export interface ForumThreadProps {
  pageNumber: string;
}

const MSG_ADMIN: BBPermission[] = ["ZFGC_MESSAGE_ADMIN"];
const MSG_EDITOR: BBPermission[] = ["ZFGC_MESSAGE_EDITOR"];
const MSG_VIEWER: BBPermission[] = ["ZFGC_MESSAGE_VIEWER"];
const THREAD_PAGE_SIZE = 10;
const EMPTY_ATTACHMENTS: Message["fileAttachments"] = [];

const threadIsRecycledContent = (thread: Thread) =>
  (thread.recycledFromBoardId !== null &&
    thread.recycledFromBoardId !== undefined) ||
  (thread.recycledFromThreadId !== null &&
    thread.recycledFromThreadId !== undefined);

const invalidateForumContent = (
  queryClient: QueryClient,
  threadIds: (number | undefined)[],
) => {
  const threadKeyPrefixes = threadIds
    .filter(
      (threadId): threadId is number =>
        threadId !== null && threadId !== undefined,
    )
    .map((threadId) => `/thread/${threadId}`);
  void queryClient.invalidateQueries({
    predicate: (query) => {
      const key = query.queryKey[0];
      if (typeof key !== "string") return false;
      if (key.startsWith("/board/")) return true;
      return threadKeyPrefixes.some(
        (prefix) =>
          key === prefix ||
          key.startsWith(`${prefix}?`) ||
          key.startsWith(`${prefix}/`),
      );
    },
  });
};

const navigateAfterRestore = (
  navigate: NavigateFunction,
  response: RestoreResponse,
  anchorMessageId?: number,
) => {
  if (response.mode === "MERGED_INTO_ORIGIN") {
    const restoredPage = Math.max(
      Math.ceil((response.postInThread ?? 1) / THREAD_PAGE_SIZE),
      1,
    );
    const anchor =
      anchorMessageId === null || anchorMessageId === undefined
        ? ""
        : `#msg${anchorMessageId}`;
    void navigate(
      `/forum/thread/${response.threadId}/${restoredPage}${anchor}`,
    );
    return;
  }
  void navigate(`/forum/thread/${response.threadId}/1`);
};

type RestoreTarget = "message" | "thread";

const shouldRestoreThreadInstead = (error: unknown) =>
  getResponseStatus(error) === 409 &&
  getProblemDetail(error) === "RESTORE_THREAD_INSTEAD";

const restoreFailureText = (error: unknown) => {
  if (getResponseStatus(error) === 409) {
    const reason = getProblemDetail(error);
    if (reason === "NOT_RECYCLED")
      return "This content is no longer in the recycle bin.";
    if (reason === "RESTORE_TARGET_MISSING")
      return "The original board no longer exists. Move the thread manually instead.";
    if (reason === "RESTORE_STATE_CHANGED")
      return "Someone else changed this content while you were viewing it. Refresh and try again.";
  }
  if (getResponseStatus(error) === 403)
    return "You are not allowed to restore this into its original board.";
  return "Failed to restore.";
};

function MessageRemovalConfirm({
  message,
  thread,
  currentPage,
  onClose,
}: {
  message: Message;
  thread: Thread;
  currentPage: number;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isPermanent =
    !thread.recycleBinEnabled || threadIsRecycledContent(thread);
  const isLastMessageOnPage = (thread.messages?.length ?? 0) === 1;
  const isSolePost = thread.pageCount <= 1 && isLastMessageOnPage;

  const finishRemoval = (response?: MessageDeletionResponse) => {
    onClose();
    invalidateForumContent(queryClient, [thread.id, response?.recycleThreadId]);
    if (response) {
      if (response.originThreadRecycled || response.originThreadDeleted) {
        void navigate(`/forum/board/${response.boardId ?? thread.boardId}/1`);
        return;
      }
      if (
        response.pageCount !== null &&
        response.pageCount !== undefined &&
        currentPage > response.pageCount
      )
        void navigate(
          `/forum/thread/${thread.id}/${Math.max(response.pageCount, 1)}`,
        );
      return;
    }
    if (isSolePost) {
      void navigate(`/forum/board/${thread.boardId}/1`);
      return;
    }
    if (isLastMessageOnPage && currentPage > 1)
      void navigate(`/forum/thread/${thread.id}/${currentPage - 1}`);
  };

  const removeMutation = useBBMutation({
    request: () => ({ url: `/message/${message.id}`, method: "DELETE" }),
    schema: MessageDeletionResponseSchema,
    onSuccess: (response) => {
      finishRemoval(response);
    },
    onError: (error) => {
      if (getResponseStatus(error) === 404) finishRemoval();
    },
  });

  const removalStatus = removeMutation.isError
    ? getResponseStatus(removeMutation.error)
    : undefined;
  const removalErrorText =
    removeMutation.isError && removalStatus !== 404
      ? removalStatus === 403
        ? "You are not allowed to remove this post."
        : "Failed to remove the post."
      : null;
  const handleRemove = useCallback(() => {
    removeMutation.mutate();
  }, [removeMutation]);

  return (
    <div className="border-b border-default bg-accented p-3 text-sm space-y-2">
      <p className="font-semibold">
        {isPermanent
          ? "Permanently delete this post?"
          : "Move this post to the recycle bin?"}
      </p>
      <p>
        {isPermanent
          ? "The post and its attachments will be permanently deleted. This cannot be undone."
          : "The post will be moved to the recycle bin, where staff can restore it later."}{" "}
        Quotes of this post inside other posts are not affected.
      </p>
      {isSolePost && (
        <p>
          {isPermanent
            ? "This is the only post in the thread, so the thread will also be permanently deleted."
            : "This is the only post in the thread, so the whole thread will be moved to the recycle bin."}
        </p>
      )}
      {removalErrorText && <p className="text-error">{removalErrorText}</p>}
      <BBFlex gap="gap-2" align="center">
        <BBButton
          variant={isPermanent ? "destructive" : "default"}
          disabled={removeMutation.isPending}
          onClick={handleRemove}
        >
          {removeMutation.isPending
            ? isPermanent
              ? "Deleting..."
              : "Moving..."
            : isPermanent
              ? "Delete permanently"
              : "Move to recycle bin"}
        </BBButton>
        <BBButton disabled={removeMutation.isPending} onClick={onClose}>
          Cancel
        </BBButton>
      </BBFlex>
    </div>
  );
}

function RecycledThreadNotice({ thread }: { thread: Thread }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [restoreNotice, setRestoreNotice] = useState<string | null>(null);
  const isWrapper =
    thread.recycledFromThreadId !== null &&
    thread.recycledFromThreadId !== undefined;

  const restoreThreadMutation = useBBMutation({
    request: () => ({ url: `/thread/${thread.id}/restore`, method: "PUT" }),
    schema: RestoreResponseSchema,
    onSuccess: (response) => {
      invalidateForumContent(queryClient, [thread.id, response.threadId]);
      navigateAfterRestore(navigate, response);
    },
    onError: (error) => {
      setRestoreNotice(restoreFailureText(error));
      invalidateForumContent(queryClient, [thread.id]);
    },
  });
  const handleRestore = useCallback(() => {
    setRestoreNotice(null);
    restoreThreadMutation.mutate();
  }, [restoreThreadMutation]);

  return (
    <div className="border-2 border-default bg-accented p-3 text-sm space-y-2">
      <p>
        {isWrapper
          ? "This post is in the recycle bin. It was removed from another thread."
          : "This thread is in the recycle bin."}{" "}
        Deleting content here is permanent.
      </p>
      {restoreNotice && <p className="text-error">{restoreNotice}</p>}
      <BBButton
        disabled={restoreThreadMutation.isPending}
        onClick={handleRestore}
      >
        {restoreThreadMutation.isPending
          ? "Restoring..."
          : isWrapper
            ? "Restore post to its original thread"
            : "Restore thread"}
      </BBButton>
    </div>
  );
}

const ThreadMessage = memo(function ThreadMessage({
  message,
  thread,
  currentPage,
  isEven,
  onQuote,
  onModify,
  permalink,
  canReply,
  isTargeted,
}: {
  message: Message;
  thread: Thread;
  currentPage: number;
  isEven: boolean;
  onQuote: (message: Message) => void;
  onModify: (message: Message) => void;
  permalink: string;
  canReply: boolean;
  isTargeted: boolean;
}) {
  const messageRef = useScrollIntoViewWhen<HTMLDivElement>(isTargeted);
  const rowBackground = isEven ? "bg-elevated" : "bg-muted";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showRemovalConfirm, setShowRemovalConfirm] = useState(false);
  const [restoreNotice, setRestoreNotice] = useState<string | null>(null);

  const { actions: messageActions, isLoaded: messageActionsLoaded } =
    useAllowedActions(
      `/message/${message.id}/allowed-actions`,
      message.id !== null && message.id !== undefined,
    );
  const canRemove =
    messageActionsLoaded && messageActions.has("message.delete");
  const canRestore =
    messageActionsLoaded && messageActions.has("message.restore");

  const restoreMutation = useBBMutation<
    RestoreTarget,
    typeof RestoreResponseSchema
  >({
    request: (target) => ({
      url:
        target === "thread"
          ? `/thread/${thread.id}/restore`
          : `/message/${message.id}/restore`,
      method: "PUT",
    }),
    schema: RestoreResponseSchema,
    onSuccess: (response) => {
      invalidateForumContent(queryClient, [thread.id, response.threadId]);
      navigateAfterRestore(navigate, response, message.id);
    },
    onError: (error, target) => {
      if (target === "message" && shouldRestoreThreadInstead(error)) {
        restoreMutation.mutate("thread");
        return;
      }
      setRestoreNotice(restoreFailureText(error));
      invalidateForumContent(queryClient, [thread.id]);
    },
  });

  const restorePending = restoreMutation.isPending;
  const handleQuote = useCallback(() => {
    onQuote(message);
  }, [message, onQuote]);
  const handleModify = useCallback(() => {
    onModify(message);
  }, [message, onModify]);
  const handleRestore = useCallback(() => {
    setRestoreNotice(null);
    restoreMutation.mutate("message");
  }, [restoreMutation]);
  const handleRemovalToggle = useCallback(() => {
    setRestoreNotice(null);
    setShowRemovalConfirm((current) => !current);
  }, []);
  const handleRemovalClose = useCallback(() => {
    setShowRemovalConfirm(false);
  }, []);

  return (
    <div
      ref={messageRef}
      id={`msg${message.id}`}
      className="flex flex-col min-h-75 scroll-mt-4"
    >
      <div className="flex flex-row items-stretch min-h-16">
        <div
          className={`w-28 md:w-34 lg:w-64 shrink-0 border-r border-b border-default p-3 ${rowBackground}`}
        >
          <UserLeftPaneHeader user={message.createdUser ?? undefined} />
        </div>
        <div
          className={`flex flex-1 min-w-0 border-b border-default p-3 ${rowBackground} items-start`}
        >
          <BBFlex
            justify="between"
            align="start"
            gap="gap-4"
            className="w-full min-w-0"
            wrap={false}
          >
            <div className="text-sm min-w-0">
              <div>
                <BBLink
                  to={permalink}
                  className="hover:underline"
                  title="Link to this post"
                >
                  <BBDate dateStr={message.createdTs} long />
                </BBLink>
                <BBHasPermission requiredPermissions={MSG_ADMIN}>
                  <span className="text-muted">- 192.168.1.1</span>
                </BBHasPermission>
              </div>
              {message.updatedTs && message.updatedTs !== message.createdTs && (
                <div className="text-muted">
                  Last Edit: <BBDate dateStr={message.updatedTs} long />
                </div>
              )}
            </div>

            <BBFlex
              gap="gap-4"
              align="start"
              wrap={false}
              className="text-sm shrink-0"
            >
              <BBFlex gap="gap-2" wrap={true}>
                {canReply && (
                  <button
                    type="button"
                    className="text-toned hover:transition-colors"
                    onClick={handleQuote}
                  >
                    <Fa6SolidReply className="mr-1" />
                    <span className="hidden sm:inline">Reply</span>
                  </button>
                )}
                <BBHasPermission requiredPermissions={MSG_EDITOR}>
                  <button
                    type="button"
                    className="text-toned hover:transition-colors"
                    onClick={handleModify}
                  >
                    <BBIcon name="modify" className="mr-1" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                </BBHasPermission>
                {canRestore && (
                  <button
                    type="button"
                    className="text-toned hover:transition-colors"
                    disabled={restorePending}
                    onClick={handleRestore}
                  >
                    <BBIcon name="approve" className="mr-1" />
                    <span className="hidden sm:inline">
                      {restorePending ? "Restoring..." : "Restore"}
                    </span>
                  </button>
                )}
                <BBHasPermission requiredPermissions={MSG_ADMIN}>
                  <button
                    type="button"
                    className="text-toned hover:transition-colors hidden md:inline-flex"
                  >
                    <BBIcon name="split" className="mr-1" />
                    Split
                  </button>
                </BBHasPermission>
                <BBHasPermission requiredPermissions={MSG_VIEWER}>
                  <button
                    type="button"
                    className="text-toned hover:transition-colors hidden md:inline-flex"
                  >
                    <BBIcon name="history" className="mr-1" />
                    History
                  </button>
                </BBHasPermission>
                <BBHasPermission requiredPermissions={MSG_EDITOR}>
                  <button
                    type="button"
                    className="text-toned hover:transition-colors hidden lg:inline-flex"
                  >
                    <BBIcon name="suspect" className="mr-1" />
                    Report
                  </button>
                </BBHasPermission>
                <BBHasPermission requiredPermissions={MSG_ADMIN}>
                  <button
                    type="button"
                    className="text-toned hover:transition-colors hidden lg:inline-flex"
                  >
                    <BBIcon name="warn" className="mr-1" />
                    Warn
                  </button>
                </BBHasPermission>
              </BBFlex>
              {canRemove && (
                <button
                  type="button"
                  className="text-toned hover:transition-colors shrink-0"
                  onClick={handleRemovalToggle}
                >
                  <BBIcon name="delete" className="mr-1" />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              )}
            </BBFlex>
          </BBFlex>
        </div>
      </div>

      {restoreNotice && (
        <div className="border-b border-default bg-accented p-3 text-sm text-error">
          {restoreNotice}
        </div>
      )}
      {showRemovalConfirm && (
        <MessageRemovalConfirm
          message={message}
          thread={thread}
          currentPage={currentPage}
          onClose={handleRemovalClose}
        />
      )}

      <div className="flex flex-row flex-1 items-stretch">
        <div
          className={`w-28 md:w-34 lg:w-64 shrink-0 border-r border-default ${rowBackground}`}
        >
          <UserLeftPaneBody user={message.createdUser ?? undefined} />
        </div>
        <div className="flex flex-1 flex-col grow min-w-0">
          <UserMessage
            messageText={message.currentMessage.messageText}
            isEven={isEven}
          />
          <MessageAttachments
            attachments={message.fileAttachments ?? EMPTY_ATTACHMENTS}
            isEven={isEven}
          />
          <ReactionBar
            reactableId={message.id}
            className={`${rowBackground} px-3 py-2`}
          />
          <UserSignature
            user={message.createdUser ?? undefined}
            isEven={isEven}
          />
        </div>
      </div>
    </div>
  );
});

function ThreadView({
  thread,
  currentPage,
  canReply,
  canRestoreThread,
  showReplyBox,
  quoteSeed,
  quoteSeedNonce,
  onQuote,
  onModify,
  targetedMessageId,
}: {
  thread: Thread;
  currentPage: number;
  canReply: boolean;
  canRestoreThread: boolean;
  showReplyBox: boolean;
  quoteSeed?: string | undefined;
  quoteSeedNonce: number;
  onQuote: (message: Message) => void;
  onModify: () => void;
  targetedMessageId: number | null;
}) {
  const navigate = useNavigate();
  const threadId = thread.id;
  const reactableIds = useMemo(
    () => (thread.messages ?? []).map((message) => message.id),
    [thread.messages],
  );
  const loadNewPage = useCallback(
    (nextPage: number) => {
      void navigate(`/forum/thread/${threadId}/${nextPage}`);
    },
    [navigate, threadId],
  );

  return (
    <>
      <div className="space-y-4">
        {canRestoreThread && threadIsRecycledContent(thread) && (
          <RecycledThreadNotice thread={thread} />
        )}
        <PaginatorBar
          numPages={thread.pageCount ?? currentPage}
          currentPage={currentPage}
          onPageChange={loadNewPage}
        />

        {thread.pollInfo && <PollResults poll={thread.pollInfo} />}
        <BBWidget
          widgetTitle={thread.threadName}
          className="shadow-panel"
          contentContainerClassName="border-default border-1 border-t-0"
        >
          <ReactionsProvider
            reactableType="MESSAGE"
            reactableIds={reactableIds}
          >
            <div className="divide-y divide-default">
              {thread.messages?.map((message, index) => (
                <ThreadMessage
                  key={message.id}
                  message={message}
                  thread={thread}
                  currentPage={currentPage}
                  isEven={index % 2 === 0}
                  onQuote={onQuote}
                  onModify={onModify}
                  permalink={`/forum/thread/${threadId}/${currentPage}#msg${message.id}`}
                  canReply={canReply}
                  isTargeted={message.id === targetedMessageId}
                />
              ))}
            </div>
          </ReactionsProvider>

          <PaginatorBar
            numPages={thread.pageCount ?? currentPage}
            currentPage={currentPage}
            onPageChange={loadNewPage}
          />
        </BBWidget>
      </div>

      {canReply && showReplyBox && threadId && (
        <MessageEditor
          key={quoteSeedNonce}
          threadId={threadId}
          initialBody={quoteSeed}
        />
      )}
    </>
  );
}

export default function ForumThread({
  pageNumber: paramsPageNo,
}: ForumThreadProps) {
  const { threadId: threadIdParam } = useParams();
  const currentPage = parsePage(paramsPageNo ?? null);
  const { actions: threadActions, isLoaded: threadActionsLoaded } =
    useAllowedActions(
      `/thread/${threadIdParam}/allowed-actions`,
      threadIdParam !== null && threadIdParam !== undefined,
    );
  const canReply = threadActionsLoaded && threadActions.has("thread.reply");
  const canRestoreThread =
    threadActionsLoaded && threadActions.has("thread.restore");

  const query = useBBQuery(
    `/thread/${threadIdParam}?page=${currentPage}&pageSize=10`,
    { schema: ThreadSchema },
  );

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [quoteSeed, setQuoteSeed] = useState<string | undefined>();
  const [quoteSeedNonce, setQuoteSeedNonce] = useState(0);

  const seedReplyEditor = useCallback((message: Message) => {
    setQuoteSeed(
      `[quote thread=${message.threadId} msg=${message.id}]\n[/quote]\n`,
    );
    setQuoteSeedNonce((nonce) => nonce + 1);
    setShowReplyBox(true);
  }, []);

  const openReplyEditor = useCallback(() => {
    setQuoteSeed(undefined);
    setQuoteSeedNonce((nonce) => nonce + 1);
    setShowReplyBox(true);
  }, []);

  const { hash } = useLocation();
  const targetedMessageId = useMemo(() => {
    const targeted = /^#msg(\d+)$/u.exec(hash);
    return targeted ? Number(targeted[1]) : null;
  }, [hash]);
  const renderThread = useCallback(
    (thread: Thread) => (
      <ThreadView
        thread={thread}
        currentPage={currentPage}
        canReply={canReply}
        canRestoreThread={canRestoreThread}
        showReplyBox={showReplyBox}
        quoteSeed={quoteSeed ?? undefined}
        quoteSeedNonce={quoteSeedNonce}
        onQuote={seedReplyEditor}
        onModify={openReplyEditor}
        targetedMessageId={targetedMessageId}
      />
    ),
    [
      canReply,
      canRestoreThread,
      currentPage,
      openReplyEditor,
      quoteSeed,
      quoteSeedNonce,
      seedReplyEditor,
      showReplyBox,
      targetedMessageId,
    ],
  );

  return <BBQueryBoundary query={query}>{renderThread}</BBQueryBoundary>;
}
