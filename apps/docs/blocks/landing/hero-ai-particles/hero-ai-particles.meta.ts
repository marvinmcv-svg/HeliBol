import type { ComponentMeta } from "@web/types";

export const meta: ComponentMeta = {
  id: "hero-ai-particles",
  name: "Hero \u2014 AI Particle Brain",
  description: "AI product hero: a particle cloud morphing between shapes behind the headline, a smart-animate capability word, and a prompt box whose placeholder types example requests.",
  category: "heroes",
  platforms: ["web"],
  engine: "r3f",
  dependencies: ["three", "@react-three/fiber", "@react-three/drei", "motion", "lucide-react"],
  registryDependencies: ["kinetik-core", "three-particle-morph", "text-smart-animate", "input-typing-placeholder"],
  tags: ["hero", "ai", "particles", "three.js", "prompt"],
  pageTypes: ["ai-app", "landing"],
  inspiration: ["MotionSites \u2014 Particle Brain / Nomi AI Agent"],
  a11y: "Headline and form are real HTML; the 3D layer is decorative; capability changes announced politely. Reduced motion: still particles, crossfading words.",
  perf: "three.js loaded only with this block; canvas pauses off-screen.",
  status: "stable",
  priority: "P1",
  previewHeight: 580,
};
