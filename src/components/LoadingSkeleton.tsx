export default function LoadingSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse rounded-xl overflow-hidden bg-surface-raised">
          <div className="aspect-[2/3] bg-surface-overlay" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-surface-overlay rounded w-3/4" />
            <div className="h-3 bg-surface-overlay rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
