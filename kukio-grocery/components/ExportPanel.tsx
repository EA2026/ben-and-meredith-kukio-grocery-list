"use client";

import { useMemo, useState } from "react";
import { GroceryItem, CATEGORY_ORDER } from "@/lib/masterList";

interface Props {
  items: GroceryItem[];
  checked: Record<string, boolean>;
  quantities: Record<string, string>;
  tripNotes: string;
  amenityNotes: string;
  visitDate: string;
  submitting: boolean;
  onSubmit: () => Promise<{ ok: boolean; error?: string }>;
  onClose: () => void;
}

function formatVisitDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year) return iso;
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ExportPanel({
  items,
  checked,
  quantities,
  tripNotes,
  amenityNotes,
  visitDate,
  submitting,
  onSubmit,
  onClose,
}: Props) {
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const [submitState, setSubmitState] = useState<"idle" | "saved" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const listText = useMemo(() => {
    const lines: string[] = [];
    lines.push("BEN & MEREDITH — GROCERY LIST REQUEST");
    lines.push(`Visit: ${formatVisitDate(visitDate)}`);
    lines.push("");

    CATEGORY_ORDER.forEach((category) => {
      const catItems = items.filter((i) => i.category === category && checked[i.id]);
      if (catItems.length === 0) return;
      lines.push(category.toUpperCase());
      catItems.forEach((item) => {
        const qty = quantities[item.id];
        lines.push(`  - ${item.name}${qty ? ` (${qty})` : ""}`);
      });
      lines.push("");
    });

    if (tripNotes.trim()) {
      lines.push("TRIP-SPECIFIC REQUESTS");
      lines.push(`  ${tripNotes.trim()}`);
      lines.push("");
    }

    if (amenityNotes.trim()) {
      lines.push("AMENITIES / MAINTENANCE ISSUES");
      lines.push(`  ${amenityNotes.trim()}`);
      lines.push("");
    }

    return lines.join("\n").trim();
  }, [items, checked, quantities, tripNotes, amenityNotes, visitDate]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(listText);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      // Clipboard API unavailable — the textarea below is selectable manually
    }
  }

  function handlePrint() {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Ben & Meredith's Grocery List</title>
          <style>
            body { font-family: ui-monospace, Menlo, Consolas, monospace; white-space: pre-wrap; padding: 40px; font-size: 14px; line-height: 1.6; color: #22303F; }
          </style>
        </head>
        <body>${listText.replace(/</g, "&lt;")}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  }

  async function handleSubmit() {
    setSubmitError(null);
    const result = await onSubmit();
    if (result.ok) {
      setSubmitState("saved");
    } else {
      setSubmitState("error");
      setSubmitError(result.error ?? "Something went wrong.");
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shareable grocery list"
      className="fixed inset-0 z-50 flex items-center justify-center bg-manifest-ink/40 backdrop-blur-[2px] p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-manifest-paper border-2 border-manifest-ink shadow-[6px_6px_0_0_rgba(34,48,63,0.9)] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-mono text-sm uppercase tracking-[0.2em]">Ready to send</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="font-mono text-xs text-manifest-inkSoft hover:text-manifest-ink"
          >
            close ✕
          </button>
        </div>

        <textarea
          readOnly
          value={listText || "Nothing checked yet — check off items on the list first."}
          rows={12}
          className="w-full bg-white/40 border border-manifest-line font-mono text-xs p-3 leading-relaxed resize-none focus:border-manifest-lagoon"
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="font-mono text-xs uppercase tracking-wide bg-manifest-lagoon text-manifest-paper px-4 py-2 hover:bg-manifest-lagoonDark"
          >
            {copyState === "copied" ? "Copied ✓" : "Copy list"}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="font-mono text-xs uppercase tracking-wide border-2 border-manifest-ink px-4 py-2 hover:bg-manifest-ink hover:text-manifest-paper"
          >
            Print / Save PDF
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || submitState === "saved"}
            className="font-mono text-xs uppercase tracking-wide bg-manifest-coral text-manifest-paper px-4 py-2 hover:opacity-90 disabled:opacity-60"
          >
            {submitState === "saved" ? "Saved ✓" : submitting ? "Saving…" : "Save to history"}
          </button>
        </div>

        {submitState === "error" && submitError && (
          <p className="mt-2 text-xs text-manifest-coral">{submitError}</p>
        )}

        <p className="mt-3 text-xs text-manifest-inkSoft">
          Copy or print to send to the house manager. "Save to history" adds this visit to the
          shared record everyone can look back on.
        </p>
      </div>
    </div>
  );
}
