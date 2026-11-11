import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-three-waypoints",
  name: "Scroll Camera Waypoints",
  description: "A scroll-driven camera flight: a ScrollTrigger-scrubbed GSAP timeline tweens a plain object between waypoints and the R3F camera copies it each frame; captions crossfade per stop.",
  category: "3d",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","three","@react-three/fiber","@react-three/drei"],
  registryDependencies: ["kinetik-core"],
  tags: ["gsap","three.js","scroll","camera","storytelling"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["GSAP Demo Hub — three.js scroll waypoints"],
  a11y: "Captions are real HTML. Reduced motion: no camera flight — every waypoint becomes a static card.",
  perf: "Sticky canvas + scrub:1; the camera is only written in useFrame, GSAP never touches three.js objects directly.",
  status: "stable",
  priority: "P1",
  previewHeight: 460,
  props: [
    { name: "waypoints", type: "Waypoint[]", description: "{ title, body?, position, target }." },
    { name: "scroller", type: "RefObject<HTMLElement>", description: "Custom scroll container." },
  ],
};
