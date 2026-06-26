/**
 * Captures real homepage screenshots of your built sites for the Website Showcase.
 *
 * Run on your Mac from the project root:
 *   npx playwright install chromium
 *   node scripts/capture-showcase.mjs
 *   git add public/showcase-sites && git commit -m "Real showcase screenshots" && git push
 *
 * It serves each sibling build folder and screenshots the homepage into
 * public/showcase-sites/<slug>/desktop.jpg
 */
import { chromium } from "@playwright/test";
import { setTimeout as sleep } from "node:timers/promises";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const PROJECT = process.cwd();
const PARENT = path.resolve(PROJECT, ".."); // folder that holds all your build folders
const OUT = path.join(PROJECT, "public", "showcase-sites");

// slug -> build folder (relative to the parent of this project)
const targets = [
  { slug: "stephenie-tocado", dir: path.join(PARENT, "Stepehenie Tocado Real estste", "out") },
  { slug: "ballantyne-title", dir: path.join(PARENT, "Ballantyne title JV stand alone") },
  { slug: "carnegie-title", dir: path.join(PARENT, "Carnegie Title") },
  { slug: "refine-title", dir: path.join(PARENT, "Refine Title ") },
  { slug: "star-processing", dir: path.join(PARENT, "Star Processing") },
  { slug: "stage-echo", dir: path.join(PARENT, "Stage Echo") },
];

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".avif": "image/avif", ".gif": "image/gif", ".svg": "image/svg+xml",
  ".mp4": "video/mp4", ".webm": "video/webm", ".woff": "font/woff",
  ".woff2": "font/woff2", ".ico": "image/x-icon", ".txt": "text/plain",
};

function serve(dir) {
  const server = http.createServer((req, res) => {
    try {
      let p = decodeURIComponent((req.url || "/").split("?")[0]);
      if (p.endsWith("/")) p += "index.html";
      let fp = path.join(dir, p);
      if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) fp = path.join(dir, p, "index.html");
      if (!fs.existsSync(fp)) { res.statusCode = 404; res.end("not found"); return; }
      res.setHeader("content-type", MIME[path.extname(fp).toLowerCase()] || "application/octet-stream");
      fs.createReadStream(fp).pipe(res);
    } catch (e) {
      res.statusCode = 500;
      res.end(String(e));
    }
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port }));
  });
}

const browser = await chromium.launch();

for (const t of targets) {
  if (!fs.existsSync(path.join(t.dir, "index.html"))) {
    console.log(`SKIP ${t.slug} (no index.html at ${t.dir})`);
    continue;
  }
  const { server, port } = await serve(t.dir);
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "load", timeout: 25000 }).catch(() => {});
    await sleep(2800);
    fs.mkdirSync(path.join(OUT, t.slug), { recursive: true });
    const outFile = path.join(OUT, t.slug, "desktop.jpg");
    await page.screenshot({ path: outFile, type: "jpeg", quality: 82 });
    await page.close();
    console.log(`OK   ${t.slug} -> ${outFile}`);
  } catch (e) {
    console.log(`FAIL ${t.slug}: ${e?.message ?? e}`);
  } finally {
    server.close();
  }
}

await browser.close();
console.log("done");
