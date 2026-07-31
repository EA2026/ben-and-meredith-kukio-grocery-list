"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GroceryItem, CATEGORY_ORDER } from "@/lib/masterList";

// Same accent cycle used on the main checklist, so categories look the same
// wherever they show up.
const ACCENTS = [
  "bg-manifest-coral",
  "bg-manifest-lagoon",
  "bg-tropic-gold",
  "bg-tropic-plum",
  "bg-tropic-leaf",
  "bg-tropic-sky",
];

export default function FavoritesPage() {
  const [items, setItems] = useState<GroceryItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  async function loadCatalog() {
    setError(null);
    try {
      const res = await fetch("/api/catalog");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn't load the shared list right now.");
        return;
      }
      setItems(data.catalog ?? []);
    } catch {
      setError("Couldn't reach the shared list right now. Check your connection and try again.");
    }
  }

  useEffect(() => {
    loadCatalog();
  }, []);

  async function toggleItem(id: string, makeStanding: boolean) {
    if (!items) return;
    setSaving(id);
    const newStatus: GroceryItem["status"] = makeStanding ? "standing" : "candidate";
    const next = items.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setItems(next);
    try {
      await fetch("/api/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ catalog: next }),
      });
    } catch {
      setError("Changed on this device, but couldn't sync to the shared list. Try again shortly.");
    } finally {
      setSaving(null);
    }
  }

  const standingItems = items?.filter((i) => i.status === "standing") ?? [];

  return (
    <main className="min-h-screen px-4 py-10 sm:py-14 bg-manifest-paper">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-manifest-lagoon mb-2">
              Ben &amp; Meredith · Kukio
            </p>
            <h1 className="inline-block bg-tropic-gold text-manifest-paper font-display text-3xl sm:text-4xl px-4 py-1 rounded">
              Usual List
            </h1>
          </div>
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-wide border-2 border-manifest-ink px-4 py-2 hover:bg-manifest-ink hover:text-manifest-paper shrink-0 rounded-full"
          >
            ← Back to list
          </Link>
        </div>
        <p className="text-sm text-manifest-inkSoft mb-8">
          Everything marked <span className="text-tropic-gold">★</span> — these get pre-checked
          every time you start a new list. Tap the star to remove something from here.
        </p>

        {error && (
          <div className="mb-6 border border-manifest-coral text-manifest-coral text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        {!error && items === null && (
          <p className="font-mono text-xs text-manifest-inkSoft">loading…</p>
        )}

        {!error && items !== null && standingItems.length === 0 && (
          <p className="text-sm text-manifest-inkSoft">
            Nothing starred yet. Star items from the main list to build your usual list here.
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          {!error &&
            items !== null &&
            standingItems.length > 0 &&
            CATEGORY_ORDER.map((category, index) => {
              const catItems = standingItems.filter((i) => i.category === category);
              if (catItems.length === 0) return null;
              const accentBg = ACCENTS[index % ACCENTS.length];
              return (
                <section
                  key={category}
                  className="bg-white/60 border border-manifest-line rounded-xl p-4 h-fit"
                >
                  <span
                    className={`inline-block ${accentBg} text-manifest-paper font-mono text-xs font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded mb-3`}
                  >
                    {category}
                  </span>
                  <ul className="space-y-1.5">
                    {catItems.map((item) => (
                      <li key={item.id} className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleItem(item.id, false)}
                          disabled={saving === item.id}
                          aria-label={`Remove ${item.name} from usual list`}
                          className="shrink-0 text-lg leading-none text-tropic-gold hover:opacity-60 disabled:opacity-40"
                        >
                          ★
                        </button>
                        <span className="text-sm text-manifest-ink">
                          {item.name}
                          {item.defaultQty ? ` (${item.defaultQty})` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
        </div>
      </div>
    </main>
  );
}
