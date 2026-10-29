"use client";
import { SvgPathDraw } from "./svg-path-draw";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-10 p-6">
      <SvgPathDraw viewBox="0 0 200 120" className="w-72 text-foreground" duration={2.2} stagger={0.3}>
        <path d="M10 110 L60 30 L90 75 L120 45 L190 110" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx="150" cy="28" r="12" stroke="#f59e0b" strokeWidth="3" />
        <path d="M10 110 H190" stroke="currentColor" strokeOpacity=".4" strokeWidth="2" strokeLinecap="round" />
        <path d="M25 92 C 55 70, 75 100, 105 85 S 160 70, 180 92" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="0" />
      </SvgPathDraw>
      <SvgPathDraw viewBox="0 0 120 40" className="hidden w-40 text-foreground sm:block" duration={2.4}>
        <path d="M5 30 C 15 5, 25 5, 22 28 C 20 38, 32 10, 40 12 C 48 14, 40 32, 50 28 C 58 25, 60 10, 68 14 C 74 18, 66 32, 76 28 C 86 24, 90 8, 98 12 C 106 16, 100 34, 115 26" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </SvgPathDraw>
    </div>
  );
}
