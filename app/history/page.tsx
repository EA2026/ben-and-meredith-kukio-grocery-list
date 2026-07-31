"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { VisitRequest } from "@/lib/kv";
import { CATEGORY_ORDER } from "@/lib/masterList";

// Same accent cycle used on the main checklist and Usual List page.
const ACCENTS = [
  "bg-manifest-coral",
  "bg-manifest-lagoon",
  "bg-tropic-gold",
  "bg-tropic-plum",
  "bg-tropic-leaf",
  "bg-tropic-sky",
];

function formatVisitDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year) return iso;
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function HistoryPage() {
  const [requests, setRequests] = useState<VisitRequest[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadRequests() {
    setError(null);
    try {
      const res = await fetch("/api/requests");
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error ??
            "Couldn't reach the shared history. If this is the first time using the app, Neon may not be connected yet in Vercel — see the README's setup step."
        );
        return;
      }
      setRequests(data.requests ?? []);
    } catch {
      setError("Couldn't reach the shared history right now. Check your connection and try again.");
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function handleSeed() {
    setSeeding(true);
    setError(null);
    try {
      const res = await fetch("/api/requests/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error ??
            "Couldn't load the historical visits. Neon may not be connected yet — see the README's setup step."
        );
        return;
      }
      setRequests(data.requests ?? []);
    } catch {
      setError("Couldn't load the historical visits right now.");
    } finally {
      setSeeding(false);
    }
  }

  async function handleDelete(id: string, visitLabel: string) {
    if (!window.confirm(`Delete the visit for ${visitLabel}? This can't be undone.`)) return;
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/requests?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn't delete this visit right now.");
        return;
      }
      setRequests(data.requests ?? []);
    } catch {
      setError("Couldn't delete this visit right now.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen px-4 py-10 sm:py-14 bg-manifest-paper">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-manifest-lagoon mb-2">
              Ben &amp; Meredith · Kukio
            </p>
            <h1 className="inline-block bg-manifest-lagoon text-manifest-paper font-display text-3xl sm:text-4xl px-4 py-1 rounded">
              Past Visits
            </h1>
          </div>
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-wide border-2 border-manifest-ink px-4 py-2 hover:bg-manifest-ink hover:text-manifest-paper shrink-0 rounded-full"
          >
            ← Back to list
          </Link>
        </div>

        {error && (
          <div className="mb-6 border border-manifest-coral text-manifest-coral text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        {!error && requests === null && (
          <p className="font-mono text-xs text-manifest-inkSoft">loading…</p>
        )}

        {!error && requests !== null && requests.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-manifest-inkSoft">
              Nothing submitted yet. Once a request is sent from the checklist, it'll show up here
              for everyone.
            </p>
            <button
              type="button"
              onClick={handleSeed}
              disabled={seeding}
              className="font-mono text-xs uppercase tracking-wide border-2 border-manifest-ink px-4 py-2 hover:bg-manifest-ink hover:text-manifest-paper disabled:opacity-60 rounded-full"
            >
              {seeding ? "Loading…" : "Load past visits (12/31/24 & 5/26/25)"}
            </button>
          </div>
        )}

        {!error && requests !== null && requests.length > 0 && (
          <div className="space-y-4">
            {requests.map((req, reqIndex) => {
              const isOpen = openId === req.id;
              const badgeAccent = ACCENTS[reqIndex % ACCENTS.length];

              const byCategory = CATEGORY_ORDER.map((category) => ({
                category,
                items: req.items.filter((i) => i.category === category),
              })).filter((g) => g.items.length > 0);

              return (
                <div
                  key={req.id}
                  className="bg-white/60 border border-manifest-line rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : req.id)}
                      className="flex-1 flex items-center justify-between text-left gap-3"
                    >
                      <span
                        className={`ticket-tag ${badgeAccent} text-manifest-paper font-display text-lg sm:text-xl leading-none px-4 py-1.5`}
                      >
                        {formatVisitDate(req.visitDate)}
                      </span>
                      <span className="font-mono text-xs text-manifest-inkSoft shrink-0 text-right">
                        {req.submittedBy && (
                          <span className="block">by {req.submittedBy}</span>
                        )}
                        {req.items.length} item{req.items.length === 1 ? "" : "s"} {isOpen ? "▲" : "▼"}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(req.id, formatVisitDate(req.visitDate))}
                      disabled={deletingId === req.id}
                      aria-label={`Delete visit for ${formatVisitDate(req.visitDate)}`}
                      className="shrink-0 font-mono text-xs uppercase tracking-wide text-manifest-coral border border-manifest-coral/50 px-2.5 py-1.5 rounded-full hover:bg-manifest-coral hover:text-manifest-paper disabled:opacity-40"
                    >
                      {deletingId === req.id ? "…" : "✕"}
                    </button>
                  </div>

                  {isOpen && (
                    <div className="mt-4 grid sm:grid-cols-2 gap-4">
                      {byCategory.map(({ category, items: catItems }, catIndex) => (
                        <div key={category}>
                          <span
                            className={`inline-block ${ACCENTS[catIndex % ACCENTS.length]} text-manifest-paper font-mono text-[10px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded mb-1.5`}
                          >
                            {category}
                          </span>
                          <ul className="text-sm text-manifest-inkSoft space-y-0.5">
                            {catItems.map((item, idx) => (
                              <li key={idx}>
                                — {item.name}
                                {item.qty ? ` (${item.qty})` : ""}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {req.groceryNotes && (
                        <p className="sm:col-span-2 text-sm">
                          <span className="font-mono text-xs uppercase text-manifest-coral">
                            Trip request:{" "}
                          </span>
                          {req.groceryNotes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
