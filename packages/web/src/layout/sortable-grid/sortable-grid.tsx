"use client";
import { useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface SortableGridItem {
  id: string;
  content: ReactNode;
  label: string;
}

export interface SortableGridProps {
  items: SortableGridItem[];
  columns?: number;
  onReorder?: (ids: string[]) => void;
  className?: string;
}

/**
 * iOS home-screen style reordering in a 2D grid: press and drag a tile, it lifts and tilts, and the
 * other tiles slide out of the way (layout springs) as you move over their slots. Keyboard: focus a
 * tile, Space to pick up, arrows to move, Space to drop, Esc to cancel.
 */
export function SortableGrid({ items: initial, columns = 4, onReorder, className }: SortableGridProps) {
  const reduced = useReducedMotion();
  const [items, setItems] = useState(initial);
  const [picked, setPicked] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const grid = useRef<HTMLDivElement>(null);
  const before = useRef<SortableGridItem[] | null>(null);

  const moveTo = (id: string, to: number) => {
    setItems((list) => {
      const from = list.findIndex((x) => x.id === id);
      if (from === to || to < 0 || to >= list.length) return list;
      const next = [...list];
      const [it] = next.splice(from, 1);
      next.splice(to, 0, it);
      return next;
    });
  };
  const slotAt = (x: number, y: number) => {
    const el = grid.current;
    if (!el) return -1;
    const tiles = [...el.children] as HTMLElement[];
    let best = -1, bestD = Infinity;
    tiles.forEach((t, i) => {
      const r = t.getBoundingClientRect();
      const d = Math.hypot(r.left + r.width / 2 - x, r.top + r.height / 2 - y);
      if (d < bestD) (bestD = d), (best = i);
    });
    return best;
  };
  const commit = (list = items) => onReorder?.(list.map((x) => x.id));
  const t = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 520, damping: 38 };

  return (
    <>
      <div ref={grid} role="listbox" aria-label="Reorderable grid" className={cn("grid gap-3", className)} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {items.map((it, i) => {
          const isPicked = picked === it.id;
          return (
            <motion.div
              key={it.id}
              layout
              transition={t}
              role="option"
              aria-selected={isPicked}
              aria-label={`${it.label}, position ${i + 1} of ${items.length}`}
              tabIndex={0}
              drag
              dragSnapToOrigin
              dragElastic={1}
              dragMomentum={false}
              onDrag={(_, info) => {
                const s = slotAt(info.point.x - window.scrollX, info.point.y - window.scrollY);
                if (s >= 0 && s !== i) moveTo(it.id, s);
              }}
              onDragEnd={() => commit()}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  if (isPicked) (setPicked(null), commit(), setMsg(`${it.label} dropped at position ${i + 1}`));
                  else (before.current = items, setPicked(it.id), setMsg(`${it.label} picked up. Use arrow keys to move, Space to drop.`));
                  return;
                }
                if (e.key === "Escape" && isPicked) (setItems(before.current ?? items), setPicked(null), setMsg("Move cancelled"));
                if (!isPicked) return;
                const d = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -columns, ArrowDown: columns }[e.key];
                if (d) (e.preventDefault(), moveTo(it.id, i + d), setMsg(`Position ${Math.min(items.length, Math.max(1, i + d + 1))}`));
              }}
              whileDrag={reduced ? { zIndex: 50 } : { scale: 1.12, rotate: -3, zIndex: 50, boxShadow: "0 24px 50px -12px rgb(0 0 0 / .45)" }}
              animate={isPicked && !reduced ? { scale: 1.08, rotate: [0, -2, 2, 0], transition: { rotate: { repeat: Infinity, duration: 0.5 } } } : { scale: 1, rotate: 0 }}
              className={cn("relative aspect-square cursor-grab touch-none select-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:cursor-grabbing", isPicked && "ring-2 ring-primary")}
            >
              {it.content}
            </motion.div>
          );
        })}
      </div>
      <p className="sr-only" aria-live="assertive">{msg}</p>
    </>
  );
}
