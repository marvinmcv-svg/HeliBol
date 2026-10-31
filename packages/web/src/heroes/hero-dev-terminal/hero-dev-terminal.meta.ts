import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-dev-terminal",
  name: "Hero — Dev Tool Terminal",
  description: "Developer-tool hero: headline, a copyable install command, and a terminal that types the session and its output.",
  category: "heroes",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","cli","developer","terminal","install"],
  pageTypes: ["landing","docs"],
  inspiration: ["Vercel / Turborepo heroes","Magic UI Terminal"],
  a11y: "Copy button labelled with the command; terminal is decorative (aria-hidden) duplicate of info.",
  perf: "Single timeout chain.",
  status: "stable",
  priority: "P1",
  previewHeight: 440,
  props: [
    { name: "command", type: "string", default: "\"npx kinetik@latest init\"", description: "Install command." },
  ],
};
