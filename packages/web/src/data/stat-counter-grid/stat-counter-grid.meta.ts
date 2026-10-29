import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "stat-counter-grid",
  name: "KPI Stat Grid",
  description: "Dashboard KPI cards that stagger in, tick up their numbers, draw sparklines and badge the delta — all on first view.",
  category: "data",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["kpi", "dashboard", "stats", "sparkline", "analytics"],
  pageTypes: ["dashboard", "landing"],
  inspiration: ["Stripe dashboard", "Tremor KPI cards"],
  a11y: "Semantic <dl>/<dt>/<dd>; final values present for SSR; deltas use arrows + text, not color alone.",
  perf: "Numbers written via textContent from motion values; sparklines are single polylines.",
  status: "stable",
  priority: "P1",
  previewHeight: 260,
  props: [{ name: "stats", type: "{ label, value, prefix?, suffix?, decimals?, delta?, spark? }[]", description: "KPIs." }],
};
