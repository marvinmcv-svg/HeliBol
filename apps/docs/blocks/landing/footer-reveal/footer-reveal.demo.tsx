"use client";
import { DemoScroller } from "@web/_demo";
import { FooterReveal } from "./footer-reveal";
export default function Demo() {
  return (
    <DemoScroller className="[transform:translateZ(0)]">
      <div className="relative z-10 grid h-[110cqh] place-items-center rounded-b-[2rem] bg-background shadow-2xl"><p className="text-muted-foreground">Scroll to the end of the page ↓</p></div>
      <FooterReveal />
    </DemoScroller>
  );
}
