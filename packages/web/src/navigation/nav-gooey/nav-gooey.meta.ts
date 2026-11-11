import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "nav-gooey",
  name: "Gooey Tab Bar",
  description: "Tab bar whose active blob oozes between items: an SVG goo filter merges the blob with a slower trailing droplet so they stretch and pinch like liquid.",
  category: "navigation",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["tab bar","gooey","svg filter","navigation","mobile"],
  pageTypes: ["landing","dashboard"],
  inspiration: ["unlumen UI — Gooey Navbar Menu"],
  a11y: "Real buttons with aria-current; the goo layer is aria-hidden. Reduced motion: no filter, instant move.",
  perf: "One SVG filter on a small layer with two moving circles.",
  status: "stable",
  priority: "P2",
  previewHeight: 360,
  props: [
    { name: "items", type: "{ label, icon }[]", description: "Tabs." },
    { name: "defaultIndex", type: "number", default: "0", description: "Initial tab." },
    { name: "onChange", type: "(i) => void", description: "Selection callback." },
  ],
};
