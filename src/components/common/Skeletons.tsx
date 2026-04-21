import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-brutal border-2 border-surface-border bg-surface p-6",
        className
      )}
    >
      <Skeleton className="mb-4 h-6 w-3/4" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-brutal border-2 border-surface-border bg-surface p-6",
        className
      )}
    >
      <Skeleton className="mb-4 h-5 w-1/2" />
      <Skeleton className="h-48 w-full" />
    </div>
  )
}

export function QuestionSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="mx-auto h-8 w-3/4" />
      <div className="space-y-3 pt-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  )
}

export function ResultsSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <div className="text-center">
        <Skeleton className="mx-auto mb-4 h-10 w-2/3" />
        <Skeleton className="mx-auto h-6 w-1/2" />
      </div>
      <Skeleton className="mx-auto h-64 w-full max-w-md" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  )
}
