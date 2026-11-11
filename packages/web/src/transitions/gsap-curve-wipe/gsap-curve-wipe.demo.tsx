"use client";
import { photos } from "../../_demo";
import { GsapCurveWipe } from "./gsap-curve-wipe";

const Screen = ({ img, kicker, title }: { img: string; kicker: string; title: string }) => (
  <div className="relative h-full w-full">
    <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
    <div className="absolute bottom-16 left-6 text-white">
      <p className="text-[10px] uppercase tracking-[0.3em] opacity-70">{kicker}</p>
      <h3 className="text-5xl font-semibold tracking-tight">{title}</h3>
    </div>
  </div>
);

export default function Demo() {
  return (
    <GsapCurveWipe
      color="#8b5cf6"
      screens={[
        { label: "Home", node: <Screen img={photos[0]} kicker="Index" title="Coral Dunes" /> },
        { label: "Work", node: <Screen img={photos[5]} kicker="Selected work" title="Aurora" /> },
        { label: "About", node: <Screen img={photos[3]} kicker="Studio" title="Canopy" /> },
      ]}
    />
  );
}
