export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  isVerified: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  /** Optional, YYYY-MM-DD. */
  dateOfBirth?: string;
  /** Seller share link (?ref=) they arrived through, if any. */
  referralCode?: string;
}

export interface GoogleAuthPayload {
  /** Google's ID token from the sign-in button. */
  credential: string;
  referralCode?: string;
}

export interface AuthSuccessData {
  accessToken: string;
  refreshToken: string;
  user: User;
  /** Continue with Google only: an account was just created. */
  isNewUser?: boolean;
}

export interface TwoFactorChallengeData {
  requires2FA: true;
  twoFactorToken: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthSuccessData | TwoFactorChallengeData;
}

export interface TwoFactorLoginPayload {
  twoFactorToken: string;
  token: string;
}

export interface TwoFactorSetupData {
  qrCodeDataUrl: string;
  secret: string;
}

export interface AccountSession {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
}