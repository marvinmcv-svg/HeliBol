import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "toggle-switch",
  name: "Spring Switch",
  description: "iOS-feel switch: the thumb springs across with layout animation and stretches while pressed.",
  category: "buttons",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["switch", "toggle", "settings", "ios", "form"],
  pageTypes: ["settings", "pricing", "dashboard"],
  inspiration: ["iOS UISwitch"],
  a11y: 'role="switch" with aria-checked; label is clickable; full keyboard support via native button.',
  perf: "Layout animation of a single 24px element.",
  status: "stable",
  priority: "P1",
  previewHeight: 260,
  props: [
    { name: "checked / defaultChecked", type: "boolean", description: "Controlled or uncontrolled state." },
    { name: "onCheckedChange", type: "(checked) => void", description: "Change callback." },
    { name: "label", type: "string", description: "Optional inline label." },
  ],
};
