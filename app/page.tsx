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
    setAmenityNotes,
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
        <div
          className="horizon-glow"
          style={{ width: 140, height: 140, top: "18%", left: "50%", transform: "translateX(-50%)" }}
          aria-hidden="true"
        />
        <div className="mx-auto max-w-2xl relative">
          <div className="flex items-start justify-between gap-4">
            <p className="hero-eyebrow font-mono text-[11px] uppercase text-horizon-goldSoft/80 mb-5">
              Kukio, Hawaii
            </p>
            <Link
              href="/history"
              className="font-mono text-[11px] uppercase tracking-widest text-horizon-cream/80 border border-horizon-cream/30 px-3 py-1.5 hover:bg-horizon-cream/10 shrink-0"
            >
              Past visits
            </Link>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl leading-[0.95] text-horizon-cream">
            Ben &amp; Meredith&apos;s
            <br />
            Grocery List
          </h1>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-horizon-cream/70">
            The house, stocked before you walk in. Check what you want this
            trip — your usual picks (
            <span className="text-horizon-gold">★</span>) are already
            checked. Uncheck anything you don&apos;t need, add anything new.
          </p>

          <label className="mt-6 block max-w-[220px]">
            <span className="block font-mono text-[11px] uppercase tracking-widest text-horizon-cream/60 mb-1">
              Visit date
            </span>
            <input
              type="date"
              value={state.visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="w-full bg-horizon-deep2 border border-horizon-cream/30 text-horizon-cream text-sm px-2 py-1.5 focus:border-horizon-gold"
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
            fill="#EFE8D8"
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
          <section className="mb-8">
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

          {/* Amenities / maintenance requests */}
          <section className="mb-10">
            <div className="flex items-baseline justify-between border-b-2 border-manifest-ink/80 pb-1.5 mb-3">
              <h2 className="font-mono text-sm tracking-[0.2em] uppercase">Amenities &amp; Maintenance</h2>
            </div>
            <textarea
              value={state.amenityNotes}
              onChange={(e) => setAmenityNotes(e.target.value)}
              placeholder="Anything that needs attention before you arrive — AC, pool, a broken fixture, etc."
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
      </div>

      {showExport && (
        <ExportPanel
          items={state.items}
          checked={state.checked}
          quantities={state.quantities}
          tripNotes={state.tripNotes}
          amenityNotes={state.amenityNotes}
          visitDate={state.visitDate}
          submitting={submitting}
          onSubmit={submitRequest}
          onClose={() => setShowExport(false)}
        />
      )}
    </main>
  );
}
