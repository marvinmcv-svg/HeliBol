import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "chart-gauge",
  name: "Chart — Gauge",
  description: "Speedometer gauge with a weighted needle: on view and on change the needle sweeps past the target and settles with a damped wobble, the active zone lights up and the readout counts. Zones are configurable.",
  category: "data",
  platforms: ["web"],
  engine: "svg",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","chart","gauge","speedometer","kpi","score","meter"],
  pageTypes: ["dashboard"],
  inspiration: ["kinetik Premium collection"],
  a11y: "role=img labelled with value and max. Reduced motion places the needle directly.",
  perf: "A low-damping spring on one motion value drives rotation and the number.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "value", type: "number", description: "Value." },
    { name: "min / max", type: "number", default: "0 / 100", description: "Range." },
    { name: "label", type: "string", default: "Score", description: "Label." },
    { name: "unit", type: "string", description: "Unit." },
    { name: "zones", type: "{ to; color }[]", default: "red/amber/green", description: "Coloured zones." },
  ],
};
