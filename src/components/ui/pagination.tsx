"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageList(page: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (page > 3) pages.push("ellipsis");

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (page < totalPages - 2) pages.push("ellipsis");

  pages.push(totalPages);

  return pages;
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const pages = getPageList(page, totalPages);

  return (
    <nav className="flex items-center justify-center gap-1.5 py-6" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="flex h-9 items-center gap-1 rounded-lg border border-[#ECE9F6] px-3 text-[13px] font-medium text-[#334155] transition-colors hover:bg-[#F7F7FB] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <ChevronLeft size={15} />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, index) =>
          p === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="w-9 text-center font-[family-name:var(--font-mono)] text-[13px] text-[#94A3B8]"
            >
              ···
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={`
                flex h-9 w-9 items-center justify-center rounded-lg font-[family-name:var(--font-mono)] text-[13px] font-medium transition-colors
                ${
                  p === page
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                    : "text-[#334155] hover:bg-[#F7F7FB]"
                }
              `}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="flex h-9 items-center gap-1 rounded-lg border border-[#ECE9F6] px-3 text-[13px] font-medium text-[#334155] transition-colors hover:bg-[#F7F7FB] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={15} />
      </button>
    </nav>
  );
}