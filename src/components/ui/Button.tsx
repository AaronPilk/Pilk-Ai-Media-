"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost";

type BaseProps = {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  withArrow?: boolean;
  onClick?: () => void;
  "data-cursor"?: string;
};

type ButtonProps = BaseProps & { href?: undefined; type?: "button" | "submit" };
type LinkProps = BaseProps & { href: string };

export function Button(props: ButtonProps | LinkProps) {
  const {
    children,
    variant = "primary",
    className,
    withArrow = false,
    onClick,
  } = props;

  const classes = cn(
    "btn",
    variant === "primary" ? "btn-primary" : "btn-ghost",
    className
  );

  const content = (
    <>
      {children}
      {withArrow && <ArrowUpRight size={16} aria-hidden />}
    </>
  );

  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        className={classes}
        onClick={onClick}
        data-cursor={props["data-cursor"]}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={(props as ButtonProps).type ?? "button"}
      className={classes}
      onClick={onClick}
      data-cursor={props["data-cursor"]}
    >
      {content}
    </button>
  );
}
