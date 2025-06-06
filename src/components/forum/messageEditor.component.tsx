import type React from "react";
import { useRef } from "react";
import { useBBQuery } from "../../hooks/useBBQuery";
import { styled } from "styled-components";
import { Button, Form } from "react-bootstrap";
import type { Message } from "../../types/forum";
import { useBBMutation } from "../../hooks/useBBMutation";
import type { BaseBB } from "../../types/api";

const Style = {
  graveDigWarning: styled.div`
    border: 0.1rem solid red;
    color: red;
    background-color: #ffe0e0;
  `,
};

const MessageEditor: React.FC<{ threadId: number }> = ({ threadId }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { data: currentMsg } = useBBQuery<Message>(
    `/message/template?threadId=${threadId}`,
  );

  const cursorPosition = useRef<number | undefined>(0);
  const buildMessagePost = () => {
    return [`message/${threadId}`, currentMsg] as [string, BaseBB];
  };

  const newPostMutator = useBBMutation(buildMessagePost);

  return (
    <div className="mt-3">
      <Style.graveDigWarning className="p-4 mb-4">
        Warning: this topic has not been posted in for at least 14 days. Unless
        you're sure you want to reply, please consider starting a new topic.
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
            onBlur={() =>
              (cursorPosition.current = textAreaRef?.current?.selectionStart)
            }
            onChange={(e) => {
              if (currentMsg) {
                currentMsg.currentMessage.unparsedText = e.target.value;
              }
            }}
          />
        </Form.Group>
        <div onClick={() => newPostMutator.mutate()}>test</div>
      </Form>
    </div>
  );
};

export default MessageEditor;
