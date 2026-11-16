"use client";
import { cn } from "@kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Plus+Jakarta+Sans:wght@400;500;800&family=JetBrains+Mono&display=swap";
const css = `
.k-hnw{font-family:"Plus Jakarta Sans",ui-sans-serif,system-ui,sans-serif}
.k-hnw .mono{font-family:"JetBrains Mono",ui-monospace,monospace}
.k-hnw .tape{animation:k-hnw-tape 40s linear infinite}
@keyframes k-hnw-tape{to{transform:translateX(-50%)}}
.k-hnw .win{animation:k-hnw-win 1.2s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d)}
@keyframes k-hnw-win{from{opacity:0;transform:translateY(80px)}}
.k-hnw .spark span{animation:k-hnw-spark 1.6s ease-in-out infinite;animation-delay:var(--d)}
@keyframes k-hnw-spark{50%{opacity:.2}}
.k-hnw .in{animation:k-hnw-in .9s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hnw-in{from{opacity:0;transform:translateY(12px)}}
@media (prefers-reduced-motion:reduce){.k-hnw *{animation:none!important}}
[data-reduce-motion] .k-hnw *{animation:none!important}`;

const news = ["Agentic analytics tools that actually work →", "🤖 Notebook Agent Act II: AI tools for data people just got even better →", "🙏 It's just \"Hux\"! Not \"HUX\" or \"Hux dot tech\" →", "↗ Bringing data to everyone →"];
const Handles = () => <>{["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map((p) => <i key={p} aria-hidden className={cn("absolute size-1.5 border border-[#e08e7b] bg-white", p)} />)}</>;

/** Data-platform hero on dotted pink paper: news ticker, centered-logo nav, italic serif + heavy sans headline with a sparkle, handle-framed CTAs and three product windows rising and overlapping at the fold. */
export function HeroNotebookWindows({ serif = "Bring the magic of AI", sans = "to data, for everyone", subtitle = "Finally — anyone can explore data using natural language, with or without code, on trusted context, in one integrated platform.", className }: { serif?: string; sans?: string; subtitle?: string; className?: string }) {
  return (
    <section className={cn("k-hnw relative flex flex-col overflow-hidden bg-[#f7efee] px-[1.8%] text-[#1d1a3a]", className)} style={{ backgroundImage: "radial-gradient(#e7d3d3 1px,transparent 1px)", backgroundSize: "10px 10px" }}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hnw" precedence="kinetik">{css}</style>
      <div className="mono overflow-hidden border-b border-[#e6d6d6] py-2 text-[11px]"><div className="tape flex w-max gap-6 pr-6">{[...news, ...news].map((t, i) => <span key={i} aria-hidden={i >= news.length}>{t}</span>)}</div></div>
      <nav className="flex items-center justify-center gap-8 py-4 text-[13px] whitespace-nowrap"><a href="#" className="max-lg:hidden">Platform ⌄</a><a href="#" className="max-lg:hidden">Solutions ⌄</a><a href="#">Enterprise</a><b className="mx-6 text-[22px] font-extrabold tracking-[.08em]">HUX</b><a href="#" className="max-lg:hidden">Resources ⌄</a><a href="#">Pricing</a><a href="#">Log In</a><a href="#" className="relative border border-[#e08e7b] bg-[#fbe4dd] px-3 py-1.5"><Handles />Get started</a></nav>
      <div className="relative pt-[3.5%] text-center">
        <h1 className="leading-[1.05]">
          <span className="in relative inline-block text-[clamp(2.6rem,5.6vw,5.4rem)] tracking-[-.02em]" style={{ fontFamily: '"Instrument Serif",serif', fontStyle: "italic" }}>{serif}<span aria-hidden className="spark absolute -top-[10%] -right-[9%] block size-10">{[-50, -15, 20].map((r, k) => <span key={r} className="absolute bottom-0 left-1/2 block h-4 w-px origin-bottom bg-[#ff7a59]" style={{ transform: `rotate(${r}deg) translateY(-8px)`, ["--d" as string]: `${k * 0.2}s` }} />)}</span></span>
          <span className="in block text-[clamp(2.4rem,5.1vw,4.9rem)] font-extrabold tracking-[-.03em]" style={{ ["--d" as string]: ".12s" }}>{sans}</span>
        </h1>
        <p className="in mx-auto mt-4 max-w-[38rem] text-[clamp(.95rem,1.6vw,1.5rem)] leading-snug text-[#4f4a66]" style={{ ["--d" as string]: ".24s" }}>{subtitle}</p>
        <div className="in mt-6 flex justify-center gap-3 text-[13px]" style={{ ["--d" as string]: ".34s" }}>
          <a href="#" className="relative border border-[#e08e7b] bg-[#fbe4dd] px-5 py-3 font-medium shadow-[0_0_0_4px_#fde9e3]"><Handles />Get started for free</a>
          <a href="#" className="border border-[#e1d6e6] bg-white px-5 py-3">Request a demo</a>
        </div>
      </div>
      <div aria-hidden className="relative mt-[5%] flex-1 text-left text-[10px]">
        <div className="win absolute top-[18%] left-[2%] w-[45%] rounded-t-lg border border-[#e2dbe8] bg-white shadow-xl" style={{ ["--d" as string]: ".55s" }}><span className="mono absolute -top-6 left-2 border border-[#e2dbe8] bg-white/70 px-1.5 py-0.5 text-[9px]">Agentic data notebooks</span><p className="flex justify-between border-b px-3 py-2 font-semibold"><span><b className="tracking-[.08em]">HUX</b>&nbsp;&nbsp;Galactic Revenue Insights</span><span>▣ Notebook</span></p><div className="p-4 pl-10"><p className="text-[clamp(.9rem,1.6vw,1.5rem)] font-bold">NexaCorp Revenue Overview</p><p className="text-zinc-400">Add a description...</p><pre className="mono mt-3 text-[9px] whitespace-pre-wrap text-[#5b4fc4]">{"select quarter, product_line, region, customer_sector,\nfrom galactic_sales.revenue\nwhere quarter in ('Q1-2025', 'Q2-2025', 'Q3-2025')"}</pre></div></div>
        <div className="win absolute top-[22%] right-[2%] w-[24%] rounded-t-lg border border-[#e2dbe8] bg-white shadow-xl" style={{ ["--d" as string]: ".7s" }}><span className="mono absolute -top-6 right-2 border border-[#e2dbe8] bg-white/70 px-1.5 py-0.5 text-[9px]">Beautiful data apps</span><p className="flex justify-end gap-3 border-b px-3 py-2"><span>Edit</span><span>Share</span></p><div className="p-3"><p className="text-[clamp(.9rem,1.5vw,1.4rem)] font-bold">Overview</p><p className="text-zinc-500">Revenue across product lines, regions, and customer sectors.</p><div className="mt-3 grid grid-cols-2 gap-2 font-bold"><span className="rounded border p-2">Mid-Rim</span><span className="rounded border p-2">Commercial</span></div></div></div>
        <div className="win absolute top-0 left-[34%] z-10 w-[39%] rounded-t-lg border border-[#e2dbe8] bg-white shadow-2xl" style={{ ["--d" as string]: ".85s" }}><span className="mono absolute -top-6 left-2 border border-[#e2dbe8] bg-white/70 px-1.5 py-0.5 text-[9px]">Conversational self-serve</span><p className="flex justify-between border-b px-3 py-2"><span><b className="tracking-[.08em]">HUX</b>&nbsp;&nbsp;NexaCorp product line performance (Q3)</span><span>Share&nbsp;&nbsp;Continue in project</span></p><div className="space-y-2 p-3 text-[9px] leading-relaxed"><p className="ml-auto w-3/4 rounded bg-[#eef0ff] p-2 text-[#5b4fc4]">Can you break this down by region? I want to see how each product line performed across the Core Worlds, Mid-Rim, and Outer Rim.</p><p>I'll help you analyze NexaCorp's Q3 revenue by product line and region. Let me search for the most relevant data source.</p><p className="text-zinc-400">› Thought for 11 seconds</p><p>I found regional revenue data in the endorsed semantic model "NexaCorp: Galactic Sales Model." This model contains standardized region definitions…</p></div></div>
      </div>
    </section>
  );
}
