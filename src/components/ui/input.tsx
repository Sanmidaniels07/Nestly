import { cn } from "@/src/lib/utils";
import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, rightElement, fullWidth = true, ...props }, ref) => {
    return (
      <div className={cn("group", fullWidth && "w-full")}>
        {label && (
          <label className="mb-2 block text-sm font-medium text-ink-2">
            {label}
          </label>
        )}

        <div
          className={cn(
            `
            relative
            flex
            h-14
            items-center
            rounded-3xl
            border
            border-line
            bg-surface
            px-5
            transition-all
            duration-200
            focus-within:border-violet-500
            focus-within:ring-4
            focus-within:ring-violet-100
            dark:focus-within:ring-violet-500/20
            hover:border-line-strong
            `,
            error && "border-red-500 focus-within:border-red-500 focus-within:ring-red-100 dark:focus-within:ring-red-500/20"
          )}
        >
          {icon && (
            <div className="mr-3 text-subtle group-focus-within:text-violet-500 transition-colors">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={cn(
              `
              h-full
              w-full
              bg-transparent
              text-base
              text-ink
              placeholder:text-subtle
              focus:outline-none
              `,
              className
            )}
            {...props}
          />

          {rightElement && (
            <div className="ml-3 flex shrink-0 items-center text-subtle">
              {rightElement}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;