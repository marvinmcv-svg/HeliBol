import type { ComponentMeta } from "@web/types";

export const meta: ComponentMeta = {
  id: "flow-paywall",
  name: "Paywall",
  description: "Subscription paywall: features stagger in, plan cards share a sliding selection ring, trial switch springs, and the CTA shimmers into a success state.",
  category: "layout",
  platforms: ["native", "web"],
  engine: "motion",
  dependencies: ["motion", "lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["paywall", "subscription", "pricing", "iap", "mobile"],
  pageTypes: ["pricing", "onboarding"],
  inspiration: ["Mobbin paywalls (Calm, Duolingo, Superhuman)", "RevenueCat paywall templates"],
  a11y: "Plans are a radiogroup; trial is a switch; restore/cancel copy always visible (store guidelines).",
  perf: "Shared layoutId ring; shimmer is a transform loop on one element.",
  status: "stable",
  priority: "P1",
  previewHeight: 700,
  steps: ["Yearly selected", "Monthly selected", "Subscribed"],
};
