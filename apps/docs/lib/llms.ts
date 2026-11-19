import type { ComponentMeta } from "@web/types";
import { SITE_URL } from "./content";
import { blocks, components, flows } from "./registry.generated";
import { categories, engines } from "./taxonomy";

const pageUrl = (m: ComponentMeta, kind: "component" | "block" | "flow") =>
  `${SITE_URL}${kind === "block" ? `/blocks/${m.id}` : kind === "flow" ? `/flows/${m.id}` : `/components/${m.category}/${m.id}`}`;

const intro = `# kinetik

> The motion library for web & mobile: ${components.length} animated React components, ${blocks.length} page blocks and ${flows.length} mobile flows. Every item has a live preview, full source, a shadcn registry install and an AI prompt. Every item has a reduced-motion fallback.

Install any item into a shadcn project: \`npx shadcn@latest add ${SITE_URL}/r/<id>.json\`.
Each item's AI prompt (intent, motion spec, a11y/perf constraints, full source) is at \`${SITE_URL}/r/<id>.prompt.md\`.
Engines: ${Object.values(engines).map((e) => e.name).join(", ")}. Motion tokens are shared across CSS, Motion, GSAP and Reanimated.
`;

/** llms.txt: the map — one line per item with links an agent can follow. */
export function llmsIndex() {
  const line = (m: ComponentMeta, kind: "component" | "block" | "flow") => `- [${m.name}](${pageUrl(m, kind)}): ${m.description} Prompt: ${SITE_URL}/r/${m.id}.prompt.md`;
  const sections = categories
    .map((c) => ({ c, items: components.filter((m) => m.category === c.id) }))
    .filter((s) => s.items.length)
    .map((s) => `## ${s.c.name}\n\n${s.items.map((m) => line(m, "component")).join("\n")}`);
  return [intro, ...sections, `## Blocks\n\n${blocks.map((m) => line(m, "block")).join("\n")}`, `## Mobile flows (Expo + Reanimated prompts)\n\n${flows.map((m) => line(m, "flow")).join("\n")}`, `## Optional\n\n- [Full catalogue with props, a11y and install commands](${SITE_URL}/llms-full.txt)\n- [Registry index](${SITE_URL}/r/registry.json)`].join("\n\n") + "\n";
}

/** llms-full.txt: everything an agent needs to choose and install an item, without the source. */
export function llmsFull() {
  const item = (m: ComponentMeta, kind: "component" | "block" | "flow") =>
    [
      `### ${m.name} (\`${m.id}\`)`,
      m.description,
      `- Page: ${pageUrl(m, kind)}`,
      `- Engine: ${engines[m.engine].name}; dependencies: ${m.dependencies.join(", ") || "none"}`,
      `- Install: \`npx shadcn@latest add ${SITE_URL}/r/${m.id}.json\``,
      `- Use for: ${m.pageTypes.join(", ")}; tags: ${m.tags.join(", ")}`,
      `- Accessibility: ${m.a11y}`,
      `- Performance: ${m.perf}`,
      ...(m.props?.length ? ["- Props:", ...m.props.map((p) => `  - \`${p.name}\`: \`${p.type}\`${p.default ? ` = ${p.default}` : ""} — ${p.description}`)] : []),
      `- Full prompt with source: ${SITE_URL}/r/${m.id}.prompt.md`,
    ].join("\n");
  return [intro, ...components.map((m) => item(m, "component")), "## Blocks", ...blocks.map((m) => item(m, "block")), "## Mobile flows", ...flows.map((m) => item(m, "flow"))].join("\n\n") + "\n";
}
