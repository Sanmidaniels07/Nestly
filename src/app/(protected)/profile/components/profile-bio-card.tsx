"use client";

interface Props {
  bio: string;
}

export default function ProfileBioCard({ bio }: Props) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-ink">
        Bio
      </h2>
      <p className="mt-3 text-[14.5px] leading-relaxed text-ink-3">
        {bio}
      </p>
    </section>
  );
}