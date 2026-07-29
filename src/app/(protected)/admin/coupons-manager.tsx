"use client";

import { useState } from "react";
import { Plus, Ticket } from "lucide-react";

import { useCoupons } from "@/src/hooks/use-coupons";
import { useCreateCoupon } from "@/src/hooks/use-create-coupon";
import { useUpdateCoupon } from "@/src/hooks/use-update-coupon";
import { Coupon, CouponType } from "@/src/types/coupon";
import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";
import Pagination from "@/src/components/ui/pagination";
import { TableSkeleton } from "@/src/components/skeletons/table-skeleton";

function formatValue(coupon: Coupon) {
  return coupon.type === "PERCENTAGE" ? `${coupon.value}%` : `₦${coupon.value.toLocaleString()}`;
}

export default function CouponsManager() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const { data, isLoading } = useCoupons({ page, limit: 15 });
  const coupons = data?.coupons ?? [];

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button
          onClick={() => setCreateOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-[13.5px] font-semibold text-white transition-all hover:brightness-110"
        >
          <Plus size={16} />
          New coupon
        </button>
      </div>

      {createOpen && <CreateCouponForm onDone={() => setCreateOpen(false)} />}

      {isLoading ? (
        <TableSkeleton rows={5} cols={4} />
      ) : coupons.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#ECE9F6] bg-[#FAFAFD] px-8 py-16 text-center">
          <Ticket className="mx-auto h-8 w-8 text-[#C4C0DC]" strokeWidth={1.5} />
          <p className="mt-4 text-[13.5px] text-[#94A3B8]">No coupons yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#ECE9F6] bg-white">
          <table className="w-full text-left">
            <thead className="border-b border-[#F2F1F8] bg-[#FAFAFD]">
              <tr>
                <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-wide text-[#94A3B8]">Code</th>
                <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-wide text-[#94A3B8]">Value</th>
                <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-wide text-[#94A3B8]">Usage</th>
                <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-wide text-[#94A3B8]">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F1F8]">
              {coupons.map((coupon) => (
                <CouponRow key={coupon.id} coupon={coupon} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && (
        <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}

function CouponRow({ coupon }: { coupon: Coupon }) {
  const { mutate: updateCoupon, isPending } = useUpdateCoupon();

  return (
    <tr>
      <td className="px-5 py-4 font-[family-name:var(--font-mono)] text-[13px] font-semibold text-[#13131A]">
        {coupon.code}
      </td>
      <td className="px-5 py-4 text-[13px] text-[#334155]">{formatValue(coupon)}</td>
      <td className="px-5 py-4 text-[12.5px] text-[#64748B]">
        {coupon.usedCount}
        {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
      </td>
      <td className="px-5 py-4">
        <span
          className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${
            coupon.isActive ? "bg-emerald-50 text-emerald-700" : "bg-[#F1F0F5] text-[#64748B]"
          }`}
        >
          {coupon.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-5 py-4 text-right">
        <button
          onClick={() => updateCoupon({ id: coupon.id, data: { isActive: !coupon.isActive } })}
          disabled={isPending}
          className="rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-[12px] font-semibold text-[#334155] transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          {coupon.isActive ? "Deactivate" : "Activate"}
        </button>
      </td>
    </tr>
  );
}

function CreateCouponForm({ onDone }: { onDone: () => void }) {
  const [code, setCode] = useState("");
  const [type, setType] = useState<CouponType>("PERCENTAGE");
  const [value, setValue] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");

  const { mutate: createCoupon, isPending } = useCreateCoupon();

  const canSubmit = code.trim().length >= 3 && Number(value) > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;

    createCoupon(
      {
        code: code.trim().toUpperCase(),
        type,
        value: Number(value),
        minOrderAmount: minOrderAmount ? Number(minOrderAmount) : undefined,
        usageLimit: usageLimit ? Number(usageLimit) : undefined,
      },
      {
        onSuccess: () => {
          setCode("");
          setValue("");
          setMinOrderAmount("");
          setUsageLimit("");
          onDone();
        },
      }
    );
  };

  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[19px] italic text-[#13131A]">
        Create coupon
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Input
          label="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. WELCOME10"
        />

        <div>
          <label className="mb-2 block text-[13.5px] font-medium text-[#334155]">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as CouponType)}
            className="h-12 w-full rounded-xl border border-[#E4E6EB] bg-[#FAFBFC] px-4 text-[14px] text-[#13131A] outline-none transition-colors focus:border-violet-400 focus:bg-white"
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED">Fixed amount</option>
          </select>
        </div>

        <Input
          label={type === "PERCENTAGE" ? "Value (%)" : "Value (₦)"}
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Input
          label="Minimum order amount (optional)"
          type="number"
          value={minOrderAmount}
          onChange={(e) => setMinOrderAmount(e.target.value)}
        />
        <Input
          label="Usage limit (optional)"
          type="number"
          value={usageLimit}
          onChange={(e) => setUsageLimit(e.target.value)}
        />
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <Button variant="outline" onClick={onDone} className="h-11 rounded-xl px-6">
          Cancel
        </Button>
        <Button
          variant="tribely"
          loading={isPending}
          disabled={!canSubmit}
          onClick={handleSubmit}
          className="h-11 rounded-xl px-6"
        >
          Create
        </Button>
      </div>
    </div>
  );
}
