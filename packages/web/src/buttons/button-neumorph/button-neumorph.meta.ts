import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "button-neumorph",
  name: "Neumorphic Toggle",
  description: "Soft-UI toggle that sits raised when off and presses into the surface when on, with an eased shadow swap.",
  category: "buttons",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["neumorphism","soft ui","toggle","control center"],
  pageTypes: ["settings","dashboard"],
  inspiration: ["Dribbble soft UI","iOS Control Center"],
  a11y: "aria-pressed toggle with visible focus ring; don't rely on shadows alone for state (icon color changes too).",
  perf: "box-shadow transition on a small element.",
  status: "stable",
  priority: "P2",
  previewHeight: 240,
  props: [
    { name: "defaultPressed", type: "boolean", default: "false", description: "Initial state." },
    { name: "onPressedChange", type: "(p) => void", description: "Change callback." },
  ],
};
