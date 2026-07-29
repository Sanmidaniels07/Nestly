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
}

export interface AuthSuccessData {
  accessToken: string;
  refreshToken: string;
  user: User;
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