import Skeleton from "@/src/components/ui/skeleton";

interface Props {
  rows?: number;
  cols?: number;
}

export function TableSkeleton({ rows = 6, cols = 5 }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#ECE9F6] bg-white">
      <div className="flex items-center gap-6 border-b border-[#F2F1F8] bg-[#FAFAFD] px-5 py-3.5">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-16" />
        ))}
      </div>

      <div className="divide-y divide-[#F0EEF9]">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-6 px-5 py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
              <Skeleton className="h-3.5 w-28" />
            </div>
            {Array.from({ length: cols - 1 }).map((_, c) => (
              <Skeleton key={c} className="h-3.5 w-14" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
