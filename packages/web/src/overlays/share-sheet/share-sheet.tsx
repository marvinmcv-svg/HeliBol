"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Share2 } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface ShareTarget {
  label: string;
  icon: ReactNode;
  color: string;
  href?: string;
}

export interface ShareSheetProps {
  url: string;
  title?: string;
  targets: ShareTarget[];
  /** Recent people shown as avatars. */
  people?: { name: string; avatar: string }[];
  /** Start open (for previews). */
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Share button that morphs into a share sheet (shared layout): the pill grows into a card,
 * recent people and app targets pop in on a staggered spring, the link row copies with a check
 * morph, and the native share sheet is used when available. Esc and outside click close.
 */
export function ShareSheet({ url, title = "Share", targets, people = [], defaultOpen = false, className }: ShareSheetProps) {
  const reduced = useReducedMotion();
  const id = useId();
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 380, damping: 32 };

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const d = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", k);
    document.addEventListener("pointerdown", d);
    return () => { document.removeEventListener("keydown", k); document.removeEventListener("pointerdown", d); };
  }, [open]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const pop = (i: number) => ({ initial: reduced ? { opacity: 0 } : { opacity: 0, scale: 0.4, y: 10 }, animate: { opacity: 1, scale: 1, y: 0 }, transition: reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 500, damping: 22, delay: 0.08 + i * 0.035 } });

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <AnimatePresence initial={false} mode="popLayout">
        {!open ? (
          <motion.button key="btn" layoutId={`${id}-sheet`} transition={t} type="button" onClick={() => setOpen(true)} aria-expanded={false} style={{ borderRadius: 999 }} className="inline-flex h-11 items-center gap-2 bg-foreground px-5 text-sm font-semibold text-background">
            <Share2 className="size-4" /> {title}
          </motion.button>
        ) : (
          <motion.div key="sheet" layoutId={`${id}-sheet`} transition={t} role="dialog" aria-label={title} style={{ borderRadius: 24 }} className="w-80 overflow-hidden bg-popover p-4 text-popover-foreground shadow-2xl ring-1 ring-border">
            <div className="flex items-center justify-between">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold">{title}</motion.p>
              <button type="button" onClick={() => setOpen(false)} className="text-xs text-muted-foreground hover:text-foreground">Done</button>
            </div>
            {people.length > 0 && (
              <ul className="mt-4 flex gap-3">
                {people.map((p, i) => (
                  <motion.li key={p.name} {...pop(i)} className="w-12 text-center">
                    <img src={p.avatar} alt="" className="mx-auto size-12 rounded-full object-cover" />
                    <span className="mt-1 block truncate text-[10px] text-muted-foreground">{p.name}</span>
                  </motion.li>
                ))}
              </ul>
            )}
            <ul className="mt-4 grid grid-cols-4 gap-3">
              {targets.map((tg, i) => (
                <motion.li key={tg.label} {...pop(people.length + i)}>
                  <a href={tg.href ?? "#"} className="group flex flex-col items-center gap-1 text-[10px] text-muted-foreground">
                    <span className="grid size-12 place-items-center rounded-2xl text-white transition-transform group-hover:-translate-y-0.5" style={{ background: tg.color }}>{tg.icon}</span>
                    {tg.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.div {...pop(people.length + targets.length)} className="mt-4 flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
              <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{url}</span>
              <button type="button" onClick={copy} aria-label={copied ? "Copied" : "Copy link"} className="grid size-7 place-items-center rounded-lg bg-background">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span key={String(copied)} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </motion.div>
            {typeof navigator !== "undefined" && "share" in navigator && (
              <button type="button" onClick={() => navigator.share({ url, title }).catch(() => {})} className="mt-2 w-full text-center text-xs text-muted-foreground underline underline-offset-4">More options…</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
