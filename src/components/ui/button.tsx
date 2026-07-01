import { cn } from "@/src/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  leftIcon?: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "tribely";
  size?: "sm" | "default" | "lg";
}

export default function Button({
  children,
  className,
  loading,
  leftIcon,
  variant = "primary",
  size = "default",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-[#2B7FFF] text-white hover:bg-[#1E6AD4]",

    secondary: "bg-[var(--secondary)] text-white",

    outline: `
  border border-[#E5E7EB]
  bg-transparent
  !text-[#1A1A2E]
  hover:bg-[#F8FAFC]
  hover:!text-[#1A1A2E]
  hover:border-[#D1D5DB]

  dark:border-gray-700
  dark:!text-gray-900
  dark:bg-white
  dark:hover:bg-gray-100
  dark:hover:!text-gray-900
  dark:hover:border-gray-300
`,

    tribely:
      "bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white hover:brightness-110 active:brightness-95 shadow-lg shadow-indigo-500/30",
  };

  const sizes = {
    sm: "h-9 px-4 text-sm rounded-xl",
    default: "h-12 px-6 rounded-2xl",
    lg: "h-14 px-10 text-base rounded-3xl",
  };

  return (
    <button
      disabled={loading}
      className={cn(
        `
        flex
        items-center
        justify-center
        gap-2
        font-semibold
        transition-all
        hover:scale-[1.02]
        disabled:opacity-50
        disabled:cursor-not-allowed
        `,
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        "Loading..."
      ) : (
        <>
          {leftIcon}
          {children}
        </>
      )}
    </button>
  );
}
