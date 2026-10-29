"use client";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import { cn } from "@kinetik/core";
import { duration as durations, easeBezier, gsapEase, springConfig, type SpringToken } from "@kinetik/tokens";
import { CopyButton } from "./copy-button";

type EaseName = keyof typeof easeBezier;

function bezierPoint(t: number, [x1, y1, x2, y2]: readonly number[]) {
  const c = (a: number, b: number) => 3 * a * (1 - t) ** 2 * t + 3 * b * (1 - t) * t ** 2 + t ** 3;
  return [c(x1, x2), c(y1, y2)];
}

/** Integrate a damped spring (unit step from 0 → 1). */
function simulateSpring({ stiffness, damping, mass }: { stiffness: number; damping: number; mass: number }) {
  const pts: number[] = [];
  let x = 0;
  let v = 0;
  const dt = 1 / 240;
  let settled = 0;
  for (let i = 0; i < 240 * 3; i++) {
    const a = (-stiffness * (x - 1) - damping * v) / mass;
    v += a * dt;
    x += v * dt;
    if (i % 4 === 0) pts.push(x);
    if (Math.abs(x - 1) < 0.001 && Math.abs(v) < 0.01) {
      if (++settled > 30) break;
    } else settled = 0;
  }
  return pts;
}

function Panel({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-5", className)}>
      <h2 className="mb-4 text-sm font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Snippet({ label, code }: { label: string; code: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-background py-1 pr-1 pl-3">
      <span className="w-20 shrink-0 text-[11px] text-muted-foreground">{label}</span>
      <code className="flex-1 truncate font-mono text-[11px]">{code}</code>
      <CopyButton text={code} />
    </div>
  );
}

function Slider({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void }) {
  return (
    <label className="block text-xs">
      <span className="flex justify-between text-muted-foreground"><span>{label}</span><span className="font-mono text-foreground tabular-nums">{value}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1.5 w-full accent-[var(--brand)]" />
    </label>
  );
}

export function Playground() {
  const [ease, setEase] = useState<EaseName>("expoOut");
  const [dur, setDur] = useState<number>(durations.slow);
  const [runE, setRunE] = useState(0);
  const [preset, setPreset] = useState<SpringToken>("smooth");
  const [cfg, setCfg] = useState(springConfig.smooth);
  const [runS, setRunS] = useState(0);

  const curve = useMemo(() => {
    const pts = Array.from({ length: 61 }, (_, i) => bezierPoint(i / 60, easeBezier[ease]));
    return pts.map(([x, y], i) => `${i ? "L" : "M"}${10 + x * 180},${170 - y * 140}`).join(" ");
  }, [ease]);
  const springPts = useMemo(() => simulateSpring(cfg), [cfg]);
  const springPath = springPts.map((y, i) => `${i ? "L" : "M"}${10 + (i / (springPts.length - 1)) * 280},${150 - y * 110}`).join(" ");
  const settle = Math.round((springPts.length * 4) / 240 * 1000);
  const bz = easeBezier[ease].join(", ");

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Easing curves">
        <div className="mb-4 flex flex-wrap gap-1.5">
          {(Object.keys(easeBezier) as EaseName[]).map((e) => (
            <button key={e} onClick={() => { setEase(e); setRunE((r) => r + 1); }} aria-pressed={ease === e} className={cn("rounded-full border px-2.5 py-1 text-xs", ease === e ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground")}>{e}</button>
          ))}
        </div>
        <div className="grid grid-cols-[200px_1fr] items-center gap-4">
          <svg viewBox="0 0 200 180" className="w-full rounded-xl bg-muted/50">
            <path d="M10 170 L190 30" className="stroke-border" strokeDasharray="4 4" fill="none" />
            <path d={curve} fill="none" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="space-y-4">
            <div className="relative h-12 rounded-xl bg-muted/50 [container-type:inline-size]">
              <motion.div key={`${runE}-${ease}-${dur}`} className="absolute top-2 left-2 size-8 rounded-lg bg-brand" initial={{ x: 0 }} animate={{ x: "calc(100cqw - 3rem)" }} transition={{ duration: dur / 1000, ease: easeBezier[ease] }} />
            </div>
            <div className="relative h-12 overflow-hidden rounded-xl bg-muted/50 [container-type:inline-size]">
              <motion.div key={`b-${runE}-${ease}-${dur}`} className="absolute inset-y-2 left-2 rounded-lg bg-foreground/80" initial={{ width: 0 }} animate={{ width: "calc(100% - 1rem)" }} transition={{ duration: dur / 1000, ease: easeBezier[ease] }} />
            </div>
            <Slider label="Duration (ms)" value={dur} min={100} max={1500} step={10} onChange={setDur} />
            <button onClick={() => setRunE((r) => r + 1)} className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background"><Play className="size-3" /> Play</button>
          </div>
        </div>
        <div className="mt-5 space-y-1.5">
          <Snippet label="CSS" code={`transition: transform ${dur}ms cubic-bezier(${bz});`} />
          <Snippet label="Motion" code={`transition={{ duration: ${dur / 1000}, ease: [${bz}] }}`} />
          <Snippet label="GSAP" code={`gsap.to(el, { duration: ${dur / 1000}, ease: "${gsapEase[ease]}" })`} />
          <Snippet label="Reanimated" code={`withTiming(v, { duration: ${dur}, easing: Easing.bezier(${bz}) })`} />
          <Snippet label="Token" code={`import { ease, duration } from "@/lib/kinetik/tokens"; // ease.${ease}`} />
        </div>
      </Panel>

      <Panel title="Springs">
        <div className="mb-4 flex flex-wrap gap-1.5">
          {(Object.keys(springConfig) as SpringToken[]).map((p) => (
            <button key={p} onClick={() => { setPreset(p); setCfg(springConfig[p]); setRunS((r) => r + 1); }} aria-pressed={preset === p} className={cn("rounded-full border px-2.5 py-1 text-xs", preset === p ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground")}>{p}</button>
          ))}
        </div>
        <svg viewBox="0 0 300 170" className="w-full rounded-xl bg-muted/50">
          <path d="M10 40 H290" className="stroke-border" strokeDasharray="4 4" />
          <path d={springPath} fill="none" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round" />
          <text x="290" y="162" textAnchor="end" className="fill-muted-foreground text-[10px]">settles ≈ {settle}ms</text>
        </svg>
        <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-6">
          <div className="space-y-3">
            <Slider label="Stiffness" value={cfg.stiffness} min={50} max={800} onChange={(v) => setCfg((c) => ({ ...c, stiffness: v }))} />
            <Slider label="Damping" value={cfg.damping} min={5} max={80} onChange={(v) => setCfg((c) => ({ ...c, damping: v }))} />
            <Slider label="Mass" value={cfg.mass} min={0.2} max={4} step={0.1} onChange={(v) => setCfg((c) => ({ ...c, mass: v }))} />
          </div>
          <button onClick={() => setRunS((r) => r + 1)} className="grid size-28 place-items-center rounded-2xl bg-muted/50" aria-label="Replay spring">
            <motion.div key={`${runS}-${cfg.stiffness}-${cfg.damping}-${cfg.mass}`} className="size-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500" initial={{ scale: 0.3, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", ...cfg }} />
          </button>
        </div>
        <div className="mt-5 space-y-1.5">
          <Snippet label="Motion" code={`transition={{ type: "spring", stiffness: ${cfg.stiffness}, damping: ${cfg.damping}, mass: ${cfg.mass} }}`} />
          <Snippet label="Reanimated" code={`withSpring(v, { stiffness: ${cfg.stiffness}, damping: ${cfg.damping}, mass: ${cfg.mass} })`} />
          <Snippet label="CSS" code={`/* use the springCss token: linear(...) */ transition-timing-function: var(--k-ease-springCss);`} />
        </div>
      </Panel>
    </div>
  );
}
