import Link from "next/link";
import { duration, easeBezier, springConfig, stagger } from "@kinetik/tokens";
import { highlight } from "@/lib/highlight";
import { SITE_URL } from "@/lib/content";
import { Sidebar } from "@/components/sidebar";

export const metadata = { title: "Getting started", description: "Install kinetik components, use the motion tokens, pick the right engine and wire AI agents to the registry." };

const tree = `Simple hover / focus / press / enter from display:none?
  → CSS transitions + @starting-style.                       (button-press, dialog-animated)
Scroll reveal / progress / simple parallax?
  → CSS scroll-driven animation, IntersectionObserver fallback. (scroll-reveal, scroll-progress)
Route change or shared element?
  → View Transitions API, Motion layoutId fallback.            (vt-shared-element, theme-toggle)
React state: open/closed, selected, reorder, drag, layout?
  → Motion (motion/react).                                     (animated-tabs, reorder-list)
Choreographed sequence, pinned story, text split, SVG draw?
  → GSAP + ScrollTrigger / SplitText / DrawSVG via useGSAP().  (text-split-reveal, svg-path-draw)
Whole-page smooth scrolling?
  → Lenis, synced to gsap.ticker.                              (smooth-scroll)
3D, particles, shaders?
  → React Three Fiber, lazy-loaded.                            (canvas-3d-shell)
Mobile (Expo):
  State → Reanimated 4 CSS API · Gestures/scroll → worklets + Gesture Handler
  Graphics → Skia · Always pair meaningful interactions with expo-haptics.`;

function H({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-20 border-b border-border pb-2 text-2xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

export default async function Page() {
  const [install, manual, usage, agent] = await Promise.all([
    highlight(`# 1. shadcn project (skip if you have one)\nnpx shadcn@latest init\n\n# 2. add any component — its deps + kinetik-core come along\nnpx shadcn@latest add ${SITE_URL}/r/like-burst.json`, "bash"),
    highlight(`npm i motion gsap @gsap/react lenis   # only the engines you use\n# then copy lib/kinetik/{utils,core,tokens}.ts from\n${SITE_URL}/r/kinetik-core.json`, "bash"),
    highlight(`import { LikeBurst } from "@/components/kinetik/like-burst";\nimport { spring, duration } from "@/lib/kinetik/tokens";\n\nexport default function Post() {\n  return <LikeBurst count={1284} />;\n}`, "tsx"),
    highlight(`# Every item exposes three agent-friendly endpoints\n${SITE_URL}/r/registry.json          # index of all items (shadcn registry schema)\n${SITE_URL}/r/<id>.json              # registry item with full source\n${SITE_URL}/r/<id>.prompt.md         # paste-ready AI prompt\n\n# Example: tell Claude Code\n"Install ${SITE_URL}/r/toast-stack.json and wire useToast() into our settings page"`, "bash"),
  ]);
  const code = "overflow-hidden rounded-2xl border border-border bg-card text-[13px] [&_pre]:overflow-x-auto [&_pre]:p-4";

  return (
    <div className="mx-auto flex max-w-[1440px]">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 py-10 sm:px-8">
        <article className="mx-auto max-w-3xl space-y-12">
          <header className="space-y-3">
            <p className="text-sm font-medium text-brand">Docs</p>
            <h1 className="text-4xl font-semibold tracking-tight">Getting started</h1>
            <p className="text-lg text-muted-foreground">
              kinetik is copy-paste-first: components are source code that lands in your repo through the shadcn CLI — or through an AI prompt. Web and mobile share one motion language.
            </p>
            <nav className="flex flex-wrap gap-2 pt-2 text-sm">
              {[["install", "Install"], ["tokens", "Motion tokens"], ["engines", "Engine decision tree"], ["a11y", "Reduced motion"], ["ai", "AI agents"], ["mobile", "Mobile"], ["contribute", "Contributing"]].map(([id, l]) => (
                <a key={id} href={`#${id}`} className="rounded-full border border-border px-3 py-1 text-muted-foreground hover:text-foreground">{l}</a>
              ))}
            </nav>
          </header>

          <section className="space-y-4">
            <H id="install">Install</H>
            <p className="text-muted-foreground">Every component page has an install command. It adds the component to <code>components/kinetik/</code> and the shared helpers to <code>lib/kinetik/</code>.</p>
            <div className={code} dangerouslySetInnerHTML={{ __html: install }} />
            <p className="text-sm text-muted-foreground">No shadcn? Install the engines you need and copy the files manually:</p>
            <div className={code} dangerouslySetInnerHTML={{ __html: manual }} />
            <div className={code} dangerouslySetInnerHTML={{ __html: usage }} />
            <p className="text-sm text-muted-foreground">
              Components use shadcn CSS variables (<code>background</code>, <code>foreground</code>, <code>muted</code>, <code>border</code>, <code>card</code>, <code>primary</code>, <code>ring</code>) so they inherit your theme in light and dark.
            </p>
          </section>

          <section className="space-y-4">
            <H id="tokens">Motion tokens</H>
            <p className="text-muted-foreground">One vocabulary across CSS, Motion, GSAP and Reanimated. Import tokens — never inline magic numbers. Tune them live in the <Link href="/playground" className="text-foreground underline underline-offset-4">playground</Link>.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border">
                <p className="border-b border-border px-4 py-2 text-xs font-semibold">duration</p>
                <table className="w-full text-sm"><tbody className="divide-y divide-border">{Object.entries(duration).map(([k, v]) => <tr key={k}><td className="px-4 py-1.5 font-mono text-xs">{k}</td><td className="px-4 py-1.5 text-right text-muted-foreground tabular-nums">{v}ms</td></tr>)}</tbody></table>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-border">
                  <p className="border-b border-border px-4 py-2 text-xs font-semibold">spring (Motion = Reanimated)</p>
                  <table className="w-full text-sm"><tbody className="divide-y divide-border">{Object.entries(springConfig).map(([k, v]) => <tr key={k}><td className="px-4 py-1.5 font-mono text-xs">{k}</td><td className="px-4 py-1.5 text-right text-muted-foreground tabular-nums">{v.stiffness} / {v.damping} / {v.mass}</td></tr>)}</tbody></table>
                </div>
                <div className="rounded-2xl border border-border">
                  <p className="border-b border-border px-4 py-2 text-xs font-semibold">ease · stagger</p>
                  <table className="w-full text-sm"><tbody className="divide-y divide-border">{Object.entries(easeBezier).map(([k, v]) => <tr key={k}><td className="px-4 py-1.5 font-mono text-xs">{k}</td><td className="px-4 py-1.5 text-right font-mono text-[11px] text-muted-foreground">{v.join(", ")}</td></tr>)}<tr><td className="px-4 py-1.5 font-mono text-xs">stagger</td><td className="px-4 py-1.5 text-right text-muted-foreground">{Object.entries(stagger).map(([k, v]) => `${k} ${v}s`).join(" · ")}</td></tr></tbody></table>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <H id="engines">Engine decision tree</H>
            <p className="text-muted-foreground">Don&apos;t reach for a heavy library when CSS can do it. Every component follows this tree — use it for your own work too.</p>
            <pre className="overflow-x-auto rounded-2xl border border-border bg-card p-5 font-mono text-[12px] leading-relaxed">{tree}</pre>
          </section>

          <section className="space-y-4">
            <H id="a11y">Reduced motion</H>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              <li><code>useReducedMotion()</code> from <code>lib/kinetik/core</code> is true when the OS prefers reduced motion <em>or</em> your app sets <code>&lt;html data-reduce-motion&gt;</code> (an in-app setting).</li>
              <li>Movement is replaced with opacity or an instant change — never removed in a way that hides content.</li>
              <li>GSAP code checks the flag inside <code>useGSAP()</code>; Lenis is disabled; marquees and ambient backgrounds pause; pointer effects switch off on touch.</li>
              <li>Hover effects also trigger on focus; drag interactions always have a button/keyboard alternative; autoplaying motion longer than 5s has a pause control.</li>
              <li>Try it: the ♿ toggle in the header flips every preview on this site.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <H id="ai">AI agents</H>
            <p className="text-muted-foreground">Like 21st.dev, every item has a <b>Copy AI prompt</b> button. The prompt contains intent, motion spec, accessibility/performance constraints, the full source, a usage example and the helper files — enough for any coding agent to rebuild it in your stack.</p>
            <div className={code} dangerouslySetInnerHTML={{ __html: agent }} />
          </section>

          <section className="space-y-4">
            <H id="mobile">Mobile</H>
            <p className="text-muted-foreground">
              <Link href="/flows" className="text-foreground underline underline-offset-4">Mobile flows</Link> are interactive web prototypes in a phone frame. Their prompts target Expo + Reanimated 4 + Gesture Handler + expo-haptics, with the exact same spring presets, so the native build feels identical to what you tried here.
            </p>
          </section>

          <section className="space-y-4">
            <H id="contribute">Contributing</H>
            <p className="text-muted-foreground">Each component lives in <code>packages/web/src/&lt;category&gt;/&lt;slug&gt;/</code> with four files:</p>
            <pre className="overflow-x-auto rounded-2xl border border-border bg-card p-5 font-mono text-[12px] leading-relaxed">{`<slug>.tsx         the component (shipped to users)
<slug>.demo.tsx    live preview + usage example
<slug>.meta.ts     name, category, engine, tags, page types, a11y, perf, props
<slug>.prompt.md   intent + motion spec for the AI prompt

pnpm registry      # regenerates the gallery index, /r/*.json and prompts
pnpm dev           # docs at localhost:3000`}</pre>
          </section>
        </article>
      </main>
    </div>
  );
}
