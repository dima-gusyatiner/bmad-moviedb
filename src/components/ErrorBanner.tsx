export default function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-lg bg-red-950/50 border border-red-800 p-4 flex items-center justify-between gap-4">
      <p className="text-red-200 text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="shrink-0 px-3 py-1.5 text-sm font-medium rounded-md bg-red-800 hover:bg-red-700 text-red-100 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}
