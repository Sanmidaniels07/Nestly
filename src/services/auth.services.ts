import { api } from "../lib/axios";
import { LoginPayload, ResetPasswordPayload, SignupPayload } from "../types/auth";


export const login =
  async (
    data: LoginPayload
  ) => {
    const response =
      await api.post(
        "/auth/login",
        data
      );

    return response.data;
  };

export const signup =
  async (
    data: SignupPayload
  ) => {
    const response =
      await api.post(
        "/auth/signup",
        data
      );

    return response.data;
  };

export const forgotPassword =
  async (
    email: string
  ) => {
    const response =
      await api.post(
        "/auth/forgot-password",
        {
          email,
        }
      );

    return response.data;
  };

export const resetPassword =
  async (
    data: ResetPasswordPayload
  ) => {
    const response =
      await api.post(
        "/auth/reset-password",
        data
      );

    return response.data;
  };

  export const verifyEmail =
  async (
    token: string
  ) => {
    const response =
      await api.get(
        `/verify-email/${token}`
      );

    return response.data;
  };

  export const resendVerification =
  async (
    email: string
  ) => {
    const response =
      await api.post(
        "/verify-email/resend",
        {
          email,
        }
      );

    return response.data;
  };