"use client";
import { photos } from "../../_demo";
import { CursorFlashlight } from "./cursor-flashlight";

export default function Demo() {
  return (
    <CursorFlashlight
      className="h-full"
      reveal={
        <div className="relative size-full">
          <img src={photos[2]} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 grid place-items-center">
            <p className="rounded-2xl bg-black/40 px-5 py-3 text-center text-2xl font-semibold text-white backdrop-blur">The city never sleeps.</p>
          </div>
        </div>
      }
    >
      <div className="size-full bg-[#07070b] p-8 text-white">
        <div className="max-w-56">
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">Night mode</p>
          <h3 className="mt-2 text-3xl font-semibold leading-tight tracking-tight">Shine a light around</h3>
          <p className="mt-1 text-sm text-white/45">Move to explore · press to widen the beam</p>
        </div>
      </div>
    </CursorFlashlight>
  );
}
