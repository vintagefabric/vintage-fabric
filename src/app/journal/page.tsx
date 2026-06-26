import type { Metadata } from "next";
import Link from "next/link";
import { getJournalPosts } from "@/lib/data";
import { buildMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Pill, Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = buildMetadata({
  title: "Journal",
  description:
    "Notes from Vintage Fabric on fabric care, trends and export guides for buyers of printed and foil fabrics.",
  path: "/journal",
  keywords: ["fabric blog", "fabric care", "fabric trends", "export guide"],
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function JournalPage() {
  const posts = await getJournalPosts();

  return (
    <>
      <div className="container-vf pt-8">
        <Breadcrumbs items={[{ name: "Journal", path: "/journal" }]} />
      </div>
      <Section className="!pt-8">
        <div className="container-vf">
          <SectionHeading
            eyebrow="Notes & guides"
            title="Journal"
            intro="Short reads on caring for fabrics, what's selling, and sourcing from India."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/journal/${post.slug}`}
                className="group flex flex-col rounded-xl border border-line bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
              >
                <time className="text-xs uppercase tracking-wide text-ink-soft">
                  {formatDate(post.publishedAt)}
                </time>
                <h2 className="mt-3 text-xl text-wine group-hover:text-gold-dark">{post.title}</h2>
                <p className="mt-2 flex-1 text-sm text-ink-soft">{post.excerpt}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.slice(0, 2).map((t) => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
