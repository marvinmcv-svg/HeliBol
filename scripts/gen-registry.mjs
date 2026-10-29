#!/usr/bin/env node
/**
 * Scans packages/web/src/<category>/<slug>/ and generates:
 *  - apps/docs/lib/registry.generated.ts     (metas + lazy demo loaders for the docs app)
 *  - apps/docs/content/<id>.json             (source, demo, AI prompt — read by component pages)
 *  - apps/docs/public/r/<id>.json            (shadcn registry items, installable with `npx shadcn add`)
 *  - apps/docs/public/r/<id>.prompt.md       (raw AI prompt, for agents / MCP)
 *  - apps/docs/public/r/registry.json + apps/docs/registry.json
 * Blocks (apps/docs/blocks/<slug>) and flows (apps/docs/flows/<slug>) are scanned the same way.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const webSrc = path.join(root, "packages/web/src");
const docs = path.join(root, "apps/docs");
const outR = path.join(docs, "public/r");
const outContent = path.join(docs, "content");
const SITE = process.env.KINETIK_URL ?? "https://kinetik.dev";

fs.mkdirSync(outR, { recursive: true });
fs.mkdirSync(outContent, { recursive: true });

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");

/** Cheap meta extraction: the meta files are plain object literals, so evaluate them. */
function loadMeta(file) {
  const src = read(file)
    .replace(/^import .*$/gm, "")
    .replace(/export const meta(?::\s*\w+)?\s*=/, "return ")
    .replace(/\}\s*(as const|satisfies \w+)?;\s*$/, "}");
  return new Function(src)();
}

const rewriteImports = (s) =>
  s
    .replace(/from "@web\/[\w-]+\/([\w-]+)\/\1"/g, 'from "@/components/kinetik/$1"')
    .replace(/from "\.\.\/\.\.\/_shared\/phone"/g, 'from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */')
    .replaceAll('from "@kinetik/core"', 'from "@/lib/kinetik/core"')
    .replaceAll('from "@kinetik/core/utils"', 'from "@/lib/kinetik/utils"')
    .replaceAll('from "@kinetik/tokens"', 'from "@/lib/kinetik/tokens"');

const coreSrc = read(path.join(root, "packages/core/src/index.ts"));
const utilsSrc = read(path.join(root, "packages/core/src/utils.ts"));
const tokensSrc = read(path.join(root, "packages/tokens/src/index.ts"));

const composes = (meta) => {
  const deps = (meta.registryDependencies ?? []).filter((d) => d !== "kinetik-core");
  if (!deps.length) return "";
  return `## Built from these kinetik components
Install them first (each also has its own prompt at \`${SITE}/r/<id>.prompt.md\`):
\`\`\`bash
npx shadcn@latest add ${deps.map((d) => `${SITE}/r/${d}.json`).join(" ")}
\`\`\`

`;
};

const nativeSection = (meta) => `## Target platform: React Native (Expo)
The source below is the **web prototype** of this flow. Build the real thing natively:
- Expo SDK 55+, Expo Router, React Native New Architecture.
- \`react-native-reanimated\` 4 (+ \`react-native-worklets\`) for all animation; \`react-native-gesture-handler\` for pans/drags; \`expo-haptics\` wherever the prototype calls \`haptic()\` (light → ImpactFeedbackStyle.Light, medium → Medium, success/error → NotificationFeedbackType).
- Use these exact spring presets with \`withSpring\` (same physics as web): snappy {stiffness:500,damping:35}, smooth {260,30}, gentle {120,20}, bouncy {400,15}, heavy {200,40,mass:1.5}.
- Gesture- and scroll-driven values must run on the UI thread (shared values, \`useAnimatedStyle\`, \`useAnimatedScrollHandler\`). State-driven transitions can use Reanimated's CSS-style API or layout animations (\`entering\`/\`exiting\`/\`layout\`).
- Respect \`useReducedMotion()\` / \`ReduceMotion.System\`: swap movement for fades.
- Screens: ${(meta.steps ?? []).join(" → ") || "see prototype"}.

`;

function buildPrompt(meta, source, demo, intent, kind = "component") {
  const deps = meta.dependencies?.length ? meta.dependencies.join(" ") : null;
  const usesCore = source.includes('"@kinetik/core"');
  const usesUtils = usesCore || source.includes("@kinetik/core/utils");
  const usesTokens = source.includes("@kinetik/tokens");
  return `You are given a task to integrate a ${kind} from the **kinetik** motion library into this codebase.

# ${meta.name} (\`${meta.id}\`)

${meta.description}

## What it should do
${intent.trim()}

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (\`background\`, \`foreground\`, \`muted\`, \`muted-foreground\`, \`border\`, \`card\`, \`primary\`, \`ring\`). If the project lacks shadcn, set it up first (\`npx shadcn@latest init\`).
- Animation engine: **${meta.engine}**.${deps ? `\n- Install dependencies: \`npm i ${deps}\`` : "\n- No runtime dependencies (CSS only)."}
- Put the component at \`components/kinetik/${meta.id}.tsx\`.${usesUtils ? "\n- `cn` lives at `lib/kinetik/utils.ts` (source below)." : ""}${usesCore ? "\n- Shared hooks go at `lib/kinetik/core.ts` (source below)." : ""}${usesTokens ? "\n- Motion tokens go at `lib/kinetik/tokens.ts` (source below). Use tokens instead of magic numbers." : ""}

${composes(meta)}${kind === "flow" ? nativeSection(meta) : ""}## Non-negotiables
- **Accessibility:** ${meta.a11y}
- **Performance:** ${meta.perf}
- Respect \`prefers-reduced-motion\` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/${meta.id}.tsx
\`\`\`tsx
${rewriteImports(source).trim()}
\`\`\`

## Usage example
\`\`\`tsx
${rewriteImports(demo)
  .replace(/from "\.\/([\w-]+)"/g, 'from "@/components/kinetik/$1"')
  .replace(/from "\.\.\/\.\.\/_demo"/g, 'from "@/components/kinetik/demo-helpers" /* or inline */')
  .trim()}
\`\`\`
${usesUtils ? `\n## lib/kinetik/utils.ts\n\`\`\`ts\n${utilsSrc.trim()}\n\`\`\`\n` : ""}${usesCore ? `\n## lib/kinetik/core.ts\n\`\`\`ts\n${coreSrc.trim()}\n\`\`\`\n` : ""}${usesTokens ? `\n## lib/kinetik/tokens.ts\n\`\`\`ts\n${tokensSrc.trim()}\n\`\`\`\n` : ""}
## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use \`@/\`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
`;
}

function scan(dir, { skip = [] } = {}) {
  const items = [];
  if (!fs.existsSync(dir)) return items;
  for (const cat of fs.readdirSync(dir)) {
    const catDir = path.join(dir, cat);
    if (skip.includes(cat) || cat.startsWith("_") || !fs.statSync(catDir).isDirectory()) continue;
    for (const slug of fs.readdirSync(catDir)) {
      const d = path.join(catDir, slug);
      if (!fs.statSync(d).isDirectory()) continue;
      const metaFile = path.join(d, `${slug}.meta.ts`);
      if (!fs.existsSync(metaFile)) continue;
      items.push({ cat, slug, dir: d, meta: loadMeta(metaFile) });
    }
  }
  return items.sort((a, b) => a.meta.name.localeCompare(b.meta.name));
}

const components = scan(webSrc);
const pageRank = ["landing", "pricing", "auth", "dashboard", "ecommerce", "onboarding", "settings", "portfolio", "blog", "docs"];
const byPage = (a, b) =>
  a.meta.priority.localeCompare(b.meta.priority) ||
  pageRank.indexOf(a.meta.pageTypes[0]) - pageRank.indexOf(b.meta.pageTypes[0]) ||
  (a.meta.id.startsWith("hero") ? -1 : b.meta.id.startsWith("hero") ? 1 : 0) ||
  a.meta.name.localeCompare(b.meta.name);
const blocks = scan(path.join(docs, "blocks")).sort(byPage);
const flows = scan(path.join(docs, "flows")).sort(byPage);

const ids = new Set();
for (const c of [...components, ...blocks, ...flows]) {
  if (ids.has(c.meta.id)) throw new Error(`Duplicate id ${c.meta.id}`);
  ids.add(c.meta.id);
}

const registryItems = [];

// kinetik-core: helpers + tokens every component can depend on
registryItems.push({
  name: "kinetik-core",
  type: "registry:lib",
  title: "kinetik core",
  description: "Motion tokens (durations, easings, springs) and hooks (useReducedMotion, useInView, cn…).",
  dependencies: ["clsx", "tailwind-merge"],
  files: [
    { path: "lib/kinetik/utils.ts", type: "registry:lib", target: "lib/kinetik/utils.ts", content: utilsSrc },
    { path: "lib/kinetik/core.ts", type: "registry:lib", target: "lib/kinetik/core.ts", content: coreSrc },
    { path: "lib/kinetik/tokens.ts", type: "registry:lib", target: "lib/kinetik/tokens.ts", content: tokensSrc },
  ],
});

function emit(entry, kind) {
  const { meta, dir, slug } = entry;
  const source = read(path.join(dir, `${slug}.tsx`));
  const demo = read(path.join(dir, `${slug}.demo.tsx`));
  const intent = read(path.join(dir, `${slug}.prompt.md`)) || meta.description;
  const prompt = buildPrompt(meta, source, demo, intent, kind);
  const rel = path.relative(root, dir);
  fs.writeFileSync(
    path.join(outContent, `${meta.id}.json`),
    JSON.stringify({ source, demo, prompt, path: rel, lines: source.split("\n").length }),
  );
  fs.writeFileSync(path.join(outR, `${meta.id}.prompt.md`), prompt);
  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: meta.id,
    type: kind === "component" ? "registry:component" : "registry:block",
    title: meta.name,
    description: meta.description,
    dependencies: meta.dependencies,
    registryDependencies: (meta.registryDependencies ?? []).map((d) => (d.startsWith("http") || !ids.has(d) && d !== "kinetik-core" ? d : `${SITE}/r/${d}.json`)),
    files: [
      {
        path: `components/kinetik/${meta.id}.tsx`,
        type: kind === "component" ? "registry:component" : "registry:block",
        target: `components/kinetik/${meta.id}.tsx`,
        content: rewriteImports(source),
      },
    ],
    categories: [meta.category],
    meta: { engine: meta.engine, tags: meta.tags, pageTypes: meta.pageTypes },
  };
  registryItems.push(item);
  fs.writeFileSync(path.join(outR, `${meta.id}.json`), JSON.stringify(item, null, 2));
}

components.forEach((c) => emit(c, "component"));
blocks.forEach((c) => emit(c, "block"));
flows.forEach((c) => emit(c, "flow"));
fs.writeFileSync(
  path.join(outR, "kinetik-core.json"),
  JSON.stringify({ $schema: "https://ui.shadcn.com/schema/registry-item.json", ...registryItems[0] }, null, 2),
);

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "kinetik",
  homepage: SITE,
  items: registryItems.map(({ files, ...rest }) => ({ ...rest, files: files.map(({ content, ...f }) => f) })),
};
fs.writeFileSync(path.join(outR, "registry.json"), JSON.stringify(registry, null, 2));
fs.writeFileSync(path.join(docs, "registry.json"), JSON.stringify(registry, null, 2));

// ---- TS module for the docs app
const lines = [
  "// AUTO-GENERATED by scripts/gen-registry.mjs — do not edit.",
  'import type { ComponentType } from "react";',
  'import type { ComponentMeta } from "@web/types";',
];
const metaArr = (list, name) => {
  list.forEach((c, i) => {
    const base = path.relative(path.join(docs, "lib"), path.join(c.dir, `${c.slug}.meta`)).replaceAll("\\", "/");
    const spec = c.dir.startsWith(webSrc) ? `@web/${c.cat}/${c.slug}/${c.slug}.meta` : base;
    lines.push(`import { meta as ${name}${i} } from "${spec}";`);
  });
};
metaArr(components, "c");
metaArr(blocks, "b");
metaArr(flows, "f");
lines.push("");
lines.push(`export const components: ComponentMeta[] = [${components.map((_, i) => `c${i}`).join(", ")}];`);
lines.push(`export const blocks: ComponentMeta[] = [${blocks.map((_, i) => `b${i}`).join(", ")}];`);
lines.push(`export const flows: ComponentMeta[] = [${flows.map((_, i) => `f${i}`).join(", ")}];`);
lines.push("");
lines.push("export const demoLoaders: Record<string, () => Promise<{ default: ComponentType }>> = {");
for (const c of [...components, ...blocks, ...flows]) {
  const spec = c.dir.startsWith(webSrc)
    ? `@web/${c.cat}/${c.slug}/${c.slug}.demo`
    : path.relative(path.join(docs, "lib"), path.join(c.dir, `${c.slug}.demo`)).replaceAll("\\", "/");
  lines.push(`  "${c.meta.id}": () => import("${spec}"),`);
}
lines.push("};");
fs.writeFileSync(path.join(docs, "lib/registry.generated.ts"), lines.join("\n") + "\n");

console.log(`kinetik registry: ${components.length} components, ${blocks.length} blocks, ${flows.length} flows → ${path.relative(root, outR)}`);
