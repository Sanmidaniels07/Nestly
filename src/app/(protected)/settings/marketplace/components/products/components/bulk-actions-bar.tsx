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
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet-200 bg-violet-50/60 px-5 py-3.5">
      <p className="text-[13px] font-medium text-violet-700">
        {selectedIds.length} product{selectedIds.length !== 1 ? "s" : ""} selected
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {STATUS_ACTIONS.map((action) => (
          <button
            key={action.status}
            onClick={() => handleStatusChange(action.status)}
            disabled={isPending}
            className="rounded-lg border border-[#E5E7EB] bg-white px-3.5 py-2 text-[12.5px] font-medium text-[#334155] transition-colors hover:border-violet-300 hover:text-violet-700 disabled:opacity-50"
          >
            {action.label}
          </button>
        ))}

        <button
          onClick={handleArchive}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3.5 py-2 text-[12.5px] font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
        >
          <Archive size={13} />
          Archive
        </button>

        <button
          onClick={onClear}
          aria-label="Clear selection"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-white hover:text-[#334155]"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
