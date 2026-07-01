import { cn } from "@/src/lib/utils";
import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, fullWidth = true, ...props }, ref) => {
    return (
      <div className={cn("group", fullWidth && "w-full")}>
        {label && (
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
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
            border-gray-200
            bg-white
            px-5
            transition-all
            duration-200
            focus-within:border-violet-500
            focus-within:ring-4
            focus-within:ring-violet-100
            hover:border-gray-300
            dark:bg-gray-900
            dark:border-gray-700
            dark:focus-within:ring-violet-900/30
            `,
            error && "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
          )}
        >
          {icon && (
            <div className="mr-3 text-gray-400 group-focus-within:text-violet-500 transition-colors">
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
              placeholder:text-gray-400
              focus:outline-none
              dark:text-white
              `,
              className
            )}
            {...props}
          />
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