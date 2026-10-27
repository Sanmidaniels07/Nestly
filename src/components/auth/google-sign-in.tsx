"use client";

import { useGoogleAuth } from "@/src/hooks/use-google-auth";
import GoogleButton from "./google-button";

interface Props {
  text?: "signin_with" | "signup_with" | "continue_with";
  /** The account has 2FA on - show the code form with this token. */
  onTwoFactor: (twoFactorToken: string) => void;
}

// Continue with Google + an "or use email" divider, for the login and
// signup pages.
export default function GoogleSignIn({ text = "continue_with", onTwoFactor }: Props) {
  const { mutate, isPending } = useGoogleAuth();

  return (
    <div className="space-y-6">
      <GoogleButton
        text={text}
        busy={isPending}
        onCredential={(credential) =>
          mutate(credential, {
            onSuccess: (response) => {
              if ("requires2FA" in response.data) onTwoFactor(response.data.twoFactorToken);
            },
          })
        }
      />

      <div className="flex items-center gap-3 text-[12px] font-medium uppercase tracking-wide text-subtle">
        <span className="h-px flex-1 bg-line" />
        or use your email
        <span className="h-px flex-1 bg-line" />
      </div>
    </div>
  );
}
