import { z } from "zod";

// Mirrors the API's rule: names are public, so no emails or links in them.
const EMAIL_LIKE = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const LINK_LIKE = /(https?:\/\/|www\.)/i;

const displayName = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(60, "Name must be 60 characters or fewer")
  .refine((name) => !EMAIL_LIKE.test(name), "Please enter your name, not your email address")
  .refine((name) => !LINK_LIKE.test(name), "Please enter your name, not a link");

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const signupSchema = z
  .object({
    name: displayName,
    email: z.email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
    // Optional; the picker only offers ages 13-100 and the API re-checks.
    dateOfBirth: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.email(),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resendVerificationSchema = z.object({
  email: z.email(),
});

export const editProfileSchema = z.object({
  name: displayName,

  username: z.string().min(3).max(20),

  bio: z.string().max(250),

  location: z.string(),

  occupation: z.string(),

  company: z.string(),

  education: z.string(),

  dateOfBirth: z.string().optional(),

  website: z.string().url("Enter a valid URL").or(z.literal("")),

  skills: z.array(z.string()).max(10).optional(),

  interests: z.array(z.string()).max(10).optional(),

  languages: z.array(z.string()).max(6).optional(),

  linkedin: z.string().url("Enter a valid LinkedIn URL").or(z.literal("")),

  twitter: z.string().url("Enter a valid X URL").or(z.literal("")),

  instagram: z.string().url("Enter a valid Instagram URL").or(z.literal("")),

  facebook: z.string().url("Enter a valid Facebook URL").or(z.literal("")),

  tiktok: z.string().url("Enter a valid TikTok URL").or(z.literal("")),

  youtube: z.string().url("Enter a valid YouTube URL").or(z.literal("")),
});

// Inferred types
export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type ResendVerificationValues = z.infer<typeof resendVerificationSchema>;
export type EditProfileBasicValues = z.infer<typeof editProfileSchema>;
