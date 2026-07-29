"use client";

import { useState } from "react";
import { Plus, Store as StoreIcon, Wallet } from "lucide-react";

import { usePayouts } from "@/src/hooks/use-payouts";
import { useCreatePayout } from "@/src/hooks/use-create-payout";
import { useStores } from "@/src/hooks/use-stores";
import { Store } from "@/src/types/store";
import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";
import Pagination from "@/src/components/ui/pagination";
import { formatRelativeTime } from "@/src/lib/date";

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PayoutsManager() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = usePayouts({ page, limit: 15 });
  const payouts = data?.payouts ?? [];

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button
          onClick={() => setCreateOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-[13.5px] font-semibold text-white transition-all hover:brightness-110"
        >
          <Plus size={16} />
          Record payout
        </button>
      </div>

      {createOpen && <CreatePayoutForm onDone={() => setCreateOpen(false)} />}

      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-[#F7F7FB]" />
          ))}
        </div>
      ) : payouts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#ECE9F6] bg-[#FAFAFD] px-8 py-16 text-center">
          <Wallet className="mx-auto h-8 w-8 text-[#C4C0DC]" strokeWidth={1.5} />
          <p className="mt-4 text-[13.5px] text-[#94A3B8]">No payouts recorded yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#ECE9F6] bg-white">
          <table className="w-full text-left">
            <thead className="border-b border-[#F2F1F8] bg-[#FAFAFD]">
              <tr>
                <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-wide text-[#94A3B8]">
                  Store
                </th>
                <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-wide text-[#94A3B8]">
                  Amount
                </th>
                <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-wide text-[#94A3B8]">
                  Note
                </th>
                <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-wide text-[#94A3B8]">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F1F8]">
              {payouts.map((payout) => (
                <tr key={payout.id}>
                  <td className="px-5 py-3.5 text-[13.5px] font-medium text-[#13131A]">
                    {payout.store?.name ?? "Unknown store"}
                  </td>
                  <td className="px-5 py-3.5 font-[family-name:var(--font-mono)] text-[13px] font-semibold text-violet-700">
                    {money(payout.amount)}
                  </td>
                  <td className="max-w-[240px] truncate px-5 py-3.5 text-[12.5px] text-[#64748B]">
                    {payout.note ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-[12px] text-[#94A3B8]">
                    {formatRelativeTime(payout.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && data.totalPages > 1 && (
        <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}

function CreatePayoutForm({ onDone }: { onDone: () => void }) {
  const [storeSearch, setStoreSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const { data: storesData } = useStores({ search: storeSearch, limit: 6 });
  const { mutate: createPayout, isPending } = useCreatePayout();

  const stores = storesData?.stores ?? [];
  const canSubmit = !!selectedStore && Number(amount) > 0;

  const handleSubmit = () => {
    if (!canSubmit || !selectedStore) return;

    createPayout(
      { storeId: selectedStore.id, amount: Number(amount), note: note.trim() || undefined },
      {
        onSuccess: () => {
          setSelectedStore(null);
          setStoreSearch("");
          setAmount("");
          setNote("");
          onDone();
        },
      }
    );
  };

  return (
    <div className="space-y-4 rounded-2xl border border-dashed border-violet-200 bg-[#FAFAFD] p-5">
      <div>
        <label className="mb-2 block text-[13px] font-medium text-[#334155]">Store</label>

        {selectedStore ? (
          <div className="flex items-center justify-between rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <StoreIcon size={15} className="text-violet-600" />
              <span className="text-[13.5px] font-medium text-[#13131A]">
                {selectedStore.name}
              </span>
            </div>
            <button
              onClick={() => setSelectedStore(null)}
              className="text-[12.5px] font-medium text-violet-600 hover:underline"
            >
              Change
            </button>
          </div>
        ) : (
          <div>
            <Input
              value={storeSearch}
              onChange={(e) => setStoreSearch(e.target.value)}
              placeholder="Search stores by name..."
            />
            {storeSearch.trim() && stores.length > 0 && (
              <div className="mt-2 space-y-1 rounded-2xl border border-[#ECE9F6] bg-white p-2">
                {stores.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => setSelectedStore(store)}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13.5px] text-[#13131A] hover:bg-[#F7F7FB]"
                  >
                    <StoreIcon size={14} className="text-[#94A3B8]" />
                    {store.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Amount (₦)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="50000"
        />
        <Input
          label="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Weekly payout"
        />
      </div>

      <Button
        variant="tribely"
        disabled={!canSubmit}
        loading={isPending}
        onClick={handleSubmit}
        className="w-full sm:w-auto"
      >
        Record payout
      </Button>
    </div>
  );
}
