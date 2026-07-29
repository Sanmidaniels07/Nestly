import Skeleton from "@/src/components/ui/skeleton";

export function ConversationListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="divide-y divide-[#F2F1F8]">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3.5">
          <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-2.5 w-8" />
            </div>
            <Skeleton className="h-3 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MessageThreadSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-4 p-5">
      {Array.from({ length: count }).map((_, i) => {
        const fromMe = i % 2 === 1;
        return (
          <div key={i} className={`flex ${fromMe ? "justify-end" : "justify-start"}`}>
            <Skeleton
              className="h-10 rounded-2xl"
              style={{ width: `${140 + ((i * 47) % 120)}px` }}
            />
          </div>
        );
      })}
    </div>
  );
}
