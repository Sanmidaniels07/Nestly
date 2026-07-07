"use client";

import { useState } from "react";
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

interface Props {
  onClose: () => void;
}

export default function EditProfileForm({ onClose }: Props) {
  const methods = useForm<EditProfileBasicValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: "Daniel Sanmi",
      username: "daniel",
      bio: "Senior Software Engineer passionate about building products that connect people.",
      location: "Lagos, Nigeria",
      occupation: "Senior Software Engineer",
      company: "Nestly Technologies",
      education: "University of Lagos",
      website: "https://danielsanmi.dev",
      skills: ["React", "Next.js", "TypeScript", "Node.js"],
      interests: ["Technology", "Travel", "AI"],
      languages: ["English", "Yoruba"],
      github: "https://github.com/danielsanmi",

      linkedin: "https://linkedin.com/in/danielsanmi",

      twitter: "https://x.com/danielsanmi",

      instagram: "https://instagram.com/danielsanmi",
    },
  });

  const { watch, setValue, handleSubmit } = methods;

  const skills = watch("skills") ?? [];
  const interests = watch("interests") ?? [];
  const languages = watch("languages") ?? [];

  const [cover, setCover] = useState("/images/profile-cover.jpg");
  const [avatar, setAvatar] = useState("/images/avatar.jpg");
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    setSaving(true);
    try {
      // TODO: wire to real update-profile mutation
      await new Promise((resolve) => setTimeout(resolve, 900));
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex max-h-[85vh] flex-col"
      >
        <div className="flex-1 overflow-y-auto">
          <EditProfileCover
            cover={cover}
            onRemove={() => setCover("")}
            onChange={(file) => setCover(URL.createObjectURL(file))}
          />

          <EditProfileAvatar
            avatar={avatar}
            onChange={(file) => setAvatar(URL.createObjectURL(file))}
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
