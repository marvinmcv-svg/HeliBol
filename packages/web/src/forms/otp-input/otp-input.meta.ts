import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "otp-input",
  name: "OTP Input",
  description: "One-time-code input: digits pop into cells, a caret blinks in the active cell, wrong codes shake and clear, right codes turn green.",
  category: "forms",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["otp", "2fa", "verification", "auth", "pin"],
  pageTypes: ["auth", "onboarding"],
  inspiration: ["Stripe / Vercel verification screens", "input-otp"],
  a11y: "A single real input (autocomplete=one-time-code, inputMode numeric) powers the cells, so paste, SMS autofill and screen readers just work. Reduced motion: no shake.",
  perf: "Only the changed digit animates.",
  status: "stable",
  priority: "P1",
  previewHeight: 260,
  props: [
    { name: "length", type: "number", default: "6", description: "Digits." },
    { name: "onComplete", type: "(code) => boolean | Promise<boolean>", description: "Validate; false triggers the shake." },
  ],
};
