"use client";
import { CursorCustom } from "./cursor-custom";
export default function Demo() {
  return (
    <CursorCustom className="flex h-full w-full flex-col items-center justify-center gap-6 p-8">
      <div className="flex gap-4 text-sm">
        <a href="#" className="underline">A link</a>
        <button className="rounded-lg border border-border px-3 py-1.5">A button</button>
      </div>
      <div className="flex gap-4">
        <img data-cursor="view" src="/demo/photo-3.jpg" alt="Project" className="h-32 w-44 rounded-2xl object-cover" />
        <img data-cursor-text="Drag" src="/demo/photo-7.jpg" alt="Gallery" className="h-32 w-44 rounded-2xl object-cover" />
      </div>
    </CursorCustom>
  );
}
