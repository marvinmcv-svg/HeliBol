"use client";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@kinetik/core";
import { toggleSaved, useSaved } from "@/lib/saved";

/** Heart toggle that adds an item to the local "Saved" collection. */
export function SaveButton({ id, name, className, withLabel = false }: { id: string; name: string; className?: string; withLabel?: boolean }) {
  const saved = useSaved().includes(id);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from saved` : `Save ${name}`}
      title={saved ? "Saved" : "Save"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSaved(id);
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        withLabel ? "h-9 border border-border px-3.5 text-sm" : "size-8 justify-center bg-background/80 backdrop-blur",
        saved ? "text-rose-500" : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      <motion.span key={String(saved)} initial={saved ? { scale: 0.4 } : false} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }} className="grid place-items-center">
        <Heart className={cn("size-4", saved && "fill-current")} />
      </motion.span>
      {withLabel && (saved ? "Saved" : "Save")}
    </button>
  );
}
