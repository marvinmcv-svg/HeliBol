"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

/** Newsletter field where the whole pill morphs into a "You're in" confirmation after submit. */
export function ButtonSubscribe({ onSubscribe, className }: { onSubscribe?: (email: string) => Promise<unknown> | void; className?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const valid = /\S+@\S+\.\S+/.test(email);
  return (
    <motion.form
      layout
      transition={spring.smooth}
      onSubmit={async (e) => {
        e.preventDefault();
        if (!valid || state !== "idle") return;
        setState("busy");
        await onSubscribe?.(email);
        await new Promise((r) => setTimeout(r, 700));
        setState("done");
      }}
      className={cn("flex h-12 items-center overflow-hidden rounded-full border border-border bg-card p-1", state === "done" && "border-emerald-500/40 bg-emerald-500/10", className)}
      style={{ width: state === "done" ? 230 : 360 }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {state === "done" ? (
          <motion.p key="done" role="status" className="flex w-full items-center justify-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <motion.span initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={spring.bouncy}>✓</motion.span> You&apos;re on the list
          </motion.p>
        ) : (
          <motion.div key="form" className="flex w-full items-center" exit={{ opacity: 0 }}>
            <label className="sr-only" htmlFor="k-sub-email">Email</label>
            <input id="k-sub-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" />
            <button disabled={!valid || state === "busy"} className="h-10 shrink-0 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity disabled:opacity-40">
              {state === "busy" ? "…" : "Subscribe"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
