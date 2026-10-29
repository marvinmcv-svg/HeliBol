import { TextShimmer } from "./text-shimmer";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-8">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm">
        <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
        <TextShimmer>Claude is thinking…</TextShimmer>
      </div>
      <TextShimmer as="h2" duration={3} spread={60} className="text-4xl font-semibold tracking-tight">
        Generating your interface
      </TextShimmer>
    </div>
  );
}
