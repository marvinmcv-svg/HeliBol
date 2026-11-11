#!/usr/bin/env node
/**
 * Compact component specs → <slug>.meta.ts + <slug>.prompt.md.
 * Specs live in packages/web/specs/*.json (arrays). Hand-written meta/prompt files are never overwritten
 * unless the spec sets "regen": true. Component + demo .tsx files are always hand-written.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const specDir = path.join(root, "packages/web/specs");
const src = path.join(root, "packages/web/src");
const q = (s) => JSON.stringify(s);
let wrote = 0;
const missing = [];

for (const file of fs.readdirSync(specDir).filter((f) => f.endsWith(".json")).sort()) {
  for (const s of JSON.parse(fs.readFileSync(path.join(specDir, file), "utf8"))) {
    const dir = path.join(src, s.category, s.id);
    if (!fs.existsSync(path.join(dir, `${s.id}.tsx`))) {
      missing.push(`${s.category}/${s.id}`);
      continue;
    }
    const metaFile = path.join(dir, `${s.id}.meta.ts`);
    if (!fs.existsSync(metaFile) || s.regen) {
      const props = (s.props ?? []).map(([name, type, def, description]) => `    { name: ${q(name)}, type: ${q(type)}, ${def ? `default: ${q(def)}, ` : ""}description: ${q(description)} },`);
      fs.writeFileSync(
        metaFile,
        `import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: ${q(s.id)},
  name: ${q(s.name)},
  description: ${q(s.description)},
  category: ${q(s.category)},
  platforms: ["web"],
  engine: ${q(s.engine)},
  dependencies: ${q(s.deps ?? (s.engine === "motion" ? ["motion"] : []))},
  registryDependencies: ${q(["kinetik-core", ...(s.registryDeps ?? [])])},
  tags: ${q(s.tags)},
  pageTypes: ${q(s.pageTypes)},
  inspiration: ${q(s.inspiration ?? [])},
  a11y: ${q(s.a11y)},
  perf: ${q(s.perf)},
  status: ${q(s.status ?? "stable")},
  priority: ${q(s.priority ?? "P2")},
  previewHeight: ${s.previewHeight ?? 320},
  props: [
${props.join("\n")}
  ],
};
`,
      );
      wrote++;
    }
    const promptFile = path.join(dir, `${s.id}.prompt.md`);
    if (!fs.existsSync(promptFile) || s.regen) fs.writeFileSync(promptFile, `${s.prompt.trim()}\n`);
  }
}
console.log(`gen-meta: wrote ${wrote} meta files${missing.length ? `; specs without source yet: ${missing.join(", ")}` : ""}`);
