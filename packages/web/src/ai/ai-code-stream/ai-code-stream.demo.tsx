"use client";
import { AiCodeStream, type CodeToken } from "./ai-code-stream";
const t: CodeToken[] = [
  ["// spring tuned for toggles\n", "com"], ["import", "kw"], [" { motion } ", "punct"], ["from", "kw"], [' "motion/react"', "str"], [";\n\n", "punct"],
  ["export function", "kw"], [" Switch", "fn"], ["({ on }) {\n  ", "punct"], ["return", "kw"], [" <motion.span layout transition={{ stiffness: ", "punct"], ["500", "num"], [", damping: ", "punct"], ["35", "num"], [" }} />;\n}", "punct"],
];
export default function Demo() {
  return <div className="flex h-full w-full items-center justify-center p-6"><AiCodeStream tokens={t} file="switch.tsx" className="w-full max-w-lg" /></div>;
}
