"use client";
import { TextOdometer } from "@web/text/text-odometer/text-odometer";
import { ChartBarGrow } from "@web/data/chart-bar-grow/chart-bar-grow";
import { useEffect, useState } from "react";

export function StatsImpact() {
  const [live, setLive] = useState(2489120);
  useEffect(() => {
    const t = setInterval(() => setLive((v) => v + Math.floor(Math.random() * 900)), 1500);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-sm font-medium text-brand">Impact</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Animations served, live</h2>
          <TextOdometer value={live} className="mt-4 text-5xl font-semibold tracking-tight" />
          <dl className="mt-8 grid grid-cols-2 gap-6">
            {[["194", "Components"], ["99.98%", "Uptime"], ["38", "Edge regions"], ["4.6 KB", "Min. runtime"]].map(([v, l]) => <div key={l}><dd className="text-2xl font-semibold">{v}</dd><dt className="text-xs text-muted-foreground">{l}</dt></div>)}
          </dl>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6">
          <p className="mb-4 text-sm font-semibold">Monthly installs (k)</p>
          <ChartBarGrow height={240} data={["J", "F", "M", "A", "M", "J", "J", "A", "S", "O"].map((label, i) => ({ label, value: [12, 18, 22, 31, 29, 44, 52, 61, 78, 96][i], highlight: i === 9 }))} />
        </div>
      </div>
    </section>
  );
}
