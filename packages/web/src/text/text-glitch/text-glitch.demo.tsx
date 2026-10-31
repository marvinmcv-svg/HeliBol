import { TextGlitch } from "./text-glitch";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-black p-8 font-mono text-white">
      <TextGlitch as="h2" className="text-6xl font-black tracking-tight">SYSTEM_FAILURE</TextGlitch>
      <TextGlitch every={4} className="text-sm text-white/60">hover to destabilize</TextGlitch>
    </div>
  );
}
