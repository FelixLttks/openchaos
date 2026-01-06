import type { PullRequest } from "@/lib/github";

interface PRCardProps {
  pr: PullRequest;
  rank: number;
}

export function PRCard({ pr, rank }: PRCardProps) {
  return (
    <a
      href={pr.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full p-4 rounded-lg border border-zinc-200 hover:border-zinc-400 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-sm">#{pr.number}</span>
            {rank === 1 && (
              <span className="px-1.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded">
                LEADING
              </span>
            )}
          </div>
          <h3 className="mt-1 font-medium truncate">{pr.title}</h3>
          <p className="mt-1 text-sm text-zinc-500">by @{pr.author}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1.5 text-lg font-medium">
            <span>👍</span>
            <span>{pr.votes}</span>
          </div>
          <div className="flex items-center gap-2">
            {(!pr.isMergeable || !pr.checksPassed) && (
              <span className="text-xs text-zinc-500 font-medium text-right">
                {!pr.isMergeable && !pr.checksPassed
                  ? "Conflicts & Checks failed"
                  : !pr.isMergeable
                    ? "Merge conflicts"
                    : "Checks failed"}
              </span>
            )}
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full ${pr.isMergeable && pr.checksPassed
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                }`}
              title={
                pr.isMergeable && pr.checksPassed
                  ? "All checks passed & no conflicts"
                  : "Checks failed or has conflicts"
              }
            >
              {pr.isMergeable && pr.checksPassed ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 text-sm text-zinc-500 flex items-center gap-1">
        View &amp; Vote on GitHub
        <span aria-hidden="true">→</span>
      </div>
    </a>
  );
}
