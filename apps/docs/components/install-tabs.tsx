"use client";
import { useSyncExternalStore } from "react";
import { cn } from "@kinetik/core";
import { CopyButton } from "./copy-button";

type PM = "npm" | "pnpm" | "yarn" | "bun";
const PMS: PM[] = ["npm", "pnpm", "yarn", "bun"];
const KEY = "kinetik-pm";
const listeners = new Set<() => void>();
const getPm = (): PM => {
  try {
    const v = localStorage.getItem(KEY) as PM | null;
    return v && PMS.includes(v) ? v : "npm";
  } catch {
    return "npm";
  }
};
const setPm = (pm: PM) => {
  try {
    localStorage.setItem(KEY, pm);
  } catch {}
  listeners.forEach((l) => l());
};
const subscribe = (cb: () => void) => (listeners.add(cb), () => void listeners.delete(cb));

const dlx: Record<PM, string> = { npm: "npx", pnpm: "pnpm dlx", yarn: "yarn dlx", bun: "bunx --bun" };
const add: Record<PM, string> = { npm: "npm i", pnpm: "pnpm add", yarn: "yarn add", bun: "bun add" };

/**
 * Install command in the visitor's package manager (npm / pnpm / yarn / bun). The choice is
 * remembered and shared by every install block on the site, like 21st.dev's preference.
 */
export function InstallTabs({ registryUrl, dependencies }: { registryUrl: string; dependencies: string[] }) {
  const pm = useSyncExternalStore(subscribe, getPm, () => "npm" as PM);
  const cli = `${dlx[pm]} shadcn@latest add ${registryUrl}`;
  const manual = dependencies.length ? `${add[pm]} ${dependencies.join(" ")}` : null;
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div role="tablist" aria-label="Package manager" className="flex gap-1 border-b border-border px-2 pt-2">
        {PMS.map((p) => (
          <button
            key={p}
            role="tab"
            aria-selected={pm === p}
            onClick={() => setPm(p)}
            className={cn("rounded-t-lg px-3 py-1.5 font-mono text-xs transition-colors", pm === p ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            {p}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="space-y-3 p-4 font-mono text-[13px]">
        <div className="flex items-start justify-between gap-3">
          <code className="min-w-0 break-all"><span className="text-muted-foreground">$ </span>{cli}</code>
          <CopyButton text={cli} label="Copy" icon="terminal" className="h-7 shrink-0 rounded-lg border border-border px-2 text-xs" />
        </div>
        {manual && (
          <div className="flex items-start justify-between gap-3 border-t border-border pt-3 text-muted-foreground">
            <code className="min-w-0 break-all"><span className="opacity-60"># or just the dependencies: </span>{manual}</code>
            <CopyButton text={manual} label="Copy" icon="terminal" className="h-7 shrink-0 rounded-lg border border-border px-2 text-xs" />
          </div>
        )}
      </div>
    </div>
  );
}
