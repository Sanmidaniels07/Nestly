"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input, { InputProps } from "./input";

const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, "type" | "rightElement">>(
  (props, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <Input
        ref={ref}
        type={visible ? "text" : "password"}
        rightElement={
          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="transition-colors hover:text-violet-500"
          >
            {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        }
        {...props}
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
