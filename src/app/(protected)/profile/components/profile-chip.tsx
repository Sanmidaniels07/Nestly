"use client";

interface Props {
  title: string;
  items: string[];
  tone?: "violet" | "indigo" | "emerald" | "amber";
}

const tones: Record<string, string> = {
  violet: "bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300",
  indigo: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  emerald: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  amber: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

export default function ProfileChipSection({ title, items, tone = "violet" }: Props) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-ink">
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