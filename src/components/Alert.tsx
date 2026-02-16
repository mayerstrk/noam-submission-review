import { AlertTriangle } from "lucide-react";
import { useRepositories } from "@/hooks/queries/useRepositories";
import { getHeader, parseHeaderValue } from "@/lib/utils";

export function Alert() {
  const { error, data } = useRepositories();


  const limit =
    parseHeaderValue(getHeader(error?.response?.headers, "x-ratelimit-limit")) ??
    parseHeaderValue(getHeader(data?.headers, "x-ratelimit-limit"));

  const remaining =
    parseHeaderValue(getHeader(error?.response?.headers, "x-ratelimit-remaining")) ??
    parseHeaderValue(getHeader(data?.headers, "x-ratelimit-remaining"));

  const message = error?.response?.data?.message ?? "";

  const getFirstSentence = (text: string) => {
    const match = text.match(/[^.!?]+[.!?]/);
    return match ? match[0] : text;
  };

  const truncated = getFirstSentence(message);

  if (!error && !remaining) return null;

  return (
    <div className="flex justify-center py-4">
      <div className="flex flex-col gap-3 w-fit max-w-xl px-6 py-4 rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-600 shadow-sm">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-500" />
          <span className="text-sm font-medium">
            {remaining !== null && limit !== null
              ? `API quota low (${remaining}/${limit}) search requests remaining in the current minute.`
              : "API quota information unavailable."}
          </span>
        </div>
        {error && (
          <p className="text-xs text-amber-700 border-t border-amber-500/20 pt-3">
            {truncated}
          </p>
        )}
      </div>
    </div>
  );
}
