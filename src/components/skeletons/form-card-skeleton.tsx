import Skeleton from "@/src/components/ui/skeleton";

export function FormCardSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-6 sm:p-7">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-2 h-3 w-56" />

      <div className="mt-6 space-y-5">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
