#!/usr/bin/env node
// Tell IndexNow search engines (Bing, Yandex, Seznam, Naver and others) which
// pilk.ai URLs exist or changed, so they recrawl soon instead of on their own
// schedule. Google does not use IndexNow; it reads the sitemap.
//
//   node scripts/indexnow-submit.mjs --all             every URL in the live sitemap
//   node scripts/indexnow-submit.mjs --all --local     every URL in out/sitemap.xml
//   node scripts/indexnow-submit.mjs --url <url> ...   specific pilk.ai URLs
//   add --dry-run to print what would be sent without sending it
//
// The key is public by design: engines confirm ownership by fetching
// https://pilk.ai/<key>.txt and comparing it with the key in the request. Only
// URLs from the sitemap (or given explicitly, and on pilk.ai) are ever sent,
// so noindex pages like /checkout/ or the demo sites cannot be pushed here.

import { readFileSync, readdirSync } from "node:fs";

const HOST = "pilk.ai";
const ORIGIN = `https://${HOST}`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const UA = "Mozilla/5.0 (compatible; pilk-indexnow/1.0; +https://pilk.ai)";
const BATCH = 10000; // protocol maximum per request

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const local = args.includes("--local");
const explicit = args.flatMap((a, i) => (args[i - 1] === "--url" ? [a] : []));

if (!args.includes("--all") && explicit.length === 0) {
  console.error(
    "usage: indexnow-submit.mjs --all [--local] | --url <url> [--url <url>] [--dry-run]"
  );
  process.exit(2);
}

const publicDir = new URL("../public/", import.meta.url);
const keyFile = readdirSync(publicDir).find((f) =>
  /^[a-f0-9]{32}\.txt$/.test(f)
);
if (!keyFile) {
  console.error("STOP: no public/<32 hex chars>.txt IndexNow key file found");
  process.exit(1);
}
const KEY = keyFile.slice(0, -4);
if (readFileSync(new URL(keyFile, publicDir), "utf8").trim() !== KEY) {
  console.error(
    `STOP: public/${keyFile} must contain exactly its own name (the key)`
  );
  process.exit(1);
}
const KEY_LOCATION = `${ORIGIN}/${KEY}.txt`;

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, "Cache-Control": "no-cache" },
  });
  if (!res.ok) throw new Error(`${url} answered HTTP ${res.status}`);
  return res.text();
}

const locs = (xml) =>
  [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) =>
    m[1].replace(/&amp;/g, "&")
  );

async function sitemapUrls() {
  if (local)
    return locs(
      readFileSync(new URL("../out/sitemap.xml", import.meta.url), "utf8")
    );
  const xml = await fetchText(`${ORIGIN}/sitemap.xml`);
  if (xml.includes("<sitemapindex")) {
    const nested = await Promise.all(locs(xml).map(fetchText));
    return nested.flatMap(locs);
  }
  return locs(xml);
}

const candidates = explicit.length ? explicit : await sitemapUrls();
const urlList = [...new Set(candidates)].filter(
  (u) => u === ORIGIN + "/" || u.startsWith(ORIGIN + "/")
);
const dropped = candidates.length - urlList.length;
if (dropped)
  console.log(`indexnow: skipped ${dropped} URL(s) not on ${ORIGIN}`);
if (urlList.length === 0) {
  console.log("indexnow: nothing to send");
  process.exit(0);
}

if (!dryRun) {
  const served = (await fetchText(KEY_LOCATION).catch(() => "")).trim();
  if (served !== KEY) {
    console.error(
      `STOP: ${KEY_LOCATION} does not serve the key yet. Deploy first, then re-run.`
    );
    process.exit(1);
  }
}

let accepted = 0;
let refused = 0;
for (let i = 0; i < urlList.length; i += BATCH) {
  const batch = urlList.slice(i, i + BATCH);
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: batch,
  };
  if (dryRun) {
    console.log(
      JSON.stringify(
        { ...body, urlList: `${batch.length} URLs`, sample: batch.slice(0, 5) },
        null,
        2
      )
    );
    continue;
  }
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "User-Agent": UA,
    },
    body: JSON.stringify(body),
  });
  // 200 = accepted, 202 = accepted while the key is being verified.
  console.log(`indexnow: ${batch.length} URLs -> HTTP ${res.status}`);
  if (res.status === 200 || res.status === 202) accepted += batch.length;
  else {
    refused += batch.length;
    console.log((await res.text()).slice(0, 500));
  }
}

console.log(
  dryRun
    ? `indexnow dry run: ${urlList.length} URLs`
    : `indexnow: ${accepted} accepted, ${refused} refused`
);
process.exit(refused ? 1 : 0);
