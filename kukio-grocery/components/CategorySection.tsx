"use client";

import { useState } from "react";
import { GroceryItem } from "@/lib/masterList";

interface Props {
  category: string;
  items: GroceryItem[];
  checked: Record<string, boolean>;
  quantities: Record<string, string>;
  onToggle: (id: string) => void;
  onQtyChange: (id: string, qty: string) => void;
  onAddItem: (name: string, category: string) => void;
  onPromote: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function CategorySection({
  category,
  items,
  checked,
  quantities,
  onToggle,
  onQtyChange,
  onAddItem,
  onPromote,
  onRemove,
}: Props) {
  const [draft, setDraft] = useState("");

  const checkedCount = items.filter((i) => checked[i.id]).length;

  function submitDraft() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onAddItem(trimmed, category);
    setDraft("");
  }

  return (
    <section className="mb-8 break-inside-avoid">
      <div className="flex items-baseline justify-between border-b-2 border-manifest-ink/80 pb-1.5 mb-3">
        <h2 className="font-mono text-sm tracking-[0.2em] uppercase text-manifest-ink">
          {category}
        </h2>
        <span className="font-mono text-xs text-manifest-inkSoft tabular-nums">
          {checkedCount}/{items.length}
        </span>
      </div>

      <ul className="space-y-2">
        {items.map((item) => {
          const isChecked = !!checked[item.id];
          return (
            <li
              key={item.id}
              className="group flex items-center gap-3 rounded-sm px-1 py-1 -mx-1 hover:bg-manifest-ink/[0.04]"
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={isChecked}
                aria-label={item.name}
                onClick={() => onToggle(item.id)}
                className={`shrink-0 h-5 w-5 border-2 border-manifest-ink flex items-center justify-center transition-colors ${
                  isChecked ? "bg-manifest-lagoon border-manifest-lagoon" : "bg-manifest-paper"
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
                {item.status === "standing" ? (
                  <span
                    title="Standing item — confirmed on repeat visits"
                    className="ml-1.5 text-manifest-coral"
                  >
                    ★
                  </span>
                ) : (
                  <button
                    type="button"
                    title="Candidate item — click to confirm as standing"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPromote(item.id);
                    }}
                    className="ml-1.5 text-[11px] font-mono uppercase tracking-wide text-manifest-lagoon border border-manifest-lagoon/50 px-1 rounded-sm hover:bg-manifest-lagoon hover:text-manifest-paper"
                  >
                    new
                  </button>
                )}
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
                className="w-14 shrink-0 bg-transparent border-b border-manifest-line text-right font-mono text-sm px-1 py-0.5 focus:border-manifest-lagoon"
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
          className="flex-1 bg-transparent border-b border-dashed border-manifest-line text-sm px-1 py-1 placeholder:text-manifest-inkSoft/50 focus:border-manifest-lagoon"
        />
        <button
          type="button"
          onClick={submitDraft}
          className="font-mono text-xs uppercase tracking-wide text-manifest-lagoon hover:text-manifest-lagoonDark px-1"
        >
          + add
        </button>
      </div>
    </section>
  );
}
