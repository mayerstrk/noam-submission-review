import { createFileRoute } from "@tanstack/react-router"
import { useRepositories } from "@/hooks/queries/useRepositories"
import { HorizontalScroll } from "@/components/HorizontalScroll"
import { DeveloperCard } from "@/components/DeveloperCard"
import type { Developer } from "@/types/github"
import RespositoryCardSkeleton from "@/components/RespositoryCardSkeleton"

export const Route = createFileRoute("/developers")({
  component: DevelopersPage,
})

function DevelopersPage() {
  const { data, isLoading } = useRepositories();

  const developers: Developer[] =
    data?.data?.items.map((repo) => ({
      login: repo.owner.login,
      avatar_url: repo.owner.avatar_url,
      repoName: repo.name,
      repoStars: repo.stargazers_count,
    })) ?? [];

  return isLoading ? (
    <RespositoryCardSkeleton />
  ) : (
    <div className="w-full overflow-x-hidden">
      {developers.length > 0 && (
        <HorizontalScroll>
          {developers.map((dev, index) => (
            <DeveloperCard key={`${dev.login}-${index}`} developer={dev} />
          ))}
        </HorizontalScroll>
      )}
    </div>
  );
}
