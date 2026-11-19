import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "transition-zoom-portal",
  name: "Zoom Portal Transition",
  description: "Cards that become pages: clicking a card zooms its image (shared layout) to fill the view while the other cards fall back and blur, then the article rises in. Back reverses into the card.",
  category: "transitions",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","shared element","zoom","page transition","article","cards"],
  pageTypes: ["blog","portfolio","media"],
  inspiration: ["kinetik Premium collection"],
  a11y: "The page is a focusable article; Esc/Back return focus to the originating card; background cards aria-hidden while open. Reduced motion: instant swap.",
  perf: "layoutId on image and title only.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "items", type: "{ id, title, kicker?, image, page }[]", description: "Cards and their pages." },
  ],
};
