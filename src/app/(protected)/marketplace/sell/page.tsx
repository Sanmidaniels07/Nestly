"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, ImagePlus, Percent, Store as StoreIcon, XCircle } from "lucide-react";

import { useMySeller } from "@/src/hooks/use-my-seller";
import { useBecomeSeller } from "@/src/hooks/use-become-seller";
import { useCreateStore } from "@/src/hooks/use-create-store";
import { useImageUpload } from "@/src/hooks/use-image-upload";
import { useCategories } from "@/src/hooks/use-categories";
import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";
import { FormCardSkeleton } from "@/src/components/skeletons/form-card-skeleton";

export default function SellPage() {
  const router = useRouter();
  const { data: seller, isLoading, isError } = useMySeller();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-xl">
        <FormCardSkeleton fields={2} />
      </div>
    );
  }

  const isSeller = !isError && !!seller;

  if (isSeller && seller.status === "REJECTED") {
    return (
      <section className="mx-auto max-w-3xl rounded-2xl border border-[#ECE9F6] bg-white px-10 py-16 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <XCircle size={26} className="text-red-600" />
        </div>
        <h1 className="font-[family-name:var(--font-fraunces)] text-[26px] italic text-[#13131A]">
          Application rejected
        </h1>
        <p className="mt-2.5 text-[13.5px] text-[#64748B]">
          {seller.statusReason
            ? `Reason: ${seller.statusReason}`
            : "Your seller application was not approved."}
        </p>
        {seller.store && (
          <p className="mt-2.5 text-[13px] text-[#94A3B8]">
            {seller.store.name} is no longer manageable while your application is
            rejected.
          </p>
        )}
      </section>
    );
  }

  if (isSeller && seller.status === "PENDING") {
    return (
      <section className="mx-auto max-w-3xl rounded-2xl border border-[#ECE9F6] bg-white px-10 py-16 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
          <Clock size={26} className="text-amber-600" />
        </div>
        <h1 className="font-[family-name:var(--font-fraunces)] text-[26px] italic text-[#13131A]">
          Application pending
        </h1>
        <p className="mt-2.5 text-[13.5px] text-[#64748B]">
          Your seller application is awaiting admin review. We&apos;ll notify you as
          soon as it&apos;s approved.
        </p>
      </section>
    );
  }

  if (isSeller && seller.store) {
    return (
      <section className="mx-auto max-w-3xl rounded-2xl border border-[#ECE9F6] bg-white px-10 py-16 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 size={26} className="text-emerald-600" />
        </div>
        <h1 className="font-[family-name:var(--font-fraunces)] text-[26px] italic text-[#13131A]">
          You&apos;re all set up
        </h1>
        <p className="mt-2.5 text-[13.5px] text-[#64748B]">
          {seller.store.name} is live on Nestly.
        </p>
        <Button
          className="mx-auto mt-7 w-fit"
          variant="tribely"
          onClick={() => router.push("/settings/marketplace")}
        >
          Go to seller dashboard
        </Button>
      </section>
    );
  }

  if (isSeller) {
    return <CreateStoreForm />;
  }

  return <BecomeSellerForm />;
}

function BecomeSellerForm() {
  const [cacNumber, setCacNumber] = useState("");
  const { mutate: becomeSeller, isPending } = useBecomeSeller();
  const { data: categories } = useCategories();

  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-[#ECE9F6] bg-white p-8 sm:p-10">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-violet-50">
        <StoreIcon size={26} className="text-violet-600" />
      </div>

      <h1 className="text-center font-[family-name:var(--font-fraunces)] text-[26px] italic text-[#13131A]">
        Become a seller
      </h1>
      <p className="mt-2.5 text-center text-[13.5px] text-[#64748B]">
        Activate your seller account to start setting up your store.
      </p>

      {!!categories?.length && (
        <div className="mt-6 rounded-2xl border border-dashed border-[#E2E0EE] bg-[#FAFAFD] p-5">
          <div className="flex items-center gap-2">
            <Percent size={15} className="text-violet-600" />
            <p className="text-[13px] font-semibold text-[#13131A]">
              Nestly takes a commission on each sale
            </p>
          </div>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#64748B]">
            The rate varies by category — you keep the rest of what buyers pay,
            paid out to your registered bank account.
          </p>

          <div className="mt-3.5 space-y-1.5">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between text-[12.5px]"
              >
                <span className="text-[#334155]">{category.name}</span>
                <span className="font-[family-name:var(--font-mono)] font-medium text-violet-700">
                  {category.commissionRate}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <Input
          label="CAC registration number (optional)"
          value={cacNumber}
          onChange={(e) => setCacNumber(e.target.value)}
          placeholder="RC1234567"
        />

        <Button
          variant="tribely"
          className="w-full"
          loading={isPending}
          onClick={() =>
            becomeSeller({ cacNumber: cacNumber.trim() || undefined })
          }
        >
          Continue
        </Button>
      </div>
    </section>
  );
}

function CreateStoreForm() {
  const router = useRouter();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
  });
  const [logo, setLogo] = useState<string>();
  const [banner, setBanner] = useState<string>();

  const { mutate: uploadImage, isPending: isUploading } = useImageUpload();
  const { mutate: createStore, isPending: isCreating } = useCreateStore();

  const update = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleFile = (
    file: File | undefined,
    onDone: (url: string) => void
  ) => {
    if (!file) return;
    uploadImage(file, { onSuccess: onDone });
  };

  const canSubmit = form.name.trim().length > 0 && !isCreating && !isUploading;

  const handleSubmit = () => {
    if (!canSubmit) return;

    createStore(
      {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        address: form.address.trim() || undefined,
        city: form.city.trim() || undefined,
        state: form.state.trim() || undefined,
        country: form.country.trim() || undefined,
        logo,
        banner,
      },
      { onSuccess: () => router.push("/settings/marketplace") }
    );
  };

  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-[#ECE9F6] bg-white p-8 sm:p-10">
      <h1 className="font-[family-name:var(--font-fraunces)] text-[26px] italic text-[#13131A]">
        Set up your store
      </h1>
      <p className="mt-2.5 text-[13.5px] text-[#64748B]">
        Tell buyers who you are. You can update this later.
      </p>

      <div className="mt-8 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <ImagePicker
            label="Logo"
            previewUrl={logo}
            inputRef={logoInputRef}
            onFile={(file) => handleFile(file, setLogo)}
          />
          <ImagePicker
            label="Banner"
            previewUrl={banner}
            inputRef={bannerInputRef}
            onFile={(file) => handleFile(file, setBanner)}
          />
        </div>

        <Input
          label="Store name"
          value={form.name}
          onChange={update("name")}
          placeholder="e.g. Daniel's Electronics"
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={update("description")}
            rows={3}
            placeholder="What does your store sell?"
            className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-[14px] text-[#13131A] outline-none transition-colors focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={update("email")}
            placeholder="store@example.com"
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={update("phone")}
            placeholder="+234..."
          />
        </div>

        <Input
          label="Address"
          value={form.address}
          onChange={update("address")}
          placeholder="Street address"
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="City" value={form.city} onChange={update("city")} />
          <Input label="State" value={form.state} onChange={update("state")} />
          <Input
            label="Country"
            value={form.country}
            onChange={update("country")}
          />
        </div>

        <Button
          variant="tribely"
          className="mt-2 w-full"
          loading={isCreating || isUploading}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          Create store
        </Button>
      </div>
    </section>
  );
}

function ImagePicker({
  label,
  previewUrl,
  inputRef,
  onFile,
}: {
  label: string;
  previewUrl?: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFile: (file: File | undefined) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex h-28 w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-[#F7F7FB] transition-colors hover:border-violet-400"
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={label}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-[#94A3B8]">
            <ImagePlus size={20} />
            <span className="text-[12px]">Upload</span>
          </div>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
    </div>
  );
}
