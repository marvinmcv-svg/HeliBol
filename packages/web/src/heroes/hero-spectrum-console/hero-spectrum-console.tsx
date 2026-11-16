"use client";
import { cn } from "@kinetik/core";

const css = `
.k-hsc .bar{transform-origin:bottom;animation:k-hsc-eq var(--s) ease-in-out infinite alternate;animation-delay:var(--d)}
@keyframes k-hsc-eq{from{transform:scaleY(.15)}to{transform:scaleY(1)}}
.k-hsc .in{animation:k-hsc-in .9s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hsc-in{from{opacity:0;transform:translateY(14px)}}
.k-hsc .console{animation:k-hsc-rise 1.2s cubic-bezier(.16,1,.3,1) .45s both}
@keyframes k-hsc-rise{from{opacity:0;transform:perspective(900px) rotateX(18deg) translateY(50px)}}
.k-hsc .row{animation:k-hsc-row 3s steps(1) infinite;animation-delay:var(--d)}
@keyframes k-hsc-row{0%,100%{background:transparent}50%{background:#6366f122}}
@media (prefers-reduced-motion:reduce){.k-hsc *{animation:none!important}}
[data-reduce-motion] .k-hsc *{animation:none!important}`;

const seeded = (n: number) => Array.from({ length: n }, (_, i) => ({ h: 20 + ((i * 37) % 80), s: `${0.6 + ((i * 13) % 10) / 10}s`, d: `${-((i * 7) % 10) / 10}s` }));

/** Observability hero: email capture over a console mock flanked by equaliser-style log-volume bars that never stop moving. */
export function HeroSpectrumConsole({ eyebrow = "Log. Troubleshoot. Resolve.", title = "The fastest log search on the planet", className }: { eyebrow?: string; title?: string; className?: string }) {
  const bars = seeded(28);
  return (
    <section className={cn("k-hsc relative overflow-hidden bg-[#0b0b14] px-6 pt-12 text-white", className)}>
      <style href="k-hsc" precedence="kinetik">{css}</style>
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,#312e8155,transparent_70%)]" aria-hidden />
      <div className="relative mx-auto max-w-xl text-center">
        <p className="in text-[11px] font-medium tracking-[.4em] text-indigo-300 uppercase">{eyebrow}</p>
        <h1 className="in mt-4 bg-gradient-to-b from-white to-white/60 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl" style={{ ["--d" as string]: ".08s" }}>{title}</h1>
        <form className="in mx-auto mt-6 flex max-w-md gap-2" style={{ ["--d" as string]: ".18s" }} onSubmit={(e) => e.preventDefault()}>
          <label className="sr-only" htmlFor="k-hsc-email">Work e-mail</label>
          <input id="k-hsc-email" type="email" placeholder="Your work e-mail" className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none placeholder:text-white/40 focus:border-indigo-400" />
          <button className="rounded-lg bg-indigo-500 px-4 text-sm font-medium shadow-[0_0_24px_#6366f188] hover:bg-indigo-400">Start in 30 seconds</button>
        </form>
      </div>
      <div aria-hidden className="relative mx-auto mt-10 flex max-w-4xl items-end gap-4">
        <div className="hidden h-36 flex-1 items-end gap-[3px] sm:flex">{bars.slice(0, 14).map((b, i) => <span key={i} className="bar w-full rounded-t-sm bg-gradient-to-t from-indigo-600/10 to-indigo-400" style={{ height: `${b.h}%`, ["--s" as string]: b.s, ["--d" as string]: b.d }} />)}</div>
        <div className="console w-full max-w-lg rounded-t-xl border border-white/10 bg-[#11111c] p-3 text-[10px] shadow-2xl sm:w-[60%]">
          <div className="mb-2 flex items-center gap-1.5"><span className="size-2 rounded-full bg-white/20" /><span className="size-2 rounded-full bg-white/20" /><span className="ml-2 text-white/50">Dashboards › Load balancer overview</span></div>
          {["GET /api/v1/search 200 12ms", "POST /ingest 202 4ms", "GET /health 200 1ms", "GET /api/v1/tail 200 9ms", "WARN slow query 812ms"].map((r, i) => <p key={r} className="row rounded px-1.5 py-1 font-mono text-white/70" style={{ ["--d" as string]: `${i * 0.6}s` }}>{r}</p>)}
        </div>
        <div className="hidden h-36 flex-1 items-end gap-[3px] sm:flex">{bars.slice(14).map((b, i) => <span key={i} className="bar w-full rounded-t-sm bg-gradient-to-t from-indigo-600/10 to-indigo-400" style={{ height: `${b.h}%`, ["--s" as string]: b.s, ["--d" as string]: b.d }} />)}</div>
      </div>
    </section>
  );
}
