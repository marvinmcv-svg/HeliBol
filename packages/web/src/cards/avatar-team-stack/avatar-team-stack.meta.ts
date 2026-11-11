import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "avatar-team-stack",
  name: "Avatar Team Stack",
  description: "Overlapping, slightly tilted avatars that fan out on hover or focus; the person under the pointer lifts and shows a name card.",
  category: "cards",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["avatars","team","hover","social proof"],
  pageTypes: ["landing","social"],
  inspiration: ["unlumen UI — Team Stack"],
  a11y: "Each avatar is a button labelled with name and role; works with keyboard focus; tap toggles on touch. Reduced motion: no lift, instant spread.",
  perf: "Springs on margin/scale/rotate of a few elements.",
  status: "stable",
  priority: "P2",
  previewHeight: 360,
  props: [
    { name: "members", type: "{ name, role, image }[]", description: "People." },
    { name: "size", type: "number", default: "56", description: "Avatar size in px." },
  ],
};
