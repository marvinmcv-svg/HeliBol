"use client";
import { cn } from "@kinetik/core";

const css = `
.k-hgw .ch{display:inline-block;animation:k-hgw-rise 1.3s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(.3s + var(--i)*80ms)}
@keyframes k-hgw-rise{from{transform:translateY(70%);opacity:0}}
.k-hgw .card{animation:k-hgw-card 1s cubic-bezier(.16,1,.3,1) both}
@keyframes k-hgw-card{from{transform:translateY(-30px);opacity:0}}
.k-hgw .sky{animation:k-hgw-sky 12s ease-in-out infinite alternate}
@keyframes k-hgw-sky{to{background-position:0 100%}}
@media (prefers-reduced-motion:reduce){.k-hgw *{animation:none!important}}
[data-reduce-motion] .k-hgw *{animation:none!important}`;

/** Brand hero inverted: a white rounded card holds the serif pitch and link columns, while a colossal serif wordmark rises letter by letter out of the sky below. */
export function HeroGiantWordmark({ word = "Willow", line = "AI that runs the", italic = "doctor's office", className }: { word?: string; line?: string; italic?: string; className?: string }) {
  const cols: [string, string[]][] = [["Company", ["Call us", "Careers", "Blog"]], ["Socials", ["Instagram", "X", "LinkedIn"]], ["Legal", ["Privacy", "Terms"]]];
  return (
    <section className={cn("k-hgw sky relative overflow-hidden text-[#111]", className)} style={{ background: "linear-gradient(180deg,#bfe3f2,#7cc3e0 50%,#a9d8ec)", backgroundSize: "100% 200%" }}>
      <style href="k-hgw" precedence="kinetik">{css}</style>
      <div className="card relative z-10 grid gap-8 rounded-b-[32px] bg-white px-8 pt-8 pb-12 md:grid-cols-[1.2fr_1fr]">
        <div>
          <h1 className="font-serif text-4xl leading-[1.05] tracking-tight">{line} <em className="block">{italic}</em></h1>
          <a href="#" className="mt-5 inline-block rounded-md bg-[#111] px-3 py-2 text-xs text-white">Get started</a>
        </div>
        <nav className="grid grid-cols-3 gap-4 text-xs">
          {cols.map(([h, ls]) => <div key={h}><p className="mb-2 text-zinc-500">{h}</p>{ls.map((l) => <a key={l} href="#" className="block py-0.5 hover:underline">{l}</a>)}</div>)}
        </nav>
      </div>
      <p aria-label={word} className="-mt-6 text-center font-serif text-[clamp(6rem,26vw,15rem)] leading-[.85] tracking-tight text-white select-none [text-shadow:0_10px_40px_#2b7ea433]">
        {[...word].map((c, i) => <span key={i} aria-hidden className="ch" style={{ ["--i" as string]: i }}>{c}</span>)}
      </p>
    </section>
  );
}
