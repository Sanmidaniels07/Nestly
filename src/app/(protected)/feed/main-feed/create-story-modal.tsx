"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ImagePlus, Loader2, X } from "lucide-react";

import { useUploadFiles } from "@/src/hooks/use-upload-files";
import { useCreateStory } from "@/src/hooks/use-create-story";
import Button from "@/src/components/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateStoryModal({ open, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadFiles, isPending: isUploading } = useUploadFiles();
  const { mutate: createStory, isPending: isPosting } = useCreateStory();

  useEffect(() => setMounted(true), []);

  const handleClose = () => {
    setFile(null);
    setPreviewUrl(null);
    setCaption("");
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handlePick = (picked: File | undefined) => {
    if (!picked) return;
    setFile(picked);
    setPreviewUrl(URL.createObjectURL(picked));
  };

  const handlePost = () => {
    if (!file) return;

    uploadFiles([file], {
      onSuccess: (response) => {
        const uploaded = response.data[0];
        createStory(
          {
            mediaUrl: uploaded.url,
            mediaType: uploaded.type,
            caption: caption.trim() || undefined,
          },
          { onSuccess: handleClose }
        );
      },
    });
  };

  if (!mounted || !open) return null;

  const isBusy = isUploading || isPosting;

  return createPortal(
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
      />

      <div className="fixed left-1/2 top-1/2 z-[100] w-[92%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between border-b border-[#ECE9F6] px-5 py-4">
          <h2 className="font-[family-name:var(--font-fraunces)] text-[18px] italic text-[#13131A]">
            Add to your story
          </h2>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="rounded-full p-2 text-[#64748B] transition-colors hover:bg-violet-50 hover:text-violet-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            hidden
            onChange={(e) => handlePick(e.target.files?.[0])}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-64 w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#E2E0EE] bg-[#FAFAFD] transition-colors hover:border-violet-300"
          >
            {previewUrl ? (
              file?.type.startsWith("video") ? (
                <video src={previewUrl} className="h-full w-full object-contain" controls />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="Story preview" className="h-full w-full object-contain" />
              )
            ) : (
              <div className="flex flex-col items-center gap-2 text-[#94A3B8]">
                <ImagePlus size={28} strokeWidth={1.5} />
                <span className="text-[13px]">Choose a photo or video</span>
              </div>
            )}
          </button>

          {previewUrl && (
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption (optional)"
              maxLength={280}
              className="mt-4 w-full rounded-xl border border-[#E4E6EB] bg-[#FAFBFC] px-4 py-3 text-[14px] text-[#13131A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-violet-400 focus:bg-white"
            />
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[#ECE9F6] px-5 py-4">
          <Button variant="outline" onClick={handleClose} className="h-10 rounded-xl px-5">
            Cancel
          </Button>
          <Button
            variant="tribely"
            disabled={!file || isBusy}
            onClick={handlePost}
            className="h-10 rounded-xl px-6"
          >
            {isBusy ? <Loader2 size={16} className="animate-spin" /> : "Share to story"}
          </Button>
        </div>
      </div>
    </>,
    document.body
  );
}
