/// <reference types="vite/client" />
import { act, cleanup, render } from "@testing-library/react";
import { createElement, type ComponentType } from "react";
import { afterEach, describe, expect, it } from "vitest";
import type { ComponentMeta } from "../src/types";

const metas = import.meta.glob<{ meta: ComponentMeta }>("../src/*/*/*.meta.ts", { eager: true });
const prompts = import.meta.glob<string>("../src/*/*/*.prompt.md", { eager: true, query: "?raw", import: "default" });
const sources = import.meta.glob<string>("../src/*/*/*.tsx", { eager: true, query: "?raw", import: "default" });
const demos = import.meta.glob<{ default: ComponentType }>("../src/*/*/*.demo.tsx");

const entries = Object.entries(metas).map(([file, mod]) => {
  const [, category, slug] = file.match(/src\/([^/]+)\/([^/]+)\//)!;
  return { file, category, slug, meta: mod.meta };
});

// Directly scroll-linked feedback moves only as the user scrolls, so it is allowed under reduced motion.
const USER_DRIVEN = new Set(["scroll-progress"]);
// WebGL can't run in jsdom; covered by Playwright instead.
const SKIP_RENDER = new Set(["canvas-3d-shell"]);

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute("data-reduce-motion");
});

describe("component contract", () => {
  it("finds the catalog", () => {
    expect(entries.length).toBeGreaterThan(60);
  });

  it("has unique ids", () => {
    const ids = entries.map((e) => e.meta.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  describe.each(entries)("$meta.id", ({ category, slug, meta }) => {
    it("meta matches folder and is complete", () => {
      expect(meta.id).toBe(slug);
      expect(meta.category).toBe(category);
      expect(meta.name.length).toBeGreaterThan(2);
      expect(meta.description.length).toBeGreaterThan(30);
      expect(meta.a11y.length).toBeGreaterThan(20);
      expect(meta.perf.length).toBeGreaterThan(10);
      expect(meta.tags.length).toBeGreaterThan(0);
      expect(meta.pageTypes.length).toBeGreaterThan(0);
      expect(meta.platforms).toContain("web");
    });

    it("ships source, demo and an AI prompt", () => {
      const src = sources[`../src/${category}/${slug}/${slug}.tsx`];
      expect(src, "component source").toBeTruthy();
      expect(sources[`../src/${category}/${slug}/${slug}.demo.tsx`], "demo").toBeTruthy();
      expect(prompts[`../src/${category}/${slug}/${slug}.prompt.md`]?.length ?? 0).toBeGreaterThan(80);
    });

    it("declares its runtime dependencies", () => {
      const src = sources[`../src/${category}/${slug}/${slug}.tsx`];
      for (const dep of ["motion", "gsap", "lenis", "three", "@react-three/fiber"]) {
        const re = new RegExp(`from "${dep.replace("/", "\\/")}(/[^"]*)?"`);
        if (re.test(src)) expect(meta.dependencies, `${dep} imported but not declared`).toContain(dep);
      }
    });

    it("handles reduced motion", () => {
      const src = sources[`../src/${category}/${slug}/${slug}.tsx`];
      const handled = /useReducedMotion|prefersReducedMotion|prefers-reduced-motion|motion-reduce|data-reduce-motion|MotionConfig|useInView/.test(src);
      // Motion components without explicit handling rely on the global MotionConfig (documented in motion-provider).
      expect(handled || meta.engine === "motion" || USER_DRIVEN.has(slug)).toBe(true);
    });

    if (!SKIP_RENDER.has(slug)) {
      it.each([false, true])("renders (reduced motion: %s)", async (reduced) => {
        if (reduced) document.documentElement.setAttribute("data-reduce-motion", "");
        const Demo = (await demos[`../src/${category}/${slug}/${slug}.demo.tsx`]()).default;
        let container!: HTMLElement;
        await act(async () => {
          container = render(createElement(Demo)).container;
        });
        expect(container.innerHTML.length).toBeGreaterThan(20);
      });
    }
  });
});
