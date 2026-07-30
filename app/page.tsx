"use client";

import { useState } from "react";
import { useManifestState } from "@/lib/useManifestState";
import { CATEGORY_ORDER } from "@/lib/masterList";
import CategorySection from "@/components/CategorySection";
import ExportPanel from "@/components/ExportPanel";

export default function Home() {
  const {
    state,
    toggleChecked,
    setQuantity,
    setTripNotes,
    addItem,
    promoteToStanding,
    removeItem,
    resetTrip,
  } = useManifestState();

  const [showExport, setShowExport] = useState(false);

  if (!state) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-sm text-manifest-inkSoft">loading manifest…</p>
      </main>
    );
  }

  const checkedTotal = Object.values(state.checked).filter(Boolean).length;

  return (
    <main className="min-h-screen px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header className="mb-10 relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-manifest-lagoon mb-2">
                Ben &amp; Meredith White · Hawaii
              </p>
              <h1 className="font-mono text-3xl sm:text-4xl font-bold tracking-tight leading-none">
                Kukio Provisioning
                <br />
                Manifest
              </h1>
              <p className="mt-3 text-sm text-manifest-inkSoft max-w-sm">
                Check what you want this trip. Standing items (
                <span className="text-manifest-coral">★</span>) are pre-checked from past visits —
                just uncheck anything you don't need and add anything new.
              </p>
            </div>
            <div className="stamp shrink-0 hidden sm:flex flex-col items-center justify-center h-20 w-20 rounded-full border-2 border-manifest-coral text-manifest-coral font-mono text-[10px] uppercase tracking-widest text-center leading-tight">
              Provision
              <br />
              Before
              <br />
              Departure
            </div>
          </div>
        </header>

        {/* Category sections */}
        {CATEGORY_ORDER.map((category) => {
          const catItems = state.items.filter((i) => i.category === category);
          if (catItems.length === 0) return null;
          return (
            <CategorySection
              key={category}
              category={category}
              items={catItems}
              checked={state.checked}
              quantities={state.quantities}
              onToggle={toggleChecked}
              onQtyChange={setQuantity}
              onAddItem={addItem}
              onPromote={promoteToStanding}
              onRemove={removeItem}
            />
          );
        })}

        {/* Trip-specific requests */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between border-b-2 border-manifest-ink/80 pb-1.5 mb-3">
            <h2 className="font-mono text-sm tracking-[0.2em] uppercase">Trip-Specific Requests</h2>
          </div>
          <textarea
            value={state.tripNotes}
            onChange={(e) => setTripNotes(e.target.value)}
            placeholder="Anything one-off for this visit only — a special occasion, a guest's request, etc."
            rows={3}
            className="w-full bg-white/40 border border-manifest-line text-sm p-3 resize-none placeholder:text-manifest-inkSoft/50 focus:border-manifest-lagoon"
          />
        </section>

        {/* Actions */}
        <footer className="sticky bottom-4 flex flex-wrap items-center gap-3 bg-manifest-paper/95 backdrop-blur-sm border-2 border-manifest-ink px-4 py-3 shadow-[4px_4px_0_0_rgba(34,48,63,0.9)]">
          <span className="font-mono text-xs text-manifest-inkSoft tabular-nums mr-auto">
            {checkedTotal} item{checkedTotal === 1 ? "" : "s"} checked
          </span>
          <button
            type="button"
            onClick={resetTrip}
            className="font-mono text-xs uppercase tracking-wide text-manifest-inkSoft hover:text-manifest-ink px-2 py-2"
          >
            Reset to defaults
          </button>
          <button
            type="button"
            onClick={() => setShowExport(true)}
            className="font-mono text-xs uppercase tracking-wide bg-manifest-ink text-manifest-paper px-5 py-2 hover:bg-manifest-inkSoft"
          >
            Generate list →
          </button>
        </footer>
      </div>

      {showExport && (
        <ExportPanel
          items={state.items}
          checked={state.checked}
          quantities={state.quantities}
          tripNotes={state.tripNotes}
          onClose={() => setShowExport(false)}
        />
      )}
    </main>
  );
}
