"use client";
import { TextRollHover } from "@web/text/text-roll-hover/text-roll-hover";
import { ButtonSubscribe } from "@web/buttons/button-subscribe/button-subscribe";

/** The page scrolls away to reveal a fixed footer underneath (sticky reveal), with a giant wordmark and rolling links. */
export function FooterReveal() {
  const cols = { Product: ["Components", "Blocks", "Flows", "Pricing"], Company: ["About", "Careers", "Blog", "Contact"], Social: ["X / Twitter", "GitHub", "YouTube", "Dribbble"] };
  return (
    <footer className="relative h-[460px] [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]">
      <div className="fixed bottom-0 h-[460px] w-full">
        <div className="flex h-full flex-col justify-between bg-zinc-950 p-8 text-white">
          <div className="grid gap-8 sm:grid-cols-4">
            {Object.entries(cols).map(([h, ls]) => (
              <div key={h}><p className="mb-3 text-xs tracking-widest text-white/40 uppercase">{h}</p><ul className="space-y-1.5">{ls.map((l) => <li key={l}><a href="#" className="text-sm"><TextRollHover>{l}</TextRollHover></a></li>)}</ul></div>
            ))}
            <div><p className="mb-3 text-xs tracking-widest text-white/40 uppercase">Newsletter</p><ButtonSubscribe className="[&]:border-white/20 [&]:bg-white/5" /></div>
          </div>
          <div className="flex items-end justify-between gap-4"><p className="text-[16vw] leading-[0.8] font-black tracking-tighter sm:text-[12vw]">kinetik</p><p className="mb-2 text-xs text-white/40">© 2026</p></div>
        </div>
      </div>
    </footer>
  );
}
