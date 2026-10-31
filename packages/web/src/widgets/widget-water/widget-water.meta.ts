import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "widget-water",
  name: "Water Tracker",
  description: "Hydration tracker: a glass fills with a wobbling wave as you log cups, with bubbles rising on each change.",
  category: "widgets",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["health","tracker","habit","liquid"],
  pageTypes: ["dashboard","onboarding"],
  inspiration: ["Animata water tracker","WaterMinder"],
  a11y: "role=meter with value; labelled add/remove buttons.",
  perf: "Spring height + looping wave transform.",
  status: "stable",
  priority: "P3",
  previewHeight: 280,
  props: [
    { name: "goal", type: "number", default: "8", description: "Cups per day." },
  ],
};
