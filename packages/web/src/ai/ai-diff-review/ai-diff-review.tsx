"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, FileCode2, X } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface DiffLine {
  type: "ctx" | "add" | "del";
  text: string;
}

export interface DiffHunk {
  id: string;
  file: string;
  summary: string;
  lines: DiffLine[];
}

export interface AiDiffReviewProps {
  hunks: DiffHunk[];
  /** ms between streamed lines. */
  speed?: number;
  onDecision?: (id: string, accepted: boolean) => void;
  className?: string;
}

/**
 * An AI agent's proposed edit, streaming in: diff lines appear one by one with a cursor, additions
 * flash green and deletions strike through, then each hunk gets Accept / Reject — accepted hunks
 * collapse into a green chip, rejected ones fold away. Live region announces progress.
 */
export function AiDiffReview({ hunks, speed = 70, onDecision, className }: AiDiffReviewProps) {
  const reduced = useReducedMotion();
  const total = hunks.reduce((s, h) => s + h.lines.length, 0);
  const [shown, setShown] = useState(reduced ? total : 0);
  const [decided, setDecided] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (reduced) return setShown(total);
    if (shown >= total) return;
    const id = setTimeout(() => setShown((n) => n + 1), speed);
    return () => clearTimeout(id);
  }, [shown, total, speed, reduced]);

  let offset = 0;
  const decide = (id: string, ok: boolean) => (setDecided((d) => ({ ...d, [id]: ok })), onDecision?.(id, ok));

  return (
    <div className={cn("w-full space-y-3 font-mono text-[12.5px]", className)}>
      <p className="sr-only" aria-live="polite">{shown < total ? "Agent is writing changes" : "Changes ready for review"}</p>
      {hunks.map((h) => {
        const start = offset;
        offset += h.lines.length;
        const visible = Math.max(0, Math.min(h.lines.length, shown - start));
        const complete = visible === h.lines.length;
        const verdict = decided[h.id];
        if (visible === 0) return null;
        return (
          <motion.section key={h.id} layout={!reduced} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-2xl border border-border bg-card" aria-label={`${h.file}: ${h.summary}`}>
            <header className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-2 font-sans text-xs">
              <FileCode2 className="size-3.5 text-muted-foreground" />
              <span className="font-medium">{h.file}</span>
              <span className="truncate text-muted-foreground">— {h.summary}</span>
              {verdict !== undefined && (
                <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={cn("ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold", verdict ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground")}>
                  {verdict ? "Accepted" : "Rejected"}
                </motion.span>
              )}
            </header>
            <AnimatePresence initial={false}>
              {verdict === undefined && (
                <motion.div exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                  <pre className="overflow-x-auto py-2">
                    {h.lines.slice(0, visible).map((l, i) => (
                      <motion.div
                        key={i}
                        initial={reduced ? false : l.type === "add" ? { backgroundColor: "rgb(34 197 94 / .45)" } : { opacity: 0 }}
                        animate={{ opacity: 1, backgroundColor: l.type === "add" ? "rgb(34 197 94 / .12)" : l.type === "del" ? "rgb(244 63 94 / .1)" : "rgb(0 0 0 / 0)" }}
                        transition={{ duration: 0.5 }}
                        className={cn("flex px-3", l.type === "del" && "text-rose-500 line-through decoration-rose-500/50", l.type === "add" && "text-emerald-600 dark:text-emerald-400")}
                      >
                        <span className="w-5 shrink-0 select-none text-muted-foreground">{l.type === "add" ? "+" : l.type === "del" ? "−" : " "}</span>
                        <span className="whitespace-pre">{l.text}</span>
                        {i === visible - 1 && !complete && <span className="ml-0.5 inline-block w-2 animate-pulse bg-foreground/70 motion-reduce:animate-none" />}
                      </motion.div>
                    ))}
                  </pre>
                  {complete && (
                    <motion.div initial={reduced ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end gap-2 border-t border-border px-3 py-2 font-sans">
                      <button type="button" onClick={() => decide(h.id, false)} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"><X className="size-3.5" /> Reject</button>
                      <button type="button" onClick={() => decide(h.id, true)} className="inline-flex items-center gap-1 rounded-lg bg-foreground px-2.5 py-1 text-xs font-medium text-background"><Check className="size-3.5" /> Accept</button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        );
      })}
    </div>
  );
}
