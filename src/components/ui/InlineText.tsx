import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { INLINE_LINK } from "@/lib/inline";

const linkClass = "text-accent underline underline-offset-2 hover:opacity-80";

/**
 * Renders a content string, turning [anchor](/path/) into a real link. Internal
 * paths use next/link; everything else is a plain anchor. No hooks, so it works
 * in server and client components alike.
 */
export function InlineText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = new RegExp(INLINE_LINK.source, "g");
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const [, label, href] = m;
    out.push(
      href.startsWith("/") ? (
        <Link key={m.index} href={href} className={linkClass}>
          {label}
        </Link>
      ) : (
        <a key={m.index} href={href} className={linkClass}>
          {label}
        </a>
      )
    );
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return <Fragment>{out}</Fragment>;
}
