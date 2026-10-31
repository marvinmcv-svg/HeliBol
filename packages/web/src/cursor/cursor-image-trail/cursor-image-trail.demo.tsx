"use client";
import { photos } from "../../_demo";
import { CursorImageTrail } from "./cursor-image-trail";
export default function Demo() {
  return (
    <CursorImageTrail images={photos} className="grid h-full w-full place-items-center">
      <h2 className="pointer-events-none text-center text-6xl font-black tracking-tighter mix-blend-difference text-white">MOVE<br />AROUND</h2>
    </CursorImageTrail>
  );
}
