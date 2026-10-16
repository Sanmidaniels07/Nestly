"use client";

import { Archive, X } from "lucide-react";

import { useBulkUpdateProductStatus } from "@/src/hooks/use-bulk-update-product-status";
import { useBulkDeleteProducts } from "@/src/hooks/use-bulk-delete-products";
import { ProductStatus } from "@/src/types/product";

interface Props {
  selectedIds: string[];
  onClear: () => void;
}

const STATUS_ACTIONS: { label: string; status: ProductStatus }[] = [
  { label: "Publish", status: "PUBLISHED" },
  { label: "Move to draft", status: "DRAFT" },
];

export default function BulkActionsBar({ selectedIds, onClear }: Props) {
  const { mutate: bulkUpdateStatus, isPending: isUpdating } = useBulkUpdateProductStatus();
  const { mutate: bulkArchive, isPending: isArchiving } = useBulkDeleteProducts();

  const isPending = isUpdating || isArchiving;

  const handleStatusChange = (status: ProductStatus) => {
    bulkUpdateStatus({ productIds: selectedIds, status }, { onSuccess: onClear });
  };

  const handleArchive = () => {
    bulkArchive({ productIds: selectedIds }, { onSuccess: onClear });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet-200 dark:border-violet-500/30 bg-violet-50/60 px-5 py-3.5">
      <p className="text-[13px] font-medium text-violet-700 dark:text-violet-300">
        {selectedIds.length} product{selectedIds.length !== 1 ? "s" : ""} selected
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {STATUS_ACTIONS.map((action) => (
          <button
            key={action.status}
            onClick={() => handleStatusChange(action.status)}
            disabled={isPending}
            className="rounded-lg border border-line-strong bg-surface px-3.5 py-2 text-[12.5px] font-medium text-ink-2 transition-colors hover:border-violet-300 dark:hover:border-violet-500/40 hover:text-violet-700 dark:hover:text-violet-300 disabled:opacity-50"
          >
            {action.label}
          </button>
        ))}

        <button
          onClick={handleArchive}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-lg border border-red-200 dark:border-red-500/30 bg-surface px-3.5 py-2 text-[12.5px] font-medium text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50"
        >
          <Archive size={13} />
          Archive
        </button>

        <button
          onClick={onClear}
          aria-label="Clear selection"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-surface hover:text-ink-2"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
