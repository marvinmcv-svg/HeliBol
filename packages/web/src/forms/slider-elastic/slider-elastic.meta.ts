import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "slider-elastic",
  name: "Elastic Slider",
  description: "Range slider that stretches like rubber when dragged past its ends and springs back on release.",
  category: "forms",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["slider","range","elastic","input"],
  pageTypes: ["settings","media"],
  inspiration: ["React Bits Elastic Slider","iOS volume slider"],
  a11y: "Thumb is role=slider with arrow/Shift/Home/End keys and aria values.",
  perf: "scaleX on the track driven by a motion value.",
  status: "stable",
  priority: "P2",
  previewHeight: 300,
  props: [
    { name: "min / max / defaultValue", type: "number", default: "0 / 100 / 40", description: "Range." },
    { name: "label", type: "string", default: "\"Volume\"", description: "Accessible label." },
  ],
};
