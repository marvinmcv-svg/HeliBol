"use client";
import { photos } from "../../_demo";
import { TransitionStairs } from "./transition-stairs";

const Screen = ({ img, kicker, title }: { img: string; kicker: string; title: string }) => (
  <div className="relative h-full w-full">
    <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
    <div className="absolute bottom-14 left-6 text-white">
      <p className="text-[10px] uppercase tracking-[0.3em] opacity-70">{kicker}</p>
      <h3 className="text-5xl font-semibold tracking-tight">{title}</h3>
    </div>
  </div>
);

export default function Demo() {
  return (
    <TransitionStairs
      color="#18181b"
      pages={[
        { title: "Studio", content: <Screen img={photos[2]} kicker="01 — Studio" title="We build quiet things" /> },
        { title: "Work", content: <Screen img={photos[5]} kicker="02 — Work" title="Selected projects" /> },
        { title: "Contact", content: <Screen img={photos[0]} kicker="03 — Contact" title="Say hello" /> },
      ]}
    />
  );
}
