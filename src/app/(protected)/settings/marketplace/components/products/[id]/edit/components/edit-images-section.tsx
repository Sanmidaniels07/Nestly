"use client";

import { useEffect } from "react";
import { ImageOff } from "lucide-react";
import { useImageUpload } from "@/src/hooks/use-image-upload";
import ImageUploadZone from "../../../new/components/image-upload-zone";
import ImageCard from "../../../new/components/image-card";
import { ProductEditDraft } from "../types";

interface Props {
  draft: ProductEditDraft;
  setDraft: React.Dispatch<React.SetStateAction<ProductEditDraft>>;
}

const MAX_IMAGES = 10;

export default function EditImagesSection({ draft, setDraft }: Props) {
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
      if (target && !target.url) URL.revokeObjectURL(target.preview);

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
      draft.images.forEach((image) => {
        if (!image.url) URL.revokeObjectURL(image.preview);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <p className="mt-1 text-[12.5px] text-[#94A3B8]">Add at least one image.</p>
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
    </section>
  );
}
