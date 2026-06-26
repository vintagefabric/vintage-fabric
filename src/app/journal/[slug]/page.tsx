import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJournalPostBySlug, getJournalPosts } from "@/lib/data";
import { abs, buildMetadata } from "@/lib/site";
import { BRAND } from "@/lib/brand";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Pill, Section } from "@/components/ui";

type Params = { slug: string };

export async function generateStaticParams() {
  return (await getJournalPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return buildMetadata({
    title: post.seo?.title ?? post.title,
    description: post.seo?.description ?? post.excerpt,
    path: `/journal/${post.slug}`,
    keywords: post.seo?.keywords ?? post.tags,
  });
}

/** Minimal renderer for the seed body: paragraphs + **bold** lead-ins. */
function renderBody(body: string) {
  return body.split("\n\n").map((para, i) => {
    const html = para.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    return (
      <p
        key={i}
        className="mb-4 leading-relaxed text-ink-soft [&>strong]:text-ink"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  });
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    keywords: (post.seo?.keywords ?? post.tags).join(", "),
    author: { "@type": "Organization", name: BRAND.name },
    publisher: { "@type": "Organization", name: BRAND.name },
    mainEntityOfPage: abs(`/journal/${post.slug}`),
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <div className="container-vf pt-8">
        <Breadcrumbs
          items={[
            { name: "Journal", path: "/journal" },
            { name: post.title, path: `/journal/${post.slug}` },
          ]}
        />
      </div>
      <Section className="!pt-8">
        <article className="container-vf max-w-3xl">
          <time className="text-xs uppercase tracking-wide text-ink-soft">
            {new Date(post.publishedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          <h1 className="mt-3 text-4xl">{post.title}</h1>
          <div className="rule-gold mt-4" />
          <div className="mt-8">{renderBody(post.body)}</div>
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <Pill key={t}>{t}</Pill>
            ))}
          </div>
        </article>
      </Section>
    </>
  );
}
