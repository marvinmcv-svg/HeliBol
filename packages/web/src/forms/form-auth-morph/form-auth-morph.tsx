"use client";
import { useId, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export interface FormAuthMorphProps {
  onSubmit?: (mode: "signin" | "signup", data: Record<string, string>) => void;
  brand?: string;
  className?: string;
}

/**
 * One card, two forms: switching Sign in ↔ Create account morphs the card's height, slides the tab
 * indicator, keeps the shared Email/Password fields in place (shared layout) while the Name and
 * Confirm fields grow in and out, and the title and button label roll to their new text.
 */
export function FormAuthMorph({ onSubmit, brand = "kinetik", className }: FormAuthMorphProps) {
  const reduced = useReducedMotion();
  const id = useId();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const signup = mode === "signup";
  const t = reduced ? { duration: 0 } : spring.smooth;
  const field = (name: string, label: string, type = "text", auto?: string) => (
    <motion.div key={name} layout={!reduced} transition={t} className="space-y-1">
      <label htmlFor={`${id}-${name}`} className="text-xs font-medium text-muted-foreground">{label}</label>
      <input id={`${id}-${name}`} name={name} type={type} autoComplete={auto} required className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
    </motion.div>
  );
  const extra = (name: string, label: string, type: string, auto: string) => (
    <motion.div
      key={name}
      initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0, y: -6 }}
      animate={{ opacity: 1, height: "auto", y: 0 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0, y: -6 }}
      transition={t}
      className="overflow-hidden"
    >
      <div className="space-y-1 pb-3">
        <label htmlFor={`${id}-${name}`} className="text-xs font-medium text-muted-foreground">{label}</label>
        <input id={`${id}-${name}`} name={name} type={type} autoComplete={auto} required className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </div>
    </motion.div>
  );
  const roll = (text: string) => (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span key={text} className="inline-block" initial={reduced ? { opacity: 0 } : { y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduced ? { opacity: 0 } : { y: -14, opacity: 0 }} transition={t}>{text}</motion.span>
    </AnimatePresence>
  );

  return (
    <LayoutGroup>
      <motion.form
        layout={!reduced}
        transition={t}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(mode, Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>);
        }}
        className={cn("w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xl", className)}
        style={{ borderRadius: 24 }}
        aria-labelledby={`${id}-title`}
      >
        <motion.div layout={!reduced} transition={t}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{brand}</p>
          <h2 id={`${id}-title`} className="mt-1 overflow-hidden text-2xl font-semibold tracking-tight">{roll(signup ? "Create your account" : "Welcome back")}</h2>
          <div role="tablist" aria-label="Mode" className="mt-5 grid grid-cols-2 rounded-xl bg-muted p-1 text-sm">
            {(["signin", "signup"] as const).map((m) => (
              <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => setMode(m)} className={cn("relative rounded-lg py-1.5 font-medium transition-colors", mode === m ? "text-foreground" : "text-muted-foreground")}>
                {mode === m && <motion.span layoutId={`${id}-tab`} transition={t} className="absolute inset-0 rounded-lg bg-background shadow-sm" />}
                <span className="relative">{m === "signin" ? "Sign in" : "Create account"}</span>
              </button>
            ))}
          </div>
        </motion.div>
        <div className="mt-5">
          <AnimatePresence initial={false}>{signup && extra("name", "Full name", "text", "name")}</AnimatePresence>
          <div className="space-y-3">
            {field("email", "Email", "email", "email")}
            {field("password", "Password", "password", signup ? "new-password" : "current-password")}
          </div>
          <AnimatePresence initial={false}>{signup && <div className="pt-3">{extra("confirm", "Confirm password", "password", "new-password")}</div>}</AnimatePresence>
          <AnimatePresence initial={false}>
            {!signup && (
              <motion.a key="forgot" href="#forgot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-2 block text-right text-xs text-muted-foreground hover:text-foreground">
                Forgot password?
              </motion.a>
            )}
          </AnimatePresence>
        </div>
        <motion.button layout={!reduced} transition={t} type="submit" className="mt-5 h-11 w-full overflow-hidden rounded-xl bg-foreground text-sm font-semibold text-background">
          {roll(signup ? "Create account" : "Sign in")}
        </motion.button>
      </motion.form>
    </LayoutGroup>
  );
}
