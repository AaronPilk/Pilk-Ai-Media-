import type { Metadata } from "next";
import Link from "next/link";
import { blogCategories } from "@/content/blog/categories";
import { getAllPosts, formatPostDate } from "@/lib/blog";
import { breadcrumbNode, buildMetadata, pageGraph } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = buildMetadata({
  title: "Blog: Websites, AI and Lead Generation for Small Businesses",
  description:
    "Straight answers from Pilk.ai on website costs, real estate and mortgage sites, AI tools, automation, GoHighLevel, Meta ads and getting found in search.",
  path: "/blog/",
});

const h2Style = { fontSize: "var(--text-xl)" };

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const latest = posts.slice(0, 6);
  const groups = blogCategories
    .map((c) => ({ category: c, posts: posts.filter((p) => p.category === c.id) }))
    .filter((g) => g.posts.length);

  return (
    <>
      <JsonLd data={pageGraph(breadcrumbNode([{ name: "Blog", path: "/blog/" }]))} />
      <PageIntro
        eyebrow="The Pilk.ai blog"
        title="Straight answers for small business owners."
        sub="What websites, apps, AI and ads really cost, how long they take and what to watch out for, written by Aaron Pilkington from the projects we build in St. Petersburg, Florida."
      />

      {latest.length ? (
        <section className="relative z-10 pb-16">
          <Container>
            <h2 className="text-balance" style={h2Style}>
              Latest
            </h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latest.map((p) => (
                <li key={p.slug} className="flex flex-col rounded-3xl border border-line p-6">
                  <span className="eyebrow">{blogCategories.find((c) => c.id === p.category)?.name}</span>
                  <Link href={p.path} className="mt-4 text-lg leading-snug hover:text-accent">
                    {p.headline}
                  </Link>
                  <p className="mt-3 flex-1 text-sm text-muted">{p.description}</p>
                  <time dateTime={p.published} className="mt-4 text-xs text-muted">
                    {formatPostDate(p.published)}
                  </time>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <section className="section env-light relative z-10">
        <Container>
          <h2 className="text-balance" style={h2Style}>
            Browse by topic
          </h2>
          <nav aria-label="Topics" className="mt-6 flex flex-wrap gap-3 text-sm">
            {groups.map(({ category }) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="rounded-full border border-[color:var(--line-on-light)] px-4 py-2 hover:border-current"
              >
                {category.name}
              </a>
            ))}
          </nav>

          <div className="mt-12 flex flex-col gap-14">
            {groups.map(({ category, posts: list }) => (
              <section key={category.id} id={category.id} className="scroll-mt-28">
                <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[color:var(--line-on-light)] pb-4">
                  <h3 className="text-2xl">{category.name}</h3>
                  <Link href={category.money.href} className="text-sm underline underline-offset-2">
                    {category.money.label}
                  </Link>
                </div>
                <p className="mt-3 max-w-2xl text-sm text-[color:var(--text-on-light-muted)]">{category.blurb}</p>
                <ul className="mt-6 grid gap-x-10 gap-y-5 md:grid-cols-2">
                  {list.map((p) => (
                    <li key={p.slug}>
                      <Link href={p.path} className="font-medium hover:underline">
                        {p.headline}
                      </Link>
                      <p className="mt-1 text-sm text-[color:var(--text-on-light-muted)]">{p.description}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
