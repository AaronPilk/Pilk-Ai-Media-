import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The agreement line shown on every form. Links open in a new tab so reading
 * them never wipes a half-filled form.
 */
export function FormLegalNotice({
  className,
  tone = "default",
}: {
  className?: string;
  /** "dark" for forms on the always-dark listing demo. */
  tone?: "default" | "dark";
}) {
  const linkCls = cn("underline underline-offset-2", tone === "dark" ? "hover:text-white" : "hover:text-ink");
  const terms = (
    <Link href="/terms/" target="_blank" rel="noopener" className={linkCls}>
      Terms of Service
    </Link>
  );
  const privacy = (
    <Link href="/privacy/" target="_blank" rel="noopener" className={linkCls}>
      Privacy Policy
    </Link>
  );

  return (
    <p className={cn("text-xs leading-relaxed", tone === "dark" ? "text-white/55" : "text-muted", className)}>
      By submitting, you agree to the {terms} and acknowledge the {privacy}.
    </p>
  );
}
