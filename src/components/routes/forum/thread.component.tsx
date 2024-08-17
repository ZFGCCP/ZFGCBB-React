import React, { useMemo, useState, useRef } from "react";
import { styled } from "@linaria/react";
import Widget from "../../common/widgets/widget.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faPen, faTrash, faShuffle, faBook, faFlag, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useBBQuery } from "../../../hooks/useBBQuery";
import { Thread } from "../../../types/forum";
import { useParams } from "react-router";
import parse from 'html-react-parser';
import FooterButtons from "./footerButtons.component";
import { Form, Button } from "react-bootstrap";

const Style = {
    messageWrapper: styled.div`
        min-height: 14rem;
        border-bottom: .1rem solid black;
    `,

    userInfoWrapper: styled.div`
        border-right: .2rem solid black;
    `,

    messageBody: styled.div`
        overflow-wrap: anywhere;
    `,

    avatar: styled.img`
        max-width: 150px;
        max-height: 150px;
        border: .1rem solid black;
    `,

    buttonWrapper: styled.div`
        border-bottom: .1rem solid black;
    `,

    buttonIcon: styled.div`
        cursor: pointer;
        font-size: .8rem;
    `,

    time: styled.div`
        font-size: .8rem;
    `,

    graveDigWarning: styled.div`
        border: .1rem solid red;
        color: red;
        background-color: #ffe0e0;
    `
};

const ForumThread:React.FC = () => {
    const { threadId } = useParams();
    const textAreaRef = useRef();
    let cursorPosition = 0;
    const [ showReplyBox, setShowReployBox ] = useState(false);
    const thread = useBBQuery<Thread>(`thread/${threadId}?pageNo=1&numPerPage=10`);

    const footer = useMemo(() =>{
        return [
            {
                label: "Reply",
                callback: () => setShowReployBox(!showReplyBox)
            },
            {
                label: "Add Poll",
                callback: () => {}
            },
            {
                label: "Subscribe",
                callback: () => {}
            },
            {
                label: "Mark Unread",
                callback: () => {}
            },
        ];
    },[thread]);

    return (
        <>
            <div className="row">
                <div className="col-12 my-2">
                    <Widget widgetTitle="My Thread">
                        {thread?.messages?.map((msg) => {
                            return <Style.messageWrapper className="d-flex">
                                        <Style.userInfoWrapper className="col-2">
                                            <div className="m-2">MG-Zero</div>
                                            <div className="d-flex flex-column align-items-center m-2">
                                                <Style.avatar src="http://zfgc.com/forum/index.php?action=dlattach;attach=12126;type=avatar"/>
                                                <div>Doesnt afraid of anything</div>
                                                <div>Karma: +1/-1</div>
                                            </div>
                                        </Style.userInfoWrapper>
                                        <div className="col-10">
                                            <Style.buttonWrapper className="d-flex justify-content-between">
                                                <Style.time className="m-2">January 1, 1978 12:00:00PM</Style.time>
                                                <div className="d-flex justify-content-end">
                                                    <Style.buttonIcon className="m-2"><FontAwesomeIcon icon={faReply} className="me-1"/>Reply</Style.buttonIcon>
                                                    <Style.buttonIcon className="m-2"><FontAwesomeIcon icon={faPen} className="me-1"/>Modify</Style.buttonIcon>
                                                    <Style.buttonIcon className="m-2"><FontAwesomeIcon icon={faTrash} className="me-1"/>Remove</Style.buttonIcon>
                                                    <Style.buttonIcon className="m-2"><FontAwesomeIcon icon={faShuffle} className="me-1"/>Split Thread</Style.buttonIcon>
                                                    <Style.buttonIcon className="m-2"><FontAwesomeIcon icon={faBook} className="me-1"/>View History</Style.buttonIcon>
                                                    <Style.buttonIcon className="m-2"><FontAwesomeIcon icon={faFlag} className="me-1"/>Report</Style.buttonIcon>
                                                    <Style.buttonIcon className="m-2"><FontAwesomeIcon icon={faTriangleExclamation} className="me-1"/>Warn</Style.buttonIcon>
                                                </div>
                                            </Style.buttonWrapper>
                                            <Style.messageBody className="m-2">
                                                {parse(msg.currentMessage.messageText.toString())}
                                            </Style.messageBody>
                                            <div>
                                                192.168.1.1
                                            </div>
                                        </div>
                                    </Style.messageWrapper>
                        })}
                    </Widget>
                </div>
            </div>
            <FooterButtons options={footer}/>

            {showReplyBox && (
                <div className="mt-3">
                    <Style.graveDigWarning className="p-4 mb-4">
                        Warning: this topic has not been posted in for at least 14 days.
                        Unless you're sure you want to reply, please consider starting a new topic. 
                    </Style.graveDigWarning>

                    <Form>
                        <div>
                            <Button>B</Button>
                            <Button>I</Button>
                            <Button>U</Button>
                            <Button>S</Button>
                            <span>|</span>
                        </div>
                        <Form.Group>
                            <Form.Control 
                                as="textarea" 
                                rows={15}
                                ref={textAreaRef}
                                onBlur={() => cursorPosition = textAreaRef?.current?.selectionStart}
                            />
                        </Form.Group>
                    </Form>
                </div>    
            )

            }
        </>
    )
};

export default ForumThread;
