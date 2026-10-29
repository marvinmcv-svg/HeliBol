import { TextGradientAnimated } from "./text-gradient-animated";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-8 text-center">
      <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
        Make it <TextGradientAnimated>unforgettable</TextGradientAnimated>
      </h2>
      <TextGradientAnimated colors={["#22c55e", "#06b6d4", "#3b82f6", "#22c55e"]} speed={4} className="text-sm font-medium">
        Zero JavaScript · pure CSS
      </TextGradientAnimated>
    </div>
  );
}
