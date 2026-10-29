import fs from "node:fs";
import path from "node:path";

export interface ItemContent {
  source: string;
  demo: string;
  prompt: string;
  path: string;
  lines: number;
}

export function getContent(id: string): ItemContent {
  const file = path.join(process.cwd(), "content", `${id}.json`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kinetik.dev";
export const installCommand = (id: string) => `npx shadcn@latest add ${SITE_URL}/r/${id}.json`;
