"use client";

import { useRef } from "react";
import { Camera, Trash2 } from "lucide-react";

interface EditProfileCoverProps {
  cover: string;
  onChange: (file: File) => void;
  onRemove: () => void;
}

export default function EditProfileCover({ cover, onChange, onRemove }: EditProfileCoverProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="group relative h-52 w-full overflow-hidden rounded-t-2xl bg-[#F0EEF9] sm:h-64">
      {cover ? (
        <img src={cover} alt="Cover" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-100 to-indigo-100">
          <span className="text-[13px] font-medium text-violet-400">No cover photo</span>
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13.5px] font-semibold text-[#13131A] shadow-lg transition-transform hover:scale-105"
        >
          <Camera size={16} />
          Change cover
        </button>

        {cover && (
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2.5 text-[13.5px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-red-500"
          >
            <Trash2 size={16} />
            Remove
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(file);
        }}
      />
    </div>
  );
}