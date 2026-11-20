"use client";
import { photos } from "../../_demo";
import { TransitionInkBlot } from "./transition-ink-blot";

const Screen = ({ img, kicker, title }: { img: string; kicker: string; title: string }) => (
  <div className="relative h-full w-full">
    <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
    <div className="absolute bottom-14 left-6 text-white">
      <p className="text-[10px] uppercase tracking-[0.3em] opacity-70">{kicker}</p>
      <h3 className="font-serif text-5xl italic tracking-tight">{title}</h3>
    </div>
  </div>
);

export default function Demo() {
  return (
    <TransitionInkBlot
      pages={[
        { title: "Gallery", content: <Screen img={photos[1]} kicker="Exhibit 01" title="Still water" /> },
        { title: "Artists", content: <Screen img={photos[4]} kicker="Exhibit 02" title="Night bloom" /> },
        { title: "Visit", content: <Screen img={photos[7]} kicker="Exhibit 03" title="Salt & stone" /> },
      ]}
    />
  );
}
