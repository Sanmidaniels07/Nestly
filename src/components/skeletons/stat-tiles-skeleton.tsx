import Skeleton from "@/src/components/ui/skeleton";

export function StatTilesSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-[#ECE9F6] bg-white p-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-3 w-10" />
          </div>
          <Skeleton className="mt-4 h-6 w-20" />
          <Skeleton className="mt-2 h-3 w-16" />
        </div>
      ))}
    </div>
  );
}
