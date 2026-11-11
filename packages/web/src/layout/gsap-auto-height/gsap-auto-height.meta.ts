import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-auto-height",
  name: "Auto-Height Accordion",
  description: "Accordion with one paused GSAP timeline per panel tweening to height:auto, fading the content and turning the chevron; toggling plays or reverses, so fast clicks turn around mid-flight.",
  category: "layout",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["gsap","accordion","height auto","faq","toggle"],
  pageTypes: ["landing","docs"],
  inspiration: ["GSAP Demo Hub — Animate auto height / toggle direction"],
  a11y: "Buttons with aria-expanded/aria-controls; panels are labelled regions and inert while closed. Reduced motion: zero durations.",
  perf: "Timelines built once; GSAP measures the auto height.",
  status: "stable",
  priority: "P2",
  previewHeight: 360,
  props: [
    { name: "items", type: "{ title, content }[]", description: "Panels." },
    { name: "multiple", type: "boolean", default: "false", description: "Allow several open." },
  ],
};
