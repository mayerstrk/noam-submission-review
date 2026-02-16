import type { ReactNode } from "react"
import React from "react"
import { motion } from "framer-motion"
import { SCROLLBAR_HORIZONTAL } from "@/lib/card-styles"

interface HorizontalScrollProps {
  children: ReactNode
}

export function HorizontalScroll({ children }: HorizontalScrollProps) {
  const items = React.Children.toArray(children)

  return (
    <div className={`overflow-x-auto py-10 pb-14 ${SCROLLBAR_HORIZONTAL}`}>
      <motion.div
        className="flex items-stretch px-6"
        initial="rest"
        whileHover="hover"
      >
        {items.map((child, idx) => (
          <motion.div
            key={(child as any)?.key ?? idx}
            layout
            variants={{
              rest: { marginRight: idx === items.length - 1 ? 0 : 16 }, // gap-4
              hover: { marginRight: idx === items.length - 1 ? 0 : 48 }, // gap-12
            }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
