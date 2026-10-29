import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "button-stateful",
  name: "Stateful Button",
  description: "Idle → spinner → success/error in one element. Width morphs between states with a spring; errors shake.",
  category: "buttons",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion", "lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["async", "loading", "success", "form", "feedback"],
  pageTypes: ["auth", "ecommerce", "settings", "dashboard"],
  inspiration: ["Family wallet buttons", "Vercel deploy button"],
  a11y: "aria-busy while loading and aria-live=polite so the result is announced. Ignores repeat clicks while busy.",
  perf: "Layout animation on one element; content crossfades with popLayout.",
  status: "stable",
  priority: "P1",
  previewHeight: 220,
  props: [
    { name: "onAction", type: "() => Promise<unknown>", description: "Resolve for success, reject for error." },
    { name: "successLabel / errorLabel", type: "string", description: "Result copy." },
    { name: "resetAfter", type: "number", default: "1800", description: "ms before returning to idle." },
  ],
};
