export const CARD_BASE_WIDTH =
  "w-[85vw] sm:w-[350px] lg:w-[420px] xl:w-[480px]"

export const CARD_BASE_DIMENSIONS = `min-h-[24rem] ${CARD_BASE_WIDTH}`

export const PAGE_LAYOUT =
  "flex min-h-[calc(100vh-8rem)] flex-col justify-center space-y-4"

const SCROLLBAR_BASE =
  "[&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-muted [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30"

export const SCROLLBAR_HORIZONTAL = `[&::-webkit-scrollbar]:h-1.5 ${SCROLLBAR_BASE}`

export const SCROLLBAR_VERTICAL = `[&::-webkit-scrollbar]:w-1.5 ${SCROLLBAR_BASE}`
