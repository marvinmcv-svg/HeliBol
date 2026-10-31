import { BgLightRays } from "./bg-light-rays";
export default function Demo() {
  return (
    <BgLightRays className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
      <span className="text-6xl">🏆</span>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight">Achievement unlocked</h2>
      <p className="text-sm text-muted-foreground">100 components shipped</p>
    </BgLightRays>
  );
}
