"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, X } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

type IslandState = { id: number; kind: "loading" | "success" | "error"; title: string; detail?: string } | null;

interface IslandApi {
  /** Show a loading island that resolves to success/error with the promise. */
  promise: <T>(p: Promise<T>, msgs: { loading: string; success: string; error: string; detail?: string }) => Promise<T>;
  show: (kind: "success" | "error", title: string, detail?: string) => void;
}

const Ctx = createContext<IslandApi | null>(null);
export const useIsland = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useIsland must be used inside <ToastIsland>");
  return v;
};

/**
 * Dynamic-Island-style toasts: a black pill at the top that stretches (shared layout spring) from a
 * compact loading capsule into a wider success/error card with icon morph and detail line, then
 * shrinks back and away. One island at a time — new messages morph the existing one.
 */
export function ToastIsland({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const [s, setS] = useState<IslandState>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const n = useRef(0);

  const settle = useCallback((next: IslandState, ms = 2600) => {
    clearTimeout(timer.current);
    setS(next);
    if (next && next.kind !== "loading") timer.current = setTimeout(() => setS(null), ms);
  }, []);
  const api: IslandApi = {
    show: (kind, title, detail) => settle({ id: ++n.current, kind, title, detail }),
    promise: async (p, m) => {
      const id = ++n.current;
      settle({ id, kind: "loading", title: m.loading });
      try {
        const v = await p;
        settle({ id, kind: "success", title: m.success, detail: m.detail });
        return v;
      } catch (e) {
        settle({ id, kind: "error", title: m.error, detail: e instanceof Error ? e.message : undefined });
        throw e;
      }
    },
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  const t = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 400, damping: 30 };

  return (
    <Ctx.Provider value={api}>
      <div className={cn("relative", className)}>
        {children}
        <div className="pointer-events-none absolute inset-x-0 top-3 z-50 flex justify-center" role="status" aria-live="polite">
          <AnimatePresence>
            {s && (
              <motion.div
                key="island"
                layout={!reduced}
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: -10 }}
                transition={t}
                style={{ borderRadius: 999 }}
                className="pointer-events-auto flex items-center gap-3 bg-black py-2 pl-2 pr-5 text-white shadow-2xl"
              >
                <motion.span layout={!reduced} transition={t} className={cn("grid size-7 shrink-0 place-items-center rounded-full", s.kind === "success" ? "bg-emerald-500" : s.kind === "error" ? "bg-rose-500" : "bg-white/15")}>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span key={s.kind} initial={reduced ? false : { scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={t}>
                      {s.kind === "loading" ? <Loader2 className="size-4 animate-spin motion-reduce:animate-none" /> : s.kind === "success" ? <Check className="size-4" strokeWidth={3} /> : <X className="size-4" strokeWidth={3} />}
                    </motion.span>
                  </AnimatePresence>
                </motion.span>
                <motion.div layout="position" transition={t} className="min-w-0">
                  <p className="whitespace-nowrap text-sm font-medium">{s.title}</p>
                  <AnimatePresence initial={false}>
                    {s.detail && s.kind !== "loading" && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="whitespace-nowrap text-xs text-white/60">{s.detail}</motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Ctx.Provider>
  );
}
