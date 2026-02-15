import type { ReactNode } from "react"
import { SCROLLBAR_HORIZONTAL } from "@/lib/card-styles"

interface HorizontalScrollProps {
  children: ReactNode
}

export function HorizontalScroll({ children }: HorizontalScrollProps) {
  return (
    <div
      className={`-my-10 overflow-x-auto py-10 pb-14 ${SCROLLBAR_HORIZONTAL}`}
    >
      <div className="flex items-stretch gap-4 px-6">{children}</div>
    </div>
  )
}
