"use client";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface Toast {
  id: number;
  title: string;
  description?: string;
  tone?: "default" | "success" | "error";
}

const Ctx = createContext<(t: Omit<Toast, "id">) => void>(() => {});
export const useToast = () => useContext(Ctx);

const GAP = 12;
const PEEK = 10;

export function ToastProvider({ children, duration = 4000, contained = false }: { children: ReactNode; duration?: number; contained?: boolean }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [expanded, setExpanded] = useState(false);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const push = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = Date.now() + Math.random();
      setToasts((s) => [...s.slice(-4), { ...t, id }]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss, duration],
  );

  const visible = [...toasts].reverse();
  return (
    <Ctx.Provider value={push}>
      {children}
      <ol
        aria-live="polite"
        aria-label="Notifications"
        onPointerEnter={() => setExpanded(true)}
        onPointerLeave={() => setExpanded(false)}
        onFocus={() => setExpanded(true)}
        onBlur={() => setExpanded(false)}
        className={cn(contained ? "absolute" : "fixed", "right-4 bottom-4 z-50 h-0 w-[min(22rem,calc(100%-2rem))]")}
      >
        <AnimatePresence initial={false}>
          {visible.map((t, i) => (
            <motion.li
              key={t.id}
              layout
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0.1, right: 1 }}
              onDragEnd={(_, info) => (info.offset.x > 90 || info.velocity.x > 400) && dismiss(t.id)}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{
                opacity: i > 2 && !expanded ? 0 : 1,
                y: expanded ? -i * (64 + GAP) : -i * PEEK,
                scale: expanded ? 1 : 1 - i * 0.05,
              }}
              exit={{ opacity: 0, x: 120, transition: { duration: 0.2 } }}
              transition={spring.smooth}
              style={{ zIndex: 100 - i }}
              className={cn(
                "absolute right-0 bottom-0 flex h-16 w-full cursor-grab touch-pan-y items-center gap-3 rounded-2xl border border-border bg-popover px-4 shadow-xl active:cursor-grabbing",
              )}
            >
              <span className={cn("size-2 shrink-0 rounded-full", t.tone === "success" ? "bg-emerald-500" : t.tone === "error" ? "bg-destructive" : "bg-brand")} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{t.title}</p>
                {t.description && <p className="truncate text-xs text-muted-foreground">{t.description}</p>}
              </div>
              <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-xs text-muted-foreground hover:text-foreground">✕</button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
    </Ctx.Provider>
  );
}
