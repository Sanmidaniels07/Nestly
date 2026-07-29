import Skeleton from "@/src/components/ui/skeleton";

export function ProfileHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Skeleton className="h-[220px] w-full rounded-2xl md:h-[300px] lg:h-[360px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 md:left-10 md:translate-x-0">
          <Skeleton className="h-28 w-28 rounded-full ring-4 ring-white md:h-36 md:w-36" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 pt-14 text-center md:items-start md:pl-10 md:pt-6 md:text-left">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-3.5 w-28" />
      </div>

      <div className="grid grid-cols-3 gap-4 border-t border-[#F2F1F8] pt-5 md:px-10">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-3 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function UserProfileHeaderSkeleton() {
  return (
    <div className="rounded-2xl border border-[#EDEBF5] bg-white p-6 sm:p-8">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <Skeleton className="h-24 w-24 shrink-0 rounded-full" />

        <div className="min-w-0 flex-1 space-y-3 text-center sm:text-left">
          <Skeleton className="mx-auto h-5 w-40 sm:mx-0" />
          <Skeleton className="mx-auto h-3.5 w-24 sm:mx-0" />
          <Skeleton className="mx-auto h-3.5 w-full max-w-sm sm:mx-0" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 divide-x divide-[#F0EEF9] border-t border-[#F2F1F8] pt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-3 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}
