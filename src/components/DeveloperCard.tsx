import { Star } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CARD_BASE_DIMENSIONS } from "@/lib/card-styles"
import type { Developer } from "@/types/github"

interface DeveloperCardProps {
  developer: Developer
}

export function DeveloperCard({ developer }: DeveloperCardProps) {
  return (
    <hover-tilt
      tilt-factor="0.4"
      scale-factor="1.05"
      glare-intensity="0.4"
      glare-hue="190"
      blend-mode="overlay"
      shadow=""
      exit-delay="200"
    >
      <Card className={CARD_BASE_DIMENSIONS}>
        <CardHeader className="min-w-0 overflow-hidden">
          <CardTitle
            className="min-w-0 truncate text-xl font-bold"
            title={developer.login}
          >
            {developer.login}
          </CardTitle>
          <div className="flex min-w-0 items-center gap-2 text-base text-muted-foreground">
            <span className="min-w-0 truncate" title={developer.repoName}>
              {developer.repoName}
            </span>
            <span className="flex shrink-0 items-center gap-1.5 text-yellow-500">
              <Star className="h-4 w-4" fill="currentColor" />
              {developer.repoStars.toLocaleString()}
            </span>
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 items-center justify-center">
          <img
            src={developer.avatar_url}
            alt={developer.login}
            className="h-32 w-32 rounded-full"
            loading="lazy"
          />
        </CardContent>
      </Card>
    </hover-tilt>
  )
}
