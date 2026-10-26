"use client";

import { useState } from "react";

import { useUpdateStore } from "@/src/hooks/use-update-store";
import { Store } from "@/src/types/store";
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/src/components/ui/social-icons";

const FIELDS = [
  { key: "instagram", label: "Instagram", placeholder: "@yourshop", Icon: InstagramIcon, tone: "text-pink-600" },
  { key: "whatsapp", label: "WhatsApp number", placeholder: "0815 967 1809", Icon: WhatsAppIcon, tone: "text-emerald-600" },
  { key: "facebook", label: "Facebook page", placeholder: "facebook.com/yourshop", Icon: FacebookIcon, tone: "text-blue-600" },
  { key: "tiktok", label: "TikTok", placeholder: "@yourshop", Icon: TikTokIcon, tone: "text-ink" },
] as const;

type Key = (typeof FIELDS)[number]["key"];

// Where buyers can also find the seller - shown as buttons on their public
// store page. Accepts @usernames, profile links or numbers as typed.
export default function SocialLinksForm({ store }: { store: Store }) {
  const { mutate: updateStore, isPending } = useUpdateStore();
  const initial = (key: Key) => (key === "whatsapp" && store.whatsapp ? `+${store.whatsapp}` : store[key] ?? "");
  const [values, setValues] = useState<Record<Key, string>>({
    instagram: initial("instagram"),
    whatsapp: initial("whatsapp"),
    facebook: initial("facebook"),
    tiktok: initial("tiktok"),
  });

  const changed = FIELDS.some(({ key }) => values[key].trim() !== initial(key));

  const save = () =>
    updateStore({
      id: store.id,
      data: Object.fromEntries(FIELDS.map(({ key }) => [key, values[key].trim()])) as Record<Key, string>,
    });

  return (
    <section id="social-links" className="scroll-mt-24 rounded-2xl border border-line bg-surface p-6 sm:p-7">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-ink">Social links</h2>
      <p className="mt-1 text-[13px] leading-relaxed text-muted">
        Shown as buttons on your store page, so buyers can see you&apos;re active and message you on WhatsApp. Paste a username or a link.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {FIELDS.map(({ key, label, placeholder, Icon, tone }) => (
          <label key={key} className="block">
            <span className="mb-1.5 block text-[13px] font-medium text-ink-2">{label}</span>
            <span className="flex h-12 items-center gap-2.5 rounded-xl border border-line bg-surface px-3.5 transition-colors focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-500/10">
              <Icon size={18} className={`shrink-0 ${tone}`} />
              <input
                value={values[key]}
                onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))}
                placeholder={placeholder}
                inputMode={key === "whatsapp" ? "tel" : "text"}
                autoCapitalize="none"
                autoCorrect="off"
                className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-subtle"
              />
            </span>
          </label>
        ))}
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={!changed || isPending}
          className="h-11 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 text-[13.5px] font-semibold text-white transition-opacity disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save social links"}
        </button>
      </div>
    </section>
  );
}
