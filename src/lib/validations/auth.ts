import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const signupSchema = z
  .object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
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
  name: z.string().min(2),

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

  github: z.string().url("Enter a valid GitHub URL").or(z.literal("")),

  linkedin: z.string().url("Enter a valid LinkedIn URL").or(z.literal("")),

  twitter: z.string().url("Enter a valid X URL").or(z.literal("")),

  instagram: z.string().url("Enter a valid Instagram URL").or(z.literal("")),
});

// Inferred types
export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type ResendVerificationValues = z.infer<typeof resendVerificationSchema>;
export type EditProfileBasicValues = z.infer<typeof editProfileSchema>;
