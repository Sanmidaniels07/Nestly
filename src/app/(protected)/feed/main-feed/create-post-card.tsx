"use client";

import { useState } from "react";
import { Image as ImageIcon, Smile, X } from "lucide-react";

export default function CreatePostCard() {
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState("");

  const canPost = text.trim().length > 0;

  return (
    <div className="rounded-2xl border border-[#EDEBF5] bg-white p-5 transition-shadow duration-300 hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.2)] sm:p-6">
      <div className="flex gap-4">
        <div className="mt-1 h-11 w-11 shrink-0 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600" />

        <div className="flex-1">
          {!expanded ? (
            <button
              onClick={() => setExpanded(true)}
              className="w-full rounded-2xl bg-[#F7F7FB] px-5 py-3.5 text-left text-[15px] text-[#94A3B8] transition-colors hover:bg-[#F0EFF9]"
            >
              What's happening today?
            </button>
          ) : (
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's happening today?"
              rows={3}
              maxLength={280}
              className="w-full resize-none rounded-2xl bg-[#F7F7FB] px-5 py-3.5 text-[15px] text-[#13131A] outline-none placeholder:text-[#94A3B8] focus:bg-[#F0EFF9]"
            />
          )}

          {expanded && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1">
                <button className="rounded-full p-2 text-violet-600 transition-colors hover:bg-violet-50">
                  <ImageIcon size={19} />
                </button>
                <button className="rounded-full p-2 text-violet-600 transition-colors hover:bg-violet-50">
                  <Smile size={19} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-[family-name:var(--font-mono)] text-[12px] text-[#94A3B8]">
                  {text.length}/280
                </span>
                <button
                  onClick={() => setExpanded(false)}
                  className="rounded-full p-1.5 text-[#94A3B8] transition-colors hover:bg-gray-100"
                  aria-label="Cancel"
                >
                  <X size={16} />
                </button>
                <button
                  disabled={!canPost}
                  className="
          rounded-full bg-gradient-to-r from-violet-600 to-indigo-600
          px-5 py-2 text-[13px] font-semibold text-white
          transition-all hover:brightness-110
          disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100
        "
                >
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {!expanded && (
        <div className="mt-4 flex gap-8 pl-[60px]">
          <button
            onClick={() => setExpanded(true)}
            className="flex items-center gap-2 text-[13px] font-medium text-[#64748B] transition-colors hover:text-violet-600"
          >
            <ImageIcon size={17} />
            Photo / Video
          </button>
        </div>
      )}
    </div>
  );
}
