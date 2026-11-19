import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "color-picker",
  name: "Colour Picker",
  description: "Colour picker with a saturation/value plane, hue slider and swatches. Thumbs follow the pointer on a spring and grow while dragging; both controls are keyboard sliders and the hex input validates live.",
  category: "forms",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["color","picker","theme","input","design tool"],
  pageTypes: ["settings","dashboard"],
  inspiration: ["21st.dev category gap (audit 2026-11)"],
  a11y: "Both areas are role=slider with value text and arrow-key control (Shift for big steps); hex input has a label and aria-invalid. Reduced motion: no springs.",
  perf: "Pure HSV maths; pointer capture; no canvas.",
  status: "stable",
  priority: "P2",
  previewHeight: 360,
  props: [
    { name: "value", type: "string", description: "Hex colour." },
    { name: "onChange", type: "(hex) => void", description: "Change handler." },
    { name: "swatches", type: "string[]", default: "9 presets", description: "Quick picks." },
    { name: "label", type: "string", default: "'Colour'", description: "Accessible name." },
  ],
};
