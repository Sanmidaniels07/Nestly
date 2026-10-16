import Skeleton from "@/src/components/ui/skeleton";

export function ChartCardSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <Skeleton className="h-4 w-36" />
      <Skeleton className="mt-5 w-full rounded-xl" style={{ height }} />
    </div>
  );
}
