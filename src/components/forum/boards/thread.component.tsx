import type React from "react";
import { useMemo, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReply,
  faPen,
  faTrash,
  faShuffle,
  faBook,
  faFlag,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import parse from "html-react-parser/lib/index";
import Widget from "../../common/widgets/widget.component";
import { useBBQuery } from "../../../hooks/useBBQuery";
import type { BBPermissionLabel, Message, Thread } from "../../../types/forum";
import MessageEditor from "../messageEditor.component";
import UserLeftPane from "../../user/userLeftPane.component";
import HasPermission from "../../common/security/HasPermission.component";
import BBPaginator from "../../common/paginator/bbPaginator.component";
import { useNavigate } from "react-router";
import BBLink from "@/components/common/bbLink.component";
import BBFlex from "@/components/common/layout/bbFlex.component";

interface ForumThreadProps {
  threadId: string;
  pageNo: string;
}

const ForumThread: React.FC<ForumThreadProps> = ({
  threadId: paramsThreadId,
  pageNo: paramsPageNo,
}) => {
  const navigate = useNavigate();
  const threadId = parseInt(paramsThreadId!);
  const currentPage = parseInt(paramsPageNo!);

  const textAreaRef = useRef("");
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [msgText, setMsgText] = useState<
    string | number | readonly string[] | undefined
  >("");
  const { data: thread, isLoading } = useBBQuery<Thread>(
    `/thread/${threadId}?pageNo=${currentPage}&numPerPage=10`,
  );
  const [currentMsg, setCurrentMsg] = useState<Message>({} as Message);

  const loadNewPage = (pageNo: number) => {
    navigate(`/forum/thread/${threadId}/${pageNo}`);
  };

  const footer = useMemo(() => {
    return [
      {
        label: "Reply",
        callback: () => setShowReplyBox(!showReplyBox),
        permissions: ["ZFGC_MESSAGE_EDITOR", "ZFGC_MESSAGE_ADMIN"],
      },
      {
        label: "Add Poll",
        callback: () => {},
        permissions: ["ZFGC_MESSAGE_EDITOR", "ZFGC_MESSAGE_ADMIN"],
      },
      {
        label: "Subscribe",
        callback: () => {},
        permissions: [
          "ZFGC_MESSAGE_VIEWER",
          "ZFGC_MESSAGE_EDITOR",
          "ZFGC_MESSAGE_ADMIN",
        ],
      },
      {
        label: "Mark Unread",
        callback: () => {},
        permissions: [
          "ZFGC_MESSAGE_VIEWER",
          "ZFGC_MESSAGE_EDITOR",
          "ZFGC_MESSAGE_ADMIN",
        ],
      },
    ] satisfies BBPermissionLabel[];
  }, [showReplyBox]);

  const clickModify = (msg: Message) => {
    setShowReplyBox(true);
    setMsgText(
      msg.currentMessage.unparsedText as
        | string
        | number
        | readonly string[]
        | undefined,
    );
    setCurrentMsg(msg);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="mt-2">
          <BBFlex gap="gap-2" className="">
            <BBLink to="/forum" prefetch="render">
              ZFGC.com
            </BBLink>
            <span>&gt;&gt;</span>
            {(thread && !isLoading && (
              <BBLink
                to={`/forum/board/${thread?.boardId}/1`}
                prefetch="intent"
              >
                Board
              </BBLink>
            )) || <span>Loading...</span>}
            <span>&gt;&gt;</span>
            <span>{thread?.threadName}</span>
          </BBFlex>
        </div>

        {thread && !isLoading && (
          <div className="bg-accented p-4">
            <BBPaginator
              numPages={thread.pageCount}
              currentPage={currentPage}
              onPageChange={loadNewPage}
            />
          </div>
        )}

        <Widget widgetTitle={thread ? thread.threadName : ""}>
          <div className="divide-y divide-default">
            {thread?.messages?.map((msg, index) => {
              const isOdd = index % 2 === 0;
              return (
                <div
                  className={`${isOdd ? "bg-muted" : "bg-elevated"}`}
                  key={msg.id}
                >
                  <div className="flex flex-col lg:flex-row min-h-[300px]">
                    <div className="lg:w-64 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-default">
                      <UserLeftPane user={msg.createdUser} />
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="border-b border-default p-3 bg-elevated flex-shrink-0 min-h-[76px]  flex items-center">
                        <BBFlex
                          justify="between"
                          align="center"
                          className="flex-col sm:flex-row gap-2 sm:gap-0"
                        >
                          <div className="text-sm">
                            <div className="hidden lg:block">
                              {new Date(msg.createdTsAsString).toLocaleString()}
                              <HasPermission perms={["ZFGC_MESSAGE_ADMIN"]}>
                                <span className="text-muted">
                                  {" "}
                                  - 192.168.1.1
                                </span>
                              </HasPermission>
                            </div>
                            {msg.currentMessage.updatedTsAsString && (
                              <div className="text-muted">
                                Last Edit:{" "}
                                {new Date(
                                  msg.currentMessage.updatedTsAsString,
                                ).toLocaleString()}
                              </div>
                            )}
                          </div>

                          <BBFlex gap="gap-2" wrap={true} className="text-sm">
                            <HasPermission perms={["ZFGC_MESSAGE_EDITOR"]}>
                              <button className="text-toned hover: transition-colors">
                                <FontAwesomeIcon
                                  icon={faReply}
                                  className="mr-1"
                                />
                                <span className="hidden sm:inline">Reply</span>
                              </button>
                            </HasPermission>
                            <HasPermission perms={["ZFGC_MESSAGE_EDITOR"]}>
                              <button
                                className="text-toned hover: transition-colors"
                                onClick={() => clickModify(msg)}
                              >
                                <FontAwesomeIcon
                                  icon={faPen}
                                  className="mr-1"
                                />
                                <span className="hidden sm:inline">Edit</span>
                              </button>
                            </HasPermission>
                            <HasPermission perms={["ZFGC_MESSAGE_ADMIN"]}>
                              <button className="text-toned hover: transition-colors hidden sm:inline-flex">
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  className="mr-1"
                                />
                                Remove
                              </button>
                            </HasPermission>
                            <HasPermission perms={["ZFGC_MESSAGE_ADMIN"]}>
                              <button className="text-toned hover: transition-colors hidden md:inline-flex">
                                <FontAwesomeIcon
                                  icon={faShuffle}
                                  className="mr-1"
                                />
                                Split
                              </button>
                            </HasPermission>
                            <HasPermission perms={["ZFGC_MESSAGE_VIEWER"]}>
                              <button className="text-toned hover: transition-colors hidden md:inline-flex">
                                <FontAwesomeIcon
                                  icon={faBook}
                                  className="mr-1"
                                />
                                History
                              </button>
                            </HasPermission>
                            <HasPermission perms={["ZFGC_MESSAGE_EDITOR"]}>
                              <button className="text-toned hover: transition-colors hidden lg:inline-flex">
                                <FontAwesomeIcon
                                  icon={faFlag}
                                  className="mr-1"
                                />
                                Report
                              </button>
                            </HasPermission>
                            <HasPermission perms={["ZFGC_MESSAGE_ADMIN"]}>
                              <button className="text-toned hover: transition-colors hidden lg:inline-flex">
                                <FontAwesomeIcon
                                  icon={faTriangleExclamation}
                                  className="mr-1"
                                />
                                Warn
                              </button>
                            </HasPermission>
                          </BBFlex>
                        </BBFlex>
                      </div>

                      <div className="p-3 break-words bg-elevated flex-1 min-h-64 max-h-[calc(100dvh-25dvh)] overflow-auto snap-start snap-mandatory">
                        {parse(msg.currentMessage.messageText.toString())}
                      </div>

                      {msg.createdUser.bioInfo?.signature?.trim() && (
                        <div className="border-t border-default p-3 bg-muted flex-shrink-0">
                          <div className="overflow-x-auto max-h-42">
                            {msg.createdUser.bioInfo?.signature &&
                              parse(msg.createdUser.bioInfo?.signature)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {thread && !isLoading && (
            <div className="bg-accented p-4">
              <BBPaginator
                numPages={thread.pageCount}
                currentPage={currentPage}
                onPageChange={loadNewPage}
              />
            </div>
          )}
        </Widget>

        <div className="mt-2">
          <BBFlex gap="gap-2" className="">
            <BBLink to="/forum" prefetch="render">
              ZFGC.com
            </BBLink>
            <span>&gt;&gt;</span>
            {(thread && !isLoading && (
              <BBLink
                to={`/forum/board/${thread?.boardId}/1`}
                prefetch="intent"
              >
                Board
              </BBLink>
            )) || <span>Loading...</span>}
            <span>&gt;&gt;</span>
            <span>{thread?.threadName}</span>
          </BBFlex>
        </div>
      </div>

      {showReplyBox && <MessageEditor threadId={threadId} />}
    </>
  );
};

export default ForumThread;
