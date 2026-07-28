"use client";

import Link from "next/link";

import { useProfile } from "@/src/hooks/use-profile";
import { useMyCommunities } from "@/src/hooks/use-my-communities";
import ProfileBioCard from "../components/profile-bio-card";
import ProfilePersonalInfo from "../components/profile-personal-info";
import ProfileChipSection from "../components/profile-chip";

function formatJoinedDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default function ProfileAbout() {
  const { data: profile, isLoading } = useProfile();
  const { data: communitiesData } = useMyCommunities({ limit: 12 });
  const communities = communitiesData?.communities ?? [];

  if (isLoading || !profile) {
    return (
      <div className="rounded-2xl border border-[#ECE9F6] bg-white p-10 text-center text-[14px] text-[#94A3B8]">
        Loading about...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {profile.bio && <ProfileBioCard bio={profile.bio} />}

      <ProfilePersonalInfo
        location={profile.location}
        occupation={profile.occupation}
        company={profile.company}
        education={profile.education}
        website={profile.website}
        joined={formatJoinedDate(profile.createdAt)}
      />

      {profile.skills.length > 0 && (
        <ProfileChipSection title="Skills" items={profile.skills} tone="violet" />
      )}

      {profile.interests.length > 0 && (
        <ProfileChipSection title="Interests" items={profile.interests} tone="indigo" />
      )}

      {communities.length > 0 && (
        <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
          <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
            Communities
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {communities.map((community) => (
              <Link
                key={community.id}
                href={`/communities/${community.slug}`}
                className="rounded-full bg-emerald-50 px-4 py-2 text-[13px] font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
              >
                {community.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {profile.languages.length > 0 && (
        <ProfileChipSection title="Languages" items={profile.languages} tone="amber" />
      )}
    </div>
  );
}
