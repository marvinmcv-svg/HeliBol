"use client";
import { photos } from "../../_demo";
import { NavCircleReveal } from "./nav-circle-reveal";

export default function Demo() {
  return (
    <div className="relative h-full">
      <div className="absolute inset-0 grid place-items-center p-8 text-center">
        <div>
          <p className="text-sm font-semibold">Studio Halo</p>
          <h3 className="mt-2 text-4xl font-semibold tracking-tight">Open the menu →</h3>
        </div>
      </div>
      <NavCircleReveal
        defaultOpen
        links={[
          { label: "Work", href: "#work", image: photos[2] },
          { label: "Studio", href: "#studio", image: photos[0] },
          { label: "Journal", href: "#journal", image: photos[5] },
          { label: "Contact", href: "#contact", image: photos[6] },
        ]}
      />
    </div>
  );
}
