"use client";
import { useSyncExternalStore } from "react";

/**
 * Saved items (Mobbin-style collections, v1: one "Saved" list). Lives in localStorage so it works
 * without accounts; every tab stays in sync through the storage event.
 */
const KEY = "kinetik-saved";
const EMPTY: string[] = [];
let cache: string[] | null = null;
const listeners = new Set<() => void>();

function read(): string[] {
  if (cache) return cache;
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(ids: string[]) {
  cache = ids;
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* private mode — keep in memory */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useSaved(): string[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function toggleSaved(id: string) {
  const cur = read();
  write(cur.includes(id) ? cur.filter((x) => x !== id) : [id, ...cur]);
}

export function clearSaved() {
  write([]);
}
