import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentMeta } from "@web/types";
import { Sidebar } from "@/components/sidebar";
import { ComponentCard } from "@/components/component-card";
import { blocks, components, newIds } from "@/lib/registry.generated";
import { categories, isPremium } from "@/lib/taxonomy";

export const metadata = {
  title: "Premium collection",
  description: "The most crafted animations in kinetik — shaders, three.js scenes, physics, scroll storytelling and signature micro-interactions — organised by category. Free, with source and AI prompts.",
};

const newSet = new Set(newIds);

export default function Page() {
  const sections = categories
    .map((c) => ({ id: c.id as string, name: c.name, blurb: c.blurb, items: components.filter((m) => m.category === c.id && isPremium(m)), kind: "component" as const }))
    .filter((s) => s.items.length > 0);
  const premiumBlocks = blocks.filter(isPremium);
  if (premiumBlocks.length) sections.push({ id: "blocks", name: "Blocks & templates", blurb: "Whole sections and full pages built from premium pieces", items: premiumBlocks, kind: "block" as never });
  const total = sections.reduce((n, s) => n + s.items.length, 0);
  const href = (m: ComponentMeta, kind: string) => (kind === "block" ? `/blocks/${m.id}` : `/components/${m.category}/${m.id}`);

  return (
    <div className="mx-auto flex max-w-[1440px]">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8">
        <header className="relative overflow-hidden rounded-3xl border border-amber-300/30 bg-[radial-gradient(ellipse_at_top_left,rgb(251_191_36/.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgb(168_85_247/.16),transparent_55%)] p-8 sm:p-10">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 px-2.5 py-0.5 text-xs font-semibold text-amber-950">✦ Premium collection</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">The most crafted motion in the library.</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {total} pieces across {sections.length} categories: shaders and three.js scenes, physics and particles, scroll storytelling, liquid and ink effects, and micro-interactions with real weight. Every one still ships free with source, an install command, an AI prompt and a reduced-motion fallback.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/components?collection=premium&sort=newest" className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background">Browse with filters <ArrowRight className="size-3.5" /></Link>
          </div>
        </header>

        <nav aria-label="Premium categories" className="sticky top-14 z-20 -mx-4 mt-6 border-b border-border/60 bg-background/85 px-4 py-2 backdrop-blur-xl sm:-mx-8 sm:px-8">
          <ul className="scrollbar-thin flex gap-1.5 overflow-x-auto">
            {sections.map((s) => (
              <li key={s.id} className="shrink-0">
                <a href={`#${s.id}`} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-foreground/30 hover:text-foreground">
                  {s.name} <span className="tabular-nums text-muted-foreground/60">{s.items.length}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 space-y-14">
          {sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-28 space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 id={`${s.id}-h`} className="text-2xl font-semibold tracking-tight">{s.name} <span className="text-base font-normal text-muted-foreground">· {s.items.length}</span></h2>
                  <p className="text-sm text-muted-foreground">{s.blurb}</p>
                </div>
                {s.id !== "blocks" && (
                  <Link href={`/components/${s.id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    All {s.name.toLowerCase()} <ArrowRight className="size-3.5" />
                  </Link>
                )}
              </div>
              <div className={s.id === "blocks" ? "grid gap-5 xl:grid-cols-2" : "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"}>
                {s.items.map((m) => (
                  <ComponentCard key={m.id} meta={m} href={href(m, s.id === "blocks" ? "block" : "component")} size={s.id === "blocks" ? "lg" : "md"} premium isNew={newSet.has(m.id)} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
