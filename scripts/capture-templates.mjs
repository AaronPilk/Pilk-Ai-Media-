/**
 * Captures homepage screenshots of the template sites for card/detail thumbnails.
 *
 * Run on your Mac from the project root:
 *   npx playwright install chromium   (once)
 *   node scripts/capture-templates.mjs
 *   git add public/template-previews && git commit -m "Template thumbnails" && git push
 *
 * Screenshots are written to public/template-previews/<slug>/desktop.jpg
 */
import { chromium } from "@playwright/test";
import { setTimeout as sleep } from "node:timers/promises";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const PROJECT = process.cwd();
const TEMPLATES_DIR = path.join(PROJECT, "public", "template-previews");

const slugs = [
  "modern-agent",
  "signature-estate",
  "brokerage-command",
  "coastal-luxe",
  "urban-loft",
];

const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2",
  ".woff": "font/woff", ".ico": "image/x-icon",
};

function serve(dir) {
  const server = http.createServer((req, res) => {
    try {
      let p = decodeURIComponent((req.url || "/").split("?")[0]);
      if (p.endsWith("/")) p += "index.html";
      const fp = path.join(dir, p);
      if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
        res.statusCode = 404;
        res.end("not found");
        return;
      }
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

for (const slug of slugs) {
  const dir = path.join(TEMPLATES_DIR, slug);
  if (!fs.existsSync(path.join(dir, "index.html"))) {
    console.log(`SKIP ${slug} (no index.html)`);
    continue;
  }
  const { server, port } = await serve(dir);
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "load", timeout: 25000 }).catch(() => {});
    await sleep(2500);
    await page.screenshot({ path: path.join(dir, "desktop.jpg"), type: "jpeg", quality: 82 });
    await page.close();
    console.log(`OK   ${slug}`);
  } catch (e) {
    console.log(`FAIL ${slug}: ${e?.message ?? e}`);
  } finally {
    server.close();
  }
}

await browser.close();
console.log("done");
