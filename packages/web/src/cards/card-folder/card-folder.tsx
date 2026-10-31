"use client";
import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

/** A folder whose front flap tilts open on hover/click and whose papers slide up and fan out. */
export function CardFolder({ papers, color = "#6366f1", label = "Folder", className }: { papers: ReactNode[]; color?: string; label?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      aria-label={label}
      className={cn("relative h-40 w-52 outline-none [perspective:700px] focus-visible:ring-2 focus-visible:ring-ring rounded-2xl", className)}
    >
      <div className="absolute inset-x-0 bottom-0 h-[85%] rounded-2xl rounded-tl-none" style={{ background: color, filter: "brightness(.8)" }}>
        <div className="absolute -top-4 left-0 h-5 w-20 rounded-t-xl" style={{ background: color, filter: "brightness(.8)" }} />
      </div>
      {papers.slice(0, 3).map((p, i) => (
        <motion.div key={i} className="absolute inset-x-6 bottom-4 h-[70%] overflow-hidden rounded-lg bg-white shadow-md" animate={open ? { y: -48 - i * 6, x: (i - 1) * 36, rotate: (i - 1) * 10 } : { y: -i * 4, x: 0, rotate: 0 }} transition={{ ...spring.smooth, delay: open ? i * 0.04 : 0 }}>
          {p}
        </motion.div>
      ))}
      <motion.div className="absolute inset-x-0 bottom-0 h-[72%] origin-bottom rounded-2xl" style={{ background: color }} animate={{ rotateX: open ? -32 : 0 }} transition={spring.smooth} />
    </button>
  );
}
