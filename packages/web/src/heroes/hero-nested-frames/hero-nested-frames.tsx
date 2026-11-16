"use client";
import { cn } from "@kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500&family=Newsreader:opsz,wght@6..72,500&display=swap";
const css = `
.k-hnf{font-family:"DM Sans",ui-sans-serif,system-ui,sans-serif}
.k-hnf .frame{position:absolute;border:2px solid #4b2fc9;border-radius:calc(28px + var(--i)*14px);inset:calc(var(--i)*-38px);animation:k-hnf-pulse 4.5s ease-in-out infinite;animation-delay:calc(var(--i)*.3s)}
@keyframes k-hnf-pulse{50%{border-color:#8b74ff;box-shadow:0 0 30px #6d4aff44}}
@property --gx{syntax:"<percentage>";initial-value:35%;inherits:false}
.k-hnf .glow{background:radial-gradient(ellipse at var(--gx) 20%,#5b3fa8 0,#3a2482 35%,#24145a 75%);animation:k-hnf-glow 10s ease-in-out infinite alternate}
@keyframes k-hnf-glow{to{--gx:60%}}
.k-hnf .in{animation:k-hnf-in 1.1s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hnf-in{from{opacity:0;transform:translateY(14px);filter:blur(8px)}}
.k-hnf .bob{animation:k-hnf-bob 1.8s ease-in-out infinite}
@keyframes k-hnf-bob{50%{transform:translateY(5px)}}
@media (prefers-reduced-motion:reduce){.k-hnf *{animation:none!important}}
[data-reduce-motion] .k-hnf *{animation:none!important}`;

/** Manifesto hero: white nav bar over a deep-purple field where the copy sits in a glowing rounded panel wrapped by concentric frames that pulse outward. */
export function HeroNestedFrames({ title = "We believe in builders", subtitle = "People that endeavor to create and lead change. Whether it's through building new companies, products, services, brands, or communities.", className }: { title?: string; subtitle?: string; className?: string }) {
  return (
    <section className={cn("k-hnf flex flex-col overflow-hidden bg-[#1c0f45] text-white", className)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hnf" precedence="kinetik">{css}</style>
      <nav className="flex items-center justify-between bg-[#f4f3f8] whitespace-nowrap px-[6.5%] py-3 text-[13px] text-[#1c1340]">
        <span className="flex items-center gap-10"><span className="text-[22px] font-medium tracking-tight" style={{ fontFamily: "Newsreader,serif" }}>metricly</span><span className="hidden gap-7 lg:flex">{["Platform", "Solutions", "Resources"].map((n) => <a key={n} href="#">{n} ⌄</a>)}<a href="#">Pricing</a></span></span>
        <span className="flex items-center gap-4"><a href="#" className="font-medium">Login</a><a href="#" className="rounded-full border border-[#1c1340] px-4 py-2">Contact Sales</a><a href="#" className="rounded-full bg-[#1c1340] px-4 py-2 text-white">Get Started Free</a></span>
      </nav>
      <div className="relative flex-1 px-[2%] pt-[2.2%]">
        <div className="relative mx-[6.5%] mt-[6%] mb-[11%] h-[64%] min-h-80">
          {[3, 2, 1].map((i) => <span key={i} aria-hidden className="frame" style={{ ["--i" as string]: i }} />)}
          <div className="glow relative grid h-full place-items-center rounded-[28px] border-2 border-[#6a4bff] px-6 text-center">
            <div>
              <h1 className="in text-[clamp(2.4rem,5.3vw,5rem)] font-medium tracking-[-.025em]">{title}</h1>
              <p className="in mx-auto mt-6 max-w-[58rem] text-[clamp(1rem,2.15vw,2rem)] leading-snug text-white/85" style={{ ["--d" as string]: ".15s" }}>{subtitle}</p>
              <a href="#more" aria-label="Scroll down" className="bob mx-auto mt-8 grid size-9 place-items-center rounded-full border-2 border-white/80 text-sm">↓</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
