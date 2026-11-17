import fs from "node:fs";
import path from "node:path";
import { Marked } from "marked";
import { buildTimes, hostingPlan, mortgagePackage, packages } from "@/content/packages";
import { appBuilding } from "@/content/apps";
import { blogCategories, type BlogCategoryId } from "@/content/blog/categories";
import { money } from "@/lib/pricing";

/**
 * Blog posts live as Markdown in src/content/blog/posts/<slug>.md. Rules for
 * writing them are in docs/seo/blog-plan-20261117.md; scripts/validate-blog.mjs
 * enforces them before every build.
 *
 * A post is public once its `published` date has arrived in New York at build
 * time. Later posts sit in the repo and go live on the first build on or after
 * their date, so batches can be scheduled without a separate branch.
 */

const POSTS_DIR = path.join(process.cwd(), "src/content/blog/posts");
const FAQ_HEADING = "## Frequently asked questions";

export type BlogFaq = { q: string; a: string; html: string };

export type BlogPost = {
  slug: string;
  path: string;
  title: string;
  description: string;
  headline: string;
  keyword: string;
  category: BlogCategoryId;
  money: string;
  published: string;
  updated: string;
  answer: string;
  html: string;
  toc: { id: string; text: string }[];
  faqs: BlogFaq[];
  words: number;
  readingMinutes: number;
  sourcePath: string;
};

type Frontmatter = Record<string, string>;

/** Today's date in New York as YYYY-MM-DD, the day the business works in. */
export function todayInNewYork(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** BLOG_PREVIEW=1 builds every post regardless of date, for local review only. */
const PREVIEW = process.env.BLOG_PREVIEW === "1";

function parseFrontmatter(raw: string, file: string): { meta: Frontmatter; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`blog: ${file} has no frontmatter block`);
  const meta: Frontmatter = {};
  for (const line of match[1].split("\n")) {
    if (!line.trim()) continue;
    const i = line.indexOf(":");
    if (i < 1) throw new Error(`blog: ${file} has a bad frontmatter line: ${line}`);
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: match[2] };
}

/** Prices and timelines come from packages.ts so a price change reaches every post. */
const TOKENS: Record<string, string> = (() => {
  const tier = (id: (typeof packages)[number]["id"]) => {
    const t = packages.find((p) => p.id === id);
    if (!t) throw new Error(`blog: unknown package ${id}`);
    return `${money(t.price)}${t.priceUnit ? ` ${t.priceUnit}` : ""}`;
  };
  const appFigure = appBuilding.pricingLabel.match(/\$[\d,]+/)?.[0];
  if (!appFigure) throw new Error("blog: app pricing label has no figure");
  return {
    "price:listing": tier("listing"),
    "price:template": tier("template"),
    "price:custom": tier("custom"),
    "price:crm": tier("crm"),
    "price:mortgage": money(mortgagePackage.price),
    "price:apps": appFigure,
    "price:hosting": `${money(hostingPlan.priceFrom)} a month`,
    "time:listing": buildTimes.listing,
    "time:template": buildTimes.template,
    "time:templateStandard": buildTimes.templateStandard,
    "time:mortgage": buildTimes.mortgage,
    "time:mortgageRush": buildTimes.mortgageRush,
  };
})();

export function fillTokens(text: string, file: string): string {
  return text.replace(/\{\{([a-zA-Z]+:[a-zA-Z]+)\}\}/g, (_, key: string) => {
    const value = TOKENS[key];
    if (value === undefined) throw new Error(`blog: ${file} uses unknown token {{${key}}}`);
    return value;
  });
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 70);
}

/** Plain text for counts and JSON-LD: no Markdown syntax, no link targets. */
export function markdownToText(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/[*_`>|]/g, " ")
    .replace(/^\s*[-\d.]+\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * A link to a post that is not live yet would 404, so it renders as plain text
 * until that post's date. Typos are caught by the validator, not here.
 */
function gateBlogLinks(md: string, live: Set<string>): string {
  return md.replace(/\[([^\]]+)\]\(\/blog\/([a-z0-9-]+)\/?\)/g, (all, label: string, slug: string) =>
    live.has(slug) ? `[${label}](/blog/${slug}/)` : label
  );
}

function makeRenderer(toc: { id: string; text: string }[]) {
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        if (depth === 2) {
          const id = slugifyHeading(text);
          toc.push({ id, text: text.replace(/<[^>]+>/g, "") });
          return `<h2 id="${id}">${text}</h2>\n`;
        }
        return `<h${depth}>${text}</h${depth}>\n`;
      },
      link({ href, tokens }) {
        const text = this.parser.parseInline(tokens);
        if (href.startsWith("/")) return `<a href="${href}">${text}</a>`;
        return `<a href="${href}" rel="noopener">${text}</a>`;
      },
      table(token) {
        // Wide tables scroll inside their own box on phones.
        const head = token.header.map((c) => `<th>${this.parser.parseInline(c.tokens)}</th>`).join("");
        const rows = token.rows
          .map((r) => `<tr>${r.map((c) => `<td>${this.parser.parseInline(c.tokens)}</td>`).join("")}</tr>`)
          .join("");
        return `<div class="blog-table"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>\n`;
      },
    },
  });
  return marked;
}

function splitFaq(body: string): { main: string; faqBlock: string } {
  const i = body.indexOf(FAQ_HEADING);
  if (i === -1) return { main: body, faqBlock: "" };
  return { main: body.slice(0, i), faqBlock: body.slice(i + FAQ_HEADING.length) };
}

function parseFaqs(block: string, render: (md: string) => string): BlogFaq[] {
  return block
    .split(/^### /m)
    .slice(1)
    .map((chunk) => {
      const nl = chunk.indexOf("\n");
      const q = chunk.slice(0, nl).trim();
      const answerMd = chunk.slice(nl + 1).trim();
      return { q, a: markdownToText(answerMd), html: render(answerMd) };
    })
    .filter((f) => f.q && f.a);
}

type Raw = { slug: string; file: string; meta: Frontmatter; body: string };

function readRaw(): Raw[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const file = path.join(POSTS_DIR, f);
      const { meta, body } = parseFrontmatter(fs.readFileSync(file, "utf8"), f);
      return { slug: f.replace(/\.md$/, ""), file, meta, body };
    });
}

function isLive(meta: Frontmatter, today: string): boolean {
  return PREVIEW || meta.published <= today;
}

let cache: BlogPost[] | null = null;

/** Every live post, newest first. */
export function getAllPosts(): BlogPost[] {
  if (cache) return cache;
  const today = todayInNewYork();
  const raws = readRaw();
  const live = new Set(raws.filter((r) => isLive(r.meta, today)).map((r) => r.slug));

  const posts = raws
    .filter((r) => live.has(r.slug))
    .map((r): BlogPost => {
      const rel = path.relative(process.cwd(), r.file);
      const filled = gateBlogLinks(fillTokens(r.body, rel), live);
      const { main, faqBlock } = splitFaq(filled);
      const toc: { id: string; text: string }[] = [];
      const marked = makeRenderer(toc);
      const html = marked.parse(main) as string;
      const inline = makeRenderer([]);
      const faqs = parseFaqs(faqBlock, (md) => inline.parse(md) as string);
      const category = r.meta.category as BlogCategoryId;
      if (!blogCategories.some((c) => c.id === category)) {
        throw new Error(`blog: ${rel} has unknown category ${category}`);
      }
      const words = markdownToText(filled).split(" ").length;
      return {
        slug: r.slug,
        path: `/blog/${r.slug}/`,
        title: r.meta.title,
        description: r.meta.description,
        headline: r.meta.headline || r.meta.title,
        keyword: r.meta.keyword,
        category,
        money: r.meta.money,
        published: r.meta.published,
        updated: r.meta.updated || r.meta.published,
        answer: fillTokens(r.meta.answer, rel),
        html,
        toc,
        faqs,
        words,
        readingMinutes: Math.max(3, Math.round(words / 230)),
        sourcePath: rel,
      };
    })
    .sort((a, b) => (a.published === b.published ? a.title.localeCompare(b.title) : a.published < b.published ? 1 : -1));

  cache = posts;
  return posts;
}

export function getPost(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function postsInCategory(ids: BlogCategoryId[], limit?: number): BlogPost[] {
  const list = getAllPosts().filter((p) => ids.includes(p.category));
  return limit ? list.slice(0, limit) : list;
}

/** Up to `n` other live posts: same category first, then the newest elsewhere. */
export function relatedPosts(post: BlogPost, n = 3): BlogPost[] {
  const others = getAllPosts().filter((p) => p.slug !== post.slug);
  const same = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  return [...same, ...rest].slice(0, n);
}

export function formatPostDate(iso: string): string {
  // Noon UTC keeps the calendar day the same in every US time zone.
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
