import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "checkbox-draw",
  name: "Drawn Checkbox",
  description: "The checkmark draws itself with a stroke-dashoffset transition; optional strike-through sweeps across the label.",
  category: "buttons",
  platforms: ["web"],
  engine: "svg",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["checkbox", "todo", "form", "svg", "css-only"],
  pageTypes: ["dashboard", "settings", "onboarding"],
  inspiration: ["Things 3", "Todoist completion"],
  a11y: "Native visually-hidden <input type=checkbox> keeps full keyboard + screen-reader semantics; visible focus ring on the box.",
  perf: "CSS transitions only; the React wrapper is just for controlled state.",
  status: "stable",
  priority: "P1",
  previewHeight: 260,
  props: [
    { name: "checked / defaultChecked", type: "boolean", description: "Controlled or uncontrolled." },
    { name: "onCheckedChange", type: "(checked) => void", description: "Change callback." },
    { name: "strike", type: "boolean", default: "false", description: "Animate a line through the label when checked." },
  ],
};
