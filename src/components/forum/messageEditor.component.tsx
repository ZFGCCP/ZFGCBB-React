import type React from "react";
import { useRef } from "react";
import { useBBQuery } from "../../hooks/useBBQuery";
import type { Message } from "../../types/forum";
import { useBBMutation } from "../../hooks/useBBMutation";
import type { BaseBB } from "../../types/api";

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
      <div className="p-4 mb-4 border border-red-500 text-red-500 bg-red-100">
        Warning: this topic has not been posted in for at least 14 days. Unless
        you're sure you want to reply, please consider starting a new topic.
      </div>

      <form className="w-full">
        <div className="flex gap-1 mb-2">
          <button
            type="button"
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          >
            B
          </button>
          <button
            type="button"
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          >
            I
          </button>
          <button
            type="button"
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          >
            U
          </button>
          <button
            type="button"
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          >
            S
          </button>
          <span className="mx-2">|</span>
        </div>
        <div className="mb-4">
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
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
        </div>
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => newPostMutator.mutate()}
        >
          Post Reply
        </button>
      </form>
    </div>
  );
};

export default MessageEditor;
