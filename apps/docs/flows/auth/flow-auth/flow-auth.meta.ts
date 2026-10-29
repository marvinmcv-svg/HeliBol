import type { ComponentMeta } from "@web/types";

export const meta: ComponentMeta = {
  id: "flow-auth",
  name: "Phone Sign-in",
  description: "Phone number → SMS code → verified, with a custom keypad, popping digits, a shake on wrong codes and a drawn success check.",
  category: "forms",
  platforms: ["native", "web"],
  engine: "motion",
  dependencies: ["motion", "lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["auth", "otp", "phone", "keypad", "mobile"],
  pageTypes: ["auth", "onboarding"],
  inspiration: ["Mobbin auth flows (Cash App, Venmo, Uber)"],
  a11y: "Keypad keys are labelled buttons; on native, prefer the system number pad with textContentType oneTimeCode for autofill.",
  perf: "Only the changed digit animates; shake is a single keyframe.",
  status: "stable",
  priority: "P1",
  previewHeight: 700,
  steps: ["Phone number", "Verification code", "Verified"],
};
