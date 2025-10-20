import * as React from "react";

type ButtonBaseProps = {
  asChild?: boolean;
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string; // if provided, render <a>
};

type ButtonProps = ButtonBaseProps & (
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
);

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ asChild, variant = "default", size = "md", className = "", href, ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-md font-medium transition";
    const variants = {
      default: "bg-slate-900 text-white hover:opacity-90",
      outline: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
    };
    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-11 px-5 text-base",
    };
    const cls = [base, variants[variant], sizes[size], className].filter(Boolean).join(" ");

    if (href) {
      return <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={cls} {...(props as any)} />;
    }
    if (asChild && (props as any).children) {
      const Child: any = (props as any).children?.type || "span";
      return <Child ref={ref as any} className={cls} {...(props as any).children?.props} />;
    }
    return <button ref={ref as React.Ref<HTMLButtonElement>} className={cls} {...(props as any)} />;
  }
);
Button.displayName = "Button";
