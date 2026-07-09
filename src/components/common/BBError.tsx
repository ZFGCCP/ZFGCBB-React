export interface BBErrorProps {
  title?: string;
  description?: string;
  error?: Error;
  onRetry?: () => void;
}

export default function BBError({
  title = "Something broke on this page.",
  description = "This part of the site ran into an error. Give it another try, or head back to the forum.",
  error,
  onRetry,
}: BBErrorProps) {
  return (
    <BBWidget widgetTitle="Error">
      <div className="space-y-3 p-4">
        <p className="font-bold">{title}</p>
        <p className="text-sm text-dimmed">{description}</p>
        {import.meta.env.DEV && error && (
          <pre className="overflow-auto border border-default bg-default p-2 text-xs text-error">
            {error.message}
          </pre>
        )}
        <div className="flex items-center gap-3 pt-1">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="cursor-pointer border-2 border-default bg-muted px-3 py-1 text-sm transition-colors hover:bg-elevated"
            >
              Try again
            </button>
          )}
          <BBLink to="/">Back to forum</BBLink>
        </div>
      </div>
    </BBWidget>
  );
}
