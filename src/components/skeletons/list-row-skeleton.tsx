import Skeleton from "@/src/components/ui/skeleton";

export function ListRowSkeleton({ withAvatar = true }: { withAvatar?: boolean }) {
  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-[#ECE9F6] bg-white p-4">
      {withAvatar && <Skeleton className="h-10 w-10 shrink-0 rounded-full" />}
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-3.5 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-8 w-20 shrink-0 rounded-lg" />
    </div>
  );
}

export function AvatarRailSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="-mx-2 flex gap-6 overflow-hidden px-2 pb-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex shrink-0 flex-col items-center gap-2">
          <Skeleton className="h-[68px] w-[68px] rounded-full" />
          <Skeleton className="h-2.5 w-12" />
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({
  count = 5,
  withAvatar = true,
}: {
  count?: number;
  withAvatar?: boolean;
}) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <ListRowSkeleton key={i} withAvatar={withAvatar} />
      ))}
    </div>
  );
}
