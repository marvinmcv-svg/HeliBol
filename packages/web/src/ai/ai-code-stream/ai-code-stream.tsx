"use client";
import { useEffect, useState } from "react";
import { cn, useReducedMotion } from "@kinetik/core";

export type CodeToken = [text: string, kind?: "kw" | "str" | "fn" | "num" | "com" | "punct"];

const color: Record<string, string> = { kw: "text-fuchsia-400", str: "text-emerald-400", fn: "text-sky-400", num: "text-amber-300", com: "text-zinc-500 italic", punct: "text-zinc-400" };

/** Code block that "streams" in token by token like an AI writing it, with a block caret and file tab. */
export function AiCodeStream({ tokens, file = "component.tsx", speed = 18, className }: { tokens: CodeToken[]; file?: string; speed?: number; className?: string }) {
  const total = tokens.reduce((n, [t]) => n + t.length, 0);
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduced) return setN(total);
    setN(0);
    const id = setInterval(() => setN((x) => (x >= total ? (clearInterval(id), x) : x + 2)), speed);
    return () => clearInterval(id);
  }, [total, speed, reduced]);
  let left = n;
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 font-mono text-[13px] text-zinc-200 shadow-2xl", className)}>
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2 text-xs text-zinc-400">
        <span className="size-2.5 rounded-full bg-rose-500/80" /><span className="size-2.5 rounded-full bg-amber-500/80" /><span className="size-2.5 rounded-full bg-emerald-500/80" />
        <span className="ml-2">{file}</span>
        {n < total && <span className="ml-auto animate-pulse text-violet-400">● writing</span>}
      </div>
      <pre className="overflow-x-auto p-4 leading-relaxed" aria-label={tokens.map(([t]) => t).join("")}>
        <code aria-hidden>
          {tokens.map(([t, k], i) => {
            if (left <= 0) return null;
            const part = t.slice(0, left);
            left -= t.length;
            return <span key={i} className={k ? color[k] : undefined}>{part}</span>;
          })}
          {n < total && <span className="inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-violet-400" />}
        </code>
      </pre>
    </div>
  );
}
