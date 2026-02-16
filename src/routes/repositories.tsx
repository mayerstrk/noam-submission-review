import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useRepositories } from "@/hooks/queries/useRepositories"
import { HorizontalScroll } from "@/components/HorizontalScroll"
import { RepositoryCard } from "@/components/RepositoryCard"
import { ContributorsModal } from "@/components/ContributorsModal"
import RespositoryCardSkeleton from "@/components/RespositoryCardSkeleton"

export const Route = createFileRoute("/repositories")({
  component: RepositoriesGallery,
})

function RepositoriesGallery() {
  const { data, isLoading } = useRepositories()
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null)

  const repos = data?.items ?? []
  return isLoading ? <RespositoryCardSkeleton /> :
    (
      <>
        {repos.length > 0 && (
          <HorizontalScroll>
            {repos.map((repo) => (
              <RepositoryCard
                key={repo.id}
                repository={repo}
                onViewContributors={setSelectedRepo}
              />
            ))}
          </HorizontalScroll>
        )}

        <ContributorsModal
          repoFullName={selectedRepo}
          onClose={() => setSelectedRepo(null)}
        />
      </>
    )
}
