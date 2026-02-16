import { CARD_BASE_WIDTH } from "@/lib/card-styles"
import { SKELETON_COUNT } from "@/lib/constants"
import { Skeleton } from "./ui/skeleton"

const RespositoryCardSkeleton = () => {
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

export default RespositoryCardSkeleton;
