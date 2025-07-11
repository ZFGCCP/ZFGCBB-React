import type React from "react";
import { useRef } from "react";
import { useBBQuery } from "../../hooks/useBBQuery";
import { useBBMutation } from "../../hooks/useBBMutation";
import type { Message } from "../../types/forum";
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
    <div className="mt-6">
      <div className="border border-red-500 text-red-700 bg-red-100 p-4 mb-6 rounded-md">
        Warning: this topic has not been posted in for at least 14 days. Unless
        you're sure you want to reply, please consider starting a new topic.
      </div>

      <form className="space-y-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
          >
            B
          </button>
          <button
            type="button"
            className="px-3 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
          >
            I
          </button>
          <button
            type="button"
            className="px-3 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
          >
            U
          </button>
          <button
            type="button"
            className="px-3 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
          >
            S
          </button>
          <span className="text-gray-400">|</span>
        </div>

        <div>
          <textarea
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
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        <div>
          <button
            type="button"
            onClick={() => newPostMutator.mutate()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageEditor;
