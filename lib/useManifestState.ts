"use client";

import { useEffect, useState, useCallback } from "react";
import { GroceryItem, INITIAL_MASTER_LIST } from "./masterList";

const STORAGE_KEY = "kukio-grocery-manifest-ben-meredith-v1";

interface PersistedState {
  items: GroceryItem[];
  checked: Record<string, boolean>;
  quantities: Record<string, string>;
  tripNotes: string;
}

function defaultState(): PersistedState {
  const checked: Record<string, boolean> = {};
  const quantities: Record<string, string> = {};
  INITIAL_MASTER_LIST.forEach((item) => {
    checked[item.id] = item.status === "standing";
    if (item.defaultQty) quantities[item.id] = item.defaultQty;
  });
  return { items: INITIAL_MASTER_LIST, checked, quantities, tripNotes: "" };
}

export function useManifestState() {
  const [state, setState] = useState<PersistedState | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedState;
        // Merge in any new master-list items that shipped after this browser
        // last saved state, so app updates don't hide new standing items.
        const knownIds = new Set(parsed.items.map((i) => i.id));
        const merged = [...parsed.items];
        INITIAL_MASTER_LIST.forEach((item) => {
          if (!knownIds.has(item.id)) merged.push(item);
        });
        setState({ ...parsed, items: merged });
      } else {
        setState(defaultState());
      }
    } catch {
      setState(defaultState());
    }
  }, []);

  useEffect(() => {
    if (state) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // storage unavailable — app still works for this session
      }
    }
  }, [state]);

  const toggleChecked = useCallback((id: string) => {
    setState((prev) =>
      prev ? { ...prev, checked: { ...prev.checked, [id]: !prev.checked[id] } } : prev
    );
  }, []);

  const setQuantity = useCallback((id: string, qty: string) => {
    setState((prev) =>
      prev ? { ...prev, quantities: { ...prev.quantities, [id]: qty } } : prev
    );
  }, []);

  const setTripNotes = useCallback((notes: string) => {
    setState((prev) => (prev ? { ...prev, tripNotes: notes } : prev));
  }, []);

  const addItem = useCallback((name: string, category: string) => {
    setState((prev) => {
      if (!prev) return prev;
      const id = `custom-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
      const newItem: GroceryItem = {
        id,
        name,
        category,
        status: "candidate",
        firstSeen: new Date().toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" }),
      };
      return {
        ...prev,
        items: [...prev.items, newItem],
        checked: { ...prev.checked, [id]: true },
      };
    });
  }, []);

  const promoteToStanding = useCallback((id: string) => {
    setState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((item) =>
          item.id === id ? { ...item, status: "standing" } : item
        ),
      };
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setState((prev) => {
      if (!prev) return prev;
      const { [id]: _c, ...checked } = prev.checked;
      const { [id]: _q, ...quantities } = prev.quantities;
      return {
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
        checked,
        quantities,
      };
    });
  }, []);

  const resetTrip = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      const checked: Record<string, boolean> = {};
      prev.items.forEach((item) => {
        checked[item.id] = item.status === "standing";
      });
      return { ...prev, checked, tripNotes: "" };
    });
  }, []);

  return {
    state,
    toggleChecked,
    setQuantity,
    setTripNotes,
    addItem,
    promoteToStanding,
    removeItem,
    resetTrip,
  };
}
