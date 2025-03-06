export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-1/4 bg-border/20 animate-pulse rounded" />
      <div className="h-4 w-1/3 bg-border/20 animate-pulse rounded" />
      
      <div className="mt-8 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 border border-border/20 rounded-lg space-y-2">
            <div className="h-6 w-1/3 bg-border/20 animate-pulse rounded" />
            <div className="h-4 w-2/3 bg-border/20 animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  )
} 