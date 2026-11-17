#!/usr/bin/env node
// Checks every post in src/content/blog/posts against the content rules in
// docs/seo/blog-plan-20261117.md before the site builds. Any error stops the
// build, so a post that breaks a rule never ships.
//
//   node scripts/validate-blog.mjs           check all posts
//   node scripts/validate-blog.mjs --list    also print one line per post

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "src/content/blog/posts");
const LIST = process.argv.includes("--list");

const categories = [
  ...fs
    .readFileSync(path.join(ROOT, "src/content/blog/categories.ts"), "utf8")
    .matchAll(/id: "([a-z-]+)"/g),
].map((m) => m[1]);

const TOKENS = new Set([
  "price:listing",
  "price:template",
  "price:custom",
  "price:crm",
  "price:mortgage",
  "price:apps",
  "price:hosting",
  "time:listing",
  "time:template",
  "time:templateStandard",
  "time:mortgage",
  "time:mortgageRush",
]);

// Pages a post may link to besides other posts. Keep in step with the site.
const STATIC_PATHS = new Set([
  "/",
  "/services/",
  "/services/websites/",
  "/services/ai-consulting/",
  "/services/ai-automation-chatbots/",
  "/services/meta-ads/",
  "/services/social-media-automation/",
  "/services/lead-funnels/",
  "/services/skool-community-growth/",
  "/apps/",
  "/mortgage/",
  "/real-estate/",
  "/templates/",
  "/own-vs-rent/",
  "/st-petersburg-tampa-bay/",
  "/work/",
  "/process/",
  "/contact/",
  "/blog/",
  "/is-a-web-design-agency-worth-it/",
  "/work/stephenie-tocado/",
  "/work/ballantyne-title/",
  "/work/carnegie-title/",
  "/work/refine-title/",
  "/work/star-processing/",
  "/work/watchman/",
  "/work/rolodex-ai/",
  "/work/stage-echo/",
  "/work/famlink/",
  "/work/uncapped-poker/",
  "/work/chrome-hurt/",
  "/work/home-with-richard/",
  "/work/bubble-down/",
]);
const MONEY = new Set([
  "/services/websites/",
  "/services/ai-consulting/",
  "/services/ai-automation-chatbots/",
  "/services/meta-ads/",
  "/services/social-media-automation/",
  "/services/lead-funnels/",
  "/services/skool-community-growth/",
  "/apps/",
  "/mortgage/",
  "/real-estate/",
  "/templates/",
  "/st-petersburg-tampa-bay/",
]);

// Phrases that make writing read as filler. The owner asked for a human voice.
const BANNED = [
  "in today's",
  "fast-paced",
  "delve",
  "unlock",
  "unleash",
  "game-changer",
  "game changer",
  "elevate your",
  "seamless",
  "leverage",
  "robust",
  "ever-evolving",
  "landscape of",
  "navigate the",
  "it's important to note",
  "it is important to note",
  "in conclusion",
  "look no further",
  "supercharge",
  "cutting-edge",
  "revolutionize",
  "dive into",
  "deep dive",
  "click here",
  "harness",
  "tapestry",
  "embark",
  "in the realm",
  "rest assured",
  "take it to the next level",
  "skyrocket",
  "world-class",
  "best-in-class",
  "synergy",
];

const PACKAGE_FIGURES = [
  "$250",
  "$500",
  "$1,000",
  "$2,500",
  "$5,000",
  "$15,000",
];

const words = (s) => s.split(/\s+/).filter(Boolean).length;
const plain = (md) =>
  md
    .replace(/\{\{[^}]+\}\}/g, "$1,000")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/[*_`>|]/g, " ");

const files = fs.existsSync(DIR)
  ? fs
      .readdirSync(DIR)
      .filter((f) => f.endsWith(".md"))
      .sort()
  : [];
const slugs = new Set(files.map((f) => f.replace(/\.md$/, "")));

// Posts in the plan but not written yet may be linked: the loader renders those
// links as plain text until the target post exists and its date has passed.
const PLAN = path.join(ROOT, "docs/seo/blog-plan-20261117.tsv");
const BATCH_DATES = {
  1: "2026-11-17",
  2: "2026-11-24",
  3: "2026-12-01",
  4: "2026-12-08",
};
const planned = new Map();
if (fs.existsSync(PLAN)) {
  for (const line of fs
    .readFileSync(PLAN, "utf8")
    .trim()
    .split("\n")
    .slice(1)) {
    const [s, , , , batch] = line.split("\t");
    planned.set(s, BATCH_DATES[batch]);
  }
}
const publishedOf = new Map();
for (const f of files) {
  const d = fs
    .readFileSync(path.join(DIR, f), "utf8")
    .match(/^published:\s*(\S+)/m);
  if (d) publishedOf.set(f.replace(/\.md$/, ""), d[1]);
}

const errors = [];
const warnings = [];
const seenTitles = new Map();
const seenDescriptions = new Map();
const byDate = new Map();

for (const f of files) {
  const slug = f.replace(/\.md$/, "");
  const err = (m) => errors.push(`${f}: ${m}`);
  const warn = (m) => warnings.push(`${f}: ${m}`);
  const raw = fs.readFileSync(path.join(DIR, f), "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) {
    err("no frontmatter");
    continue;
  }
  const meta = {};
  for (const line of m[1].split("\n")) {
    if (!line.trim()) continue;
    const i = line.indexOf(":");
    meta[line.slice(0, i).trim()] = line
      .slice(i + 1)
      .trim()
      .replace(/^"(.*)"$/, "$1");
  }
  const body = m[2];

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug))
    err("slug must be lowercase words joined by hyphens");
  for (const k of [
    "title",
    "description",
    "keyword",
    "category",
    "money",
    "published",
    "answer",
  ]) {
    if (!meta[k]) err(`missing ${k}`);
  }
  if (meta.title && (meta.title.length < 20 || meta.title.length > 65))
    err(`title is ${meta.title.length} chars (20-65)`);
  if (
    meta.description &&
    (meta.description.length < 90 || meta.description.length > 160)
  )
    err(`description is ${meta.description.length} chars (90-160)`);
  if (meta.answer) {
    const n = words(meta.answer.replace(/\{\{[^}]+\}\}/g, "$1,000"));
    if (n > 60 || n < 20) err(`short answer is ${n} words (20-60)`);
  }
  if (meta.published && !/^\d{4}-\d{2}-\d{2}$/.test(meta.published))
    err("published must be YYYY-MM-DD");
  if (meta.updated && meta.updated < meta.published)
    err("updated is before published");
  if (meta.category && !categories.includes(meta.category))
    err(`unknown category ${meta.category}`);
  if (meta.money && !MONEY.has(meta.money))
    err(`money page ${meta.money} is not a money page`);

  for (const [, key] of raw.matchAll(/\{\{([^}]+)\}\}/g))
    if (!TOKENS.has(key)) err(`unknown token {{${key}}}`);

  const faqAt = body.indexOf("## Frequently asked questions");
  if (faqAt === -1) err("no '## Frequently asked questions' section");
  const main = faqAt === -1 ? body : body.slice(0, faqAt);
  const faq = faqAt === -1 ? "" : body.slice(faqAt);
  const h2 = (main.match(/^## /gm) || []).length;
  if (h2 < 3) err(`only ${h2} question sections (need 3+)`);
  const faqCount = (faq.match(/^### /gm) || []).length;
  if (faqCount < 3) err(`only ${faqCount} FAQs (need 3+)`);
  if (/^# /m.test(body))
    err("body must not contain an H1; the title is the H1");

  const total = words(plain(body));
  if (total < 800 || total > 2000) err(`${total} words (800-2000)`);

  const links = [...main.matchAll(/\]\((\/[^)\s]*)\)/g)].map((x) => x[1]);
  const internal = new Set(links);
  // Only links that resolve on the post's own publish day count toward the
  // minimum; a link to a later post is plain text when this one goes live.
  const liveOnDay = [...internal].filter((href) => {
    const b = href.match(/^\/blog\/([a-z0-9-]+)\/$/);
    if (!b) return true;
    const d = publishedOf.get(b[1]);
    return Boolean(d && meta.published && d <= meta.published);
  });
  if (liveOnDay.length < 3)
    err(
      `only ${liveOnDay.length} internal links resolve on the publish date (need 3+)`
    );
  if (meta.money && !links.includes(meta.money))
    err(`body never links to its money page ${meta.money}`);
  for (const href of [...body.matchAll(/\]\((\/[^)\s]*)\)/g)].map(
    (x) => x[1]
  )) {
    const b = href.match(/^\/blog\/([a-z0-9-]+)\/$/);
    if (b) {
      if (!slugs.has(b[1]) && !planned.has(b[1]))
        err(`links to ${href}, which is neither written nor planned`);
      if (b[1] === slug) err("links to itself");
    } else if (!STATIC_PATHS.has(href.split("#")[0])) {
      err(
        `links to unknown page ${href} (add it to STATIC_PATHS if it is real)`
      );
    } else if (!href.split("#")[0].endsWith("/")) {
      err(`internal link ${href} needs a trailing slash`);
    }
  }

  const lower = raw.toLowerCase();
  for (const phrase of BANNED)
    if (lower.includes(phrase)) err(`uses "${phrase}"`);
  if (raw.includes("—")) err("uses an em dash; rewrite the sentence");
  for (const fig of PACKAGE_FIGURES) {
    if (
      body.includes(`${fig} `) ||
      body.includes(`${fig}.`) ||
      body.includes(`${fig},`)
    )
      warn(
        `literal ${fig}: use a {{price:...}} token if it is one of our prices`
      );
  }

  for (const [map, key, label] of [
    [seenTitles, meta.title, "title"],
    [seenDescriptions, meta.description, "description"],
  ]) {
    if (!key) continue;
    if (map.has(key)) err(`same ${label} as ${map.get(key)}`);
    map.set(key, f);
  }
  byDate.set(meta.published, (byDate.get(meta.published) || 0) + 1);
  if (planned.has(slug) && planned.get(slug) !== meta.published)
    warn(
      `published ${meta.published} but the plan schedules it for ${planned.get(slug)}`
    );
  if (LIST)
    console.log(
      `${meta.published}  ${String(total).padStart(5)}w  ${faqCount}faq  ${liveOnDay.length}/${internal.size}links  ${slug}`
    );
}

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`ERROR ${e}`);
const dates = [...byDate.entries()]
  .sort()
  .map(([d, n]) => `${d}: ${n}`)
  .join(", ");
const unwritten = [...planned.keys()].filter((s) => !slugs.has(s)).length;
console.log(
  `blog: ${files.length} posts checked${dates ? ` (${dates})` : ""}, ${unwritten} planned posts not written yet, ` +
    `${errors.length} errors, ${warnings.length} warnings`
);
if (errors.length) process.exit(1);
