import { getAllPosts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/metadata";
import { site } from "@/content/site";

export const dynamic = "force-static";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** RSS 2.0 feed of live posts, for feed readers and anything that watches for new pages. */
export function GET() {
  const posts = getAllPosts().slice(0, 50);
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.headline)}</title>
      <link>${absoluteUrl(p.path)}</link>
      <guid isPermaLink="true">${absoluteUrl(p.path)}</guid>
      <pubDate>${new Date(`${p.published}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(p.description)}</description>
    </item>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.entity.name)} blog</title>
    <link>${absoluteUrl("/blog/")}</link>
    <atom:link href="${absoluteUrl("/blog/feed.xml")}" rel="self" type="application/rss+xml" />
    <description>Straight answers on websites, AI, automation and lead generation for small businesses.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
