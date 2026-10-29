import { ButtonShimmer } from "./button-shimmer";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-wrap items-center justify-center gap-4 p-8">
      <ButtonShimmer>Start free trial →</ButtonShimmer>
      <ButtonShimmer className="bg-[linear-gradient(135deg,#7c3aed,#db2777)]" duration={2}>
        ✦ Upgrade to Pro
      </ButtonShimmer>
    </div>
  );
}
