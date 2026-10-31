import { SvgMotionPath } from "./svg-motion-path";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <SvgMotionPath className="w-[400px] text-foreground" path="M20,160 C80,20 160,20 200,100 S320,180 380,40" items={["✈️", "📦", "🚚"].map((e) => <span key={e} className="block -translate-1/2 text-2xl">{e}</span>)} />
    </div>
  );
}
