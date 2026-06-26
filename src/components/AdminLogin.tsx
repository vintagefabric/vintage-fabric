"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogin() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: fd.get("password") }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.ok) {
      router.refresh();
    } else {
      setError(json.error || "Login failed.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm rounded-2xl border border-ink/10 bg-white p-8 shadow-card">
      <h1 className="text-2xl">Admin</h1>
      <div className="rule-gold mt-3" />
      <p className="mt-4 text-sm text-ink-soft">Enter the admin password to view leads.</p>
      <label className="mt-6 block text-sm">
        <span className="font-medium text-ink">Password</span>
        <input
          name="password"
          type="password"
          required
          autoFocus
          className="mt-1 w-full rounded-lg border border-ink/20 px-3 py-2.5 focus:border-wine focus:outline-none focus:ring-1 focus:ring-wine"
        />
      </label>
      {status === "error" && <p className="mt-3 text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={status === "loading"} className="btn-primary mt-6 w-full">
        {status === "loading" ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
