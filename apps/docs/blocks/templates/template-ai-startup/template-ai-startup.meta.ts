import type { ComponentMeta } from "@web/types";

export const meta: ComponentMeta = {
  id: "template-ai-startup",
  name: "Template \u2014 AI Startup",
  description: "An AI-product landing page in the MotionSites style: a particle-brain hero with a typing prompt box, logo marquee, a live working chat UI as the product shot, capability bento, a waitlist with suggested prompts, FAQ and footer reveal.",
  category: "heroes",
  platforms: ["web"],
  engine: "r3f",
  dependencies: ["three", "@react-three/fiber", "@react-three/drei", "motion", "gsap", "@gsap/react", "lucide-react"],
  registryDependencies: ["kinetik-core", "waitlist-form", "ai-suggestions", "hero-ai-particles", "social-proof-marquee", "ai-chat-app", "features-bento", "faq-section", "footer-reveal"],
  tags: ["template", "ai", "startup", "full page", "waitlist"],
  pageTypes: ["ai-app", "landing"],
  inspiration: ["MotionSites full-site prompts", "21st.dev templates", "React Bits Pro templates"],
  a11y: "Landmarks per section, one H1 (the hero), real links and buttons throughout; every composed block keeps its own reduced-motion fallback.",
  perf: "Heavy sections (three.js, canvas) are client components that pause off-screen; previews and thumbnails mount lazily.",
  status: "beta",
  priority: "P1",
  previewHeight: 640,
};
