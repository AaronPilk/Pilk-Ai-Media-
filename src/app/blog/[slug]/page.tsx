import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import { getCategory } from "@/content/blog/categories";
import { formatPostDate, getAllPosts, getPost, relatedPosts } from "@/lib/blog";
import { articleNode, breadcrumbNode, buildMetadata, faqNode, pageGraph } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.description,
    path: post.path,
    article: { published: post.published, modified: post.updated, author: site.entity.founder },
  });
}

const h2Style = { fontSize: "var(--text-xl)" };

export default async function BlogPostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const category = getCategory(post.category);
  const related = relatedPosts(post, 3);

  return (
    <>
      <JsonLd
        data={pageGraph(
          articleNode({
            path: post.path,
            headline: post.headline,
            description: post.description,
            published: post.published,
            modified: post.updated,
          }),
          breadcrumbNode([
            { name: "Blog", path: "/blog/" },
            { name: category.name, path: `/blog/#${category.id}` },
            { name: post.headline, path: post.path },
          ]),
          // The FAQ block is visible at the end of every post, word for word.
          faqNode(post.faqs.map((f) => ({ q: f.q, a: f.a })))
        )}
      />

      <article>
        <header className="relative z-10 pb-6 pt-[clamp(7rem,18vh,12rem)]">
          <Container>
            <div className="mx-auto max-w-3xl">
              <nav aria-label="Breadcrumb" className="text-sm text-muted">
                <Link href="/blog/" className="hover:text-ink">
                  Blog
                </Link>{" "}
                /{" "}
                <Link href={`/blog/#${category.id}`} className="hover:text-ink">
                  {category.name}
                </Link>
              </nav>
              <h1 className="mt-6 text-balance" style={{ fontSize: "var(--text-2xl)" }}>
                {post.headline}
              </h1>
              <p className="mt-6 text-sm text-muted">
                By {site.entity.founder}, founder of {site.entity.name} · Published{" "}
                <time dateTime={post.published}>{formatPostDate(post.published)}</time>
                {post.updated !== post.published ? (
                  <>
                    {" "}
                    · Checked and updated <time dateTime={post.updated}>{formatPostDate(post.updated)}</time>
                  </>
                ) : null}{" "}
                · {post.readingMinutes} min read
              </p>

              <div className="border-accent/40 mt-10 rounded-3xl border bg-[color:var(--accent-soft)] p-7 sm:p-8">
                <span className="eyebrow text-accent">The short answer</span>
                <p className="mt-4 text-lg leading-relaxed">{post.answer}</p>
              </div>

              {post.toc.length > 2 ? (
                <nav aria-label="On this page" className="mt-10 border-t border-line pt-6">
                  <span className="eyebrow">On this page</span>
                  <ol className="mt-4 flex flex-col gap-2 text-sm">
                    {post.toc.map((h) => (
                      <li key={h.id}>
                        <a href={`#${h.id}`} className="text-muted hover:text-ink">
                          {h.text}
                        </a>
                      </li>
                    ))}
                    {post.faqs.length ? (
                      <li>
                        <a href="#faq" className="text-muted hover:text-ink">
                          Frequently asked questions
                        </a>
                      </li>
                    ) : null}
                  </ol>
                </nav>
              ) : null}
            </div>
          </Container>
        </header>

        <div className="relative z-10 pb-10">
          <Container>
            <div className="blog-prose mx-auto max-w-3xl" dangerouslySetInnerHTML={{ __html: post.html }} />
          </Container>
        </div>

        {post.faqs.length ? (
          <section id="faq" className="section env-light relative z-10 scroll-mt-28">
            <Container>
              <div className="mx-auto max-w-3xl">
                <h2 className="text-balance" style={h2Style}>
                  Frequently asked questions
                </h2>
                <div className="mt-8 flex flex-col">
                  {post.faqs.map((f) => (
                    <div key={f.q} className="border-t border-[color:var(--line-on-light)] py-6">
                      <h3 className="text-lg font-medium">{f.q}</h3>
                      <div
                        className="blog-prose blog-prose--light mt-3"
                        dangerouslySetInnerHTML={{ __html: f.html }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          </section>
        ) : null}

        <section className="section relative z-10">
          <Container>
            <div className="mx-auto max-w-3xl rounded-3xl border border-line p-8 sm:p-10">
              <SectionLabel>Work with Pilk.ai</SectionLabel>
              <p className="mt-5 text-lg text-muted">
                Pilk.ai is a St. Petersburg, Florida studio that builds websites, apps, AI automations and lead
                systems for service businesses. Every project starts with a conversation and a written quote.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href="/contact/" variant="primary" withArrow>
                  Tell us about your project
                </Button>
                <Button href={category.money.href} variant="ghost">
                  {category.money.label}
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {related.length ? (
          <section className="relative z-10 pb-24">
            <Container>
              <div className="mx-auto max-w-3xl">
                <h2 className="text-balance" style={h2Style}>
                  Keep reading
                </h2>
                <ul className="mt-6 flex flex-col">
                  {related.map((r) => (
                    <li key={r.slug} className="border-t border-line py-5">
                      <Link href={r.path} className="text-lg hover:text-accent">
                        {r.headline}
                      </Link>
                      <p className="mt-2 text-sm text-muted">{r.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Container>
          </section>
        ) : null}
      </article>
    </>
  );
}
