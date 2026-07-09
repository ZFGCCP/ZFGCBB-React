import type { Message } from "@/types/forum";
import { type Crumb } from "@/components/common/BBBreadcrumb";

export interface ForumThreadProps {
  pageNumber: string;
}

const MSG_ADMIN: BBPermission[] = ["ZFGC_MESSAGE_ADMIN"];
const MSG_EDITOR: BBPermission[] = ["ZFGC_MESSAGE_EDITOR"];
const MSG_VIEWER: BBPermission[] = ["ZFGC_MESSAGE_VIEWER"];

const ThreadMessage = memo(function ThreadMessage({
  message,
  isEven,
  onModify,
}: {
  message: Message;
  isEven: boolean;
  onModify: (message: Message) => void;
}) {
  return (
    <div className="flex flex-row min-h-75">
      <div
        className={`w-28 md:w-34 lg:w-64 shrink-0 border-r ${isEven ? "bg-elevated" : "bg-muted"} border-default`}
      >
        <UserLeftPane
          user={message.createdUser ?? undefined}
          backgrounds={{
            profileInfoContainer: `${isEven ? "bg-elevated" : "bg-muted"}`,
          }}
        />
      </div>

      <div className="flex flex-1 flex-col grow min-w-0">
        <div
          className={`border-b border-default p-3 ${isEven ? "bg-elevated" : "bg-muted"} shrink-0 min-h-19 flex items-start`}
        >
          <BBFlex
            justify="between"
            align="center"
            gap="gap-2"
            className="overflow-hidden min-w-0 size-fit whitespace-nowrap"
            wrap={false}
          >
            <div className="text-sm">
              <div>
                <BBDate dateStr={message.createdTsAsString} />
                <BBHasPermission requiredPermissions={MSG_ADMIN}>
                  <span className="text-muted">- 192.168.1.1</span>
                </BBHasPermission>
              </div>
              {message.currentMessage.updatedTsAsString && (
                <div className="text-muted">
                  Last Edit:{" "}
                  <BBDate dateStr={message.currentMessage.updatedTsAsString} />
                </div>
              )}
            </div>

            <BBFlex gap="gap-2" wrap={true} className="text-sm">
              <BBHasPermission requiredPermissions={MSG_EDITOR}>
                <button
                  type="button"
                  className="text-toned hover:transition-colors"
                >
                  <Fa6SolidReply className="mr-1" />
                  <span className="hidden sm:inline">Reply</span>
                </button>
              </BBHasPermission>
              <BBHasPermission requiredPermissions={MSG_EDITOR}>
                <button
                  type="button"
                  className="text-toned hover:transition-colors"
                  onClick={() => onModify(message)}
                >
                  <BBIcon name="modify" className="mr-1" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
              </BBHasPermission>
              <BBHasPermission requiredPermissions={MSG_ADMIN}>
                <button
                  type="button"
                  className="text-toned hover:transition-colors hidden sm:inline-flex"
                >
                  <BBIcon name="delete" className="mr-1" />
                  Remove
                </button>
              </BBHasPermission>
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
          </BBFlex>
        </div>

        <UserMessage
          messageText={message.currentMessage.messageText}
          isEven={isEven}
        />
        <MessageAttachments
          attachments={message.fileAttachments ?? []}
          isEven={isEven}
        />
        <UserSignature
          user={message.createdUser ?? undefined}
          isEven={isEven}
        />
      </div>
    </div>
  );
});

const ForumThread: React.FC<ForumThreadProps> = ({
  pageNumber: paramsPageNo,
}) => {
  const navigate = useNavigate();
  const { threadId: threadIdParam } = useParams();
  const { data: siteInfo } = useSiteInfo();
  const siteName = siteInfo?.siteName ?? "";
  const currentPage = parseInt(paramsPageNo!);

  const query = useBBQuery(
    `/thread/${threadIdParam}?page=${currentPage}&pageSize=10`,
    { schema: ThreadSchema },
  );

  // const textAreaRef = useRef("");
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [, setMessageText] = useState<
    string | number | readonly string[] | undefined
  >("");

  const [, setCurrentMessage] = useState<Message>({} as Message);

  if (query.isError)
    return (
      <BBError
        error={query.error ?? undefined}
        onRetry={() => void query.refetch()}
      />
    );
  if (!query.data) return <BBSkeleton className="h-40 w-full rounded" />;
  const thread = query.data;
  const threadId = thread.id as number | undefined;

  const loadNewPage = (pageNumber: number) => {
    navigate(`/forum/thread/${threadId}/${pageNumber}`);
  };

  // const footer = useMemo(() => {
  //   return [
  //     {
  //       label: "Reply",
  //       callback: () => setShowReplyBox(!showReplyBox),
  //       permissions: ["ZFGC_MESSAGE_EDITOR", "ZFGC_MESSAGE_ADMIN"],
  //     },
  //     {
  //       label: "Add Poll",
  //       callback: () => {},
  //       permissions: ["ZFGC_MESSAGE_EDITOR", "ZFGC_MESSAGE_ADMIN"],
  //     },
  //     {
  //       label: "Subscribe",
  //       callback: () => {},
  //       permissions: [
  //         "ZFGC_MESSAGE_VIEWER",
  //         "ZFGC_MESSAGE_EDITOR",
  //         "ZFGC_MESSAGE_ADMIN",
  //       ],
  //     },
  //     {
  //       label: "Mark Unread",
  //       callback: () => {},
  //       permissions: [
  //         "ZFGC_MESSAGE_VIEWER",
  //         "ZFGC_MESSAGE_EDITOR",
  //         "ZFGC_MESSAGE_ADMIN",
  //       ],
  //     },
  //   ] satisfies BBPermissionLabel[];
  // }, [showReplyBox]);

  const clickModify = useCallback((message: Message) => {
    setShowReplyBox(true);
    setMessageText(
      message.currentMessage.unparsedText as
        | string
        | number
        | readonly string[]
        | undefined,
    );
    setCurrentMessage(message);
  }, []);

  const breadcrumbs: Crumb[] = [
    { label: siteName || "Loading...", to: "/forum", prefetch: "render" },
    {
      label: thread.boardName,
      to: `/forum/board/${thread.boardId}/1`,
      prefetch: "intent",
    },
    { label: thread.threadName ?? "Loading..." },
  ];

  return (
    <>
      <div className="space-y-4">
        <BBBreadcrumb crumbs={breadcrumbs} />
        <div className="bg-accented p-4 scrollbar-thin">
          <BBPaginator
            numPages={thread.pageCount ?? currentPage}
            currentPage={currentPage}
            onPageChange={loadNewPage}
          />
        </div>

        {thread.pollInfo && (
          <PollResults poll={thread.pollInfo} updateResults={() => {}} />
        )}
        <BBWidget widgetTitle={thread.threadName}>
          <div className="divide-y divide-default">
            {thread.messages?.map((message, index) => (
              <ThreadMessage
                key={message.id}
                message={message}
                isEven={index % 2 === 0}
                onModify={clickModify}
              />
            ))}
          </div>

          <div className="bg-accented p-4 scrollbar-thin">
            <BBPaginator
              numPages={thread.pageCount ?? currentPage}
              currentPage={currentPage}
              onPageChange={loadNewPage}
            />
          </div>
        </BBWidget>
        <BBBreadcrumb crumbs={breadcrumbs} />
      </div>

      {showReplyBox && threadId && <MessageEditor threadId={threadId} />}
    </>
  );
};

export default ForumThread;
