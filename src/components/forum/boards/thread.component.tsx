import type React from "react";
import {
  useMemo,
  useState,
  useRef,
  Suspense,
  useContext,
  useCallback,
} from "react";
import { styled } from "styled-components";
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
import type { Theme } from "../../../types/theme";
import { ThemeContext } from "../../../providers/theme/themeProvider";
import BBPaginator from "../../common/paginator/bbPaginator.component";
import { useNavigate, useSearchParams } from "react-router";

const Style = {
  messageWrapper: styled.div<{ theme: Theme }>`
    min-height: 14rem;
    border-bottom: 0.1rem solid black;

    &:nth-child(odd) {
      background-color: ${(props) => props.theme.tableRow};
    }

    &:nth-child(even) {
      background-color: ${(props) => props.theme.tableRowAlt};
    }
  `,

  signatureWrapper: styled.div`
    flex-grow: 1;
    border-top: 1px solid black;
  `,

  messageBody: styled.div`
    overflow-wrap: anywhere;
  `,

  buttonWrapper: styled.div`
    border-bottom: 0.1rem solid black;
  `,

  buttonIcon: styled.div`
    cursor: pointer;
    font-size: 0.8rem;
  `,

  time: styled.div`
    height: 3.3125rem;
  `,

  graveDigWarning: styled.div`
    border: 0.1rem solid red;
    color: red;
    background-color: #ffe0e0;
  `,

  threadFooter: styled.div<{ theme: Theme }>`
    background-color: ${(props) => props.theme.footerColor};
  `,

  lastEdit: styled.div`
    font-size: 0.8rem;
  `,
};

const ForumThread: React.FC<{ threadId: string; pageNo: string }> = ({
  threadId: paramsThreadId,
  pageNo: paramsPageNo,
}) => {
  const navigate = useNavigate();
  const threadId = parseInt(paramsThreadId!);
  const currentPage = parseInt(paramsPageNo!);

  const textAreaRef = useRef("");
  let cursorPosition = 0;
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

  const submitPost = (msg: Message, threadId: Number) => {};

  return (
    <>
      <div className="row">
        <div className="col-12 mt-2">
          <Widget widgetTitle={thread ? thread.threadName : ""}>
            {thread?.messages?.map((msg) => {
              return (
                <Style.messageWrapper
                  className="d-flex flex-column flex-lg-row"
                  key={`${msg.id}`}
                  theme={currentTheme}
                >
                  <UserLeftPane user={msg.createdUser} />
                  <div className="d-flex flex-column col-12 col-lg-10">
                    <Style.buttonWrapper className="d-flex justify-content-between">
                      <Style.time className="p-2">
                        <div>
                          {msg.createdTsAsString}
                          <HasPermission perms={["ZFGC_MESSAGE_ADMIN"]}>
                            {<span> - 192.168.1.1</span>}
                          </HasPermission>
                        </div>
                        <Style.lastEdit>
                          Last Edit: {msg.currentMessage.createdTsAsString}
                        </Style.lastEdit>
                      </Style.time>
                      <div className="d-flex justify-content-end">
                        <HasPermission perms={["ZFGC_MESSAGE_EDITOR"]}>
                          <Style.buttonIcon className="m-2">
                            <FontAwesomeIcon icon={faReply} className="me-1" />
                            Reply
                          </Style.buttonIcon>
                        </HasPermission>
                        <HasPermission perms={["ZFGC_MESSAGE_EDITOR"]}>
                          <Style.buttonIcon
                            className="m-2"
                            onClick={() => clickModify(msg)}
                          >
                            <FontAwesomeIcon icon={faPen} className="me-1" />
                            Modify
                          </Style.buttonIcon>
                        </HasPermission>
                        <HasPermission perms={["ZFGC_MESSAGE_ADMIN"]}>
                          <Style.buttonIcon className="m-2">
                            <FontAwesomeIcon icon={faTrash} className="me-1" />
                            Remove
                          </Style.buttonIcon>
                        </HasPermission>
                        <HasPermission perms={["ZFGC_MESSAGE_ADMIN"]}>
                          <Style.buttonIcon className="m-2">
                            <FontAwesomeIcon
                              icon={faShuffle}
                              className="me-1"
                            />
                            Split Thread
                          </Style.buttonIcon>
                        </HasPermission>
                        <HasPermission perms={["ZFGC_MESSAGE_VIEWER"]}>
                          <Style.buttonIcon className="m-2">
                            <FontAwesomeIcon icon={faBook} className="me-1" />
                            View History
                          </Style.buttonIcon>
                        </HasPermission>
                        <HasPermission perms={["ZFGC_MESSAGE_EDITOR"]}>
                          <Style.buttonIcon className="m-2">
                            <FontAwesomeIcon icon={faFlag} className="me-1" />
                            Report
                          </Style.buttonIcon>
                        </HasPermission>
                        <HasPermission perms={["ZFGC_MESSAGE_ADMIN"]}>
                          <Style.buttonIcon className="m-2">
                            <FontAwesomeIcon
                              icon={faTriangleExclamation}
                              className="me-1"
                            />
                            Warn
                          </Style.buttonIcon>
                        </HasPermission>
                      </div>
                    </Style.buttonWrapper>
                    <Style.messageBody className="m-2">
                      {parse(msg.currentMessage.messageText.toString())}
                    </Style.messageBody>
                    {msg.createdUser.bioInfo?.signature?.trim() !== "" && (
                      <Style.signatureWrapper className="d-flex align-items-end m-2 py-2">
                        <div>
                          {msg.createdUser.bioInfo?.signature &&
                            parse(msg.createdUser.bioInfo?.signature)}
                        </div>
                      </Style.signatureWrapper>
                    )}
                  </div>
                </Style.messageWrapper>
              );
            })}
            <Style.threadFooter theme={currentTheme}>
              {thread && (
                <BBPaginator
                  numPages={thread.pageCount}
                  currentPage={currentPage}
                  onPageChange={loadNewPage}
                />
              )}
            </Style.threadFooter>
          </Widget>
        </div>
      </div>

      {showReplyBox && <MessageEditor threadId={threadId} />}
    </>
  );
};

export default ForumThread;
