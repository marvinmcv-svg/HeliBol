import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "widget-clock",
  name: "World Clock",
  description: "Analog clocks per time zone with a smooth sweeping second hand and a digital caption.",
  category: "widgets",
  platforms: ["web"],
  engine: "js",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["clock","time zones","widget","analog"],
  pageTypes: ["dashboard"],
  inspiration: ["macOS World Clock widget"],
  a11y: "role=img labelled with the time; reduced motion ticks once per second instead of sweeping.",
  perf: "One rAF per clock (cheap style updates).",
  status: "stable",
  priority: "P2",
  previewHeight: 280,
  props: [
    { name: "timeZone", type: "string", description: "IANA zone." },
    { name: "label", type: "string", description: "City name." },
  ],
};
