"use client";

import { useRef, useState } from "react";
import { UploadCloud, ImagePlus } from "lucide-react";

interface Props {
  onFilesSelected: (files: FileList | null) => void;
  currentCount: number;
  maxImages?: number;
}

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_MB = 8;

export default function ImageUploadZone({ onFilesSelected, currentCount, maxImages = 10 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const remaining = maxImages - currentCount;
  const atLimit = remaining <= 0;

  const validateAndSend = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError("");

    if (files.length > remaining) {
      setError(`You can add ${remaining} more image${remaining !== 1 ? "s" : ""} (max ${maxImages} total).`);
      return;
    }

    const invalid = Array.from(files).find(
      (file) => !ACCEPTED_TYPES.includes(file.type) || file.size > MAX_SIZE_MB * 1024 * 1024
    );

    if (invalid) {
      setError(`Each image must be PNG, JPG, or WEBP under ${MAX_SIZE_MB}MB.`);
      return;
    }

    onFilesSelected(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (atLimit) return;
    validateAndSend(e.dataTransfer.files);
  };

  return (
    <div>
      <div
        onClick={() => !atLimit && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!atLimit) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`
          flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-8 py-14 text-center transition-colors
          ${
            atLimit
              ? "cursor-not-allowed border-line-strong bg-surface-sunken"
              : dragging
              ? "cursor-pointer border-violet-500 bg-violet-50 dark:bg-violet-500/10"
              : "cursor-pointer border-violet-200 dark:border-violet-500/30 bg-violet-50/40 hover:border-violet-400"
          }
        `}
      >
        {atLimit ? (
          <ImagePlus size={32} className="text-faint" strokeWidth={1.5} />
        ) : (
          <UploadCloud size={32} className={dragging ? "text-violet-700 dark:text-violet-300" : "text-violet-600 dark:text-violet-400"} />
        )}

        <h3 className="mt-3.5 text-[15.5px] font-semibold text-ink">
          {atLimit ? "Maximum images reached" : dragging ? "Drop to upload" : "Upload product images"}
        </h3>

        {!atLimit && (
          <p className="mt-1.5 text-[12.5px] text-muted">
            Drag and drop, or click to browse — PNG, JPG, WEBP
          </p>
        )}

        <p className="mt-1 font-[family-name:var(--font-mono)] text-[11.5px] text-subtle">
          {currentCount}/{maxImages} images
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          disabled={atLimit}
          onChange={(e) => validateAndSend(e.target.files)}
        />
      </div>

      {error && <p className="mt-2 text-[12.5px] text-red-500">{error}</p>}
    </div>
  );
}