export type Category =
  | "foundations" | "text" | "scroll" | "transitions" | "layout" | "buttons"
  | "cursor" | "backgrounds" | "cards" | "navigation" | "overlays" | "loaders"
  | "data" | "svg" | "3d" | "media" | "forms";

export type Engine = "css" | "motion" | "gsap" | "lenis" | "r3f" | "view-transitions" | "canvas" | "svg";

export type PageType = "landing" | "pricing" | "auth" | "dashboard" | "portfolio" | "blog" | "ecommerce" | "docs" | "settings" | "onboarding";

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface ComponentMeta {
  id: string;
  name: string;
  description: string;
  category: Category;
  platforms: ("web" | "native")[];
  engine: Engine;
  dependencies: string[];
  registryDependencies?: string[];
  tags: string[];
  pageTypes: PageType[];
  inspiration?: string[];
  a11y: string;
  perf: string;
  status: "experimental" | "beta" | "stable";
  priority: "P1" | "P2" | "P3";
  props?: PropDoc[];
  /** Preview canvas height in px for gallery cards / component page. */
  previewHeight?: number;
  /** Flows only: screen names, in order (Mobbin-style step strip). */
  steps?: string[];
}
