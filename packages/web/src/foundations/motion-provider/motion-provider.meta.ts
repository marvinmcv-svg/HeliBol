import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "motion-provider",
  name: "Motion Provider",
  description: "One provider for the whole app: default spring from tokens, reduced-motion wiring and LazyMotion feature loading.",
  category: "foundations",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["provider", "setup", "reduced motion", "bundle size"],
  pageTypes: ["landing", "dashboard", "docs"],
  inspiration: ["Motion docs: LazyMotion & MotionConfig"],
  a11y: "Global reducedMotion='always' when the user (or app setting) prefers reduced motion — transforms are skipped, opacity kept.",
  perf: "LazyMotion + m components cut Motion to ~4.6 KB gz initial.",
  status: "stable",
  priority: "P1",
  previewHeight: 280,
  props: [
    { name: "transition", type: "Transition", default: "spring.smooth", description: "Default transition for all motion components." },
    { name: "strict", type: "boolean", default: "false", description: "Throw if a full `motion.*` component is used inside." },
  ],
};
