"use client";
import { cn } from "@kinetik/core";

const css = `
.k-hnw .tape{animation:k-hnw-tape 30s linear infinite}
@keyframes k-hnw-tape{to{transform:translateX(-50%)}}
.k-hnw .win{animation:k-hnw-win 1.2s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d)}
@keyframes k-hnw-win{from{opacity:0;transform:translateY(80px) rotate(var(--r))}}
.k-hnw .spark span{animation:k-hnw-spark 1.6s ease-in-out infinite;animation-delay:var(--d)}
@keyframes k-hnw-spark{50%{opacity:.2;transform:scaleY(.5)}}
.k-hnw .in{animation:k-hnw-in .9s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hnw-in{from{opacity:0;transform:translateY(12px)}}
@media (prefers-reduced-motion:reduce){.k-hnw *{animation:none!important}}
[data-reduce-motion] .k-hnw *{animation:none!important}`;

const news = ["Notebook Agent II: AI tools for data people →", "Agentic analytics that actually works →", "It's just us. Not the other one →"];

/** Data-platform hero on dotted paper: italic serif meets heavy sans with a sparkle accent, then three product windows rise and overlap. */
export function HeroNotebookWindows({ serif = "Bring the magic of AI", sans = "to data, for everyone", subtitle = "Anyone can explore data using natural language, with or without code, on trusted context.", className }: { serif?: string; sans?: string; subtitle?: string; className?: string }) {
  const wins = [
    { label: "Agentic data notebooks", title: "Revenue overview", cls: "left-[4%] w-[40%]", d: ".55s", r: "-4deg", body: "select quarter, region, revenue\nfrom galactic_sales\nwhere quarter in ('Q1','Q2','Q3')" },
    { label: "Beautiful data apps", title: "Regions", cls: "right-[4%] w-[40%]", d: ".7s", r: "4deg", body: "Mid-Rim  ▇▇▇▇▇▅\nOuter    ▇▇▇▃\nCore     ▇▇▇▇▇▇▇" },
    { label: "Conversational self-serve", title: "Product line performance", cls: "left-1/2 w-[44%] -translate-x-1/2 z-10", d: ".85s", r: "0deg", body: "Thought for 11 seconds\nI found regional revenue in the semantic model and built a grouped bar chart…" },
  ];
  return (
    <section className={cn("k-hnw relative overflow-hidden bg-[#f6eeed] text-[#1f1a3a]", className)} style={{ backgroundImage: "radial-gradient(#e4cfcf 1px,transparent 1px)", backgroundSize: "12px 12px" }}>
      <style href="k-hnw" precedence="kinetik">{css}</style>
      <div className="overflow-hidden border-b border-[#e6d6d6] bg-[#f6eeed] py-1.5 font-mono text-[10px]"><div className="tape flex w-max gap-10 pr-10">{[...news, ...news, ...news, ...news].map((t, i) => <span key={i} aria-hidden={i >= news.length}>{t}</span>)}</div></div>
      <div className="relative px-6 pt-10 text-center">
        <h1 className="leading-[1]">
          <span className="in relative block font-serif text-4xl italic sm:text-5xl">{serif}<span aria-hidden className="spark absolute -top-2 ml-1 inline-flex gap-0.5">{[0, 1, 2].map((k) => <span key={k} className="block h-3 w-0.5 origin-bottom bg-[#ff7a59]" style={{ transform: `rotate(${(k - 1) * 35}deg)`, ["--d" as string]: `${k * 0.2}s` }} />)}</span></span>
          <span className="in mt-1 block text-4xl font-black tracking-tight sm:text-5xl" style={{ ["--d" as string]: ".12s" }}>{sans}</span>
        </h1>
        <p className="in mx-auto mt-4 max-w-md text-sm text-[#5b5470]" style={{ ["--d" as string]: ".24s" }}>{subtitle}</p>
        <div className="in mt-5 flex justify-center gap-3 text-xs" style={{ ["--d" as string]: ".34s" }}>
          <a href="#" className="rounded-md border border-[#f0a08c] bg-[#fde6df] px-4 py-2 font-medium shadow-[0_0_0_3px_#fde6df]">Get started for free</a>
          <a href="#" className="rounded-md border border-[#d9cfe0] bg-white px-4 py-2">Request a demo</a>
        </div>
      </div>
      <div aria-hidden className="relative mt-8 h-44">
        {wins.map((w) => (
          <div key={w.title} className={cn("win absolute top-0 rounded-lg border border-[#e2dbe8] bg-white text-left shadow-xl", w.cls)} style={{ ["--d" as string]: w.d, ["--r" as string]: w.r }}>
            <span className="absolute -top-5 left-2 rounded bg-white/70 px-1.5 font-mono text-[9px]">{w.label}</span>
            <p className="border-b border-[#eee] px-3 py-1.5 text-[11px] font-semibold">{w.title}</p>
            <pre className="px-3 py-2 font-mono text-[10px] whitespace-pre-wrap text-[#5b5470]">{w.body}</pre>
          </div>
        ))}
      </div>
    </section>
  );
}
