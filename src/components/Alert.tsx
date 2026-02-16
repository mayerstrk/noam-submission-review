import { AlertTriangle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRepositories } from "@/hooks/queries/useRepositories";

export function Alert() {
  const { error, data } = useRepositories();

  const limit =
    error?.response?.headers["x-ratelimit-limit"] ??
    data?.headers["x-ratelimit-limit"];

  const remaining = Number(
    error?.response?.headers["x-ratelimit-remaining"] ??
    data?.headers["x-ratelimit-remaining"]
  );

  const message =
    (error?.response?.data as { message?: string })?.message
      ?.match(/[^.!?]+[.!?]/)?.[0] ?? "";

  if (!error && !remaining) return null;

  const hasError = !!error;
  const isLow = remaining <= 5;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
        className="flex justify-center py-4 min-h-[140px]"
      >
        <motion.div
          layout
          className={`flex flex-col gap-3 w-fit max-w-xl px-6 py-4 rounded-xl border h-fit ${hasError
              ? "border-amber-500/30 bg-amber-500/5 shadow-amber-500/10"
              : "border-blue-500/30 bg-blue-500/5 shadow-blue-500/10"
            }`}
        >
          <div className="flex items-start gap-3">
            {hasError ? (
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-500" />
            ) : (
              <CheckCircle className="h-5 w-5 shrink-0 mt-0.5 text-blue-500" />
            )}
            <span
              className={`text-sm ${hasError ? "text-amber-500" : "text-blue-500"
                }`}
            >
              API quota {isLow ? "low" : "okay"} {remaining} / {limit} search
              requests remaining in the current minute.
            </span>
          </div>

          <AnimatePresence>
            {hasError && message && (
              <motion.p
                key="error-message"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="text-xs text-amber-700 border-t border-amber-500/20 pt-3 overflow-hidden"
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
