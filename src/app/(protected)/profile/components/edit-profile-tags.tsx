"use client";

import { X } from "lucide-react";
import { KeyboardEvent, useState } from "react";
import FormSelect from "@/src/components/ui/form-select";

interface EditProfileTagsProps {
  title: string;
  description: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  maxTags?: number;
  /** Pick from a list (grouped) instead of typing. */
  optionGroups?: { label: string; options: string[] }[];
}

export default function EditProfileTags({
  title,
  description,
  values,
  onChange,
  placeholder,
  maxTags,
  optionGroups,
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

  const renderChips = (className = "") =>
    values.length > 0 && (
      <div className={`flex flex-wrap gap-1.5 ${className}`}>
        {values.map((tag) => (
          <span
            key={tag}
            className="group flex items-center gap-1.5 rounded-full bg-violet-50 dark:bg-violet-500/10 py-1.5 pl-3.5 pr-2 text-[13px] font-medium text-violet-700 dark:text-violet-300"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
              className="rounded-full p-0.5 text-violet-400 transition-colors group-hover:text-violet-700 dark:group-hover:text-violet-300 hover:!bg-violet-100"
            >
              <X size={13} />
            </button>
          </span>
        ))}
      </div>
    );

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <div>
          <h3 className="font-[family-name:var(--font-fraunces)] text-[19px] italic text-ink">
            {title}
          </h3>
          <p className="mt-1 text-[13.5px] text-muted">{description}</p>
        </div>

        {maxTags && (
          <span className="font-[family-name:var(--font-mono)] text-[12px] text-subtle">
            {values.length}/{maxTags}
          </span>
        )}
      </div>

      {optionGroups ? (
        // Pick from the app's own dropdown; choices show as chips below it.
        <div className="space-y-3">
          <FormSelect
            ariaLabel={title}
            value=""
            onChange={addTag}
            disabled={limitReached}
            placeholder={limitReached ? "Limit reached" : placeholder}
            options={optionGroups.flatMap((group) =>
              group.options
                .filter((option) => !values.some((v) => v.toLowerCase() === option.toLowerCase()))
                .map((option) => ({ label: option, value: option, group: group.label }))
            )}
          />
          {renderChips()}
        </div>
      ) : (
        <div
          className={`
            rounded-2xl border bg-surface-sunken p-3.5 transition-colors
            focus-within:border-violet-400 focus-within:bg-surface
            ${shake ? "border-red-300 dark:border-red-500/40" : "border-line-strong"}
          `}
        >
          {renderChips("mb-3")}
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            onBlur={() => addTag(value)}
            disabled={limitReached}
            placeholder={limitReached ? "Limit reached" : placeholder}
            className="w-full bg-transparent px-1 py-1 text-[14px] text-ink outline-none placeholder:text-subtle disabled:cursor-not-allowed"
          />
        </div>
      )}
    </section>
  );
}