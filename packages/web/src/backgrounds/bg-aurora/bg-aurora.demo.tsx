import { BgAurora } from "./bg-aurora";

export default function Demo() {
  return (
    <BgAurora className="flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="rounded-full border border-white/20 bg-background/40 px-3 py-1 text-xs backdrop-blur">New · v2.0</p>
      <h2 className="max-w-lg text-4xl font-semibold tracking-tight sm:text-5xl">Build in the northern lights.</h2>
      <p className="max-w-sm text-sm text-muted-foreground">Three blurred gradient blobs drift on independent loops. Pure CSS.</p>
    </BgAurora>
  );
}
