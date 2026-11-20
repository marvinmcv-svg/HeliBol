"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface FormEmojiFeedbackProps {
  question?: string;
  labels?: [string, string, string, string, string];
  onSubmit?: (rating: number, comment: string) => void;
  className?: string;
}

const COLORS = ["#ef4444", "#f97316", "#facc15", "#84cc16", "#22c55e"];

/**
 * Feedback rating where one face does all the talking: slide or tap 1–5 and the drawn face morphs —
 * the mouth curve bends from frown to grin, brows tilt, eyes squint into a smile, the face colour
 * warms — then a comment box slides open and Send turns into a thank-you.
 */
export function FormEmojiFeedback({ question = "How was your experience?", labels = ["Awful", "Meh", "Okay", "Good", "Loved it"], onSubmit, className }: FormEmojiFeedbackProps) {
  const reduced = useReducedMotion();
  const [r, setR] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);
  const v = r ?? 2; // face shown before choosing = neutral
  const k = v / 4; // 0..1
  const mouth = `M68 ${128 - k * 4} Q100 ${112 + k * 44} 132 ${128 - k * 4}`;
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 220, damping: 18 };

  return (
    <form
      onSubmit={(e) => (e.preventDefault(), r !== null && (setSent(true), onSubmit?.(r + 1, comment)))}
      className={cn("w-[320px] overflow-hidden rounded-[28px] border bg-card p-6 text-center shadow-xl", className)}
    >
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div key="thanks" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-2 py-10">
            <p className="text-4xl" aria-hidden>💌</p>
            <p className="text-lg font-semibold">Thanks for the feedback!</p>
            <button type="button" onClick={() => (setSent(false), setR(null), setComment(""))} className="text-xs text-muted-foreground underline">Rate again</button>
          </motion.div>
        ) : (
          <motion.div key="form" exit={{ opacity: 0, y: -10 }} className="space-y-4">
            <p className="font-semibold">{question}</p>
            <svg viewBox="0 0 200 200" className="mx-auto size-32" aria-hidden>
              <motion.circle cx="100" cy="100" r="80" animate={{ fill: r === null ? "#e4e4e7" : COLORS[v] }} transition={{ duration: reduced ? 0 : 0.35 }} />
              <motion.path d="M58 70 L84 74" stroke="#18181b" strokeWidth="6" strokeLinecap="round" animate={{ rotate: (0.5 - k) * 24, y: k * -4 }} style={{ originX: 0.5, originY: 0.5 }} transition={spring} />
              <motion.path d="M116 74 L142 70" stroke="#18181b" strokeWidth="6" strokeLinecap="round" animate={{ rotate: (k - 0.5) * 24, y: k * -4 }} style={{ originX: 0.5, originY: 0.5 }} transition={spring} />
              <motion.ellipse cx="74" cy="92" rx="8" fill="#18181b" animate={{ ry: 10 - k * 6 }} transition={spring} />
              <motion.ellipse cx="126" cy="92" rx="8" fill="#18181b" animate={{ ry: 10 - k * 6 }} transition={spring} />
              <motion.path fill="none" stroke="#18181b" strokeWidth="7" strokeLinecap="round" animate={{ d: mouth }} transition={spring} />
            </svg>
            <div role="radiogroup" aria-label="Rating" className="flex justify-between gap-1">
              {labels.map((l, i) => (
                <button key={l} type="button" role="radio" aria-checked={r === i} onClick={() => setR(i)} className="relative flex-1 rounded-full py-1.5 text-[11px] font-medium">
                  {r === i && <motion.span layoutId="kn-emoji-pill" className="absolute inset-0 rounded-full" style={{ background: COLORS[i] }} transition={spring} />}
                  <span className={cn("relative", r === i ? "text-black" : "text-muted-foreground")}>{l}</span>
                </button>
              ))}
            </div>
            <AnimatePresence initial={false}>
              {r !== null && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : 0.3 }} className="space-y-3 overflow-hidden">
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2} placeholder={r < 2 ? "What went wrong?" : "What did you like?"} aria-label="Comment" className="w-full resize-none rounded-xl border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  <button type="submit" className="h-10 w-full rounded-full bg-foreground text-sm font-medium text-background">Send feedback</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
