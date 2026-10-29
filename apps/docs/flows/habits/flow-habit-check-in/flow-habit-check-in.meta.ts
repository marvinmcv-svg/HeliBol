import type { ComponentMeta } from "@web/types";

export const meta: ComponentMeta = {
  id: "flow-habit-check-in",
  name: "Habit Check-in",
  description: "Daily habit tracker: checking a habit bursts particles, fills the streak ring, and completing all of them extends the 🔥 streak with a celebration toast.",
  category: "data",
  platforms: ["native", "web"],
  engine: "motion",
  dependencies: ["motion", "lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["habits", "streak", "progress ring", "gamification", "mobile"],
  pageTypes: ["dashboard", "onboarding"],
  inspiration: ["Mobbin habit apps (Streaks, Duolingo, Fabulous)"],
  a11y: "Each habit is an aria-pressed toggle with a text label; streak count is text.",
  perf: "8 particles per check, unmounted after 600ms; ring is one stroke animation.",
  status: "stable",
  priority: "P2",
  previewHeight: 700,
  steps: ["Fresh day", "Halfway", "Perfect day"],
};
