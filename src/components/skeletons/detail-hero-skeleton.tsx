import Skeleton from "@/src/components/ui/skeleton";

export function DetailHeroSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-3">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-xl" />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-4/5" />
        <Skeleton className="h-5 w-1/3" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-2/3" />
        </div>
        <Skeleton className="mt-4 h-12 w-full rounded-2xl" />
      </div>
    </div>
  );
}
