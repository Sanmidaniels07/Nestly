"use client";

import { useEffect } from "react";
import { ImageOff } from "lucide-react";
import Button from "@/src/components/ui/button";
import { ProductDraft } from "@/src/types/products-draft";
import ImageUploadZone from "./image-upload-zone";
import ImageCard from "./image-card";

interface Props {
  draft: ProductDraft;
  setDraft: React.Dispatch<React.SetStateAction<ProductDraft>>;
  onBack: () => void;
  onNext: () => void;
}

const MAX_IMAGES = 10;

export default function ProductImages({ draft, setDraft, onBack, onNext }: Props) {
  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const uploaded = Array.from(files).map((file, index) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      isCover: draft.images.length === 0 && index === 0,
    }));

    setDraft((prev) => ({
      ...prev,
      images: [...prev.images, ...uploaded],
    }));
  };

  const removeImage = (id: string) => {
    setDraft((prev) => {
      const target = prev.images.find((image) => image.id === id);
      if (target) URL.revokeObjectURL(target.preview);

      const remaining = prev.images.filter((image) => image.id !== id);

      // If the removed image was the cover, promote the next one automatically
      const hadCover = target?.isCover;
      const nextImages =
        hadCover && remaining.length > 0
          ? remaining.map((img, i) => ({ ...img, isCover: i === 0 }))
          : remaining;

      return { ...prev, images: nextImages };
    });
  };

  const setCover = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      images: prev.images.map((image) => ({
        ...image,
        isCover: image.id === id,
      })),
    }));
  };

  // Revoke all object URLs when this step unmounts entirely (e.g. leaving the form)
  useEffect(() => {
    return () => {
      draft.images.forEach((image) => URL.revokeObjectURL(image.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = () => {
    if (draft.images.length === 0) return;
    onNext();
  };

  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6 sm:p-7">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
        Product images
      </h2>
      <p className="mt-1 text-[13px] text-[#64748B]">
        Clear, well-lit photos help buyers trust your listing.
      </p>

      <div className="mt-6">
        <ImageUploadZone
          onFilesSelected={handleFiles}
          currentCount={draft.images.length}
          maxImages={MAX_IMAGES}
        />
      </div>

      {draft.images.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E2E0EE] py-10 text-center">
          <ImageOff size={26} className="text-[#C4C0DC]" strokeWidth={1.5} />
          <p className="mt-3 text-[13.5px] font-medium text-[#13131A]">No images yet</p>
          <p className="mt-1 text-[12.5px] text-[#94A3B8]">
            Add at least one image to continue.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {draft.images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onCover={() => setCover(image.id)}
              onDelete={() => removeImage(image.id)}
            />
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-between border-t border-[#F2F1F8] pt-6">
        <Button variant="outline" onClick={onBack} className="h-11 rounded-xl px-7">
          Back
        </Button>
        <Button
          variant="tribely"
          onClick={handleContinue}
          disabled={draft.images.length === 0}
          className="h-11 rounded-xl px-7"
        >
          Continue
        </Button>
      </div>
    </section>
  );
}