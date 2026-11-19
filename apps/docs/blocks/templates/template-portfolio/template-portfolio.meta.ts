import type { ComponentMeta } from "@web/types";

export const meta: ComponentMeta = {
  id: "template-portfolio",
  name: "Template \u2014 Creative Portfolio",
  description: "An independent creative's portfolio: a 3D image-ribbon opener behind a giant name, an about section with a smart-animate discipline word, a selected-work grid, a vertical marquee of kind words, a contact section and a footer reveal.",
  category: "heroes",
  platforms: ["web"],
  engine: "r3f",
  dependencies: ["three", "@react-three/fiber", "@react-three/drei", "motion", "lucide-react"],
  registryDependencies: ["kinetik-core", "marquee-vertical", "text-smart-animate", "portfolio-ribbon", "blog-grid", "contact-section", "footer-reveal"],
  tags: ["template", "portfolio", "personal", "full page", "three.js"],
  pageTypes: ["portfolio"],
  inspiration: ["MotionSites full-site prompts", "21st.dev templates", "React Bits Pro templates"],
  a11y: "Landmarks per section, one H1 (the hero), real links and buttons throughout; every composed block keeps its own reduced-motion fallback.",
  perf: "Heavy sections (three.js, canvas) are client components that pause off-screen; previews and thumbnails mount lazily.",
  status: "beta",
  priority: "P1",
  previewHeight: 640,
};
