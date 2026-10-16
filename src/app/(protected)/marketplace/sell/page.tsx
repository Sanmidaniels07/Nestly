"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, ImagePlus, Percent, Store as StoreIcon, XCircle } from "lucide-react";

import { useMySeller } from "@/src/hooks/use-my-seller";
import { useBecomeSeller } from "@/src/hooks/use-become-seller";
import { useCreateStore } from "@/src/hooks/use-create-store";
import { useImageUpload } from "@/src/hooks/use-image-upload";
import { useCategories } from "@/src/hooks/use-categories";
import { useCountdown } from "@/src/hooks/use-countdown";
import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";
import { FormCardSkeleton } from "@/src/components/skeletons/form-card-skeleton";
import BackButton from "@/src/components/ui/back-button";
import { SellerProfile } from "@/src/types/seller";

// Sellers arrive here from the seller dashboard, the marketplace, or a
// "Set up store" prompt - always offer a way back to where they were.
export default function SellPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <BackButton fallbackHref="/settings/marketplace" />
      <SellPageContent />
    </div>
  );
}

function SellPageContent() {
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
    return <RejectedApplication seller={seller} />;
  }

  if (isSeller && seller.status === "PENDING") {
    return (
      <section className="mx-auto max-w-3xl rounded-2xl border border-line bg-surface px-6 py-16 text-center sm:px-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-500/10">
          <Clock size={26} className="text-amber-600 dark:text-amber-400" />
        </div>
        <h1 className="font-[family-name:var(--font-fraunces)] text-[26px] italic text-ink">
          Application pending
        </h1>
        <p className="mt-2.5 text-[13.5px] text-muted">
          Your seller application is awaiting admin review. We&apos;ll notify you as
          soon as it&apos;s approved.
        </p>
      </section>
    );
  }

  if (isSeller && seller.store) {
    return (
      <section className="mx-auto max-w-3xl rounded-2xl border border-line bg-surface px-6 py-16 text-center sm:px-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10">
          <CheckCircle2 size={26} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="font-[family-name:var(--font-fraunces)] text-[26px] italic text-ink">
          You&apos;re all set up
        </h1>
        <p className="mt-2.5 text-[13.5px] text-muted">
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

function RejectedApplication({ seller }: { seller: SellerProfile }) {
  const { mutate: becomeSeller, isPending } = useBecomeSeller();
  const { label: countdownLabel, isDone } = useCountdown(seller.reapplyEligibleAt);

  const canReapply = seller.canReapply || isDone;

  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-line bg-surface px-6 py-16 text-center sm:px-10">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
        <XCircle size={26} className="text-red-600 dark:text-red-400" />
      </div>
      <h1 className="font-[family-name:var(--font-fraunces)] text-[26px] italic text-ink">
        Application rejected
      </h1>
      <p className="mt-2.5 text-[13.5px] text-muted">
        {seller.statusReason
          ? `Reason: ${seller.statusReason}`
          : "Your seller application was not approved."}
      </p>
      {seller.store && (
        <p className="mt-2.5 text-[13px] text-subtle">
          {seller.store.name} is no longer manageable while your application is
          rejected.
        </p>
      )}

      {!canReapply && countdownLabel && (
        <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full bg-surface-sunken px-4 py-2 text-[13px] font-medium text-ink-2">
          <Clock size={14} className="text-subtle" />
          You can reapply in {countdownLabel}
        </div>
      )}

      {canReapply && (
        <Button
          className="mx-auto mt-7 w-fit"
          variant="tribely"
          loading={isPending}
          onClick={() => becomeSeller({})}
        >
          Apply again
        </Button>
      )}
    </section>
  );
}

function BecomeSellerForm() {
  const [cacNumber, setCacNumber] = useState("");
  const { mutate: becomeSeller, isPending } = useBecomeSeller();
  const { data: categories } = useCategories();

  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-line bg-surface p-6 sm:p-10">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-violet-50 dark:bg-violet-500/10">
        <StoreIcon size={26} className="text-violet-600 dark:text-violet-400" />
      </div>

      <h1 className="text-center font-[family-name:var(--font-fraunces)] text-[26px] italic text-ink">
        Become a seller
      </h1>
      <p className="mt-2.5 text-center text-[13.5px] text-muted">
        Activate your seller account to start setting up your store.
      </p>

      {!!categories?.length && (
        <div className="mt-6 rounded-2xl border border-dashed border-line-strong bg-surface-sunken p-5">
          <div className="flex items-center gap-2">
            <Percent size={15} className="text-violet-600 dark:text-violet-400" />
            <p className="text-[13px] font-semibold text-ink">
              Nestly takes a commission on each sale
            </p>
          </div>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
            The rate varies by category — you keep the rest of what buyers pay,
            paid out to your registered bank account.
          </p>

          <div className="mt-3.5 space-y-1.5">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between text-[12.5px]"
              >
                <span className="text-ink-2">{category.name}</span>
                <span className="font-[family-name:var(--font-mono)] font-medium text-violet-700 dark:text-violet-300">
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
      // replace, not push: Back from the dashboard shouldn't reopen a
      // completed setup form.
      { onSuccess: () => router.replace("/settings/marketplace") }
    );
  };

  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-line bg-surface p-6 sm:p-10">
      <h1 className="font-[family-name:var(--font-fraunces)] text-[26px] italic text-ink">
        Set up your store
      </h1>
      <p className="mt-2.5 text-[13.5px] text-muted">
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
          <label className="mb-2 block text-sm font-medium text-ink-2">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={update("description")}
            rows={3}
            placeholder="What does your store sell?"
            className="w-full rounded-2xl border border-line bg-surface px-5 py-3.5 text-[14px] text-ink outline-none transition-colors focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-500/20"
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
      <label className="mb-2 block text-sm font-medium text-ink-2">
        {label}
      </label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex h-28 w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-line-strong bg-surface-2 transition-colors hover:border-violet-400"
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={label}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-subtle">
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
