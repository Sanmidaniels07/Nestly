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
