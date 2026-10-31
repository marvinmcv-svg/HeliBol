"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, Copy } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

/** Developer-tool hero: headline, copyable install command and a terminal that types a session — the 'shipped in one command' story. */
export function HeroDevTerminal({ command = "npx kinetik@latest init", className }: { command?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotion();
  const out = ["✔ Detected Next.js 16 + Tailwind v4", "✔ Added lib/kinetik/tokens.ts", "✔ Added 3 components", "✨ Done in 1.8s"];
  const [n, setN] = useState(reduced ? out.length : 0);
  const [typed, setTyped] = useState(reduced ? command.length : 0);
  useEffect(() => {
    if (reduced) return;
    if (typed < command.length) {
      const t = setTimeout(() => setTyped((x) => x + 1), 45);
      return () => clearTimeout(t);
    }
    if (n < out.length) {
      const t = setTimeout(() => setN((x) => x + 1), 380);
      return () => clearTimeout(t);
    }
  }, [typed, n, reduced, command.length, out.length]);
  return (
    <section className={cn("grid items-center gap-10 px-6 py-12 lg:grid-cols-2", className)}>
      <div>
        <p className="font-mono text-xs text-brand">v2.0 is out →</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Motion for your app, in one command.</h1>
        <p className="mt-3 max-w-md text-muted-foreground">Tokens, providers and components land in your repo as source. No lock-in, no runtime.</p>
        <button
          onClick={async () => {
            await navigator.clipboard?.writeText(command).catch(() => {});
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 font-mono text-sm transition-colors hover:bg-accent"
          aria-label={`Copy command: ${command}`}
        >
          <span className="text-muted-foreground">$</span>{command}
          {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4 text-muted-foreground" />}
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 font-mono text-[13px] text-zinc-200 shadow-2xl" aria-hidden>
        <div className="flex gap-1.5 border-b border-white/10 px-4 py-2.5"><span className="size-3 rounded-full bg-rose-500" /><span className="size-3 rounded-full bg-amber-400" /><span className="size-3 rounded-full bg-emerald-500" /></div>
        <div className="min-h-44 space-y-1.5 p-4">
          <p><span className="text-violet-400">❯</span> {command.slice(0, typed)}{typed < command.length && <span className="inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-zinc-300" />}</p>
          {out.slice(0, n).map((l, i) => <motion.p key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className={i === out.length - 1 ? "text-amber-300" : "text-emerald-400"}>{l}</motion.p>)}
        </div>
      </div>
    </section>
  );
}
