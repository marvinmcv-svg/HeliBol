"use client";
import { photos } from "../../_demo";
import { GsapThrowBoard } from "./gsap-throw-board";

const Polaroid = ({ src, label }: { src: string; label: string }) => (
  <div className="w-32 rounded-lg bg-white p-2 pb-6 text-center text-[11px] font-medium text-neutral-700">
    <img src={src} alt="" draggable={false} className="aspect-square w-full rounded object-cover" />
    <p className="mt-1.5">{label}</p>
  </div>
);
const Pill = ({ children, className }: { children: string; className: string }) => <div className={`rounded-full px-4 py-2 text-sm font-bold ${className}`}>{children}</div>;

export default function Demo() {
  return (
    <div className="relative h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(127,127,127,.25)_1px,transparent_0)] [background-size:20px_20px]">
      <p className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-4xl font-semibold tracking-tight text-muted-foreground/40">
        Pick up & throw
      </p>
      <GsapThrowBoard
        items={[
          { x: 8, y: 12, rotate: -8, node: <Polaroid src={photos[0]} label="Dunes '24" /> },
          { x: 62, y: 8, rotate: 6, node: <Polaroid src={photos[5]} label="Aurora" /> },
          { x: 36, y: 52, rotate: 4, node: <Polaroid src={photos[3]} label="Canopy" /> },
          { x: 72, y: 58, rotate: -5, node: <Pill className="bg-amber-300 text-amber-950">✦ ship it</Pill> },
          { x: 12, y: 70, rotate: 10, node: <Pill className="bg-violet-500 text-white">motion ♥</Pill> },
          { x: 44, y: 14, rotate: -14, node: <div className="grid size-16 place-items-center rounded-full bg-rose-500 text-2xl">🔥</div> },
        ]}
      />
    </div>
  );
}
