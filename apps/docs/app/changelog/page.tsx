import Link from "next/link";
import type { ComponentMeta } from "@web/types";
import { added, blocks, components, flows, thumbs } from "@/lib/registry.generated";
import { EngineBadge } from "@/components/engine-badge";

export const metadata = { title: "Changelog", description: "Every kinetik release: what was added and why." };

/** Release notes keyed by the date items landed (dates come from git, see gen-registry). */
const notes: Record<string, { title: string; body: string }> = {
  "2026-10-29": { title: "kinetik 1.0", body: "The first 71 components, 10 blocks and 6 mobile flows, one motion-token system and a reduced-motion fallback for everything." },
  "2026-10-31": { title: "kinetik 2.0 — research-driven expansion", body: "139 items from a gap analysis of 21st.dev, Mobbin, Refero, Awwwards and six open-source libraries: heroes, AI interfaces, widgets, device mockups, canvas/WebGL backgrounds." },
  "2026-11-11": { title: "kinetik 2.1–2.2 — GSAP, three.js, unlumen & 21st UI", body: "The GSAP collection, a 13-piece three.js collection, unlumen-inspired components, the missing 21st.dev UI sections, MotionSites-style hero blocks and two new Mobbin-style flows." },
  "2026-11-16": { title: "30 Mobbin heroes", body: "Thirty hero sections, each modelled on a standout hero found through Mobbin and rebuilt as original code." },
  "2026-11-19": { title: "kinetik 2.3 & 2.4 — audit release + ✦ Premium collection", body: "Templates (SaaS, AI startup, portfolio), 12 components for the 21st.dev categories we lacked, saved collections, sorting and New badges, package-manager install tabs, llms.txt, sitemap and OG images, 70% less JavaScript per page — and the ✦ Premium collection: 32 high-craft animations across 17 categories (shaders, metaballs, liquid and ink effects, scroll storytelling, stacked sheets, product tours, AI image generation and diff review)." },
  "2026-11-20": { title: "✦ Premium, round 2", body: "Premium for the categories that had none: heroes (depth landscape, product orbit, aurora type), forms (morphing auth card, live credit card, password peek), widgets (flight tracker, vinyl player, flip countdown) and mockups (3D phone, opening laptop)." },
};

const all: { m: ComponentMeta; href: string }[] = [
  ...components.map((m) => ({ m, href: `/components/${m.category}/${m.id}` })),
  ...blocks.map((m) => ({ m, href: `/blocks/${m.id}` })),
  ...flows.map((m) => ({ m, href: `/flows/${m.id}` })),
];

export default function Page() {
  const byDate = new Map<string, typeof all>();
  for (const it of all) {
    const d = added[it.m.id] ?? "unknown";
    byDate.set(d, [...(byDate.get(d) ?? []), it]);
  }
  const dates = [...byDate.keys()].sort().reverse();
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-10 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Changelog</h1>
        <p className="text-muted-foreground">
          {all.length} items across {dates.length} releases. Subscribe with the{" "}
          <Link href="/components?sort=newest" className="underline underline-offset-4">Newest</Link> sort, or point your agent at{" "}
          <a href="/llms.txt" className="underline underline-offset-4">/llms.txt</a>.
        </p>
      </header>
      {dates.map((d) => {
        const items = byDate.get(d)!;
        const n = notes[d];
        return (
          <section key={d} className="grid gap-6 border-t border-border pt-8 md:grid-cols-[11rem_1fr]">
            <div>
              <time dateTime={d} className="text-sm font-medium">{new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</time>
              <p className="text-xs text-muted-foreground">{items.length} items</p>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">{n?.title ?? "New items"}</h2>
                {n && <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>}
              </div>
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {items.map(({ m, href }) => (
                  <li key={m.id}>
                    <Link href={href} className="group block overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-foreground/20">
                      {thumbs[m.id] && <img src={thumbs[m.id]} alt="" loading="lazy" className="aspect-[8/5] w-full object-cover object-top" />}
                      <span className="flex items-center justify-between gap-2 p-2 text-xs">
                        <span className="truncate font-medium">{m.name}</span>
                        <EngineBadge engine={m.engine} className="shrink-0 scale-90" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}
    </div>
  );
}
