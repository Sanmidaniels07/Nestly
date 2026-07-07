"use client";


import {
  bio,
  personalInfo,
  skills,
  interests,
  communities,
  languages,
} from "@/src/mocks/profile-about";
import ProfileBioCard from "../components/profile-bio-card";
import ProfilePersonalInfo from "../components/profile-personal-info";
import ProfileChipSection from "../components/profile-chip";

export default function ProfileAbout() {
  return (
    <div className="space-y-5">
      <ProfileBioCard bio={bio} />
      <ProfilePersonalInfo info={personalInfo} />
      <ProfileChipSection title="Skills" items={skills} tone="violet" />
      <ProfileChipSection title="Interests" items={interests} tone="indigo" />
      <ProfileChipSection title="Communities" items={communities} tone="emerald" />
      <ProfileChipSection title="Languages" items={languages} tone="amber" />
    </div>
  );
}