export interface Profile {
  id: string;
  name: string;
  email: string;
  username: string | null;
  avatar: string | null;
  cover: string | null;
  bio: string | null;
  role: "USER" | "ADMIN";
  isVerified: boolean;
  createdAt: string;
  profileCompletion: number;
}

export interface UpdateProfilePayload {
  name?: string;
  username?: string;
  avatar?: string;
  cover?: string;
  bio?: string;
}
