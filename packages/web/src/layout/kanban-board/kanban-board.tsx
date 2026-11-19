"use client";
import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ArrowLeft, ArrowRight, GripVertical } from "lucide-react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export interface KanbanCard {
  id: string;
  title: string;
  tag?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

export interface KanbanBoardProps {
  columns: KanbanColumn[];
  onChange?: (columns: KanbanColumn[]) => void;
  className?: string;
}

/**
 * Kanban board: drag cards between and within columns (native drag-and-drop, so it works without
 * a library), or move them with the arrow buttons / keyboard. Every card glides to its new slot
 * with a shared layout animation; the target column lights up while you drag over it.
 */
export function KanbanBoard({ columns: initial, onChange, className }: KanbanBoardProps) {
  const reduced = useReducedMotion();
  const [cols, setCols] = useState(initial);
  const [drag, setDrag] = useState<string | null>(null);
  const [over, setOver] = useState<{ col: string; index: number } | null>(null);
  const [announce, setAnnounce] = useState("");

  const move = (cardId: string, toCol: string, toIndex: number) => {
    setCols((prev) => {
      const card = prev.flatMap((c) => c.cards).find((c) => c.id === cardId);
      if (!card) return prev;
      const next = prev.map((c) => ({ ...c, cards: c.cards.filter((x) => x.id !== cardId) }));
      const target = next.find((c) => c.id === toCol)!;
      target.cards.splice(Math.min(toIndex, target.cards.length), 0, card);
      onChange?.(next);
      setAnnounce(`${card.title} moved to ${target.title}, position ${Math.min(toIndex, target.cards.length - 1) + 1}`);
      return next;
    });
  };
  const nudge = (cardId: string, colIdx: number, dir: -1 | 1) => {
    const to = cols[colIdx + dir];
    if (to) move(cardId, to.id, to.cards.length);
  };
  const t = reduced ? { duration: 0 } : spring.smooth;

  return (
    <LayoutGroup>
      <div className={cn("grid h-full auto-cols-[minmax(13rem,1fr)] grid-flow-col gap-3 overflow-x-auto p-1", className)}>
        <p className="sr-only" aria-live="polite">{announce}</p>
        {cols.map((col, ci) => (
          <section
            key={col.id}
            aria-label={`${col.title}, ${col.cards.length} cards`}
            onDragOver={(e) => {
              e.preventDefault();
              if (over?.col !== col.id) setOver({ col: col.id, index: col.cards.length });
            }}
            onDragLeave={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOver(null)}
            onDrop={(e) => {
              e.preventDefault();
              if (drag) move(drag, col.id, over?.col === col.id ? over.index : col.cards.length);
              setDrag(null);
              setOver(null);
            }}
            className={cn("flex min-h-0 flex-col rounded-2xl border p-2 transition-colors", over?.col === col.id ? "border-primary/50 bg-primary/5" : "border-border bg-muted/40")}
          >
            <header className="flex items-center justify-between px-1.5 pb-2 pt-1 text-xs font-semibold">
              {col.title}
              <motion.span key={col.cards.length} initial={reduced ? false : { scale: 1.4 }} animate={{ scale: 1 }} transition={spring.bouncy} className="rounded-full bg-background px-1.5 tabular-nums text-muted-foreground">
                {col.cards.length}
              </motion.span>
            </header>
            <ul className="flex min-h-12 flex-col gap-2 overflow-y-auto">
              <AnimatePresence initial={false}>
                {col.cards.map((card, i) => (
                  <motion.li key={card.id} layoutId={card.id} transition={t}>
                  <div
                    draggable
                    onDragStart={(e) => {
                      setDrag(card.id);
                      e.dataTransfer.setData("text/plain", card.id);
                    }}
                    onDragEnd={() => (setDrag(null), setOver(null))}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const r = e.currentTarget.getBoundingClientRect();
                      const index = e.clientY < r.top + r.height / 2 ? i : i + 1;
                      if (over?.col !== col.id || over.index !== index) setOver({ col: col.id, index });
                    }}
                    className={cn(
                      "group relative cursor-grab rounded-xl border border-border bg-card p-3 text-sm shadow-sm active:cursor-grabbing",
                      drag === card.id && "opacity-40",
                      over?.col === col.id && over.index === i && drag !== card.id && "before:absolute before:-top-1.5 before:inset-x-2 before:h-0.5 before:rounded-full before:bg-primary",
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" aria-hidden />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium leading-snug">{card.title}</p>
                        {card.tag && <span className="mt-1.5 inline-block rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{card.tag}</span>}
                      </div>
                    </div>
                    <div className="mt-2 flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100">
                      <button type="button" disabled={ci === 0} onClick={() => nudge(card.id, ci, -1)} aria-label={`Move ${card.title} to ${cols[ci - 1]?.title ?? ""}`} className="grid size-6 place-items-center rounded-md hover:bg-muted disabled:opacity-30"><ArrowLeft className="size-3.5" /></button>
                      <button type="button" disabled={ci === cols.length - 1} onClick={() => nudge(card.id, ci, 1)} aria-label={`Move ${card.title} to ${cols[ci + 1]?.title ?? ""}`} className="grid size-6 place-items-center rounded-md hover:bg-muted disabled:opacity-30"><ArrowRight className="size-3.5" /></button>
                    </div>
                  </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </section>
        ))}
      </div>
    </LayoutGroup>
  );
}
