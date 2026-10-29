"use client";
import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Eye, EyeOff } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

const rules = [
  { label: "8+ characters", test: (s: string) => s.length >= 8 },
  { label: "Upper & lower case", test: (s: string) => /[a-z]/.test(s) && /[A-Z]/.test(s) },
  { label: "A number", test: (s: string) => /\d/.test(s) },
  { label: "A symbol", test: (s: string) => /[^A-Za-z0-9]/.test(s) },
];
const levels = [
  { label: "Too weak", color: "bg-red-500" },
  { label: "Weak", color: "bg-orange-500" },
  { label: "Fair", color: "bg-amber-500" },
  { label: "Good", color: "bg-lime-500" },
  { label: "Strong", color: "bg-emerald-500" },
];

export function PasswordStrength({ className, onChange }: { className?: string; onChange?: (value: string, score: number) => void }) {
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const id = useId();
  const passed = useMemo(() => rules.map((r) => r.test(value)), [value]);
  const score = value ? passed.filter(Boolean).length : 0;
  const level = levels[score];
  return (
    <div className={cn("w-full space-y-3", className)}>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onChange?.(e.target.value, rules.filter((r) => r.test(e.target.value)).length);
          }}
          placeholder="Create a password"
          aria-describedby={`${id}-s`}
          className="h-11 w-full rounded-xl border border-input bg-card pr-10 pl-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
        />
        <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:text-foreground">
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      <div className="flex gap-1.5" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <motion.div className={cn("h-full origin-left rounded-full", level.color)} animate={{ scaleX: i < score ? 1 : 0 }} transition={{ ...spring.smooth, delay: i * 0.04 }} />
          </div>
        ))}
      </div>
      <p id={`${id}-s`} aria-live="polite" className="h-4 text-xs text-muted-foreground">
        {value && <>Strength: <span className="font-medium text-foreground">{level.label}</span></>}
      </p>
      <ul className="grid grid-cols-2 gap-1.5 text-xs">
        {rules.map((r, i) => (
          <li key={r.label} className={cn("flex items-center gap-1.5 transition-colors", passed[i] ? "text-foreground" : "text-muted-foreground")}>
            <span className={cn("grid size-4 place-items-center rounded-full border transition-colors", passed[i] ? "border-emerald-500 bg-emerald-500 text-white" : "border-border")}>
              <AnimatePresence>{passed[i] && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring.bouncy}><Check className="size-2.5" strokeWidth={4} /></motion.span>}</AnimatePresence>
            </span>
            {r.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
