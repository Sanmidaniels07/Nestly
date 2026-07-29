"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import EditProfileAvatar from "./edit-profile-avatar";
import EditProfileCover from "./edit-profile-cover";
import EditProfileBasic from "./edit-profile-basic-info";
import EditProfilePersonal from "./edit-profile-pseronal-info";
import EditProfileTags from "./edit-profile-tags";
import Button from "@/src/components/ui/button";
import {
  EditProfileBasicValues,
  editProfileSchema,
} from "@/src/lib/validations/auth";
import EditProfileSocial from "./edit-profile-social";
import { useProfile } from "@/src/hooks/use-profile";
import { useUpdateProfile } from "@/src/hooks/use-update-profile";
import { useUploadFiles } from "@/src/hooks/use-upload-files";

interface Props {
  onClose: () => void;
  variant?: "modal" | "page";
}

const emptyDefaults: EditProfileBasicValues = {
  name: "",
  username: "",
  bio: "",
  location: "",
  occupation: "",
  company: "",
  education: "",
  dateOfBirth: "",
  website: "",
  skills: [],
  interests: [],
  languages: [],
  linkedin: "",
  twitter: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  youtube: "",
};

export default function EditProfileForm({ onClose, variant = "modal" }: Props) {
  const { data: profile } = useProfile();
  const { mutateAsync: updateProfile, isPending: isSaving } = useUpdateProfile();
  const { mutateAsync: uploadFiles, isPending: isUploading } = useUploadFiles();

  const methods = useForm<EditProfileBasicValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: emptyDefaults,
  });

  const { watch, setValue, handleSubmit, reset } = methods;

  const skills = watch("skills") ?? [];
  const interests = watch("interests") ?? [];
  const languages = watch("languages") ?? [];

  const [cover, setCover] = useState("");
  const [avatar, setAvatar] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (!profile) return;

    reset({
      ...emptyDefaults,
      name: profile.name,
      username: profile.username ?? "",
      bio: profile.bio ?? "",
      location: profile.location ?? "",
      occupation: profile.occupation ?? "",
      company: profile.company ?? "",
      education: profile.education ?? "",
      dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : "",
      website: profile.website ?? "",
      skills: profile.skills ?? [],
      interests: profile.interests ?? [],
      languages: profile.languages ?? [],
      linkedin: profile.socialLinks?.linkedin ?? "",
      twitter: profile.socialLinks?.twitter ?? "",
      instagram: profile.socialLinks?.instagram ?? "",
      facebook: profile.socialLinks?.facebook ?? "",
      tiktok: profile.socialLinks?.tiktok ?? "",
      youtube: profile.socialLinks?.youtube ?? "",
    });
    setCover(profile.cover ?? "");
    setAvatar(profile.avatar ?? "");
  }, [profile, reset]);

  const onSubmit = async (values: EditProfileBasicValues) => {
    let avatarUrl = avatar;
    let coverUrl = cover;

    if (avatarFile) {
      const uploaded = await uploadFiles([avatarFile]);
      avatarUrl = uploaded.data[0].url;
    }
    if (coverFile) {
      const uploaded = await uploadFiles([coverFile]);
      coverUrl = uploaded.data[0].url;
    }

    await updateProfile({
      name: values.name,
      username: values.username,
      bio: values.bio,
      avatar: avatarUrl,
      cover: coverUrl,
      location: values.location,
      website: values.website,
      occupation: values.occupation,
      company: values.company,
      education: values.education,
      dateOfBirth: values.dateOfBirth || undefined,
      skills: values.skills,
      interests: values.interests,
      languages: values.languages,
      socialLinks: {
        linkedin: values.linkedin,
        twitter: values.twitter,
        instagram: values.instagram,
        facebook: values.facebook,
        tiktok: values.tiktok,
        youtube: values.youtube,
      },
    });
    onClose();
  };

  const saving = isSaving || isUploading;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={variant === "modal" ? "flex max-h-[85vh] flex-col" : "flex flex-col"}
      >
        <div className={variant === "modal" ? "flex-1 overflow-y-auto" : ""}>
          <EditProfileCover
            cover={cover}
            onRemove={() => {
              setCover("");
              setCoverFile(null);
            }}
            onChange={(file) => {
              setCoverFile(file);
              setCover(URL.createObjectURL(file));
            }}
          />

          <EditProfileAvatar
            avatar={avatar}
            onChange={(file) => {
              setAvatarFile(file);
              setAvatar(URL.createObjectURL(file));
            }}
          />

          <div className="space-y-8 px-6 pb-8 pt-6 sm:px-8">
            <EditProfileBasic />
            <EditProfilePersonal />

            <EditProfileTags
              title="Skills"
              description="What are you good at?"
              values={skills}
              onChange={(v) => setValue("skills", v, { shouldDirty: true })}
              placeholder="Type a skill and press Enter"
              maxTags={10}
            />

            <EditProfileTags
              title="Interests"
              description="Topics you enjoy"
              values={interests}
              onChange={(v) => setValue("interests", v, { shouldDirty: true })}
              placeholder="Add an interest"
              maxTags={10}
            />

            <EditProfileTags
              title="Languages"
              description="Languages you speak"
              values={languages}
              onChange={(v) => setValue("languages", v, { shouldDirty: true })}
              placeholder="Add a language"
              maxTags={6}
            />
            <EditProfileSocial />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[#ECE9F6] bg-white/95 px-6 py-4 backdrop-blur-sm sm:px-8">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-11 rounded-xl px-6"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="tribely"
            loading={saving}
            className="h-11 rounded-xl px-7"
          >
            Save changes
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
