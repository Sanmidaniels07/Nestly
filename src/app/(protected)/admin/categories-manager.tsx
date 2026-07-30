"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, LayoutGrid, Plus, Star, Trash2 } from "lucide-react";

import { useCategories } from "@/src/hooks/use-categories";
import { useCreateCategory } from "@/src/hooks/use-create-category";
import { useUpdateCategory } from "@/src/hooks/use-update-category";
import { useDeleteCategory } from "@/src/hooks/use-delete-category";
import { useImageUpload } from "@/src/hooks/use-image-upload";
import { Category } from "@/src/types/category";
import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";

export default function CategoriesManager() {
  const [createOpen, setCreateOpen] = useState(false);
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button
          onClick={() => setCreateOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-[13.5px] font-semibold text-white transition-all hover:brightness-110"
        >
          <Plus size={16} />
          New category
        </button>
      </div>

      {createOpen && <CreateCategoryForm onDone={() => setCreateOpen(false)} />}

      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-[#F7F7FB]" />
          ))}
        </div>
      ) : !categories?.length ? (
        <div className="rounded-2xl border border-dashed border-[#ECE9F6] bg-[#FAFAFD] px-8 py-16 text-center">
          <LayoutGrid className="mx-auto h-8 w-8 text-[#C4C0DC]" strokeWidth={1.5} />
          <p className="mt-4 text-[13.5px] text-[#94A3B8]">
            No categories yet. Sellers can&apos;t assign products to a category until you
            create at least one.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#ECE9F6] bg-white">
          <table className="w-full text-left">
            <thead className="border-b border-[#F2F1F8] bg-[#FAFAFD]">
              <tr>
                <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-wide text-[#94A3B8]">
                  Category
                </th>
                <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-wide text-[#94A3B8]">
                  Products
                </th>
                <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-wide text-[#94A3B8]">
                  Commission
                </th>
                <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-wide text-[#94A3B8]">
                  Featured
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F1F8]">
              {categories.map((category) => (
                <CategoryRow key={category.id} category={category} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CategoryRow({ category }: { category: Category }) {
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [commissionInput, setCommissionInput] = useState(category.commissionRate.toString());

  useEffect(() => {
    setCommissionInput(category.commissionRate.toString());
  }, [category.commissionRate]);

  const handleDelete = () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      setTimeout(() => setConfirmingDelete(false), 3000);
      return;
    }
    deleteCategory(category.id);
  };

  const handleCommissionBlur = () => {
    const value = Number(commissionInput);

    if (!Number.isFinite(value) || value < 0 || value > 100) {
      setCommissionInput(category.commissionRate.toString());
      return;
    }

    if (value !== category.commissionRate) {
      updateCategory({ id: category.id, data: { commissionRate: value } });
    }
  };

  return (
    <tr>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F4F4F7]">
            {category.icon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={category.icon} alt={category.name} className="h-full w-full object-cover" />
            ) : (
              <LayoutGrid size={15} className="text-[#94A3B8]" />
            )}
          </div>
          <span className="text-[13.5px] font-medium text-[#13131A]">{category.name}</span>
        </div>
      </td>
      <td className="px-5 py-3.5 font-[family-name:var(--font-mono)] text-[13px] text-[#64748B]">
        {category.productCount ?? 0}
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={0}
            max={100}
            step={0.5}
            value={commissionInput}
            onChange={(e) => setCommissionInput(e.target.value)}
            onBlur={handleCommissionBlur}
            disabled={isUpdating}
            className="h-8 w-16 rounded-lg border border-[#E5E7EB] px-2 text-[13px] font-medium text-[#13131A] outline-none transition-colors focus:border-violet-400 disabled:opacity-50"
          />
          <span className="text-[12px] text-[#94A3B8]">%</span>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <button
          onClick={() =>
            updateCategory({ id: category.id, data: { isFeatured: !category.isFeatured } })
          }
          disabled={isUpdating}
          className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors disabled:opacity-50 ${
            category.isFeatured
              ? "border-violet-200 bg-violet-50 text-violet-600"
              : "border-[#E5E7EB] text-[#C4C0DC] hover:text-violet-500"
          }`}
          aria-label={category.isFeatured ? "Unfeature category" : "Feature category"}
        >
          <Star size={13} className={category.isFeatured ? "fill-violet-600" : ""} />
        </button>
      </td>
      <td className="px-5 py-3.5 text-right">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`
            inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[12px] font-medium transition-colors disabled:opacity-50
            ${
              confirmingDelete
                ? "bg-red-600 text-white hover:bg-red-700"
                : "text-[#94A3B8] hover:bg-red-50 hover:text-red-600"
            }
          `}
        >
          <Trash2 size={13} />
          {confirmingDelete && "Sure?"}
        </button>
      </td>
    </tr>
  );
}

function CreateCategoryForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [icon, setIcon] = useState<string>();
  const [commissionRate, setCommissionRate] = useState("10");
  const iconInputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadImage, isPending: isUploading } = useImageUpload();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();

  const canSubmit = name.trim().length >= 2 && !isUploading;

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    uploadImage(file, { onSuccess: setIcon });
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    createCategory(
      { name: name.trim(), icon, isFeatured, commissionRate: Number(commissionRate) || 0 },
      {
        onSuccess: () => {
          setName("");
          setIcon(undefined);
          setIsFeatured(false);
          setCommissionRate("10");
          onDone();
        },
      }
    );
  };

  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[19px] italic text-[#13131A]">
        Create category
      </h2>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start">
        <button
          type="button"
          onClick={() => iconInputRef.current?.click()}
          className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#D8D5E8] bg-[#F7F7FB] transition-colors hover:border-violet-300"
        >
          {icon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={icon} alt="Category icon" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus size={20} className="text-[#94A3B8]" />
          )}
        </button>
        <input
          ref={iconInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        <div className="flex-1 space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Electronics"
          />

          <Input
            label="Commission rate (%)"
            type="number"
            min={0}
            max={100}
            step={0.5}
            value={commissionRate}
            onChange={(e) => setCommissionRate(e.target.value)}
            placeholder="10"
          />

          <label className="flex items-center gap-2.5 text-[13.5px] text-[#334155]">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-[#D4D2E3] text-violet-600 focus:ring-violet-400"
            />
            Feature on the marketplace homepage
          </label>
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <Button variant="outline" onClick={onDone} className="h-11 rounded-xl px-6">
          Cancel
        </Button>
        <Button
          variant="tribely"
          loading={isCreating || isUploading}
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
