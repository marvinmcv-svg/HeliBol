"use client";
import { cn } from "@kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=DM+Sans:wght@400&family=DM+Mono&display=swap";
const css = `
.k-hgw{font-family:"DM Sans",ui-sans-serif,system-ui,sans-serif}
.k-hgw .serif{font-family:Newsreader,ui-serif,Georgia,serif}
.k-hgw .ch{display:inline-block;animation:k-hgw-rise 1.3s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(.3s + var(--i)*80ms)}
@keyframes k-hgw-rise{from{transform:translateY(60%);opacity:0}}
.k-hgw .card{animation:k-hgw-card 1s cubic-bezier(.16,1,.3,1) both}
@keyframes k-hgw-card{from{transform:translateY(-30px);opacity:0}}
.k-hgw .flower{display:inline-block;animation:k-hgw-spin 12s linear infinite}
@keyframes k-hgw-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.k-hgw *{animation:none!important}}
[data-reduce-motion] .k-hgw *{animation:none!important}`;

/** Brand hero inverted: a tall white card with rounded bottom holds the serif pitch, CTA, link columns and a small mark + copyright, while a colossal serif wordmark rises letter by letter out of a pale sky below. */
export function HeroGiantWordmark({ word = "Willow", line = "AI that runs the", italic = "doctor's office", className }: { word?: string; line?: string; italic?: string; className?: string }) {
  const cols: [string, string[]][] = [["Company", ["Call us", "Careers", "Blog"]], ["Socials", ["Instagram", "X", "LinkedIn"]], ["Legal", ["Privacy Policy", "Terms of Service"]]];
  return (
    <section className={cn("k-hgw relative flex flex-col overflow-hidden bg-[linear-gradient(180deg,#eaf5f8_0%,#d7eef4_55%,#c6e6ef_100%)] text-[#111]", className)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hgw" precedence="kinetik">{css}</style>
      <div className="card relative z-10 grid min-h-[56%] grid-cols-[1.35fr_1fr] gap-8 rounded-b-[36px] bg-white px-[2.1%] pt-[6%] pb-[3%]">
        <div>
          <h1 className="serif text-[clamp(2rem,3.85vw,3.7rem)] leading-[1.12] tracking-[-.01em]">{line} <em className="block">{italic}</em></h1>
          <a href="#" className="mt-[5%] inline-block rounded-md bg-[#111] px-3 py-2 text-[12px] text-white">Get started</a>
        </div>
        <div className="flex flex-col justify-between">
          <nav className="grid grid-cols-3 gap-4 text-[12px]">{cols.map(([h, ls]) => <div key={h}><p className="mb-2 text-zinc-500">{h}</p>{ls.map((l) => <a key={l} href="#" className="block py-0.5 hover:underline">{l}</a>)}</div>)}</nav>
          <div className="mt-10 text-[10px] leading-snug" style={{ fontFamily: '"DM Mono",monospace' }}><span aria-hidden className="flower mb-2 block w-fit text-4xl leading-none">✿</span>© 2026 Willow Labs, Inc. All rights reserved.<br />Made in San Francisco, CA.</div>
        </div>
      </div>
      <p aria-label={word} className="serif -mt-[1%] flex-1 text-center text-[clamp(7rem,30vw,28rem)] leading-[.78] tracking-[-.02em] text-white select-none">
        {[...word].map((c, i) => <span key={i} aria-hidden className="ch" style={{ ["--i" as string]: i }}>{c}</span>)}
      </p>
    </section>
  );
}
