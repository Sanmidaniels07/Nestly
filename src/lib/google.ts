// "Continue with Google" via Google Identity Services. The client ID belongs
// to the "Nestly" Google Cloud project and isn't secret;
// NEXT_PUBLIC_GOOGLE_CLIENT_ID can override it.
export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "197293090775-bvip2bnb7jqk8700g1154b0585nl2s6c.apps.googleusercontent.com";

const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

export interface GoogleButtonOptions {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with";
  shape?: "rectangular" | "pill";
  logo_alignment?: "left" | "center";
  width?: number;
}

interface GoogleIdentity {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: { credential?: string }) => void;
        ux_mode?: "popup";
        auto_select?: boolean;
        context?: "signin" | "signup" | "use";
        itp_support?: boolean;
      }) => void;
      renderButton: (parent: HTMLElement, options: GoogleButtonOptions) => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

let loading: Promise<GoogleIdentity> | null = null;

/** Loads Google's sign-in script once per page. */
export const loadGoogleIdentity = (): Promise<GoogleIdentity> => {
  if (window.google?.accounts?.id) return Promise.resolve(window.google);
  if (loading) return loading;

  loading = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => (window.google ? resolve(window.google) : reject(new Error("Google sign-in unavailable")));
    script.onerror = () => {
      loading = null;
      script.remove();
      reject(new Error("Couldn't load Google sign-in"));
    };
    document.head.appendChild(script);
  });

  return loading;
};
