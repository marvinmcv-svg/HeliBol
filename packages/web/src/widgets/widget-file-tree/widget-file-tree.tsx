"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, FileCode2, Folder, FolderOpen } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface TreeNode {
  name: string;
  children?: TreeNode[];
}

function Node({ node, depth, selected, onSelect }: { node: TreeNode; depth: number; selected: string; onSelect: (p: string) => void }) {
  const [open, setOpen] = useState(depth < 1);
  const isDir = !!node.children;
  return (
    <li role="treeitem" aria-expanded={isDir ? open : undefined} aria-selected={selected === node.name}>
      <button
        onClick={() => (isDir ? setOpen((o) => !o) : onSelect(node.name))}
        className={cn("relative flex w-full items-center gap-1.5 rounded-md py-1 pr-2 text-left text-sm hover:bg-accent", selected === node.name && "bg-accent font-medium")}
        style={{ paddingLeft: depth * 14 + 6 }}
      >
        {isDir ? <motion.span animate={{ rotate: open ? 90 : 0 }} transition={spring.snappy}><ChevronRight className="size-3.5 text-muted-foreground" /></motion.span> : <span className="w-3.5" />}
        {isDir ? (open ? <FolderOpen className="size-4 text-sky-500" /> : <Folder className="size-4 text-sky-500" />) : <FileCode2 className="size-4 text-muted-foreground" />}
        {node.name}
      </button>
      <AnimatePresence initial={false}>
        {isDir && open && (
          <motion.ul role="group" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }} className="overflow-hidden">
            {node.children!.map((c) => <Node key={c.name} node={c} depth={depth + 1} selected={selected} onSelect={onSelect} />)}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}

/** Collapsible file tree with smooth height animation, rotating chevrons and open/closed folder icons. */
export function WidgetFileTree({ tree, className }: { tree: TreeNode[]; className?: string }) {
  const [selected, setSelected] = useState("");
  return (
    <ul role="tree" aria-label="Files" className={cn("w-64 rounded-2xl border border-border bg-card p-2", className)}>
      {tree.map((n) => <Node key={n.name} node={n} depth={0} selected={selected} onSelect={setSelected} />)}
    </ul>
  );
}
