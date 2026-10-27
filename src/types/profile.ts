export interface SocialLinks {
  twitter?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  tiktok?: string;
  youtube?: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  username: string | null;
  avatar: string | null;
  cover: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  socialLinks: SocialLinks | null;
  occupation: string | null;
  company: string | null;
  education: string | null;
  dateOfBirth: string | null;
  skills: string[];
  interests: string[];
  languages: string[];
  role: "USER" | "ADMIN";
  isVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  profileCompletion: number;
  /** False for Google sign-ups that never set a password. */
  hasPassword: boolean;
  hasGoogle: boolean;
  /** The dashboard's "Finish your profile" checklist. */
  setupSteps: ProfileSetupStep[];
}

export type ProfileSetupStepKey = "USERNAME" | "PHOTO" | "BIRTHDAY" | "BIO" | "ADDRESS";

export interface ProfileSetupStep {
  key: ProfileSetupStepKey;
  title: string;
  why: string;
  path: string;
  done: boolean;
}

export interface UpdateProfilePayload {
  name?: string;
  username?: string;
  avatar?: string;
  cover?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: SocialLinks;
  occupation?: string;
  company?: string;
  education?: string;
  dateOfBirth?: string;
  skills?: string[];
  interests?: string[];
  languages?: string[];
}
