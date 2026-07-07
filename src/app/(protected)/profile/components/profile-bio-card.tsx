"use client";

interface Props {
  bio: string;
}

export default function ProfileBioCard({ bio }: Props) {
  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
        Bio
      </h2>
      <p className="mt-3 text-[14.5px] leading-relaxed text-[#475569]">
        {bio}
      </p>
    </section>
  );
}