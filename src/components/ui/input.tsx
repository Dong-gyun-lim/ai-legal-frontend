import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    const cls =
      "h-10 w-full rounded-md border border-slate-300 px-3 text-sm " +
      "focus:outline-none focus:ring-2 focus:ring-slate-400 " +
      className;
    return <input ref={ref} className={cls} {...props} />;
  }
);
Input.displayName = "Input";
