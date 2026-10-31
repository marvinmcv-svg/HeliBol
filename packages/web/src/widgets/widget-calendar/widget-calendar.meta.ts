import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "widget-calendar",
  name: "Mini Calendar",
  description: "Month calendar where the selected-day pill glides between dates, months slide in their travel direction, and event dots mark days.",
  category: "widgets",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["calendar","date","widget","events"],
  pageTypes: ["dashboard","settings"],
  inspiration: ["Animata calendar widget","Cal.com"],
  a11y: "Day buttons labelled with date and event; aria-pressed for the selection.",
  perf: "Shared layoutId pill; month swap via popLayout.",
  status: "stable",
  priority: "P2",
  previewHeight: 420,
  props: [
    { name: "events", type: "Record<'YYYY-MM-DD', string>", description: "Events by date." },
  ],
};
