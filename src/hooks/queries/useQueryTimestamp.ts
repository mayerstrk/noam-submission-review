import { useRepositories } from "@/hooks/queries/useRepositories"

export function useQueryTimestamp() {
  const { dataUpdatedAt, error } = useRepositories()

  const timestamp = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    : null

  return { timestamp, isError: !!error }
}
