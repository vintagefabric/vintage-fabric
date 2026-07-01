"use client";

import { useState } from "react";
import Link from "next/link";
import { WhatsAppIcon } from "./icons";

type LeadType = "inquiry" | "catalog";

const inputClass =
  "mt-1 w-full rounded-lg border border-ink/20 bg-white px-3 py-2.5 text-ink " +
  "shadow-sm focus:border-wine focus:outline-none focus:ring-1 focus:ring-wine";

/**
 * Shared lead form for both the inquiry page and the catalog-download page.
 * Posts to /api/leads and shows a thank-you state with a WhatsApp deep link
 * (and, for catalogs, a download link).
 */
export function LeadForm({
  type,
  refSlug,
  catalogUrl,
}: {
  type: LeadType;
  refSlug?: string;
  catalogUrl?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [whatsapp, setWhatsapp] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    payload.type = type;
    if (refSlug) payload.ref = refSlug;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Something went wrong. Please try again.");
      }
      setWhatsapp(json.whatsapp ?? null);
      setStatus("done");
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-gold/40 bg-white p-8 text-center shadow-card">
        <h2 className="text-3xl">Thank you!</h2>
        <div className="rule-gold mx-auto mt-4" />
        <p className="mt-5 text-ink-soft">
          {type === "catalog"
            ? "Your catalogue is ready below. We've also noted your details and will be in touch."
            : "We've received your inquiry and will get back to you shortly."}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {type === "catalog" && catalogUrl && (
            <a href={catalogUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Download catalogue
            </a>
          )}
          {whatsapp && (
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn-gold">
              <WhatsAppIcon />
              Continue on WhatsApp
            </a>
          )}
          <Link href="/collections" className="btn-outline">
            Keep browsing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card sm:p-8">
      {/* Honeypot (hidden from users) */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-ink">Name *</span>
          <input name="name" required className={inputClass} placeholder="Your name" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Company</span>
          <input name="company" className={inputClass} placeholder="Business / store name" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Email *</span>
          <input name="email" type="email" required className={inputClass} placeholder="you@company.com" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Phone</span>
          <input name="phone" className={inputClass} placeholder="+country code …" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Country</span>
          <input name="country" className={inputClass} placeholder="Where are you based?" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Interested in</span>
          <input
            name="interest"
            defaultValue={refSlug ?? ""}
            className={inputClass}
            placeholder="Series, category or design no."
          />
        </label>
      </div>

      <label className="mt-5 block text-sm">
        <span className="font-medium text-ink">Message</span>
        <textarea
          name="message"
          rows={4}
          className={inputClass}
          placeholder={
            type === "catalog"
              ? "Any specific qualities or quantities you're after?"
              : "Tell us what you're looking for, quantities, target market…"
          }
        />
      </label>

      {status === "error" && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</p>
      )}

      <button type="submit" disabled={status === "loading"} className="btn-primary mt-6 w-full sm:w-auto">
        {status === "loading"
          ? "Sending…"
          : type === "catalog"
            ? "Get the catalogue"
            : "Send inquiry"}
      </button>
      <p className="mt-3 text-xs text-ink-soft">
        We only use your details to respond to your request. See our{" "}
        <Link href="/legal/privacy" className="underline hover:text-wine">privacy policy</Link>.
      </p>
    </form>
  );
}
