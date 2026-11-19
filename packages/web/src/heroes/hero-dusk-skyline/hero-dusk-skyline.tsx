"use client";
import { cn } from "@kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap";
const css = `
.k-hds{font-family:Inter,ui-sans-serif,system-ui,sans-serif}
.k-hds .sky{background:linear-gradient(180deg,#8f8a87 0%,#b49a8a 30%,#d1a98c 55%,#a88a78 75%,#5b4c47 100%);animation:k-hds-sky 16s ease-in-out infinite alternate}
@keyframes k-hds-sky{to{filter:brightness(.88) saturate(1.1)}}
.k-hds .city{animation:k-hds-pan 30s ease-in-out infinite alternate}
@keyframes k-hds-pan{to{transform:translateX(-3%)}}
.k-hds .win{animation:k-hds-twinkle var(--s) steps(2) infinite;animation-delay:var(--d)}
@keyframes k-hds-twinkle{50%{opacity:.1}}
.k-hds .in{animation:k-hds-in 1.4s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hds-in{from{opacity:0;filter:blur(10px)}}
@media (prefers-reduced-motion:reduce){.k-hds *{animation:none!important}}
[data-reduce-motion] .k-hds *{animation:none!important}`;

const towers: [number, number, number][] = Array.from({ length: 70 }, (_, i) => {
  const x = i * 11.6;
  const r = (i * 53) % 60;
  const h = x > 430 ? 70 + r + ((i * 29) % 90) : 25 + r * 0.8; // low skyline left, dense towers right
  return [x, h, 8 + ((i * 7) % 9)];
});

/** Corporate hero: black utility bar and white nav over a dusk skyline (drawn placeholder or your photo) with thin oversized type, then a calm statement section below. */
export function HeroDuskSkyline({ title = "The World's Identity Company™", subtitle = "We're the leading independent partner for identity management. Our vision is to free everyone to safely use any technology. Now that might sound like a seriously lofty pursuit, but we're proving it's possible — with seamless and secure access, authentication, and authorization.", image, className }: { title?: string; subtitle?: string; image?: string; className?: string }) {
  return (
    <section className={cn("k-hds flex flex-col overflow-hidden bg-[#fcfbf8] text-[#1d1d21]", className)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hds" precedence="kinetik">{css}</style>
      <div className="flex justify-between bg-[#1d1d21] px-[6.5%] py-2.5 text-[12px] text-white"><span className="truncate">Vanta secures AI. Vantane | Las Vegas | Sept 24–… <a href="#" className="ml-2 underline">Save $200 →</a></span><span className="hidden gap-6 lg:flex"><span>+1 (800) 425-1267</span><span>◫ Chat with Sales</span><span>⌕ Search</span><span>◍ United States ⌄</span></span></div>
      <nav className="flex items-center justify-between px-[6.5%] py-3.5 text-[13px] whitespace-nowrap">
        <span className="flex items-center gap-24"><b className="flex items-center gap-1.5 text-[26px] font-medium tracking-tight"><span aria-hidden className="text-[28px] leading-none">✺</span>vanta</b><span className="hidden gap-12 lg:flex">{["Products", "Why Vanta", "Developers", "Resources"].map((n) => <a key={n} href="#">{n} ⌄</a>)}</span></span>
        <span className="flex items-center gap-3"><a href="#" className="rounded-sm bg-[#1d1d21] px-5 py-3 text-white">Free trial</a><a href="#" className="rounded-sm border border-[#1d1d21] px-5 py-3">Contact us</a><a href="#" className="ml-4">◯ Login</a></span>
      </nav>
      <div className="relative isolate overflow-hidden px-6 pt-[4%] pb-[7%] text-center text-white">
        {image ? <div aria-hidden className="absolute inset-0 -z-20 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} /> : <div aria-hidden className="sky absolute inset-0 -z-20" />}
        {!image && (
          <svg aria-hidden viewBox="0 0 800 320" preserveAspectRatio="xMidYMax slice" className="city absolute inset-x-0 bottom-0 -z-10 h-full w-[104%]">
            {towers.map(([x, h, w], i) => (
              <g key={i}>
                <rect x={x} y={320 - h} width={w} height={h} fill={i % 2 ? "#2b2523" : "#3a302c"} />
                {Array.from({ length: Math.floor(h / 26) }, (_, r) => <rect key={r} className="win" x={x + 4 + (r % 2) * (w / 2 - 2)} y={320 - h + 8 + r * 24} width="3" height="5" fill="#f6c48a" opacity=".7" style={{ ["--s" as string]: `${3 + ((i + r) % 5)}s`, ["--d" as string]: `${-((i * r) % 7)}s` }} />)}
              </g>
            ))}
            <rect x="586" y="10" width="3" height="40" fill="#2b2523" /><path d="M572 60 L587 30 L602 60 V320 H572Z" fill="#2f2826" /><rect x="0" y="292" width="800" height="28" fill="#2a2421" />
          </svg>
        )}
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_45%,#c9a48a55_70%,#1a141266)]" />
        <h1 className="in mx-auto max-w-[16ch] text-[clamp(2.6rem,5.3vw,5rem)] leading-[1.12] font-light tracking-[-.01em]">{title}</h1>
        <p className="in mx-auto mt-5 max-w-[50rem] text-[clamp(.9rem,1.45vw,1.35rem)] leading-snug text-white/95" style={{ ["--d" as string]: ".3s" }}>{subtitle}</p>
      </div>
      <h2 className="mx-auto max-w-[24ch] flex-1 px-6 pt-[6%] text-center text-[clamp(1.8rem,3.7vw,3.5rem)] leading-[1.15] font-light tracking-[-.01em]">We're building a world where Identity belongs to you</h2>
    </section>
  );
}
