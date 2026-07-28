"use client";

import { useEffect } from "react";
import { ImageOff } from "lucide-react";
import Button from "@/src/components/ui/button";
import { ProductDraft } from "@/src/types/products-draft";
import { useImageUpload } from "@/src/hooks/use-image-upload";
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
  const { mutate: uploadImage } = useImageUpload();

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file, index) => {
      const id = crypto.randomUUID();

      setDraft((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          {
            id,
            file,
            preview: URL.createObjectURL(file),
            isCover: prev.images.length === 0 && index === 0,
            uploading: true,
          },
        ],
      }));

      uploadImage(file, {
        onSuccess: (url) => {
          setDraft((prev) => ({
            ...prev,
            images: prev.images.map((image) =>
              image.id === id ? { ...image, url, uploading: false } : image
            ),
          }));
        },
        onError: () => {
          setDraft((prev) => ({
            ...prev,
            images: prev.images.filter((image) => image.id !== id),
          }));
        },
      });
    });
  };

  const removeImage = (id: string) => {
    setDraft((prev) => {
      const target = prev.images.find((image) => image.id === id);
      if (target) URL.revokeObjectURL(target.preview);

      const remaining = prev.images.filter((image) => image.id !== id);

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

  useEffect(() => {
    return () => {
      draft.images.forEach((image) => URL.revokeObjectURL(image.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isUploading = draft.images.some((image) => image.uploading);
  const canContinue = draft.images.length > 0 && !isUploading;

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
          onClick={onNext}
          disabled={!canContinue}
          className="h-11 rounded-xl px-7"
        >
          {isUploading ? "Uploading..." : "Continue"}
        </Button>
      </div>
    </section>
  );
}
