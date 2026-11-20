"use client";
import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface FormCreditCardProps {
  onSubmit?: (card: { number: string; name: string; expiry: string; cvc: string }) => void;
  className?: string;
}

type Brand = "visa" | "mastercard" | "amex" | "card";
const brandOf = (n: string): Brand => (/^4/.test(n) ? "visa" : /^(5[1-5]|2[2-7])/.test(n) ? "mastercard" : /^3[47]/.test(n) ? "amex" : "card");
const skins: Record<Brand, string> = {
  visa: "from-indigo-600 via-blue-600 to-sky-500",
  mastercard: "from-zinc-900 via-zinc-800 to-orange-700",
  amex: "from-emerald-700 via-teal-600 to-cyan-500",
  card: "from-zinc-700 via-zinc-800 to-zinc-900",
};

/**
 * Payment form with a live 3D card: digits roll into place as you type, the card skin cross-fades
 * to the detected brand, the focused field gets a glowing outline on the card, and focusing CVC
 * flips the card to its back. Real labelled inputs with autocomplete hints.
 */
export function FormCreditCard({ onSubmit, className }: FormCreditCardProps) {
  const reduced = useReducedMotion();
  const id = useId();
  const [v, setV] = useState({ number: "", name: "", expiry: "", cvc: "" });
  const [focus, setFocus] = useState<keyof typeof v | null>(null);
  const digits = v.number.replace(/\D/g, "").slice(0, 16);
  const brand = brandOf(digits);
  const shown = (digits + "•".repeat(16 - digits.length)).replace(/(.{4})/g, "$1 ").trim();
  const flipped = focus === "cvc";
  const glow = (k: keyof typeof v) => cn("rounded-md px-1 transition-shadow duration-300", focus === k && "shadow-[0_0_0_2px_rgb(255_255_255/.8)]");

  const set = (k: keyof typeof v, raw: string) => {
    let val = raw;
    if (k === "number") val = raw.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    if (k === "expiry") val = raw.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");
    if (k === "cvc") val = raw.replace(/\D/g, "").slice(0, 4);
    setV((s) => ({ ...s, [k]: val }));
  };
  const input = (k: keyof typeof v, label: string, auto: string, extra?: string) => (
    <div className={cn("space-y-1", extra)}>
      <label htmlFor={`${id}-${k}`} className="text-xs font-medium text-muted-foreground">{label}</label>
      <input
        id={`${id}-${k}`}
        value={v[k]}
        onChange={(e) => set(k, e.target.value)}
        onFocus={() => setFocus(k)}
        onBlur={() => setFocus(null)}
        autoComplete={auto}
        inputMode={k === "name" ? "text" : "numeric"}
        className="h-10 w-full rounded-xl border border-border bg-background px-3 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );

  return (
    <form onSubmit={(e) => (e.preventDefault(), onSubmit?.(v))} className={cn("w-full max-w-sm space-y-5", className)}>
      <div className="mx-auto aspect-[1.586] w-full max-w-[19rem]" style={{ perspective: 1000 }} aria-hidden>
        <motion.div className="relative size-full" style={{ transformStyle: "preserve-3d" }} animate={{ rotateY: flipped ? 180 : 0 }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 16 }}>
          {/* front */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl p-5 font-mono text-white shadow-2xl [backface-visibility:hidden]">
            <AnimatePresence initial={false}>
              <motion.div key={brand} className={cn("absolute inset-0 bg-gradient-to-br", skins[brand])} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
            </AnimatePresence>
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="h-7 w-10 rounded-md bg-gradient-to-br from-yellow-200 to-amber-400" />
                <span className="text-sm font-bold uppercase italic tracking-wide">{brand === "card" ? "" : brand}</span>
              </div>
              <div className={cn("flex gap-[0.05em] text-lg tracking-widest", glow("number"))}>
                {shown.split("").map((ch, i) => (
                  <span key={i} className="relative inline-block w-[0.62em] overflow-hidden text-center">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span key={ch} className="inline-block" initial={reduced ? false : { y: "-100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduced ? undefined : { y: "100%", opacity: 0 }} transition={{ duration: 0.18 }}>{ch === " " ? " " : ch}</motion.span>
                    </AnimatePresence>
                  </span>
                ))}
              </div>
              <div className="flex items-end justify-between text-xs uppercase">
                <span className={cn("max-w-[70%] truncate", glow("name"))}>{v.name || "Your name"}</span>
                <span className={glow("expiry")}>{v.expiry || "MM/YY"}</span>
              </div>
            </div>
          </div>
          {/* back */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 text-white shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="mt-6 h-10 bg-black" />
            <div className="mx-5 mt-4 flex items-center justify-end rounded bg-white/90 px-3 py-1.5 font-mono text-sm text-zinc-900">{v.cvc.replace(/./g, "•") || "CVC"}</div>
          </div>
        </motion.div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {input("number", "Card number", "cc-number", "col-span-2")}
        {input("name", "Name on card", "cc-name", "col-span-2")}
        {input("expiry", "Expiry", "cc-exp")}
        {input("cvc", "CVC", "cc-csc")}
      </div>
      <button type="submit" className="h-11 w-full rounded-xl bg-foreground text-sm font-semibold text-background">Pay $49.00</button>
    </form>
  );
}
