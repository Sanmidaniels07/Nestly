"use client";

import { X } from "lucide-react";
import { KeyboardEvent, useState } from "react";

interface EditProfileTagsProps {
  title: string;
  description: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  maxTags?: number;
}

export default function EditProfileTags({
  title,
  description,
  values,
  onChange,
  placeholder,
  maxTags,
}: EditProfileTagsProps) {
  const [value, setValue] = useState("");
  const [shake, setShake] = useState(false);

  const limitReached = maxTags !== undefined && values.length >= maxTags;

  const flashShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 300);
  };

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag) return;

    if (limitReached) {
      flashShake();
      return;
    }

    if (values.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      flashShake();
      setValue("");
      return;
    }

    onChange([...values, tag]);
    setValue("");
  };

  const removeTag = (tag: string) => {
    onChange(values.filter((t) => t !== tag));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(value);
    }

    // Backspace on empty input removes the last tag — common, expected pattern
    if (e.key === "Backspace" && value === "" && values.length > 0) {
      removeTag(values[values.length - 1]);
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text");
    if (pasted.includes(",")) {
      e.preventDefault();
      pasted.split(",").forEach((part) => addTag(part));
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <div>
          <h3 className="font-[family-name:var(--font-fraunces)] text-[19px] italic text-[#13131A]">
            {title}
          </h3>
          <p className="mt-1 text-[13.5px] text-[#64748B]">{description}</p>
        </div>

        {maxTags && (
          <span className="font-[family-name:var(--font-mono)] text-[12px] text-[#94A3B8]">
            {values.length}/{maxTags}
          </span>
        )}
      </div>

      <div
        className={`
          rounded-2xl border bg-[#FAFBFC] p-3.5 transition-colors
          focus-within:border-violet-400 focus-within:bg-white
          ${shake ? "border-red-300" : "border-[#E4E6EB]"}
        `}
      >
        {values.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {values.map((tag) => (
              <span
                key={tag}
                className="group flex items-center gap-1.5 rounded-full bg-violet-50 py-1.5 pl-3.5 pr-2 text-[13px] font-medium text-violet-700"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  aria-label={`Remove ${tag}`}
                  className="rounded-full p-0.5 text-violet-400 transition-colors group-hover:text-violet-700 hover:!bg-violet-100"
                >
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        )}

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onBlur={() => addTag(value)}
          disabled={limitReached}
          placeholder={limitReached ? "Limit reached" : placeholder}
          className="w-full bg-transparent px-1 py-1 text-[14px] text-[#13131A] outline-none placeholder:text-[#94A3B8] disabled:cursor-not-allowed"
        />
      </div>
    </section>
  );
}