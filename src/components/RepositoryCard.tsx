import {
  Star,
  GitFork,
  CircleDot,
  Scale,
  ExternalLink,
  Users,
} from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CARD_BASE_DIMENSIONS } from "@/lib/card-styles"
import type { Repository } from "@/types/github"

interface RepositoryCardProps {
  repository: Repository
  onViewContributors: (repoFullName: string) => void
}

export function RepositoryCard({
  repository,
  onViewContributors,
}: RepositoryCardProps) {
  return (
    <hover-tilt
      tilt-factor="0.5"
      scale-factor="1.03"
      glare-intensity="1.3"
      glare-hue="217"
      glare-mask-mode="luminance"
      blend-mode="soft-light"
      shadow
    >
      <Card className={CARD_BASE_DIMENSIONS}>
        <CardHeader className="min-w-0 overflow-hidden">
          <CardTitle className="flex min-w-0 flex-col gap-1 overflow-hidden text-lg sm:text-xl sm:flex-row sm:items-center sm:gap-2 lg:text-[1.35rem]">
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-0 items-center gap-1.5 overflow-hidden font-semibold tracking-tight text-primary hover:underline"
              title={repository.name}
            >
              <span className="min-w-0 truncate">{repository.name}</span>
              <ExternalLink className="h-4 w-4 shrink-0" />
            </a>
            <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-yellow-500 sm:ml-auto sm:text-base">
              <Star className="h-4 w-4" fill="currentColor" />
              {repository.stargazers_count.toLocaleString()}
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 space-y-3">
          <p
            className="min-h-20 line-clamp-4 leading-6 lg:text-base"
            title={repository.description ?? undefined}
          >
            {repository.description ?? "No description"}
          </p>

          <div className="space-y-2 text-sm lg:text-base">
            <div className="flex items-center gap-2 font-medium text-foreground/90">
              <Scale className="h-4 w-4 shrink-0" />
              {repository.license?.name ?? "No license"}
            </div>
            <div className="flex items-center gap-2 font-medium text-foreground/90">
              <GitFork className="h-4 w-4 shrink-0" />
              {repository.forks_count.toLocaleString()} forks
            </div>
            <div className="flex items-center gap-2 font-medium text-foreground/90">
              <CircleDot className="h-4 w-4 shrink-0" />
              {repository.open_issues_count.toLocaleString()} open issues
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            variant="outline"
            className="w-full font-semibold sm:text-base hover:bg-primary/10 hover:text-primary"
            onClick={() => onViewContributors(repository.full_name)}
          >
            <Users className="h-4 w-4" />
            View Contributors
          </Button>
        </CardFooter>
      </Card>
    </hover-tilt>
  )
}
