"use client";

import { useEffect, useState } from "react";
import { VisitRequest } from "@/lib/kv";

interface Props {
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

export default function HistoryPanel({ onClose }: Props) {
  const [requests, setRequests] = useState<VisitRequest[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/requests")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setRequests(data.requests ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Couldn't load past visits right now.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Past visit history"
      className="fixed inset-0 z-50 flex items-center justify-center bg-manifest-ink/40 backdrop-blur-[2px] p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[80vh] flex flex-col bg-manifest-paper border-2 border-manifest-ink shadow-[6px_6px_0_0_rgba(34,48,63,0.9)] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-baseline justify-between mb-4 shrink-0">
          <h2 className="font-mono text-sm uppercase tracking-[0.2em]">Past visits</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="font-mono text-xs text-manifest-inkSoft hover:text-manifest-ink"
          >
            close ✕
          </button>
        </div>

        <div className="overflow-y-auto -mx-1 px-1">
          {error && <p className="text-sm text-manifest-coral">{error}</p>}

          {!error && requests === null && (
            <p className="font-mono text-xs text-manifest-inkSoft">loading…</p>
          )}

          {!error && requests !== null && requests.length === 0 && (
            <p className="text-sm text-manifest-inkSoft">
              Nothing submitted yet. Once a request is sent from the checklist below, it'll show up
              here for everyone.
            </p>
          )}

          {!error &&
            requests !== null &&
            requests.map((req) => {
              const isOpen = openId === req.id;
              return (
                <div key={req.id} className="border-b border-manifest-line py-3">
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : req.id)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <span className="text-sm font-medium">{formatVisitDate(req.visitDate)}</span>
                    <span className="font-mono text-xs text-manifest-inkSoft">
                      {req.items.length} item{req.items.length === 1 ? "" : "s"} {isOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-2 pl-1 text-sm space-y-2">
                      <ul className="space-y-0.5 text-manifest-inkSoft">
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
      </div>
    </div>
  );
}
