import type React from "react";
import { useMemo, useState, useRef, useContext } from "react";
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
import FooterButtons from "./footerButtons.component";
import MessageEditor from "../messageEditor.component";
import UserLeftPane from "../../user/userLeftPane.component";
import HasPermission from "../../common/security/HasPermission.component";
import { ThemeContext } from "../../../providers/theme/themeProvider";
import BBPaginator from "../../common/paginator/bbPaginator.component";
import { useNavigate } from "react-router";
import BBLink from "@/components/common/bbLink.component";

const ForumThread: React.FC<{
  threadId: string;
  pageNo: string;
}> = ({ threadId: paramsThreadId, pageNo: paramsPageNo }) => {
  const navigate = useNavigate();
  const threadId = parseInt(paramsThreadId!);
  const currentPage = parseInt(paramsPageNo!);

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [msgText, setMsgText] = useState<
    string | number | readonly string[] | undefined
  >("");
  const { data: thread } = useBBQuery<Thread>(
    `/thread/${threadId}?pageNo=${currentPage}&numPerPage=10`,
  );
  const [currentMsg, setCurrentMsg] = useState<Message>({} as Message);
  const { currentTheme } = useContext(ThemeContext);

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
  }, [thread]);

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
      <div className="flex gap-2 mt-2">
        <BBLink to="/forum">ZFGC.com</BBLink>
        <span>&gt;&gt;</span>
        <BBLink to={`/forum/board/${thread?.boardId}/1`}>Board</BBLink>
        <span>&gt;&gt;</span>
        <span>{thread?.threadName}</span>
      </div>

      <div className="mt-2">
        <Widget widgetTitle={thread ? thread.threadName : ""}>
          {thread?.messages?.map((msg) => (
            <div
              key={`${msg.id}`}
              className={`flex flex-col lg:flex-row p-2 border-b ${currentTheme?.tableRow} odd:bg-gray-100 even:bg-gray-200`}
            >
              <UserLeftPane user={msg.createdUser} />
              <div className="flex flex-col col-12 col-lg-10">
                <div className="flex justify-between border-b">
                  <div className="p-2">
                    <div>
                      {msg.createdTsAsString}
                      <HasPermission perms={["ZFGC_MESSAGE_ADMIN"]}>
                        <span> - 192.168.1.1</span>
                      </HasPermission>
                    </div>
                    <div className="text-sm">
                      Last Edit: {msg.currentMessage.createdTsAsString}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <HasPermission perms={["ZFGC_MESSAGE_EDITOR"]}>
                      <div className="cursor-pointer text-sm">
                        <FontAwesomeIcon icon={faReply} className="mr-1" />
                        Reply
                      </div>
                    </HasPermission>
                    <HasPermission perms={["ZFGC_MESSAGE_EDITOR"]}>
                      <div
                        className="cursor-pointer text-sm"
                        onClick={() => clickModify(msg)}
                      >
                        <FontAwesomeIcon icon={faPen} className="mr-1" />
                        Modify
                      </div>
                    </HasPermission>
                    <HasPermission perms={["ZFGC_MESSAGE_ADMIN"]}>
                      <div className="cursor-pointer text-sm">
                        <FontAwesomeIcon icon={faTrash} className="mr-1" />
                        Remove
                      </div>
                    </HasPermission>
                    <HasPermission perms={["ZFGC_MESSAGE_ADMIN"]}>
                      <div className="cursor-pointer text-sm">
                        <FontAwesomeIcon icon={faShuffle} className="mr-1" />
                        Split Thread
                      </div>
                    </HasPermission>
                    <HasPermission perms={["ZFGC_MESSAGE_VIEWER"]}>
                      <div className="cursor-pointer text-sm">
                        <FontAwesomeIcon icon={faBook} className="mr-1" />
                        View History
                      </div>
                    </HasPermission>
                    <HasPermission perms={["ZFGC_MESSAGE_EDITOR"]}>
                      <div className="cursor-pointer text-sm">
                        <FontAwesomeIcon icon={faFlag} className="mr-1" />
                        Report
                      </div>
                    </HasPermission>
                    <HasPermission perms={["ZFGC_MESSAGE_ADMIN"]}>
                      <div className="cursor-pointer text-sm">
                        <FontAwesomeIcon
                          icon={faTriangleExclamation}
                          className="mr-1"
                        />
                        Warn
                      </div>
                    </HasPermission>
                  </div>
                </div>

                <div className="m-2">
                  {parse(msg.currentMessage.messageText.toString())}
                </div>

                {msg.createdUser.bioInfo?.signature?.trim() !== "" && (
                  <div className="flex items-end p-2 border-t mt-2">
                    <div>
                      {msg.createdUser.bioInfo?.signature &&
                        parse(msg.createdUser.bioInfo?.signature)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="bg-gray-100">
            {thread && (
              <BBPaginator
                numPages={thread.pageCount}
                currentPage={currentPage}
                onPageChange={loadNewPage}
              />
            )}
          </div>
        </Widget>
      </div>

      {showReplyBox && <MessageEditor threadId={threadId} />}
    </>
  );
};

export default ForumThread;
