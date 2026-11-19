"use client";
import { cn } from "@kinetik/core";

const css = `
.k-hcs .strings{transform-origin:50% 100%;animation:k-hcs-sway 7s ease-in-out infinite alternate}
.k-hcs .strings.b{animation-duration:9s;animation-direction:alternate-reverse}
@keyframes k-hcs-sway{from{transform:skewX(-1.5deg)}to{transform:skewX(1.5deg)}}
.k-hcs .s{stroke-dasharray:900;stroke-dashoffset:900;animation:k-hcs-draw 1.8s cubic-bezier(.65,0,.35,1) forwards;animation-delay:calc(var(--i)*25ms)}
@keyframes k-hcs-draw{to{stroke-dashoffset:0}}
.k-hcs .in{animation:k-hcs-in 1s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hcs-in{from{opacity:0;transform:translateY(20px)}}
.k-hcs .magic{display:inline-block;animation:k-hcs-wiggle 2.5s ease-in-out infinite}
@keyframes k-hcs-wiggle{50%{transform:rotate(14deg) scale(1.1)}}
@media (prefers-reduced-motion:reduce){.k-hcs *{animation:none!important;stroke-dashoffset:0!important}}
[data-reduce-motion] .k-hcs *{animation:none!important;stroke-dashoffset:0!important}`;

const people = [{ x: 27, h: 60, sit: false }, { x: 34, h: 61, sit: false }, { x: 40, h: 48, sit: true }, { x: 45, h: 60, sit: false }, { x: 52, h: 63, sit: false }, { x: 56, h: 50, sit: true }, { x: 62, h: 61, sit: false }, { x: 70, h: 62, sit: false }, { x: 78, h: 64, sit: false }];

/** Branding-agency hero: a grayscale studio where dozens of taut strings fan down from the ceiling onto the team (photo slot or silhouettes), under a huge indented statement. */
export function HeroConvergingStrings({ text = "Bureau is a digital branding agency. We craft impactful experiences with magic people, Bureau people!", cities = ["Coimbra", "&", "Porto"], image, className }: { text?: string; cities?: string[]; image?: string; className?: string }) {
  const heads = people.map((p) => [p.x * 12, 400 - p.h * 0.62 * 1.5 * 4 * 0.97] as const);
  const tops = Array.from({ length: 48 }, (_, i) => -40 + i * 27);
  const words = text.split(" ");
  return (
    <section className={cn("k-hcs relative isolate min-h-[460px] overflow-hidden bg-[#e9e9e7] px-[1.3%] pt-2 text-[#111]", className)}>
      <style href="k-hcs" precedence="kinetik">{css}</style>
      <div aria-hidden className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#f4f4f2_0,#dcdcda_8%,#f7f7f5_9%,#ececea_60%,#f5f5f3_100%)]" />
      {image && <div aria-hidden className="absolute inset-0 -z-20 bg-cover bg-center grayscale" style={{ backgroundImage: `url(${image})` }} />}
      {!image && (
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-[62%]">
          {people.map((p, i) => (
            <div key={i} className="in absolute bottom-[3%] flex w-[7%] -translate-x-1/2 flex-col items-center" style={{ left: `${p.x}%`, height: `${p.h * 1.5}%`, ["--d" as string]: `${0.4 + i * 0.05}s` }}>
              <span className="aspect-[4/5] w-[36%] shrink-0 rounded-[45%] bg-gradient-to-b from-[#8f8a85] to-[#5d5955]" />
              <span className="h-[3%] w-[22%] bg-[#6b6763]" />
              <span className={cn("w-full rounded-t-[40%_30%] bg-gradient-to-b from-[#222] to-[#111]", p.sit ? "h-[40%]" : "h-[46%]")} />
              <span className="flex w-[62%] flex-1 justify-between"><i className="block w-[44%] bg-[#151515]" /><i className="block w-[44%] bg-[#151515]" /></span>
              <span className="flex w-[80%] justify-between"><i className="block h-2 w-[42%] rounded-full bg-[#333]" /><i className="block h-2 w-[42%] rounded-full bg-[#333]" /></span>
            </div>
          ))}
          <div className="absolute inset-x-0 bottom-0 h-[4%] bg-[#d6d6d4]" />
        </div>
      )}
      <svg aria-hidden viewBox="0 0 1200 400" preserveAspectRatio="none" className="absolute inset-0 -z-10 size-full">
        <g className="strings" stroke="#222" strokeWidth=".9" fill="none">{tops.filter((_, i) => i % 2 === 0).map((x, i) => { const [hx, hy] = heads[i % heads.length]; return <path key={x} className="s" style={{ ["--i" as string]: i }} d={`M${x} 0 L ${hx + ((i % 3) - 1) * 10} ${hy}`} />; })}</g>
        <g className="strings b" stroke="#222" strokeWidth=".7" fill="none">{tops.filter((_, i) => i % 2 === 1).map((x, i) => { const [hx, hy] = heads[(i + 4) % heads.length]; return <path key={x} className="s" style={{ ["--i" as string]: i + 24 }} d={`M${x} 0 L ${hx + ((i % 3) - 1) * 12} ${hy}`} />; })}</g>
      </svg>
      <div className="flex justify-between text-[clamp(.75rem,1.15vw,1.1rem)]">{cities.map((c) => <span key={c}>{c}</span>)}</div>
      <h1 className="in mt-[1.5%] text-[clamp(1.9rem,5.5vw,5.3rem)] leading-[1.03] tracking-[-.055em] indent-[24.5%]">
        {words.map((w, i) => (w.startsWith("magic") ? <span key={i}>magic<span aria-hidden className="magic">✺</span> </span> : <span key={i}>{w} </span>))}
      </h1>
    </section>
  );
}
