interface UserMessageProps {
  messageText: string;
  isEven: boolean;
}

export default function UserMessage({ messageText, isEven }: UserMessageProps) {
  return (
    <BBShowMore
      className={`grow ${isEven ? "bg-elevated" : "bg-muted"} min-h-64 w-full snap-start snap-mandatory`}
    >
      <BBHtml html={messageText} className="p-3 whitespace-pre-wrap" />
    </BBShowMore>
  );
}
