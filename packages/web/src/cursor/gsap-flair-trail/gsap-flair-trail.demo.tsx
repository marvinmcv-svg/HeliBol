"use client";
import { GsapFlairTrail } from "./gsap-flair-trail";

export default function Demo() {
  return (
    <GsapFlairTrail className="h-full w-full" flair={["✦", "🎉", "★", "💜", "✿", "⚡"]}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(139,92,246,0.25),transparent)]" />
      <div className="relative grid h-full place-items-center text-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Launch party</p>
          <h3 className="mt-2 text-5xl font-semibold tracking-tight">Wiggle your cursor</h3>
          <p className="mt-3 text-sm text-muted-foreground">Flair flies out in the direction you move.</p>
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {["left-[12%] top-[20%] text-pink-400", "left-[80%] top-[30%] text-amber-300", "left-[22%] top-[72%] text-sky-400", "left-[70%] top-[75%] text-violet-400", "left-[48%] top-[12%] text-emerald-400"].map((c, i) => (
          <span key={i} className={`absolute text-3xl ${c}`} style={{ rotate: `${i * 35}deg` }}>{["✦", "★", "✿", "◆", "●"][i]}</span>
        ))}
      </div>
    </GsapFlairTrail>
  );
}
