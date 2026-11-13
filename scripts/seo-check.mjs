#!/usr/bin/env node
// Static SEO check for the exported site in out/. No dependencies, regex-based
// on purpose: Next's static HTML is predictable and this has to run anywhere
// Node runs (CI, the owner's Mac, the deploy kit) without an install step.
//
//   node scripts/seo-check.mjs            report, exit 1 on errors
//   node scripts/seo-check.mjs --json     machine-readable report
//   node scripts/seo-check.mjs --out dir  check a different export folder
//
// Errors fail the run (deploy kits rely on that). Warnings are advisory.

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const outIdx = args.indexOf("--out");
const OUT = path.resolve(outIdx >= 0 ? args[outIdx + 1] : "out");
const ORIGIN = "https://pilk.ai";

// Static demo sites and media live under these folders. They are not app
// routes and carry their own markup, so they are checked by _headers policy,
// not by this page-level audit.
const SKIP_DIRS = new Set([
  "_next",
  "template-previews",
  "showcase-sites",
  "experience",
]);

if (!fs.existsSync(OUT)) {
  console.error(`seo-check: ${OUT} does not exist. Run the build first.`);
  process.exit(2);
}

function walk(dir, rel = "") {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const relPath = path.posix.join(rel, entry.name);
    if (entry.isDirectory()) {
      if (rel === "" && SKIP_DIRS.has(entry.name)) continue;
      found.push(...walk(path.join(dir, entry.name), relPath));
    } else if (entry.name.endsWith(".html")) {
      found.push(relPath);
    }
  }
  return found;
}

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\s${name}=("([^"]*)"|'([^']*)')`, "i"));
  return m ? decode(m[2] ?? m[3] ?? "") : undefined;
}

function metaContent(head, key, value) {
  for (const m of head.matchAll(/<meta\b[^>]*>/gi)) {
    if ((attr(m[0], key) ?? "").toLowerCase() === value.toLowerCase())
      return attr(m[0], "content");
  }
  return undefined;
}

function routeFor(file) {
  if (file === "index.html") return "/";
  if (file === "404.html") return "/404";
  if (file.endsWith("/index.html"))
    return "/" + file.slice(0, -"index.html".length);
  return "/" + file.replace(/\.html$/, "");
}

function resolvesLocally(urlPath) {
  const clean = decodeURIComponent(urlPath.split("#")[0].split("?")[0]);
  if (clean === "" || clean === "/")
    return fs.existsSync(path.join(OUT, "index.html"));
  const p = path.join(OUT, clean);
  if (fs.existsSync(p) && fs.statSync(p).isFile()) return true;
  if (fs.existsSync(path.join(p, "index.html"))) return true;
  if (fs.existsSync(p.replace(/\/$/, "") + ".html")) return true;
  // Cloudflare Pages Functions answer these at the edge, not from out/.
  if (clean.startsWith("/api/")) return true;
  return false;
}

const pages = walk(OUT).filter((f) => f !== "404/index.html");
const errors = [];
const warnings = [];
const report = [];

for (const file of pages) {
  const html = fs.readFileSync(path.join(OUT, file), "utf8");
  const route = routeFor(file);
  const headEnd = html.indexOf("</head>");
  const head = headEnd > 0 ? html.slice(0, headEnd) : html;
  const body = headEnd > 0 ? html.slice(headEnd) : html;

  const title = decode(
    (head.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] ?? ""
  ).trim();
  const description = metaContent(head, "name", "description") ?? "";
  const robots = metaContent(head, "name", "robots") ?? "";
  const noindex = /noindex/i.test(robots) || file === "404.html";
  const canonicalTag = (head.match(/<link\b[^>]*rel="canonical"[^>]*>/i) ||
    [])[0];
  const canonical = canonicalTag ? attr(canonicalTag, "href") : undefined;
  const ogImage = metaContent(head, "property", "og:image");
  const ogTitle = metaContent(head, "property", "og:title");
  const ogUrl = metaContent(head, "property", "og:url");
  const twCard = metaContent(head, "name", "twitter:card");
  const twImage = metaContent(head, "name", "twitter:image");
  const h1Count = (body.match(/<h1[\s>]/gi) || []).length;

  const jsonLd = [];
  const ldTypes = [];
  for (const m of html.matchAll(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
  )) {
    try {
      const data = JSON.parse(m[1]);
      jsonLd.push(data);
      const nodes = Array.isArray(data) ? data : (data["@graph"] ?? [data]);
      for (const n of nodes) ldTypes.push([].concat(n["@type"]).join("+"));
    } catch (e) {
      errors.push(`${route}: invalid JSON-LD (${e.message})`);
    }
  }

  const imgsNoAlt = [];
  for (const m of body.matchAll(/<img\b[^>]*>/gi)) {
    if (attr(m[0], "alt") === undefined) imgsNoAlt.push(attr(m[0], "src"));
  }

  const brokenLinks = [];
  const deadHashLinks = [];
  for (const m of body.matchAll(/<a\b[^>]*>/gi)) {
    const href = attr(m[0], "href");
    if (href === undefined) continue;
    if (href === "#") deadHashLinks.push(href);
    else if (
      href.startsWith("/") &&
      !href.startsWith("//") &&
      !resolvesLocally(href)
    )
      brokenLinks.push(href);
  }

  const row = {
    route,
    file,
    title,
    titleLength: title.length,
    description,
    descriptionLength: description.length,
    canonical,
    noindex,
    h1Count,
    ogImage,
    twCard,
    ldTypes,
    imgsNoAlt,
    brokenLinks,
    deadHashLinks: deadHashLinks.length,
  };
  report.push(row);

  if (brokenLinks.length)
    errors.push(
      `${route}: broken internal links ${[...new Set(brokenLinks)].join(", ")}`
    );
  if (noindex) continue;

  if (!title) errors.push(`${route}: missing <title>`);
  else if (title.length > 60)
    warnings.push(`${route}: title is ${title.length} chars (>60): "${title}"`);
  if (!description) errors.push(`${route}: missing meta description`);
  else if (description.length > 155)
    warnings.push(
      `${route}: description is ${description.length} chars (>155)`
    );
  else if (description.length < 70)
    warnings.push(
      `${route}: description is short (${description.length} chars)`
    );
  if (h1Count !== 1) errors.push(`${route}: ${h1Count} <h1> elements (want 1)`);
  if (!canonical) errors.push(`${route}: missing canonical`);
  else {
    const expected = ORIGIN + route;
    if (canonical !== expected)
      errors.push(`${route}: canonical ${canonical} != ${expected}`);
  }
  if (!ogTitle || !ogImage)
    errors.push(`${route}: missing og:title or og:image`);
  if (ogUrl && canonical && ogUrl !== canonical)
    warnings.push(`${route}: og:url ${ogUrl} differs from canonical`);
  if (
    ogImage &&
    ogImage.startsWith(ORIGIN) &&
    !resolvesLocally(ogImage.slice(ORIGIN.length))
  )
    errors.push(`${route}: og:image not found in build (${ogImage})`);
  if (!twCard || !twImage)
    warnings.push(`${route}: missing twitter:card or twitter:image`);
  if (imgsNoAlt.length)
    warnings.push(`${route}: ${imgsNoAlt.length} <img> without alt`);
  if (deadHashLinks.length)
    warnings.push(`${route}: ${deadHashLinks.length} link(s) to "#"`);
  if (jsonLd.length === 0) warnings.push(`${route}: no JSON-LD`);
}

// Duplicate titles and descriptions among indexable pages.
const indexable = report.filter((r) => !r.noindex);
for (const key of ["title", "description"]) {
  const seen = new Map();
  for (const r of indexable) {
    if (!r[key]) continue;
    seen.set(r[key], [...(seen.get(r[key]) ?? []), r.route]);
  }
  for (const [value, routes] of seen) {
    if (routes.length > 1)
      warnings.push(
        `duplicate ${key} on ${routes.join(", ")}: "${value.slice(0, 80)}"`
      );
  }
}

// Sitemap: every URL must be a real, indexable page whose canonical is itself.
const sitemap = { count: 0, urls: [], missingFromSitemap: [] };
const smPath = path.join(OUT, "sitemap.xml");
if (!fs.existsSync(smPath)) errors.push("sitemap.xml missing");
else {
  const xml = fs.readFileSync(smPath, "utf8");
  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
    loc: (m[1].match(/<loc>([^<]+)<\/loc>/) || [])[1],
    lastmod: (m[1].match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1],
  }));
  sitemap.count = entries.length;
  sitemap.urls = entries;
  const byRoute = new Map(report.map((r) => [r.route, r]));
  const listed = new Set();
  for (const { loc, lastmod } of entries) {
    if (!loc || !loc.startsWith(ORIGIN + "/")) {
      errors.push(`sitemap: bad loc ${loc}`);
      continue;
    }
    const route = loc.slice(ORIGIN.length);
    listed.add(route);
    const page = byRoute.get(route);
    if (!page)
      errors.push(`sitemap: ${loc} has no page in the build (trailing slash?)`);
    else if (page.noindex) errors.push(`sitemap: ${loc} is noindex`);
    else if (page.canonical !== loc)
      errors.push(`sitemap: ${loc} canonical is ${page.canonical}`);
    if (!lastmod || Number.isNaN(Date.parse(lastmod)))
      warnings.push(`sitemap: ${loc} has no valid lastmod`);
  }
  if (new Set(entries.map((e) => e.loc)).size !== entries.length)
    errors.push("sitemap: duplicate URLs");
  for (const r of indexable) {
    if (r.route !== "/404" && !listed.has(r.route))
      sitemap.missingFromSitemap.push(r.route);
  }
  for (const route of sitemap.missingFromSitemap)
    warnings.push(`indexable page not in sitemap: ${route}`);
}

const robotsPath = path.join(OUT, "robots.txt");
if (!fs.existsSync(robotsPath)) errors.push("robots.txt missing");
else {
  const robots = fs.readFileSync(robotsPath, "utf8");
  if (!/Sitemap:\s*https:\/\/pilk\.ai\/sitemap\.xml/i.test(robots))
    errors.push("robots.txt: no Sitemap line for https://pilk.ai/sitemap.xml");
  if (/Disallow:\s*\/\s*$/m.test(robots))
    errors.push("robots.txt: blocks the whole site");
}

if (asJson) {
  console.log(
    JSON.stringify({ errors, warnings, sitemap, pages: report }, null, 2)
  );
} else {
  console.log(
    `seo-check: ${report.length} pages (${indexable.length} indexable), sitemap ${sitemap.count} URLs`
  );
  for (const w of warnings) console.log(`  warn  ${w}`);
  for (const e of errors) console.log(`  ERROR ${e}`);
  console.log(
    errors.length
      ? `seo-check: FAILED with ${errors.length} error(s)`
      : "seo-check: OK"
  );
}
process.exit(errors.length ? 1 : 0);
