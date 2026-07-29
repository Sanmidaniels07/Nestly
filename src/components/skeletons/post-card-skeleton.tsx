import Skeleton from "@/src/components/ui/skeleton";

export function PostCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#EDEBF5] bg-white">
      <div className="flex items-center gap-3.5 p-5 sm:p-6">
        <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      <div className="space-y-2.5 px-5 pb-4 sm:px-6">
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-4/5" />
      </div>

      <Skeleton className="h-64 w-full rounded-none" />

      <div className="flex items-center gap-6 border-t border-[#F2F1F8] px-5 py-4 sm:px-6">
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-5 w-12" />
      </div>
    </article>
  );
}

export function PostListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-5">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}
