import type { ComponentMeta } from "@web/types";

export const meta: ComponentMeta = {
  id: "flow-checkout",
  name: "Swipe-to-Pay Checkout",
  description: "Mobile bag with rolling quantity stepper and a swipe-to-pay slider that fills green, snaps home if released early, and lands on a spinning success badge.",
  category: "forms",
  platforms: ["native", "web"],
  engine: "motion",
  dependencies: ["motion", "lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["checkout", "swipe to pay", "cart", "ecommerce", "mobile"],
  pageTypes: ["ecommerce"],
  inspiration: ["Mobbin checkout flows (Nike, Cash App, Starbucks)"],
  a11y: "The slider handle is also a button (tap to pay) so the gesture is never required; quantity buttons labelled.",
  perf: "Single drag motion value drives handle, fill and label fade.",
  status: "stable",
  priority: "P2",
  previewHeight: 700,
  steps: ["Bag", "Quantity", "Paid"],
};
