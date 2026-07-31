"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { GroceryItem, INITIAL_MASTER_LIST } from "./masterList";

const DRAFT_KEY = "ben-meredith-grocery-draft-v1";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

interface DraftState {
  checked: Record<string, boolean>;
  quantities: Record<string, string>;
  groceryNotes: string;
  visitDate: string;
}

function defaultDraft(items: GroceryItem[]): DraftState {
  const checked: Record<string, boolean> = {};
  const quantities: Record<string, string> = {};
  items.forEach((item) => {
    checked[item.id] = item.status === "standing";
    if (item.defaultQty) quantities[item.id] = item.defaultQty;
  });
  return { checked, quantities, groceryNotes: "", visitDate: todayISO() };
}

export function useManifestState() {
  const [items, setItems] = useState<GroceryItem[]>(INITIAL_MASTER_LIST);
  const [draft, setDraft] = useState<DraftState | null>(null);
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const hasHydratedChecks = useRef(false);

  // Load the local draft (per-device, in-progress) immediately.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      setDraft(raw ? (JSON.parse(raw) as DraftState) : defaultDraft(INITIAL_MASTER_LIST));
    } catch {
      setDraft(defaultDraft(INITIAL_MASTER_LIST));
    }
  }, []);

  // Load the shared catalog from the server.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/catalog")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.catalog) {
          setItems(data.catalog);
        }
        setCatalogLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        setCatalogError("Couldn't reach the shared list — showing your last known items instead.");
        setCatalogLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Once the shared catalog arrives, make sure the draft has an entry for
  // every item (new items added by someone else since this device last synced).
  useEffect(() => {
    if (!catalogLoaded || !draft || hasHydratedChecks.current) return;
    hasHydratedChecks.current = true;
    setDraft((prev) => {
      if (!prev) return prev;
      const checked = { ...prev.checked };
      const quantities = { ...prev.quantities };
      items.forEach((item) => {
        if (!(item.id in checked)) checked[item.id] = item.status === "standing";
        if (item.defaultQty && !(item.id in quantities)) quantities[item.id] = item.defaultQty;
      });
      return { ...prev, checked, quantities };
    });
  }, [catalogLoaded, items, draft]);

  // Persist the draft locally on every change.
  useEffect(() => {
    if (draft) {
      try {
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      } catch {
        // storage unavailable — app still works for this session
      }
    }
  }, [draft]);

  async function syncCatalog(next: GroceryItem[]) {
    setItems(next);
    try {
      await fetch("/api/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ catalog: next }),
      });
    } catch {
      setCatalogError("Saved on this device, but couldn't sync to the shared list. Try again shortly.");
    }
  }

  const toggleChecked = useCallback((id: string) => {
    setDraft((prev) =>
      prev ? { ...prev, checked: { ...prev.checked, [id]: !prev.checked[id] } } : prev
    );
  }, []);

  const setQuantity = useCallback((id: string, qty: string) => {
    setDraft((prev) =>
      prev ? { ...prev, quantities: { ...prev.quantities, [id]: qty } } : prev
    );
  }, []);

  const setGroceryNotes = useCallback((notes: string) => {
    setDraft((prev) => (prev ? { ...prev, groceryNotes: notes } : prev));
  }, []);

  const setVisitDate = useCallback((date: string) => {
    setDraft((prev) => (prev ? { ...prev, visitDate: date } : prev));
  }, []);

  const addItem = useCallback(
    (name: string, category: string) => {
      const id = `custom-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
      const newItem: GroceryItem = {
        id,
        name,
        category,
        status: "candidate",
        firstSeen: new Date().toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" }),
      };
      syncCatalog([...items, newItem]);
      setDraft((prev) => (prev ? { ...prev, checked: { ...prev.checked, [id]: true } } : prev));
    },
    [items]
  );

  const promoteToStanding = useCallback(
    (id: string) => {
      syncCatalog(items.map((item) => (item.id === id ? { ...item, status: "standing" } : item)));
    },
    [items]
  );

  const demoteToCandidate = useCallback(
    (id: string) => {
      syncCatalog(items.map((item) => (item.id === id ? { ...item, status: "candidate" } : item)));
    },
    [items]
  );

  const removeItem = useCallback(
    (id: string) => {
      syncCatalog(items.filter((item) => item.id !== id));
      setDraft((prev) => {
        if (!prev) return prev;
        const { [id]: _c, ...checked } = prev.checked;
        const { [id]: _q, ...quantities } = prev.quantities;
        return { ...prev, checked, quantities };
      });
    },
    [items]
  );

  const resetTrip = useCallback(() => {
    setDraft(() => defaultDraft(items));
  }, [items]);

  const submitRequest = useCallback(async (): Promise<{ ok: boolean; error?: string }> => {
    if (!draft) return { ok: false, error: "Nothing to submit yet." };
    setSubmitting(true);
    try {
      const requestItems = items
        .filter((item) => draft.checked[item.id])
        .map((item) => ({
          name: item.name,
          category: item.category,
          qty: draft.quantities[item.id],
        }));

      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `req-${Date.now()}`,
          visitDate: draft.visitDate,
          createdAt: new Date().toISOString(),
          items: requestItems,
          groceryNotes: draft.groceryNotes,
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      return { ok: true };
    } catch {
      return { ok: false, error: "Couldn't save this to the shared history. You can still copy/print it below." };
    } finally {
      setSubmitting(false);
    }
  }, [draft, items]);

  const state =
    draft && catalogLoaded
      ? {
          items,
          checked: draft.checked,
          quantities: draft.quantities,
          tripNotes: draft.groceryNotes,
          visitDate: draft.visitDate,
        }
      : null;

  return {
    state,
    catalogError,
    submitting,
    toggleChecked,
    setQuantity,
    setTripNotes: setGroceryNotes,
    setVisitDate,
    addItem,
    promoteToStanding,
    demoteToCandidate,
    removeItem,
    resetTrip,
    submitRequest,
  };
}
