"use client";

import { useState } from "react";
import { GroceryItem } from "@/lib/masterList";

interface Props {
  category: string;
  colorIndex: number;
  items: GroceryItem[];
  checked: Record<string, boolean>;
  quantities: Record<string, string>;
  onToggle: (id: string) => void;
  onQtyChange: (id: string, qty: string) => void;
  onAddItem: (name: string, category: string) => void;
  onPromote: (id: string) => void;
  onDemote: (id: string) => void;
  onRemove: (id: string) => void;
}

// Each category gets its own accent color, cycling through this palette —
// gives the list visual rhythm without needing a color picked per item.
const ACCENTS = [
  {
    bg: "bg-manifest-coral",
    border: "border-manifest-coral",
    text: "text-manifest-coral",
    focusBorder: "focus:border-manifest-coral",
    hoverBg: "hover:bg-manifest-coral",
  },
  {
    bg: "bg-manifest-lagoon",
    border: "border-manifest-lagoon",
    text: "text-manifest-lagoon",
    focusBorder: "focus:border-manifest-lagoon",
    hoverBg: "hover:bg-manifest-lagoon",
  },
  {
    bg: "bg-tropic-gold",
    border: "border-tropic-gold",
    text: "text-tropic-gold",
    focusBorder: "focus:border-tropic-gold",
    hoverBg: "hover:bg-tropic-gold",
  },
  {
    bg: "bg-tropic-plum",
    border: "border-tropic-plum",
    text: "text-tropic-plum",
    focusBorder: "focus:border-tropic-plum",
    hoverBg: "hover:bg-tropic-plum",
  },
  {
    bg: "bg-tropic-leaf",
    border: "border-tropic-leaf",
    text: "text-tropic-leaf",
    focusBorder: "focus:border-tropic-leaf",
    hoverBg: "hover:bg-tropic-leaf",
  },
  {
    bg: "bg-tropic-sky",
    border: "border-tropic-sky",
    text: "text-tropic-sky",
    focusBorder: "focus:border-tropic-sky",
    hoverBg: "hover:bg-tropic-sky",
  },
];

export default function CategorySection({
  category,
  colorIndex,
  items,
  checked,
  quantities,
  onToggle,
  onQtyChange,
  onAddItem,
  onPromote,
  onDemote,
  onRemove,
}: Props) {
  const [draft, setDraft] = useState("");
  const accent = ACCENTS[colorIndex % ACCENTS.length];

  const checkedCount = items.filter((i) => checked[i.id]).length;

  function submitDraft() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onAddItem(trimmed, category);
    setDraft("");
  }

  return (
    <section className="mb-8 break-inside-avoid">
      <div className="flex items-center justify-between mb-3 gap-3">
        <h2 className="m-0">
          <span
            className={`inline-block ${accent.bg} text-manifest-paper font-mono text-xs font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded`}
          >
            {category}
          </span>
        </h2>
        <span className={`font-mono text-xs ${accent.text} font-bold tabular-nums shrink-0`}>
          {checkedCount}/{items.length}
        </span>
      </div>
      <div className="border-b border-manifest-line mb-3" />

      <ul className="space-y-2">
        {items.map((item) => {
          const isChecked = !!checked[item.id];
          return (
            <li
              key={item.id}
              className="group flex items-center gap-3 rounded-lg px-1 py-1 -mx-1 hover:bg-manifest-ink/[0.04]"
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={isChecked}
                aria-label={item.name}
                onClick={() => onToggle(item.id)}
                className={`shrink-0 h-6 w-6 rounded-full border-2 border-manifest-ink flex items-center justify-center transition-colors ${
                  isChecked ? `${accent.bg} ${accent.border}` : "bg-manifest-paper"
                }`}
              >
                {isChecked && (
                  <span className="checkbox-tick block h-3 w-3 bg-manifest-paper" />
                )}
              </button>

              <label
                className={`flex-1 text-[15px] leading-tight cursor-pointer select-none ${
                  isChecked ? "text-manifest-ink" : "text-manifest-inkSoft"
                }`}
                onClick={() => onToggle(item.id)}
              >
                {item.name}
                <button
                  type="button"
                  title={
                    item.status === "standing"
                      ? "On your usual list — click to remove"
                      : "Not on your usual list yet — click to add"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.status === "standing") {
                      onDemote(item.id);
                    } else {
                      onPromote(item.id);
                    }
                  }}
                  aria-pressed={item.status === "standing"}
                  className={`ml-1.5 align-middle text-base leading-none ${
                    item.status === "standing"
                      ? "text-tropic-gold"
                      : "text-manifest-inkSoft/30 hover:text-tropic-gold/70"
                  }`}
                >
                  ★
                </button>
                {item.note && (
                  <span className="block text-xs italic text-manifest-inkSoft/80 mt-0.5">
                    {item.note}
                  </span>
                )}
              </label>

              <input
                type="text"
                inputMode="numeric"
                value={quantities[item.id] ?? ""}
                onChange={(e) => onQtyChange(item.id, e.target.value)}
                placeholder="qty"
                aria-label={`Quantity for ${item.name}`}
                className={`w-14 shrink-0 bg-transparent border-b-2 border-manifest-line text-right font-mono text-sm px-1 py-0.5 ${accent.focusBorder}`}
              />

              <button
                type="button"
                onClick={() => onRemove(item.id)}
                aria-label={`Remove ${item.name} from list`}
                className="shrink-0 opacity-0 group-hover:opacity-60 hover:!opacity-100 text-manifest-inkSoft text-xs font-mono px-1"
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex items-center gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submitDraft();
          }}
          placeholder={`Add item to ${category.toLowerCase()}…`}
          className={`flex-1 bg-transparent border-b-2 border-dashed border-manifest-line text-sm px-1 py-1 placeholder:text-manifest-inkSoft/50 ${accent.focusBorder}`}
        />
        <button
          type="button"
          onClick={submitDraft}
          className={`font-mono text-xs uppercase tracking-wide ${accent.text} hover:opacity-70 px-1`}
        >
          + add
        </button>
      </div>
    </section>
  );
}
