"use client";

import Button from "@/src/components/ui/button";
import { PenSquare } from "lucide-react";

export default function ProfileEmptyPost() {
  return (
    <div className="rounded-2xl border border-dashed border-violet-200 bg-white py-16 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-violet-50">
        <PenSquare size={26} className="text-violet-600" />
      </div>

      <h2 className="text-[19px] font-semibold text-[#13131A]">
        No posts yet
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-[14px] text-[#64748B]">
        Your posts will appear here once you begin sharing updates with your community.
      </p>

      <Button className="mt-7" variant="tribely">
        Create first post
      </Button>
    </div>
  );
}