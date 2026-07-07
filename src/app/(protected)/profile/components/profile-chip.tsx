"use client";

interface Props {
  title: string;
  items: string[];
  tone?: "violet" | "indigo" | "emerald" | "amber";
}

const tones: Record<string, string> = {
  violet: "bg-violet-50 text-violet-700",
  indigo: "bg-indigo-50 text-indigo-700",
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
};

export default function ProfileChipSection({ title, items, tone = "violet" }: Props) {
  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
        {title}
      </h2>

      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className={`rounded-full px-4 py-2 text-[13px] font-medium ${tones[tone]}`}
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}