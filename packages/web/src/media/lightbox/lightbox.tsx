"use client";
import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

/** Thumbnail grid where the clicked photo flies into a fullscreen lightbox (shared layout); arrows/keys browse, Esc returns it home. */
export function Lightbox({ images, className }: { images: { src: string; alt: string }[]; className?: string }) {
  const [i, setI] = useState<number | null>(null);
  const id = useId();
  useEffect(() => {
    if (i === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setI(null);
      if (e.key === "ArrowRight") setI((n) => (n === null ? n : (n + 1) % images.length));
      if (e.key === "ArrowLeft") setI((n) => (n === null ? n : (n - 1 + images.length) % images.length));
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [i, images.length]);
  return (
    <>
      <div className={cn("grid grid-cols-3 gap-2", className)}>
        {images.map((im, n) => (
          <motion.button key={im.src} layoutId={`${id}-${n}`} onClick={() => setI(n)} transition={spring.smooth} className="overflow-hidden rounded-xl" aria-label={`Open ${im.alt}`}>
            <img src={im.src} alt={im.alt} className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105" />
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {i !== null && (
          <div className="fixed inset-0 z-50 grid place-items-center p-6" role="dialog" aria-modal="true" aria-label={images[i].alt}>
            <motion.div className="absolute inset-0 bg-black/85" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setI(null)} />
            <motion.img key={i} layoutId={`${id}-${i}`} src={images[i].src} alt={images[i].alt} transition={spring.smooth} className="relative max-h-full max-w-full rounded-xl object-contain shadow-2xl" />
            <button autoFocus onClick={() => setI(null)} aria-label="Close" className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"><X className="size-5" /></button>
            <button onClick={() => setI((n) => ((n ?? 0) - 1 + images.length) % images.length)} aria-label="Previous" className="absolute left-4 grid size-10 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"><ChevronLeft className="size-5" /></button>
            <button onClick={() => setI((n) => ((n ?? 0) + 1) % images.length)} aria-label="Next" className="absolute right-4 grid size-10 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"><ChevronRight className="size-5" /></button>
            <p className="absolute bottom-4 text-sm text-white/80">{images[i].alt} · {i + 1}/{images.length}</p>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
