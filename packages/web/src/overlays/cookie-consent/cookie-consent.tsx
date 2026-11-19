"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Cookie } from "lucide-react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export interface ConsentCategory {
  id: string;
  label: string;
  description: string;
  required?: boolean;
}

export interface CookieConsentProps {
  categories?: ConsentCategory[];
  /** Persist the choice under this localStorage key; omit to show every time (demos). */
  storageKey?: string;
  onDecide?: (granted: Record<string, boolean>) => void;
  /** Delay before the card slides in, ms. */
  delay?: number;
  className?: string;
}

const DEFAULT: ConsentCategory[] = [
  { id: "necessary", label: "Strictly necessary", description: "Sign-in, security and your saved preferences.", required: true },
  { id: "analytics", label: "Analytics", description: "Anonymous usage stats that help us improve." },
  { id: "marketing", label: "Marketing", description: "Personalised offers on other sites." },
];

/**
 * A polite consent card: slides up after a short delay, "Customise" expands per-category switches
 * in place (height auto), and both choices are equally prominent (no dark pattern). The decision
 * is remembered.
 */
export function CookieConsent({ categories = DEFAULT, storageKey, onDecide, delay = 600, className }: CookieConsentProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [granted, setGranted] = useState<Record<string, boolean>>(() => Object.fromEntries(categories.map((c) => [c.id, !!c.required])));

  useEffect(() => {
    try {
      if (storageKey && localStorage.getItem(storageKey)) return;
    } catch {}
    const id = setTimeout(() => setOpen(true), delay);
    return () => clearTimeout(id);
  }, [storageKey, delay]);

  const decide = (g: Record<string, boolean>) => {
    try {
      if (storageKey) localStorage.setItem(storageKey, JSON.stringify(g));
    } catch {}
    onDecide?.(g);
    setOpen(false);
  };
  const all = (v: boolean) => Object.fromEntries(categories.map((c) => [c.id, c.required ? true : v]));
  const t = reduced ? { duration: 0.15 } : spring.smooth;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-labelledby="kn-cookie-title"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.97 }}
          transition={t}
          className={cn("w-[min(100%-2rem,24rem)] overflow-hidden rounded-3xl border border-border bg-popover p-5 text-popover-foreground shadow-2xl", className)}
        >
          <div className="flex items-start gap-3">
            <motion.span initial={reduced ? false : { rotate: -30, scale: 0.6 }} animate={{ rotate: 0, scale: 1 }} transition={{ ...spring.bouncy, delay: 0.15 }} className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-600">
              <Cookie className="size-5" />
            </motion.span>
            <div>
              <h2 id="kn-cookie-title" className="font-semibold">We use cookies</h2>
              <p className="mt-1 text-sm text-muted-foreground">Some are essential; others help us improve. You choose.</p>
            </div>
          </div>
          <AnimatePresence initial={false}>
            {custom && (
              <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={t} className="overflow-hidden">
                {categories.map((c) => (
                  <li key={c.id} className="mt-3 flex items-start justify-between gap-3 border-t border-border pt-3 first:mt-4">
                    <div className="text-sm">
                      <p className="font-medium">{c.label}</p>
                      <p className="text-xs text-muted-foreground">{c.description}</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={granted[c.id]}
                      aria-label={c.label}
                      disabled={c.required}
                      onClick={() => setGranted((g) => ({ ...g, [c.id]: !g[c.id] }))}
                      className={cn("flex h-6 w-10 shrink-0 rounded-full p-0.5 transition-colors disabled:opacity-60", granted[c.id] ? "justify-end bg-emerald-500" : "justify-start bg-muted-foreground/30")}
                    >
                      <motion.span layout transition={reduced ? { duration: 0 } : spring.snappy} className="size-5 rounded-full bg-white shadow" />
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {custom ? (
              <>
                <button type="button" onClick={() => setCustom(false)} className="h-10 rounded-xl border border-border text-sm font-medium hover:bg-muted">Back</button>
                <button type="button" onClick={() => decide(granted)} className="h-10 rounded-xl bg-foreground text-sm font-medium text-background">Save choices</button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => decide(all(false))} className="h-10 rounded-xl border border-border text-sm font-medium hover:bg-muted">Reject all</button>
                <button type="button" onClick={() => decide(all(true))} className="h-10 rounded-xl bg-foreground text-sm font-medium text-background">Accept all</button>
              </>
            )}
          </div>
          {!custom && <button type="button" onClick={() => setCustom(true)} className="mt-3 w-full text-center text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">Customise</button>}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
