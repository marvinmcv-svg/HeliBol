import { BgGradientMesh } from "./bg-gradient-mesh";

export default function Demo() {
  return (
    <div className="grid h-full w-full grid-cols-1 gap-3 p-4 sm:grid-cols-[1.4fr_1fr]">
      <BgGradientMesh className="flex items-end rounded-3xl p-6 text-white">
        <div>
          <p className="text-xs opacity-70">Mesh gradient · @property</p>
          <p className="text-2xl font-semibold">Living color</p>
        </div>
      </BgGradientMesh>
      <BgGradientMesh colors={["#22d3ee", "#a3e635", "#38bdf8", "#064e3b"]} speed={8} className="grid place-items-center rounded-3xl text-sm font-medium text-white">
        Custom palette
      </BgGradientMesh>
    </div>
  );
}
