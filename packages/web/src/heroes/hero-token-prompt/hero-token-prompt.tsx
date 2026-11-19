"use client";
import { useEffect, useState, type ReactNode } from "react";
import { cn, useReducedMotion } from "@kinetik/core";

type Part = string | { chip: string; icon: string; tone: string };
const prompts: Part[][] = [
  ["Spin up a ", { chip: "Client CRM App", icon: "▦", tone: "text-violet-700 bg-violet-50 border-violet-200" }, " from my ", { chip: "Contacts", icon: "☺", tone: "text-sky-700 bg-sky-50 border-sky-200" }, " and set an ", { chip: "Agent", icon: "✦", tone: "text-emerald-700 bg-emerald-50 border-emerald-200" }, " to follow up on deals that go quiet."],
  ["Summarise every ", { chip: "Support ticket", icon: "✉", tone: "text-amber-700 bg-amber-50 border-amber-200" }, " from this week into a ", { chip: "Weekly brief", icon: "▤", tone: "text-violet-700 bg-violet-50 border-violet-200" }, " for the team."],
];
const len = (p: Part[]) => p.reduce<number>((n, x) => n + (typeof x === "string" ? x.length : 1), 0);

/** Enterprise-AI hero: halftone dot fields frame a prompt box that types itself, dropping in coloured data chips; "New suggestion" shuffles prompts. */
export function HeroTokenPrompt({ title = "AI transformation", line2 = "in a box", subtitle = "Your context, your governance, your data — with apps and agents on top. Live in hours.", className }: { title?: string; line2?: string; subtitle?: string; className?: string }) {
  const reduced = useReducedMotion();
  const [p, setP] = useState(0);
  const [n, setN] = useState(reduced ? Infinity : 0);
  useEffect(() => {
    if (reduced) return setN(Infinity);
    setN(0);
    const t = setInterval(() => setN((k) => k + 1), 38);
    return () => clearInterval(t);
  }, [p, reduced]);
  let budget = n;
  const out: ReactNode[] = [];
  prompts[p].forEach((x, i) => {
    if (budget <= 0) return;
    if (typeof x === "string") { out.push(<span key={i}>{x.slice(0, budget)}</span>); budget -= x.length; }
    else { out.push(<span key={i} className={cn("mx-0.5 inline-flex animate-[k-htp-pop_.3s_ease-out] motion-reduce:animate-none items-center gap-1 rounded-md border px-1.5 text-[13px]", x.tone)}>{x.icon} {x.chip}</span>); budget -= 1; }
  });
  const dots = "radial-gradient(#c9c3b6 1.2px,transparent 1.3px) 0 0/9px 9px";
  const rule = "border-[#e6e1d6]";
  return (
    <section className={cn("relative flex flex-col overflow-hidden bg-[#f6f4ef] px-[1.3%] pt-3 text-center text-[#2a2620]", className)}>
      <style href="k-htp" precedence="kinetik">{"@keyframes k-htp-pop{from{transform:scale(.6);opacity:0}}"}</style>
      <div aria-hidden className="absolute inset-y-0 left-0 w-1/4 [mask-image:radial-gradient(ellipse_at_left,#000,transparent_70%)]" style={{ background: dots }} />
      <div aria-hidden className="absolute inset-y-0 right-0 w-1/4 [mask-image:radial-gradient(ellipse_at_right,#000,transparent_70%)]" style={{ background: dots }} />
      <nav className="relative z-10 flex items-center justify-between rounded-lg border border-[#e6e1d6] bg-white/80 px-3 py-2 text-[12px] backdrop-blur"><span className="flex items-center gap-8"><b className="flex items-center gap-1.5 text-lg font-semibold tracking-tight">❋ Zenro</b><span className="hidden gap-8 text-zinc-600 lg:flex"><a href="#">Product ⌄</a><a href="#">Security</a><a href="#">Blog</a><a href="#">Pricing</a></span></span><span className="flex items-center gap-3"><a href="#">Login</a><a href="#" className="rounded-md border border-[#e6e1d6] bg-white px-3 py-1.5">Start for free</a><a href="#" className="rounded-md bg-[#2a2620] px-3 py-1.5 text-white">Contact us →</a></span></nav>
      <div className={cn("relative mx-[14%] flex flex-1 flex-col border-x pt-[5%]", rule)}>
      <h1 className="relative text-[clamp(2.2rem,3.9vw,3.7rem)] leading-[1.15] font-medium tracking-[-.03em]">{title}<span className="block text-[#5f584d]">{line2}</span></h1>
      <p className="relative mx-auto mt-4 max-w-[30rem] text-[clamp(.85rem,1.2vw,1.15rem)] text-[#6b6458]">{subtitle}</p>
      <a href="#" className="relative mx-auto mt-5 inline-block rounded-md bg-[#c9b8ff] px-3.5 py-2 text-xs font-medium">Contact us →</a>
      <div className="relative mx-auto mt-6 w-[60%] max-w-xl rounded-2xl border border-[#e4ded2] bg-[#ece8df] p-1.5 text-left shadow-sm">
        <div className="rounded-xl bg-white p-4">
          <p aria-live="polite" className="min-h-[3.5em] text-sm leading-relaxed">{out}{n < len(prompts[p]) && <span aria-hidden className="ml-px inline-block h-4 w-px translate-y-0.5 animate-pulse bg-zinc-800" />}</p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <button type="button" onClick={() => setP((k) => (k + 1) % prompts.length)} className="flex items-center gap-1.5 text-zinc-600 hover:text-black">⤨ New suggestion</button>
            <button type="button" aria-label="Send" className="grid size-7 place-items-center rounded-md bg-[#2a2620] text-white">→</button>
          </div>
        </div>
      </div>
      <p className="relative mt-3 font-mono text-[9px] tracking-widest text-[#9b9384] uppercase">⌂ Your data never used for training · ◎ SOC2 in progress · ◎ GDPR compliant</p>
      <div className={cn("relative mt-auto grid grid-cols-[3fr_1fr] border-t font-mono text-[9px] tracking-widest text-[#9b9384] uppercase", rule)}>
        <div className="p-3 text-left">Built by the team from<div className="mt-2 grid grid-cols-3 gap-2 font-sans text-sm tracking-normal text-[#5f584d] normal-case">{["celonis", "▙ Lovable", "◍ PIGMENT"].map((l) => <span key={l} className={cn("rounded border py-2.5 text-center font-semibold", rule)}>{l}</span>)}</div></div>
        <div className={cn("border-l p-3 text-left", rule)}>Backed by<div className={cn("mt-2 rounded border py-2.5 text-center font-sans text-xs font-semibold tracking-normal text-[#5f584d] normal-case", rule)}>☺ Hugging Face</div></div>
      </div>
      </div>
    </section>
  );
}
