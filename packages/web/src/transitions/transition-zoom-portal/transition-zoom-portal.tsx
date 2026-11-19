"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface PortalItem {
  id: string;
  title: string;
  kicker?: string;
  image: string;
  /** Full page content shown after zooming in. */
  page: ReactNode;
}

export interface TransitionZoomPortalProps {
  items: PortalItem[];
  className?: string;
}

/**
 * Cards that become pages: clicking a card zooms its image (shared layout) to fill the viewport
 * while the other cards fall back and blur, then the article content rises in beneath the hero.
 * Back (or Esc) reverses the zoom into the original card. Focus moves to the page and back.
 */
export function TransitionZoomPortal({ items, className }: TransitionZoomPortalProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState<string | null>(null);
  const lastCard = useRef<HTMLButtonElement | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const item = items.find((i) => i.id === open);
  const t = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 220, damping: 30 };

  useEffect(() => {
    if (!open) return lastCard.current?.focus();
    pageRef.current?.focus();
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open]);

  return (
    <LayoutGroup>
      <div className={cn("relative h-full overflow-hidden", className)}>
        <motion.ul
          className="grid h-full grid-cols-3 gap-3 p-4"
          animate={open && !reduced ? { scale: 0.92, filter: "blur(6px)", opacity: 0.4 } : { scale: 1, filter: "blur(0px)", opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden={!!open}
        >
          {items.map((it) => (
            <li key={it.id} className="relative">
              <button
                type="button"
                onClick={(e) => ((lastCard.current = e.currentTarget), setOpen(it.id))}
                className="group relative block size-full overflow-hidden rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {open !== it.id && <motion.img layoutId={`zp-img-${it.id}`} transition={t} src={it.image} alt="" className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ borderRadius: 16 }} />}
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-4 text-white">
                  {it.kicker && <span className="block text-[10px] uppercase tracking-[0.3em] text-white/70">{it.kicker}</span>}
                  <motion.span layoutId={`zp-title-${it.id}`} transition={t} className="block text-lg font-semibold leading-tight">{it.title}</motion.span>
                </span>
              </button>
            </li>
          ))}
        </motion.ul>
        <AnimatePresence>
          {item && (
            <motion.article ref={pageRef} tabIndex={-1} aria-label={item.title} className="absolute inset-0 z-10 overflow-y-auto bg-background outline-none" initial={{ backgroundColor: "rgb(0 0 0 / 0)" }} animate={{ backgroundColor: "var(--color-background)" }} exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.1 } }}>
              <div className="relative h-[60%] min-h-56">
                <motion.img layoutId={`zp-img-${item.id}`} transition={t} src={item.image} alt="" className="absolute inset-0 size-full object-cover" style={{ borderRadius: 0 }} />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <button type="button" onClick={() => setOpen(null)} className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-sm text-white backdrop-blur hover:bg-black/60">
                  <ArrowLeft className="size-4" /> Back
                </button>
                <motion.h2 layoutId={`zp-title-${item.id}`} transition={t} className="absolute bottom-5 left-6 text-4xl font-semibold tracking-tight text-white">{item.title}</motion.h2>
              </div>
              <motion.div initial={reduced ? { opacity: 0 } : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0, transition: { delay: reduced ? 0 : 0.35, duration: 0.5 } }} exit={{ opacity: 0, transition: { duration: 0.15 } }} className="mx-auto max-w-xl p-6 text-sm leading-relaxed text-muted-foreground">
                {item.page}
              </motion.div>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
