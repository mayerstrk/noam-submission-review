import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRepositories } from "@/hooks/queries/useRepositories"


export function Alert() {
  const { refetch, error, data } = useRepositories()
  const message = error?.message || data

  return (
    <div className="flex justify-center py-4">
      <div className="flex px-8 py-1 gap-4 w-auto bg-orange-400/50 rounded-lg border-orange-500 border-2 justify-center">
        <span></span>
        <span>Hello</span>
      </div>
    </div>
  )
}
