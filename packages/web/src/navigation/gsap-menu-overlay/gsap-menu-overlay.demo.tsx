"use client";
import { photos } from "../../_demo";
import { GsapMenuOverlay } from "./gsap-menu-overlay";

export default function Demo() {
  return (
    <div className="relative h-full w-full">
      <img src={photos[0]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="max-w-md text-4xl font-semibold leading-tight tracking-tight">Independent design studio crafting motion-first brands.</p>
      </div>
      <GsapMenuOverlay
        className="absolute inset-0"
        defaultOpen
        links={[{ label: "Work", meta: "(24)" }, { label: "Studio" }, { label: "Journal", meta: "(8)" }, { label: "Contact" }]}
      />
    </div>
  );
}
