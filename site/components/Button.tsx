import Link from "next/link";
import { ComponentProps } from "react";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-colors";

const VARIANTS = {
  primary: "bg-accent text-white hover:bg-accent-strong",
  ghost: "border border-white/25 text-text-ondark hover:bg-white/10",
  outline: "border border-ink text-ink hover:bg-ink hover:text-white",
  whatsapp: "bg-[#25D366] text-white hover:bg-[#1fbd5a]",
};

type ButtonProps = {
  variant?: keyof typeof VARIANTS;
  className?: string;
} & (
  | ({ href: string } & Omit<ComponentProps<typeof Link>, "href">)
  | ({ href?: undefined } & ComponentProps<"button">)
);

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        {props.children}
      </Link>
    );
  }

  const { children, ...rest } = props as ComponentProps<"button">;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
