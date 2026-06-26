import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LogoMark } from "@/components/Logo";
import { Section, SectionHeading } from "@/components/ui";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { BRAND, PHONES } from "@/lib/brand";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Vintage Fabric, Mfg. of Quality Fabrics, based in New Cloth Market, Ahmedabad. Our story, our craft and our commitment to quality.",
  path: "/about",
  keywords: ["about Vintage Fabric", "fabric manufacturer Ahmedabad", "quality fabrics India"],
});

export default function AboutPage() {
  return (
    <>
      <div className="container-vf pt-8">
        <Breadcrumbs items={[{ name: "About", path: "/about" }]} />
      </div>

      <Section className="!pt-8">
        <div className="container-vf grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <SectionHeading eyebrow="Our story" title="Mfg. of Quality Fabrics" />
            <div className="mt-6 space-y-4 text-ink-soft">
              <p>
                Vintage Fabric works out of New Cloth Market in Raipur, Ahmedabad,
                one of the busiest cloth markets in the country. It is a fast,
                crowded place where buyers still judge a fabric by touch, and a roll
                either earns a reorder or it does not. That is the bar we make to,
                lot after lot.
              </p>
              <p>
                The company was started in 2020 by two brothers, Abhishek and
                Aditya. They did not come to this as outsiders. Their family has been
                in the textile trade for years, so they grew up around fabric, prints
                and the everyday rhythm of the market. Building their own label felt
                less like a leap and more like a natural next step, done their own
                way.
              </p>
              <p>
                We manufacture printed and foil fabrics for ladies' ethnic wear, the
                cloth that goes on to become kurtis, dresses, co-ord sets and
                three-piece suits. Most of our range runs on 100% cotton bases such
                as cambric and dhabhu, in 56 and 58 inch widths, finished with
                procian prints, foil and discharge work.
              </p>
              <p>
                We prefer to design in series rather than scatter one-off prints.
                UNIVERSE, SOULITAIRE, INDRIYA and SUNSHINE each carry their own mood,
                from soft florals to deep foil discharge. For a retailer that means a
                shelf that hangs together, and an easier story to tell the customer
                standing in front of them.
              </p>
              <p>
                Most of what we worry about is the unglamorous part. A width that
                holds true from the start of the roll to the end. Colour that comes
                through a wash the way it should. A hand that still sits right once
                the tailor is done. That is what "Mfg. of Quality Fabrics" has to
                mean if it is going to mean anything at all.
              </p>
              <p>
                Our fabric reaches wholesalers, retailers and exporters across India
                and well beyond it. If you are putting together a range for your
                market, send us a note or message us on WhatsApp. We will tell you
                honestly what is running, what is available in the widths you need,
                and what we can make to order.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/collections" className="btn-primary">
                Explore collections
              </Link>
              <WhatsAppButton />
            </div>
          </div>

          <div className="flex justify-center">
            <LogoMark size={300} className="h-auto w-[200px] sm:w-[260px] lg:w-[300px]" />
          </div>
        </div>
      </Section>

      {/* Founders' quote */}
      <section className="bg-wine text-ivory">
        <div className="container-vf py-8 text-center">
          <span className="font-display text-5xl leading-none text-gold">&ldquo;</span>
          <p className="mx-auto -mt-3 max-w-2xl font-display text-2xl italic leading-relaxed text-ivory sm:text-3xl">
            We would rather be known for the fabric a buyer orders again than the
            one that only looked good in a photo.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.25em] text-gold">
            Abhishek &amp; Aditya, Founders
          </p>
        </div>
      </section>

      {/* How we work */}
      <Section>
        <div className="container-vf">
          <div className="max-w-3xl">
            <SectionHeading eyebrow="How we work" title="From base cloth to finished roll" />
            <div className="mt-6 space-y-4 text-ink-soft">
            <p>
              It starts with the base. We choose cotton that takes a print cleanly
              and feels right in the hand, because no amount of finishing rescues a
              poor base cloth.
            </p>
            <p>
              Then the print. Our procian prints are matched to the design and to the
              base it sits on, and our foil and discharge work is where a lot of the
              character comes from. Those finishes look their best when they are not
              rushed, so we do not rush them.
            </p>
            <p>
              Before anything leaves us, it is checked for width and finish. A 58
              inch fabric should measure 58 inches, this lot and the next. That kind
              of consistency is quiet and easy to overlook, but it is usually the
              reason a buyer comes back the second time.
            </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section className="bg-cream-dark !py-10">
        <div className="container-vf grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              t: "Quality first",
              d: "We would rather hold a roll back than ship one we are unsure of. Honest cotton, true widths and finishes that survive a wash come before everything else.",
            },
            {
              t: "Designed in series",
              d: "Our prints arrive as collections, not stray one-offs. UNIVERSE, SOULITAIRE, INDRIYA and SUNSHINE each have a mood, so a retailer can build a shelf that hangs together.",
            },
            {
              t: "Real cotton bases",
              d: "Cambric, dhabhu and other 100% cotton grounds, chosen because they take a print cleanly and still feel right in the hand long after the garment is stitched.",
            },
            {
              t: "Finishing done right",
              d: "Procian prints, foil and discharge work, given the patience these finishes need so the colour and shine hold up both on the shelf and on the body.",
            },
            {
              t: "Made for export",
              d: "Clear specifications, dependable widths and steady supply, so buyers shipping abroad know exactly what they are getting, this lot and the next.",
            },
            {
              t: "Built on reorders",
              d: "Most of our business is repeat business. We treat the second order as the real test of a fabric, and we work to earn it every single time.",
            },
          ].map((v) => (
            <div key={v.t} className="rounded-xl border border-line bg-white p-6 shadow-card">
              <h3 className="text-xl">{v.t}</h3>
              <div className="rule-gold mt-3" />
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{v.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Business details */}
      <Section className="!pt-8 !pb-10">
        <div className="container-vf">
          <div className="rounded-2xl border border-gold/25 bg-white p-8 shadow-card">
            <h3 className="text-2xl">Business details</h3>
            <div className="rule-gold mt-3" />
            <dl className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-soft">Registered name</dt>
                <dd className="mt-1 text-ink">VINTAGE FABRIC</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-soft">GSTIN</dt>
                <dd className="mt-1 text-ink">{BRAND.gstin}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-soft">Sales</dt>
                <dd className="mt-1 text-ink">
                  {PHONES.sales.map((p) => (
                    <a key={p} href={`tel:${p.replace(/[^+\d]/g, "")}`} className="block hover:text-wine">
                      {p}
                    </a>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-soft">Accounts / Office</dt>
                <dd className="mt-1 text-ink">
                  <a
                    href={`tel:${PHONES.accounts.replace(/[^+\d]/g, "")}`}
                    className="block hover:text-wine"
                  >
                    {PHONES.accounts}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-soft">Address</dt>
                <dd className="mt-1 text-ink">{BRAND.address.full}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-soft">Email & web</dt>
                <dd className="mt-1 text-ink">
                  {BRAND.email}
                  <br />
                  {BRAND.website}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>
    </>
  );
}
