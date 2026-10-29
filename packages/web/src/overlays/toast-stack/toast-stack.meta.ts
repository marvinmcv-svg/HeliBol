import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "toast-stack",
  name: "Toast Stack",
  description: "Sonner-style stacked toasts: they pile up with depth, fan out on hover/focus and swipe away to the right.",
  category: "overlays",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["toast", "notification", "sonner", "swipe", "feedback"],
  pageTypes: ["dashboard", "settings", "ecommerce"],
  inspiration: ["Sonner by Emil Kowalski"],
  a11y: "aria-live=polite region; dismiss button on each toast (swipe is optional); stack expands on keyboard focus.",
  perf: "Max 5 toasts; transforms only; timers per toast.",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "ToastProvider.duration", type: "number", default: "4000", description: "Auto-dismiss ms." },
    { name: "useToast()", type: "(toast) => void", description: "{ title, description?, tone? }" },
    { name: "contained", type: "boolean", default: "false", description: "Absolute inside parent." },
  ],
};
