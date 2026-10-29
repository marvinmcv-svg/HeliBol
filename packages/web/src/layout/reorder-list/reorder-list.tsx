"use client";
import { Reorder, useDragControls } from "motion/react";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface ReorderListProps<T extends { id: string }> {
  items: T[];
  onReorder: (items: T[]) => void;
  render: (item: T) => ReactNode;
  className?: string;
}

function Row<T extends { id: string }>({ item, index, items, onReorder, children }: { item: T; index: number; items: T[]; onReorder: (i: T[]) => void; children: ReactNode }) {
  const controls = useDragControls();
  const move = (d: -1 | 1) => {
    const j = index + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[index], next[j]] = [next[j], next[index]];
    onReorder(next);
  };
  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      transition={spring.smooth}
      whileDrag={{ scale: 1.03, boxShadow: "0 16px 40px -12px rgb(0 0 0 / .35)", zIndex: 10 }}
      className="relative flex items-center gap-2 rounded-xl border border-border bg-card p-2 pr-3"
    >
      <button
        onPointerDown={(e) => controls.start(e)}
        aria-label="Drag to reorder"
        className="grid size-8 cursor-grab touch-none place-items-center rounded-lg text-muted-foreground hover:bg-accent active:cursor-grabbing"
      >
        <GripVertical className="size-4" />
      </button>
      <div className="min-w-0 flex-1">{children}</div>
      <div className="flex flex-col">
        <button onClick={() => move(-1)} disabled={index === 0} aria-label="Move up" className="rounded text-muted-foreground hover:text-foreground disabled:opacity-30"><ChevronUp className="size-4" /></button>
        <button onClick={() => move(1)} disabled={index === items.length - 1} aria-label="Move down" className="rounded text-muted-foreground hover:text-foreground disabled:opacity-30"><ChevronDown className="size-4" /></button>
      </div>
    </Reorder.Item>
  );
}

export function ReorderList<T extends { id: string }>({ items, onReorder, render, className }: ReorderListProps<T>) {
  return (
    <Reorder.Group axis="y" values={items} onReorder={onReorder} className={cn("space-y-2", className)}>
      {items.map((item, i) => (
        <Row key={item.id} item={item} index={i} items={items} onReorder={onReorder}>
          {render(item)}
        </Row>
      ))}
    </Reorder.Group>
  );
}
