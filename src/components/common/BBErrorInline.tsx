export interface BBErrorInlineProps {
  message?: string;
  onRetry?: () => void;
}

export default function BBErrorInline({
  message = "Something went wrong.",
  onRetry,
}: BBErrorInlineProps) {
  return (
    <div className="px-4 py-8 text-center text-sm">
      <p className="text-error">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 cursor-pointer border-2 border-default bg-muted px-3 py-1 text-xs transition-colors hover:bg-elevated"
        >
          Try again
        </button>
      )}
    </div>
  );
}
