"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { X } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(Flip, useGSAP);

export interface FlipModalItem {
  id: string;
  image: string;
  title: string;
  body: string;
}

export interface GsapFlipModalProps {
  items: FlipModalItem[];
  className?: string;
}

/**
 * Grid → modal with GSAP Flip: the clicked thumbnail is physically moved into the dialog
 * (same DOM node), and Flip.from animates it from the grid cell to its modal box; closing
 * reverses it back into its slot. Text and backdrop fade around the move.
 */
export function GsapFlipModal({ items, className }: GsapFlipModalProps) {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<FlipModalItem | null>(null);
  const reduced = useReducedMotion();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const { contextSafe } = useGSAP({ scope: root });

  const show = contextSafe((it: FlipModalItem) => {
    const thumb = root.current!.querySelector<HTMLElement>(`[data-thumb="${it.id}"]`)!;
    const state = Flip.getState(thumb);
    setOpen(it);
    requestAnimationFrame(() => {
      const slot = root.current!.querySelector<HTMLElement>("[data-modal-slot]")!;
      slot.appendChild(thumb);
      gsap.fromTo(root.current!.querySelector("[data-backdrop]"), { opacity: 0 }, { opacity: 1, duration: reduced ? 0 : 0.4 });
      if (!reduced) {
        Flip.from(state, { duration: 0.7, ease: "power3.inOut", scale: true, zIndex: 60 });
        gsap.fromTo(root.current!.querySelectorAll("[data-modal-text] > *"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, delay: 0.35, duration: 0.5 });
      }
      closeBtn.current?.focus();
    });
  });

  const hide = contextSafe(() => {
    if (!open) return;
    const thumb = root.current!.querySelector<HTMLElement>(`[data-thumb="${open.id}"]`)!;
    const home = root.current!.querySelector<HTMLElement>(`[data-home="${open.id}"]`)!;
    const state = Flip.getState(thumb);
    home.appendChild(thumb);
    const done = () => setOpen(null);
    if (reduced) return done();
    gsap.to(root.current!.querySelector("[data-backdrop]"), { opacity: 0, duration: 0.4 });
    Flip.from(state, { duration: 0.6, ease: "power3.inOut", scale: true, zIndex: 60, onComplete: done });
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && hide();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, hide]);

  return (
    <div ref={root} className={cn("relative", className)}>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {items.map((it) => (
          <button key={it.id} data-home={it.id} onClick={() => show(it)} aria-label={`Open ${it.title}`} className="aspect-square overflow-hidden rounded-xl bg-muted">
            <img data-thumb={it.id} src={it.image} alt="" className="h-full w-full rounded-xl object-cover" />
          </button>
        ))}
      </div>
      {open && (
        <div className="absolute inset-0 z-50 grid place-items-center p-2" role="dialog" aria-modal="true" aria-label={open.title}>
          <div data-backdrop className="absolute inset-0 rounded-2xl bg-background/80 backdrop-blur-sm" onClick={hide} />
          <div className="relative grid w-full max-w-xl grid-cols-[1.2fr_1fr] gap-4 rounded-2xl border border-border bg-card p-3 shadow-2xl">
            <div data-modal-slot className="aspect-[4/5] overflow-hidden rounded-xl" />
            <div data-modal-text className="flex flex-col py-2 pr-2">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Print</p>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight">{open.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{open.body}</p>
              <button className="mt-auto rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background">Add to bag — $64</button>
            </div>
            <button ref={closeBtn} onClick={hide} aria-label="Close" className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-background/80 hover:bg-accent">
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
