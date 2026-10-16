"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileX } from "lucide-react";

import { usePost } from "@/src/hooks/use-post";
import PostCard from "../../feed/main-feed/post-card";
import Skeleton from "@/src/components/ui/skeleton";

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: post, isLoading, isError } = usePost(id);

  return (
    <div className="mx-auto max-w-2xl space-y-5 pb-20 pt-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-[13.5px] font-medium text-muted transition-colors hover:text-violet-600 dark:hover:text-violet-400"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {isLoading ? (
        <div className="space-y-4 rounded-2xl border border-line bg-surface p-6">
          <div className="flex items-center gap-3.5">
            <Skeleton className="h-11 w-11 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : isError || !post ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface-sunken px-8 py-16 text-center">
          <FileX className="mx-auto h-8 w-8 text-faint" strokeWidth={1.5} />
          <p className="mt-4 text-[13.5px] font-medium text-ink">Post not found</p>
          <p className="mt-1 text-[12.5px] text-subtle">
            It may have been deleted or is no longer available.
          </p>
        </div>
      ) : (
        <PostCard post={post} autoOpenComments />
      )}
    </div>
  );
}
