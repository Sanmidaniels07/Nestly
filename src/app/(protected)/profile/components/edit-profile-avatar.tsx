"use client";

import { useRef } from "react";
import { Camera } from "lucide-react";

interface Props {
  avatar: string;
  onChange: (file: File) => void;
}

export default function EditProfileAvatar({ avatar, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="-mt-14 flex justify-center sm:-mt-16 sm:justify-start sm:pl-8">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative"
        aria-label="Change avatar"
      >
        <div className="rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 p-[3.5px] shadow-xl">
          <div className="rounded-full bg-white p-[3.5px]">
            <img
              src={avatar}
              alt="Avatar"
              className="h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32"
            />
          </div>
        </div>

        <div className="absolute inset-[3.5px] flex items-center justify-center rounded-full bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/45 group-hover:opacity-100">
          <Camera size={22} className="text-white" />
        </div>

        <div className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg ring-4 ring-white transition-transform group-hover:scale-110">
          <Camera size={15} />
        </div>
      </button>

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