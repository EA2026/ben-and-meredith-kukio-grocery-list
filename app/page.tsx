"use client";

import { useState } from "react";
import Link from "next/link";
import { useManifestState } from "@/lib/useManifestState";
import { CATEGORY_ORDER } from "@/lib/masterList";
import CategorySection from "@/components/CategorySection";
import ExportPanel from "@/components/ExportPanel";

export default function Home() {
  const {
    state,
    catalogError,
    submitting,
    toggleChecked,
    setQuantity,
    setTripNotes,
    setVisitDate,
    addItem,
    promoteToStanding,
    removeItem,
    resetTrip,
    submitRequest,
  } = useManifestState();

  const [showExport, setShowExport] = useState(false);

  if (!state) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-sm text-manifest-inkSoft">loading list…</p>
      </main>
    );
  }

  const checkedTotal = Object.values(state.checked).filter(Boolean).length;

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="horizon-hero px-4 pt-16 pb-24 sm:pt-24 sm:pb-32">
        {/* Bloom — the signature graphic: layered abstract petals, not literal clip-art */}
        <svg
          className="absolute pointer-events-none"
          style={{ width: 260, height: 260, top: "-40px", right: "-60px" }}
          viewBox="0 0 260 260"
          aria-hidden="true"
        >
          <circle className="bloom-petal" cx="150" cy="90" r="70" fill="#F4B740" />
          <circle className="bloom-petal" cx="90" cy="150" r="60" fill="#FF6F4C" />
          <circle className="bloom-petal" cx="170" cy="170" r="55" fill="#FBD988" />
          <circle className="bloom-petal" cx="130" cy="130" r="40" fill="#FBF6EC" />
        </svg>

        <div className="mx-auto max-w-2xl relative">
          <div className="flex items-start justify-between gap-4">
            <p className="hero-eyebrow font-mono text-[11px] uppercase text-horizon-goldSoft/90 mb-5">
              Kukio, Hawaii
            </p>
            <Link
              href="/history"
              className="font-mono text-[11px] uppercase tracking-widest text-horizon-cream border-2 border-horizon-cream/50 px-3 py-1.5 hover:bg-horizon-cream/15 shrink-0 rounded-full"
            >
              Past visits
            </Link>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl leading-[0.92] text-horizon-cream drop-shadow-sm">
            Ben &amp; Meredith&apos;s
            <br />
            <span className="text-horizon-goldSoft">Grocery List</span>
          </h1>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-horizon-cream/90">
            The house, stocked before you walk in. Check what you want this
            trip — your usual picks (
            <span className="text-horizon-goldSoft font-semibold">★</span>) are already
            checked. Uncheck anything you don&apos;t need, add anything new.
          </p>

          <label className="mt-6 block max-w-[220px]">
            <span className="block font-mono text-[11px] uppercase tracking-widest text-horizon-cream/80 mb-1">
              Visit date
            </span>
            <input
              type="date"
              value={state.visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="w-full bg-manifest-ink/30 border-2 border-horizon-cream/40 rounded-lg text-horizon-cream text-sm px-3 py-2 focus:border-horizon-goldSoft"
            />
          </label>
        </div>

        {/* Horizon wave divider into the paper body */}
        <svg
          className="horizon-wave"
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M0,40 C240,90 480,0 720,30 C960,60 1200,10 1440,45 L1440,90 L0,90 Z"
            fill="#FBF6EC"
          />
        </svg>
      </section>

      {/* Checklist body */}
      <div className="px-4 pt-10 pb-14">
        <div className="mx-auto max-w-2xl">
          {catalogError && (
            <p className="mb-6 text-xs text-manifest-coral font-mono">{catalogError}</p>
          )}

          <div className="flex items-baseline justify-end mb-8">
            <p className="font-mono text-xs text-manifest-inkSoft">
              <span className="text-manifest-coral">★</span> = usual pick
            </p>
          </div>

          {/* Category sections */}
          {CATEGORY_ORDER.map((category, index) => {
            const catItems = state.items.filter((i) => i.category === category);
            if (catItems.length === 0) return null;
            return (
              <CategorySection
                key={category}
                category={category}
                colorIndex={index}
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
          <section className="mb-8">
            <div className="flex items-baseline justify-between border-b-2 border-manifest-ink/80 pb-1.5 mb-3">
              <h2 className="font-mono text-sm tracking-[0.2em] uppercase">Trip-Specific Requests</h2>
            </div>
            <textarea
              value={state.tripNotes}
              onChange={(e) => setTripNotes(e.target.value)}
              placeholder="Anything one-off for this visit only — a special occasion, a guest's request, etc."
              rows={3}
              className="w-full bg-white/50 border-2 border-manifest-line rounded-lg text-sm p-3 resize-none placeholder:text-manifest-inkSoft/50 focus:border-manifest-lagoon"
            />
          </section>

          {/* Actions */}
          <footer className="sticky bottom-4 flex flex-wrap items-center gap-3 bg-manifest-paper/95 backdrop-blur-sm border-2 border-manifest-ink rounded-2xl px-4 py-3 shadow-[4px_4px_0_0_rgba(18,38,31,0.9)]">
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
              className="font-mono text-xs uppercase tracking-wide bg-manifest-coral text-manifest-paper rounded-full px-5 py-2.5 hover:opacity-90"
            >
              Generate list →
            </button>
          </footer>
        </div>
      </div>

      {showExport && (
        <ExportPanel
          items={state.items}
          checked={state.checked}
          quantities={state.quantities}
          tripNotes={state.tripNotes}
          visitDate={state.visitDate}
          submitting={submitting}
          onSubmit={submitRequest}
          onClose={() => setShowExport(false)}
        />
      )}
    </main>
  );
}
