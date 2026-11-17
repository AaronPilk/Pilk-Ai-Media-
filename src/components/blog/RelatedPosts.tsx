import Link from "next/link";
import type { BlogCategoryId } from "@/content/blog/categories";
import { postsInCategory } from "@/lib/blog";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * "From the blog" block for a money page: lists the live posts that support it,
 * so every post has a link in from the page it serves. Renders nothing when a
 * topic has no live posts yet.
 */
export function RelatedPosts({
  categories,
  heading = "Questions we get about this",
  limit = 6,
  className = "section relative z-10",
}: {
  categories: BlogCategoryId[];
  heading?: string;
  limit?: number;
  className?: string;
}) {
  const posts = postsInCategory(categories, limit);
  if (!posts.length) return null;
  return (
    <section className={className}>
      <Container>
        <SectionLabel>From the blog</SectionLabel>
        <h2 className="mt-6 text-balance" style={{ fontSize: "var(--text-xl)" }}>
          {heading}
        </h2>
        <ul className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-2">
          {posts.map((p) => (
            <li key={p.slug} className="border-t border-line pt-5">
              <Link href={p.path} className="text-lg leading-snug hover:text-accent">
                {p.headline}
              </Link>
              <p className="mt-2 text-sm text-muted">{p.description}</p>
            </li>
          ))}
        </ul>
        <Link href="/blog/" className="mt-8 inline-block text-sm text-accent underline underline-offset-2">
          All articles
        </Link>
      </Container>
    </section>
  );
}
