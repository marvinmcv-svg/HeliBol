import type { ComponentMeta } from "@web/types";

export const meta: ComponentMeta = {
  id: "template-saas",
  name: "Template \u2014 SaaS Launch Page",
  description: "A complete SaaS launch page assembled from kinetik blocks in conversion order: announcement bar, floating expandable nav, split-text hero, logo marquee, animated bento features, integrations orbit, stats, testimonials wall, pricing toggle with plan comparison, FAQ, spotlight CTA and footer reveal.",
  category: "heroes",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion", "gsap", "@gsap/react", "lucide-react"],
  registryDependencies: ["kinetik-core", "banner-announcement", "nav-expandable", "comparison-table", "hero-split-text", "social-proof-marquee", "features-bento", "integrations-orbit", "stats-impact", "testimonials-wall", "pricing-toggle", "faq-section", "cta-spotlight", "footer-reveal"],
  tags: ["template", "saas", "landing page", "full page", "pricing"],
  pageTypes: ["landing", "pricing"],
  inspiration: ["MotionSites full-site prompts", "21st.dev templates", "React Bits Pro templates"],
  a11y: "Landmarks per section, one H1 (the hero), real links and buttons throughout; every composed block keeps its own reduced-motion fallback.",
  perf: "Heavy sections (three.js, canvas) are client components that pause off-screen; previews and thumbnails mount lazily.",
  status: "beta",
  priority: "P1",
  previewHeight: 640,
};
