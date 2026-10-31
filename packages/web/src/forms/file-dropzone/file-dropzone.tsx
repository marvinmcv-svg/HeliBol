"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FileUp, X } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

interface Up { id: number; name: string; size: number; p: number }

/** Drop zone that lifts and glows on drag-over; dropped files fly into a list with individual animated upload progress. */
export function FileDropzone({ accept, className }: { accept?: string; className?: string }) {
  const [over, setOver] = useState(false);
  const [files, setFiles] = useState<Up[]>([]);
  const input = useRef<HTMLInputElement>(null);
  const add = (list: FileList | null) => {
    if (!list) return;
    const ups = [...list].map((f, i) => ({ id: Date.now() + i, name: f.name, size: f.size, p: 0 }));
    setFiles((s) => [...ups, ...s]);
    ups.forEach((u) => {
      const t = setInterval(() => setFiles((s) => s.map((x) => (x.id === u.id ? { ...x, p: Math.min(100, x.p + 6 + Math.random() * 14) } : x))), 160);
      setTimeout(() => clearInterval(t), 3200);
    });
  };
  return (
    <div className={cn("w-full max-w-md space-y-3", className)}>
      <motion.button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => (e.preventDefault(), setOver(true))}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => (e.preventDefault(), setOver(false), add(e.dataTransfer.files))}
        animate={{ scale: over ? 1.02 : 1, y: over ? -2 : 0 }}
        transition={spring.smooth}
        className={cn("flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition-colors", over ? "border-brand bg-brand/10" : "border-border bg-card hover:bg-accent/50")}
      >
        <motion.span animate={over ? { y: [0, -6, 0] } : { y: 0 }} transition={{ duration: 0.8, repeat: over ? Infinity : 0 }} className="grid size-12 place-items-center rounded-2xl bg-muted"><FileUp className="size-6 text-muted-foreground" /></motion.span>
        <span className="text-sm font-medium">{over ? "Drop to upload" : "Drag files here or click to browse"}</span>
        <span className="text-xs text-muted-foreground">PNG, JPG or PDF up to 10MB</span>
      </motion.button>
      <input ref={input} type="file" multiple accept={accept} className="sr-only" onChange={(e) => add(e.target.files)} aria-label="Upload files" />
      <ul className="space-y-2" aria-live="polite">
        <AnimatePresence initial={false}>
          {files.map((f) => (
            <motion.li key={f.id} layout initial={{ opacity: 0, y: -10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 40 }} transition={spring.smooth} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-xs font-semibold uppercase">{f.name.split(".").pop()?.slice(0, 3)}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{f.name}</p>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted"><motion.div className={cn("h-full rounded-full", f.p >= 100 ? "bg-emerald-500" : "bg-brand")} animate={{ width: `${f.p}%` }} /></div>
              </div>
              <span className="w-10 text-right text-xs text-muted-foreground tabular-nums">{f.p >= 100 ? "✓" : `${Math.round(f.p)}%`}</span>
              <button onClick={() => setFiles((s) => s.filter((x) => x.id !== f.id))} aria-label={`Remove ${f.name}`} className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
