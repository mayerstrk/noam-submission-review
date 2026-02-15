import { useRef } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { AlertCircle, AlertTriangle, Users } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useContributors } from "@/hooks/queries/useContributors"
import { rateLimitInfo } from "@/api/client"
import { SCROLLBAR_VERTICAL } from "@/lib/card-styles"
import {
  SKELETON_COUNT,
  CONTRIBUTORS_PER_PAGE,
  RATE_LIMIT_WARNING_THRESHOLD,
} from "@/lib/constants"
import type { Contributor } from "@/types/github"

const ROW_HEIGHT = 40

interface ContributorsModalProps {
  repoFullName: string | null
  onClose: () => void
}

export function ContributorsModal({
  repoFullName,
  onClose,
}: ContributorsModalProps) {
  const {
    data,
    isLoading,
    isError,
    isRateLimited,
    isPlaceholderData,
    refetch,
  } = useContributors(repoFullName ?? "", !!repoFullName)

  const showLoading = isLoading || isPlaceholderData

  const { remaining, limit } = rateLimitInfo.core
  const isApproachingLimit =
    remaining <= RATE_LIMIT_WARNING_THRESHOLD && remaining > 0

  return (
    <Dialog open={!!repoFullName} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            Contributors
            {!showLoading && data && (
              <span className="text-xs font-normal text-muted-foreground">
                (
                {data.length >= CONTRIBUTORS_PER_PAGE
                  ? `${data.length}+`
                  : data.length}
                )
              </span>
            )}
          </DialogTitle>
          <DialogDescription>{repoFullName}</DialogDescription>
        </DialogHeader>

        {showLoading && (
          <div className="space-y-1">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="ml-auto h-4 w-16" />
              </div>
            ))}
          </div>
        )}

        {!showLoading && isRateLimited && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
            <span className="text-sm text-amber-500">
              {data
                ? "Rate limit reached, please wait a moment, using cached data."
                : "Rate limit reached, please wait a moment."}
            </span>
          </div>
        )}

        {!showLoading && isError && !isRateLimited && (
          <div className="flex flex-col items-center gap-3 py-4">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <p className="text-sm text-muted-foreground">
              Failed to load contributors.
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}

        {!showLoading && !isRateLimited && !isError && isApproachingLimit && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-1.5">
            <AlertTriangle className="h-3 w-3 shrink-0 text-amber-500/70" />
            <span className="text-xs text-amber-500/70">
              API quota low ({remaining}/{limit} core requests remaining in the next hour)
            </span>
          </div>
        )}

        {!showLoading && data && data.length > 0 && (
          <VirtualContributorList data={data} />
        )}
      </DialogContent>
    </Dialog>
  )
}

function VirtualContributorList({ data }: { data: Contributor[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  })

  return (
    <div
      ref={scrollRef}
      className={`max-h-80 overflow-y-auto ${SCROLLBAR_VERTICAL}`}
    >
      <div
        className="relative w-full"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const contributor = data[virtualRow.index]
          return (
            <div
              key={contributor.id}
              className="absolute left-0 top-0 flex w-full items-center gap-3 border-b border-border/50 py-2 last:border-0"
              style={{
                height: virtualRow.size,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <img
                src={contributor.avatar_url}
                alt={contributor.login}
                className="h-8 w-8 rounded-full"
              />
              <span
                className="max-w-[170px] truncate text-sm font-medium"
                title={contributor.login}
              >
                {contributor.login}
              </span>
              <span className="ml-auto px-6 text-xs text-green-500">
                {contributor.contributions.toLocaleString()} +
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
