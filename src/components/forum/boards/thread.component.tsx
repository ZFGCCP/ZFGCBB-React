import type React from "react";
import { useMemo, useState, useRef, Suspense, useContext } from "react";
import { styled } from "@linaria/react";
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

  userInfoWrapper: styled.div`
    border-right: 0.2rem solid black;
  `,

  messageBody: styled.div`
    overflow-wrap: anywhere;
  `,

  avatar: styled.img`
    max-width: 150px;
    max-height: 150px;
    border: 0.1rem solid black;
  `,

  buttonWrapper: styled.div`
    border-bottom: 0.1rem solid black;
  `,

  buttonIcon: styled.div`
    cursor: pointer;
    font-size: 0.8rem;
  `,

  time: styled.div`
    font-size: 0.8rem;
  `,

  graveDigWarning: styled.div`
    border: 0.1rem solid red;
    color: red;
    background-color: #ffe0e0;
  `,
};

const ForumThread: React.FC<{ threadId: string }> = ({
  threadId: paramsThreadId,
}) => {
  const threadId = parseInt(paramsThreadId!);

  const textAreaRef = useRef();
  let cursorPosition = 0;
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [msgText, setMsgText] = useState<
    string | number | readonly string[] | undefined
  >("");
  const { data: thread } = useBBQuery<Thread>(
    `thread/${threadId}?pageNo=1&numPerPage=10`,
  );
  const [currentMsg, setCurrentMsg] = useState<Message>({} as Message);
  const { currentTheme } = useContext(ThemeContext);

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
    <Suspense>
      <div className="row">
        <div className="col-12 mt-2">
          <Widget widgetTitle={thread ? thread.threadName : ""}>
            {thread?.messages?.map((msg) => {
              return (
                <Style.messageWrapper className="d-flex" theme={currentTheme}>
                  <UserLeftPane user={msg.createdUser} />
                  <div className="col-12 col-lg-10">
                    <Style.buttonWrapper className="d-flex justify-content-between">
                      <Style.time className="m-2">
                        {msg.currentMessage.createdTsAsString}
                        <HasPermission perms={["ZFGC_MESSAGE_ADMIN"]}>
                          {<span> - 192.168.1.1</span>}
                        </HasPermission>
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
                  </div>
                </Style.messageWrapper>
              );
            })}
          </Widget>
        </div>
      </div>
      <FooterButtons options={footer} />

      {showReplyBox && <MessageEditor threadId={threadId} />}
    </Suspense>
  );
};

export default ForumThread;
