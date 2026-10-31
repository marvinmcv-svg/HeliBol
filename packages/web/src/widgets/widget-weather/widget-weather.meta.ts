import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "widget-weather",
  name: "Weather Widget",
  description: "Weather card whose sky gradient and scene (rotating sun rays, drifting clouds, rain, twinkling stars) crossfade per condition.",
  category: "widgets",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["weather","widget","ios","scene"],
  pageTypes: ["dashboard","media"],
  inspiration: ["iOS Weather widgets","Animata weather card"],
  a11y: "role=group labelled with city, temperature and condition; scene is aria-hidden and frozen under reduced motion.",
  perf: "A handful of transformed elements per scene.",
  status: "stable",
  priority: "P2",
  previewHeight: 320,
  props: [
    { name: "weather", type: "\"sunny\" | \"cloudy\" | \"rainy\" | \"night\"", description: "Condition." },
    { name: "city / temp / hi / lo", type: "string / number", description: "Data." },
  ],
};
