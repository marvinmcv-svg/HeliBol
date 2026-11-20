import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "widget-habit-tracker",
  name: "Widget — Habit Tracker",
  description: "Habit tracker grid: tap a day and it fills with a pop and a ring burst; the streak flame counter rolls to its new value and flickers bigger the longer the streak. Today is outlined.",
  category: "widgets",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","widget","habit","tracker","streak","calendar","grid"],
  pageTypes: ["dashboard","onboarding"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Each day is a toggle button with its relative date; the streak has an aria-label. Reduced motion removes pops.",
  perf: "Small grid of buttons; springs on scale only.",
  status: "stable",
  priority: "P1",
  previewHeight: 460,
  props: [
    { name: "habit", type: "string", description: "Habit name." },
    { name: "weeks", type: "number", default: "6", description: "Weeks shown." },
    { name: "defaultDone", type: "number[]", default: "[]", description: "Completed day indexes." },
    { name: "color", type: "string", default: "#22c55e", description: "Fill colour." },
  ],
};
