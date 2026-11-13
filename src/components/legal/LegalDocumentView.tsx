import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import type { LegalBlock, LegalDocument } from "@/content/legal/types";

type Refs = Map<string, number>;

const anchor = (id: string) => `s-${id}`;

function resolveRefs(text: string, refs: Refs): string {
  return text.replace(/\{\{s:([a-z0-9-]+)(?:\.(\d+))?\}\}/g, (_, id: string, sub?: string) => {
    const n = refs.get(id);
    if (!n) throw new Error(`Legal document refers to unknown section "${id}"`);
    return `[section ${n}${sub ? `.${sub}` : ""}](#${anchor(id)})`;
  });
}

function isInternal(href: string) {
  return href.startsWith("/");
}

function renderInline(text: string, refs: Refs, keyBase = "i"): ReactNode[] {
  const source = resolveRefs(text, refs);
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(source))) {
    if (m.index > last) out.push(source.slice(last, m.index));
    const key = `${keyBase}-${k++}`;
    if (m[1] !== undefined) {
      out.push(<strong key={key} className="font-semibold text-ink">{renderInline(m[1], refs, key)}</strong>);
    } else {
      const label = m[2];
      const href = m[3];
      const cls = "text-accent underline underline-offset-2 hover:opacity-80";
      if (isInternal(href)) {
        out.push(<Link key={key} href={href} className={cls}>{label}</Link>);
      } else if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        out.push(<a key={key} href={href} className={cls}>{label}</a>);
      } else {
        out.push(
          <a key={key} href={href} className={cls} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        );
      }
    }
    last = re.lastIndex;
  }
  if (last < source.length) out.push(source.slice(last));
  return out;
}

function Block({ block, refs, k }: { block: LegalBlock; refs: Refs; k: string }) {
  if (typeof block === "string") {
    return <p className="mt-4">{renderInline(block, refs, k)}</p>;
  }
  if ("list" in block) {
    const Tag = block.ordered ? "ol" : "ul";
    return (
      <Tag className={`mt-4 space-y-2 pl-5 ${block.ordered ? "list-decimal" : "list-disc"} marker:text-muted`}>
        {block.list.map((item, i) => (
          <li key={i} className="pl-1">{renderInline(item, refs, `${k}-${i}`)}</li>
        ))}
      </Tag>
    );
  }
  if ("table" in block) {
    const { head, rows } = block.table;
    return (
      <>
        {/* Wide screens: a real table. */}
        <div className="mt-5 hidden overflow-x-auto rounded-sm border border-line sm:block">
          <table className="w-full border-collapse text-left text-[0.9em] leading-6">
            <thead className="bg-surface">
              <tr>
                {head.map((h, i) => (
                  <th key={i} scope="col" className="border-b border-line px-4 py-3 align-bottom font-medium text-ink">
                    {renderInline(h, refs, `${k}-h${i}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={r} className="border-t border-line align-top">
                  {row.map((cell, c) => (
                    <td key={c} className={`px-4 py-3 ${c === 0 ? "font-medium text-ink" : ""}`}>
                      {renderInline(cell, refs, `${k}-${r}-${c}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Phones: one card per row, so nothing hides off-screen. */}
        <div className="mt-5 grid gap-3 sm:hidden">
          {rows.map((row, r) => (
            <dl key={r} className="rounded-sm border border-line bg-surface p-4 text-[0.92em] leading-6">
              <dt className="font-medium text-ink">{renderInline(row[0], refs, `${k}-m${r}-0`)}</dt>
              {row.slice(1).map((cell, c) => (
                <dd key={c} className="mt-2">
                  <span className="block text-[0.8em] uppercase tracking-[0.12em] text-muted">
                    {renderInline(head[c + 1], refs, `${k}-m${r}-h${c}`)}
                  </span>
                  {renderInline(cell, refs, `${k}-m${r}-${c + 1}`)}
                </dd>
              ))}
            </dl>
          ))}
        </div>
      </>
    );
  }
  return (
    <div className="mt-5 rounded-sm border border-line bg-[color:var(--accent-soft)] p-4 text-ink sm:p-5">
      {renderInline(block.callout, refs, k)}
    </div>
  );
}

/** Renders a numbered legal document with a table of contents and stable anchors. */
export function LegalDocumentView({ doc }: { doc: LegalDocument }) {
  const refs: Refs = new Map(doc.sections.map((s, i) => [s.id, i + 1]));

  return (
    <div className="legal-doc text-[0.98rem] leading-7 text-muted sm:text-base">
      <p className="text-sm text-muted">
        <span className="text-ink">Effective:</span> {doc.effective}
        <span aria-hidden="true" className="mx-2">·</span>
        <span className="text-ink">Last updated:</span> {doc.updated}
      </p>

      {doc.intro.map((b, i) => (
        <Block key={i} block={b} refs={refs} k={`intro-${i}`} />
      ))}

      <nav aria-label="Contents" className="mt-10 rounded-sm border border-line bg-surface p-5 sm:p-6">
        <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-ink">Contents</h2>
        <ol className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
          {doc.sections.map((s, i) => (
            <li key={s.id} className="flex gap-2">
              <span className="w-6 flex-none text-right tabular-nums text-muted">{i + 1}.</span>
              <a href={`#${anchor(s.id)}`} className="hover:text-ink hover:underline">
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {doc.sections.map((s, i) => (
        <section key={s.id} id={anchor(s.id)} className="scroll-mt-28 pt-12">
          <h2 className="text-xl font-medium text-ink sm:text-2xl">
            <span className="tabular-nums">{i + 1}.</span> {s.title}
          </h2>
          {(s.blocks ?? []).map((b, j) => (
            <Block key={j} block={b} refs={refs} k={`${s.id}-${j}`} />
          ))}
          {(s.subsections ?? []).map((sub, j) => (
            <Fragment key={j}>
              <h3 className="mt-8 text-base font-medium text-ink sm:text-lg">
                <span className="tabular-nums">
                  {i + 1}.{j + 1}
                </span>{" "}
                {sub.title}
              </h3>
              {sub.blocks.map((b, n) => (
                <Block key={n} block={b} refs={refs} k={`${s.id}-${j}-${n}`} />
              ))}
            </Fragment>
          ))}
        </section>
      ))}
    </div>
  );
}
