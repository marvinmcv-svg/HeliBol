import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "number-input",
  name: "Number Input Stepper",
  description: "A stepper whose digits roll in the direction of change, buttons auto-repeat (accelerating) while held, and the field shakes at its limits.",
  category: "forms",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["number","stepper","input","quantity","counter"],
  pageTypes: ["ecommerce","settings"],
  inspiration: ["21st.dev — Inputs / Number fields"],
  a11y: "ARIA spinbutton with valuenow/min/max/valuetext; Arrow Up/Down, Home/End. Reduced motion: fade instead of roll, no shake.",
  perf: "Single span swap per change; hold-repeat via setTimeout accelerating to 50 ms.",
  status: "stable",
  priority: "P2",
  previewHeight: 280,
  props: [
    { name: "value", type: "number", description: "Value." },
    { name: "onChange", type: "(v) => void", description: "Change handler." },
    { name: "min", type: "number", default: "-∞", description: "Minimum." },
    { name: "max", type: "number", default: "∞", description: "Maximum." },
    { name: "step", type: "number", default: "1", description: "Step." },
    { name: "label", type: "string", description: "Label." },
    { name: "format", type: "(v) => string", default: "String", description: "Display format." },
  ],
};
