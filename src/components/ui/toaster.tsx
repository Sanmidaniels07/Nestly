"use client";

import toast, { Toaster as HotToaster, resolveValue } from "react-hot-toast";
import { CheckCircle2, XCircle, AlertTriangle, Loader2, X } from "lucide-react";

const VARIANTS = {
  success: { Icon: CheckCircle2, color: "#059669", bg: "#ECFDF5" },
  error: { Icon: XCircle, color: "#E11D48", bg: "#FFF1F2" },
  loading: { Icon: Loader2, color: "#7C3AED", bg: "#F5F3FF" },
  blank: { Icon: AlertTriangle, color: "#7C3AED", bg: "#F5F3FF" },
} as const;

export default function AppToaster() {
  return (
    <HotToaster position="top-right" gutter={10} containerStyle={{ top: 20, right: 16 }}>
      {(t) => {
        const variant = (t.type in VARIANTS ? t.type : "blank") as keyof typeof VARIANTS;
        const { Icon, color, bg } = VARIANTS[variant];
        const duration = t.duration && Number.isFinite(t.duration) ? t.duration : 0;

        return (
          <div
            className={`toast-card ${t.visible ? "toast-in" : "toast-out"}`}
            style={{ ["--toast-accent" as string]: color }}
          >
            <div className="toast-icon" style={{ background: bg }}>
              <Icon size={16} color={color} className={t.type === "loading" ? "toast-spin" : ""} />
            </div>

            <p className="toast-message">{resolveValue(t.message, t)}</p>

            <button aria-label="Dismiss" onClick={() => toast.dismiss(t.id)} className="toast-close">
              <X size={13} />
            </button>

            {t.type !== "loading" && duration > 0 && (
              <span className="toast-progress" style={{ animationDuration: `${duration}ms` }} />
            )}
          </div>
        );
      }}
    </HotToaster>
  );
}