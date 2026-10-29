import type { ComponentMeta } from "@web/types";

export const meta: ComponentMeta = {
  id: "auth-card",
  name: "Auth — Magic Code Sign-in",
  description: "Email → OTP → success in one morphing card: stateful button, shaking OTP on wrong codes, animated success mark.",
  category: "forms",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion", "lucide-react"],
  registryDependencies: ["kinetik-core", "input-floating-label", "button-stateful", "otp-input", "success-check", "bg-grid-dots"],
  tags: ["auth", "login", "otp", "magic link", "flow"],
  pageTypes: ["auth"],
  a11y: "Real inputs/labels; OTP supports paste + SMS autofill; status changes announced via aria-live in the button.",
  perf: "Card height animates with layout; steps swap with popLayout.",
  status: "stable",
  priority: "P1",
  previewHeight: 520,
};
