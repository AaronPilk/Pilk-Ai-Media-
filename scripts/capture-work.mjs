/**
 * Captures REAL homepage screenshots for the Work page covers.
 *
 * Run on your Mac from the project root:
 *   npx playwright install chromium
 *   node scripts/capture-work.mjs
 *   git add public/work && git commit -m "Real work screenshots" && git push
 *
 * Local builds are served and screenshotted; live URLs are visited directly.
 * Output: public/work/<slug>.jpg  (these filenames already match the covers in
 * src/content/projects.ts, so screenshots replace the placeholder cards.)
 */
import { chromium } from "@playwright/test";
import { setTimeout as sleep } from "node:timers/promises";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const PROJECT = process.cwd();
const PARENT = path.resolve(PROJECT, "..");
const OUT = path.join(PROJECT, "public", "work");

// slug -> local build dir OR live url. Add/adjust freely.
const targets = [
  { slug: "watchman", dir: path.join(PARENT, "watchmen website") },
  { slug: "rolodex-ai", dir: path.join(PARENT, "rolodex AI", "website") },
  { slug: "uncapped-poker", dir: path.join(PARENT, "UncappedPoker") },
  { slug: "chrome-hurt", dir: path.join(PARENT, "chrome Hurt") },
  { slug: "star-processing", url: "https://www.star-processing.com" },
  { slug: "home-with-richard", url: "https://www.homewithrichard.com/" },
  { slug: "bubble-down", url: "https://bubble-car-wash-app.pages.dev/" },
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
    } catch (e) { res.statusCode = 500; res.end(String(e)); }
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port })));
}

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });

for (const t of targets) {
  let server, url;
  try {
    if (t.dir) {
      if (!fs.existsSync(path.join(t.dir, "index.html"))) { console.log(`skip ${t.slug} (no index.html in ${t.dir})`); continue; }
      const s = await serve(t.dir); server = s.server; url = `http://127.0.0.1:${s.port}/`;
    } else {
      url = t.url;
    }
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
    await sleep(2500);
    await page.screenshot({ path: path.join(OUT, `${t.slug}.jpg`), type: "jpeg", quality: 74 });
    console.log(`captured ${t.slug}`);
  } catch (e) {
    console.log(`FAILED ${t.slug}: ${e}`);
  } finally {
    if (server) server.close();
  }
}

await browser.close();
console.log("Done. Review public/work, then commit + push.");
