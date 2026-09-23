import Skeleton from "@/src/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 pb-20 pt-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-[#F7F7FB] p-8 sm:p-10 lg:p-14">
        <div className="max-w-2xl space-y-6">
          <Skeleton className="h-7 w-40 rounded-full" />
          <Skeleton className="h-11 w-72 sm:h-12 sm:w-96" />
          <div className="space-y-2.5">
            <Skeleton className="h-3.5 w-full max-w-md" />
            <Skeleton className="h-3.5 w-4/5 max-w-sm" />
          </div>
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-12 w-32 rounded-2xl" />
            <Skeleton className="h-12 w-44 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <section>
        <div className="mb-6 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-44" />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-[#ECE9F6] bg-white p-7">
              <div className="flex items-start justify-between">
                <Skeleton className="h-14 w-14 rounded-2xl" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <Skeleton className="mt-6 h-4 w-2/3" />
              <div className="mt-3 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feed + sidebar */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="rounded-2xl border border-[#ECE9F6] bg-white p-7 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-7 w-32" />
              </div>
              <Skeleton className="h-4 w-24" />
            </div>

            <div className="mt-7 space-y-5">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-[#ECE9F6] p-5">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-3.5 w-4/5" />
                  </div>
                  <Skeleton className="mt-4 h-48 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-4">
          {[3, 3, 2].map((rows, i) => (
            <div key={i} className="rounded-2xl border border-[#ECE9F6] bg-white p-7">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-5 w-36" />
              </div>
              <div className="mt-6 space-y-5">
                {Array.from({ length: rows }).map((_, j) => (
                  <div key={j} className="flex items-center gap-3.5">
                    <Skeleton className="h-12 w-12 shrink-0 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-2/3" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}