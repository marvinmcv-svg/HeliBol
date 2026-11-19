"use client";
import { useEffect, useId, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export interface WaitlistFormProps {
  /** People already on the list. */
  count: number;
  avatars?: string[];
  /** Resolve to accept, reject with an Error to show its message. */
  onJoin?: (email: string) => Promise<void>;
  className?: string;
}

/**
 * Waitlist signup: the email pill morphs into a success state with your place in line, the
 * joined counter rolls up by one, avatars shuffle to make room for yours, and errors shake the
 * field with a message.
 */
export function WaitlistForm({ count, avatars = [], onJoin = async () => new Promise((r) => setTimeout(r, 900)), className }: WaitlistFormProps) {
  const reduced = useReducedMotion();
  const id = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);
  const total = useMotionValue(count);
  const shown = useTransform(total, (v) => Math.round(v).toLocaleString());
  const [place, setPlace] = useState(count + 1);

  useEffect(() => total.set(count), [count, total]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      setState("error");
      setShake((s) => s + 1);
      return;
    }
    setState("loading");
    try {
      await onJoin(email);
      setPlace(Math.round(total.get()) + 1);
      if (reduced) total.set(total.get() + 1);
      else animate(total, total.get() + 1, { duration: 0.8, ease: "easeOut" });
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
      setShake((s) => s + 1);
    }
  };

  return (
    <div className={cn("w-full max-w-sm space-y-4", className)}>
      <AnimatePresence mode="wait" initial={false}>
        {state === "done" ? (
          <motion.div
            key="done"
            layoutId={`${id}-pill`}
            transition={reduced ? { duration: 0 } : spring.smooth}
            className="flex h-12 items-center gap-3 rounded-full bg-emerald-500 px-4 text-sm font-medium text-white"
            role="status"
          >
            <motion.span initial={reduced ? false : { scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ ...spring.bouncy, delay: 0.1 }} className="grid size-6 place-items-center rounded-full bg-white/25">
              <Check className="size-4" strokeWidth={3} />
            </motion.span>
            You&apos;re in — #{place.toLocaleString()} in line
          </motion.div>
        ) : (
          <motion.form
            key="form"
            layoutId={`${id}-pill`}
            onSubmit={submit}
            noValidate
            transition={reduced ? { duration: 0 } : spring.smooth}
            animate={shake && !reduced ? { x: [0, -8, 8, -5, 5, 0] } : undefined}
            className={cn("flex h-12 items-center gap-1 rounded-full border bg-background p-1 pl-4 shadow-sm focus-within:ring-2 focus-within:ring-ring", state === "error" ? "border-rose-500" : "border-border")}
          >
            <label htmlFor={id} className="sr-only">Email address</label>
            <input
              id={id}
              type="email"
              value={email}
              onChange={(e) => (setEmail(e.target.value), state === "error" && setState("idle"))}
              placeholder="you@company.com"
              aria-invalid={state === "error"}
              aria-describedby={state === "error" ? `${id}-err` : undefined}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button type="submit" disabled={state === "loading"} className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-foreground px-4 text-sm font-medium text-background disabled:opacity-70">
              {state === "loading" ? <Loader2 className="size-4 animate-spin motion-reduce:animate-none" /> : <>Join <ArrowRight className="size-4" /></>}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      <p id={`${id}-err`} className="h-4 px-4 text-xs text-rose-500" aria-live="assertive">{state === "error" ? error : ""}</p>
      <div className="flex items-center gap-3 px-1">
        <div className="flex -space-x-2">
          <AnimatePresence initial={false}>
            {state === "done" && (
              <motion.span key="you" initial={reduced ? false : { scale: 0, width: 0 }} animate={{ scale: 1, width: 28 }} transition={spring.bouncy} className="grid size-7 place-items-center rounded-full border-2 border-background bg-emerald-500 text-[10px] font-bold text-white">
                You
              </motion.span>
            )}
          </AnimatePresence>
          {avatars.slice(0, 4).map((a) => <motion.img layout key={a} src={a} alt="" className="size-7 rounded-full border-2 border-background object-cover" />)}
        </div>
        <p className="text-sm text-muted-foreground">
          <motion.span className="font-semibold tabular-nums text-foreground">{shown}</motion.span> people joined
        </p>
      </div>
    </div>
  );
}
