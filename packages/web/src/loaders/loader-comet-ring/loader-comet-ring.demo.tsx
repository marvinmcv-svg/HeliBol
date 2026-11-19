import { LoaderCometRing } from "./loader-comet-ring";

export default function Demo() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 bg-[#07070c] p-6 text-white">
      <div className="flex items-center gap-10">
        <LoaderCometRing size={88} thickness={6} />
        <LoaderCometRing size={56} colors={["#fde047", "#f97316"]} />
        <LoaderCometRing size={36} thickness={3} colors={["#86efac", "#14b8a6"]} />
      </div>
      <p className="text-sm text-white/60">Rendering your video…</p>
    </div>
  );
}
