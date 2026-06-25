import { createElement } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return createElement(as, { className: cn("container-page", className) }, children);
}
