import { BgNoise } from "./bg-noise";

export default function Demo() {
  return (
    <div className="grid h-full w-full grid-cols-2 gap-3 p-4">
      <div className="grid place-items-center rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-violet-700 text-sm font-medium text-white">Without grain</div>
      <BgNoise opacity={0.35} className="rounded-3xl">
        <div className="grid h-full place-items-center bg-gradient-to-br from-orange-500 via-rose-500 to-violet-700 text-sm font-medium text-white">With film grain</div>
      </BgNoise>
    </div>
  );
}
