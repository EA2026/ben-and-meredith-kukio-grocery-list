"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { VisitRequest } from "@/lib/kv";

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

  async function loadRequests() {
    setError(null);
    try {
      const res = await fetch("/api/requests");
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error ??
            "Couldn't reach the shared history. If this is the first time using the app, the shared storage (Upstash Redis) may not be connected yet in Vercel — see the README's setup step."
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
            "Couldn't load the historical visits. The shared storage (Upstash Redis) may not be connected yet — see the README's setup step."
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

  return (
    <main className="min-h-screen px-4 py-10 sm:py-14 bg-manifest-paper">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-manifest-lagoon mb-2">
              Ben &amp; Meredith · Kukio
            </p>
            <h1 className="font-display text-3xl sm:text-4xl text-manifest-ink">Past Visits</h1>
          </div>
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-wide border-2 border-manifest-ink px-4 py-2 hover:bg-manifest-ink hover:text-manifest-paper shrink-0"
          >
            ← Back to list
          </Link>
        </div>

        {error && (
          <div className="mb-6 border border-manifest-coral text-manifest-coral text-sm p-3">
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
              className="font-mono text-xs uppercase tracking-wide border-2 border-manifest-ink px-4 py-2 hover:bg-manifest-ink hover:text-manifest-paper disabled:opacity-60"
            >
              {seeding ? "Loading…" : "Load past visits (12/31/24 & 5/26/25)"}
            </button>
          </div>
        )}

        {!error && requests !== null && requests.length > 0 && (
          <div className="space-y-1">
            {requests.map((req) => {
              const isOpen = openId === req.id;
              return (
                <div key={req.id} className="border-b border-manifest-line py-4">
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : req.id)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <span className="text-base font-medium">{formatVisitDate(req.visitDate)}</span>
                    <span className="font-mono text-xs text-manifest-inkSoft">
                      {req.items.length} item{req.items.length === 1 ? "" : "s"} {isOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-3 pl-1 text-sm space-y-3">
                      <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-0.5 text-manifest-inkSoft">
                        {req.items.map((item, idx) => (
                          <li key={idx}>
                            — {item.name}
                            {item.qty ? ` (${item.qty})` : ""}
                          </li>
                        ))}
                      </ul>
                      {req.groceryNotes && (
                        <p>
                          <span className="font-mono text-xs uppercase text-manifest-coral">
                            Trip request:{" "}
                          </span>
                          {req.groceryNotes}
                        </p>
                      )}
                      {req.amenityNotes && (
                        <p>
                          <span className="font-mono text-xs uppercase text-manifest-coral">
                            Amenities/issues:{" "}
                          </span>
                          {req.amenityNotes}
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
