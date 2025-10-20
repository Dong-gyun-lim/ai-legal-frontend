import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  className?: string;
};

export function Button({
  className = "",
  variant = "default",
  size = "md",
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 " +
    "disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-slate-200 text-slate-900 hover:bg-slate-100",
    ghost: "hover:bg-slate-100 text-slate-900",
  } as const;

  const sizes = {
    sm: "h-9 px-3",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8",
  } as const;

  const cls = [base, variants[variant], sizes[size], className]
    .filter(Boolean)
    .join(" ");

  // asChild: 자식 엘리먼트(<a> 등)에 클래스만 주입해서 그대로 렌더
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      className: [cls, (children as any).props?.className ?? ""].join(" "),
      ...props,
    });
  }

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
