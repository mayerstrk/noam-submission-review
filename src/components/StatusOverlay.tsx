import { AlertCircle, AlertTriangle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { CARD_BASE_WIDTH } from "@/lib/card-styles"
import { SKELETON_COUNT, RATE_LIMIT_WARNING_THRESHOLD } from "@/lib/constants"
import { rateLimitInfo } from "@/api/client"

interface StatusOverlayProps {
  isLoading: boolean
  isError: boolean
  isRateLimited: boolean
  isEmpty: boolean
  hasData: boolean
  onRetry: () => void
}

export function StatusOverlay({
  isLoading,
  isError,
  isRateLimited,
  isEmpty,
  hasData,
  onRetry,
}: StatusOverlayProps) {
  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-hidden px-6">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div
            key={i}
            className={`${CARD_BASE_WIDTH} shrink-0 space-y-4 rounded-xl border p-6`}
          >
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (isRateLimited) {
    return (
      <div className="flex justify-center px-6">
        <div className="flex w-fit max-w-full items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
          <span className="text-sm text-amber-500">
            {hasData
              ? "Rate limit reached, please wait a moment, using cached data."
              : "Rate limit reached, please wait a moment."}
          </span>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 px-6 py-2">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-sm text-muted-foreground">Failed to load data.</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center gap-3 px-6 py-12">
        <p className="text-sm text-muted-foreground">No data available.</p>
      </div>
    )
  }

  // Approaching rate limit — show a subtle warning above the cards
  const { remaining, limit } = rateLimitInfo.search
  if (hasData && remaining <= RATE_LIMIT_WARNING_THRESHOLD && remaining > 0) {
    return (
      <div className="flex justify-center px-6">
        <div className="flex w-fit items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-1.5">
          <AlertTriangle className="h-3 w-3 shrink-0 text-amber-500/70" />
          <span className="text-xs text-amber-500/70">
            API quota low ({remaining}/{limit} search requests remaining in the next minute)
          </span>
        </div>
      </div>
    )
  }

  return null
}
