"use client";
import { KanbanBoard } from "./kanban-board";

export default function Demo() {
  return (
    <div className="h-full p-4">
      <KanbanBoard
        columns={[
          { id: "todo", title: "To do", cards: [{ id: "a", title: "Hero copy review", tag: "Content" }, { id: "b", title: "Pricing toggle states", tag: "Design" }, { id: "c", title: "OG images" }] },
          { id: "doing", title: "In progress", cards: [{ id: "d", title: "three.js coin flip", tag: "3D" }, { id: "e", title: "Reduced-motion audit", tag: "A11y" }] },
          { id: "done", title: "Done", cards: [{ id: "f", title: "Saved collections", tag: "Feature" }] },
        ]}
      />
    </div>
  );
}
