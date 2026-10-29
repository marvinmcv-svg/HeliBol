import { BgGridDots } from "./bg-grid-dots";

export default function Demo() {
  return (
    <div className="grid h-full w-full grid-cols-2">
      <BgGridDots className="grid place-items-center border-r border-border p-6">
        <span className="rounded-full border border-border bg-background px-3 py-1 text-xs">dots · vignette</span>
      </BgGridDots>
      <BgGridDots variant="grid" size={32} animate className="grid place-items-center p-6">
        <span className="rounded-full border border-border bg-background px-3 py-1 text-xs">grid · panning</span>
      </BgGridDots>
    </div>
  );
}
