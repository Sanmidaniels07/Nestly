import Skeleton from "@/src/components/ui/skeleton";

interface Props {
  count?: number;
  className?: string;
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#ECE9F6] bg-white">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-3.5 w-4/5" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-2/5" />
      </div>
    </div>
  );
}

export function SellerCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#ECE9F6] bg-white">
      <Skeleton className="h-32 w-full rounded-none" />
      <div className="px-6 pb-6">
        <div className="-mt-10 flex items-end gap-4">
          <Skeleton className="h-20 w-20 shrink-0 rounded-full ring-4 ring-white" />
          <div className="min-w-0 flex-1 space-y-2 pb-1">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
        <Skeleton className="mt-4 h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function SellerGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SellerCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CardGridSkeleton({
  count = 8,
  className = "grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
}: Props) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
