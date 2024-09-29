import React, { useMemo, useState, useRef } from "react";
import { styled } from "@linaria/react";
import Widget from "../../common/widgets/widget.component";
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
import { useBBQuery } from "../../../hooks/useBBQuery";
import { Message, Thread } from "../../../types/forum";
import { useParams } from "react-router";
import parse from "html-react-parser";
import FooterButtons from "./footerButtons.component";
import { useMutation } from "@tanstack/react-query";
import MessageEditor from "../messageEditor.component";
import UserLeftPane from "../../user/userLeftPane.component";

const Style = {
  messageWrapper: styled.div`
    min-height: 14rem;
    border-bottom: 0.1rem solid black;
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
  const thread = useBBQuery<Thread>(
    `thread/${threadId}?pageNo=1&numPerPage=10`,
  );
  const [currentMsg, setCurrentMsg] = useState<Message>({} as Message);

  const footer = useMemo(() => {
    return [
      {
        label: "Reply",
        callback: () => setShowReplyBox(!showReplyBox),
      },
      {
        label: "Add Poll",
        callback: () => {},
      },
      {
        label: "Subscribe",
        callback: () => {},
      },
      {
        label: "Mark Unread",
        callback: () => {},
      },
    ];
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
        <div className="col-12 my-2">
          <Widget widgetTitle="My Thread">
            {thread?.messages?.map((msg) => {
              return (
                <Style.messageWrapper className="d-flex">
                  <UserLeftPane user={msg.createdUser} />
                  <div className="col-9">
                    <Style.buttonWrapper className="d-flex justify-content-between">
                      <Style.time className="m-2">
                        January 1, 1978 12:00:00PM
                      </Style.time>
                      <div className="d-flex justify-content-end">
                        <Style.buttonIcon className="m-2">
                          <FontAwesomeIcon icon={faReply} className="me-1" />
                          Reply
                        </Style.buttonIcon>
                        <Style.buttonIcon
                          className="m-2"
                          onClick={() => clickModify(msg)}
                        >
                          <FontAwesomeIcon icon={faPen} className="me-1" />
                          Modify
                        </Style.buttonIcon>
                        <Style.buttonIcon className="m-2">
                          <FontAwesomeIcon icon={faTrash} className="me-1" />
                          Remove
                        </Style.buttonIcon>
                        <Style.buttonIcon className="m-2">
                          <FontAwesomeIcon icon={faShuffle} className="me-1" />
                          Split Thread
                        </Style.buttonIcon>
                        <Style.buttonIcon className="m-2">
                          <FontAwesomeIcon icon={faBook} className="me-1" />
                          View History
                        </Style.buttonIcon>
                        <Style.buttonIcon className="m-2">
                          <FontAwesomeIcon icon={faFlag} className="me-1" />
                          Report
                        </Style.buttonIcon>
                        <Style.buttonIcon className="m-2">
                          <FontAwesomeIcon
                            icon={faTriangleExclamation}
                            className="me-1"
                          />
                          Warn
                        </Style.buttonIcon>
                      </div>
                    </Style.buttonWrapper>
                    <Style.messageBody className="m-2">
                      {parse(msg.currentMessage.messageText.toString())}
                    </Style.messageBody>
                    <div>192.168.1.1</div>
                  </div>
                </Style.messageWrapper>
              );
            })}
          </Widget>
        </div>
      </div>
      <FooterButtons options={footer} />

      {showReplyBox && <MessageEditor threadId={threadId} />}
    </>
  );
};

export default ForumThread;
