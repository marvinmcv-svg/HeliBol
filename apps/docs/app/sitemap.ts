import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content";
import { added, blocks, components, flows } from "@/lib/registry.generated";
import { categories } from "@/lib/taxonomy";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, lastModified?: string, priority = 0.6) => ({ url: `${SITE_URL}${path}`, lastModified: lastModified ? new Date(lastModified) : undefined, priority });
  return [
    page("/", undefined, 1),
    ...["/components", "/blocks", "/templates", "/flows", "/playground", "/docs", "/changelog"].map((p) => page(p, undefined, 0.9)),
    ...categories.filter((c) => components.some((m) => m.category === c.id)).map((c) => page(`/components/${c.id}`, undefined, 0.8)),
    ...components.map((m) => page(`/components/${m.category}/${m.id}`, added[m.id])),
    ...blocks.map((m) => page(`/blocks/${m.id}`, added[m.id])),
    ...flows.map((m) => page(`/flows/${m.id}`, added[m.id])),
  ];
}
