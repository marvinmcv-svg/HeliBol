"use client";
import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Play, X } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

/** Hero with a product thumbnail + pulsing play button that expands (shared layout) into a full video dialog. */
export function HeroVideoDialog({ thumbnail, videoSrc, title = "See it in 90 seconds", className }: { thumbnail: string; videoSrc?: string; title?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [open]);
  return (
    <section className={cn("relative flex flex-col items-center px-6 py-14 text-center", className)}>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-md text-muted-foreground">A quick tour of every animation engine, the token system and the AI prompts.</p>
      <motion.button layoutId={`${id}-v`} onClick={() => setOpen(true)} aria-label="Play video" transition={spring.smooth} className="group relative mt-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-border shadow-2xl">
        <img src={thumbnail} alt="" className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute inset-0 grid place-items-center bg-black/20 transition-colors group-hover:bg-black/30">
          <span className="relative grid size-20 place-items-center rounded-full bg-white/20 backdrop-blur-md">
            <span className="absolute inset-0 animate-ping rounded-full bg-white/30 motion-reduce:hidden" />
            <span className="grid size-14 place-items-center rounded-full bg-white text-black shadow-xl transition-transform group-hover:scale-110"><Play className="ml-1 size-6 fill-current" /></span>
          </span>
        </span>
      </motion.button>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true" aria-label={title}>
            <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.div layoutId={`${id}-v`} transition={spring.smooth} className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl">
              {videoSrc ? <video src={videoSrc} autoPlay controls className="aspect-video w-full" /> : <div className="relative aspect-video"><img src={thumbnail} alt="" className="h-full w-full object-cover opacity-60" /><p className="absolute inset-0 grid place-items-center text-sm text-white">▶ Your video plays here</p></div>}
              <button autoFocus onClick={() => setOpen(false)} aria-label="Close video" className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25"><X className="size-4" /></button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
