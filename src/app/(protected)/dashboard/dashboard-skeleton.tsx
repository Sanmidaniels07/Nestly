import Skeleton from "@/src/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 pb-20 pt-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-surface-2 p-8 sm:p-10 lg:p-14">
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

      {/* Stat tiles */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="mt-3 h-7 w-16" />
            <Skeleton className="mt-2 h-3 w-24" />
          </div>
        ))}
      </section>

      {/* Feed + sidebar */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          {/* Activity chart */}
          <div className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-36" />
              </div>
              <Skeleton className="h-8 w-32 rounded-xl" />
            </div>
            <Skeleton className="mt-6 h-[240px] w-full rounded-xl sm:h-[280px]" />
          </div>

          <div className="rounded-2xl border border-line bg-surface p-7 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-7 w-32" />
              </div>
              <Skeleton className="h-4 w-24" />
            </div>

            <div className="mt-7 space-y-5">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-line p-5">
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
            <div key={i} className="rounded-2xl border border-line bg-surface p-7">
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