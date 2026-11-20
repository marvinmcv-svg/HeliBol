"use client";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface LoaderSkeletonMorphProps {
  /** When true, the real content replaces the skeleton. */
  loaded: boolean;
  children: ReactNode;
  /** Rows of skeleton bars; numbers are widths in %. Default looks like a profile card. */
  rows?: number[];
  avatar?: boolean;
  className?: string;
}

/**
 * Skeleton → content morph: shimmering placeholder bars dissolve with a blur while the real content
 * resolves in from a blur, row by row, in the same box — no layout jump. Under reduced motion the
 * shimmer stops and the swap is an instant cross-fade.
 */
export function LoaderSkeletonMorph({ loaded, children, rows = [70, 45, 90, 80], avatar = true, className }: LoaderSkeletonMorphProps) {
  const reduced = useReducedMotion();
  return (
    <div className={cn("relative grid", className)} aria-busy={!loaded}>
      <AnimatePresence initial={false}>
        {!loaded && (
          <motion.div
            key="sk"
            aria-hidden
            className="col-start-1 row-start-1 space-y-3"
            exit={reduced ? { opacity: 0, transition: { duration: 0.15 } } : { opacity: 0, filter: "blur(8px)", scale: 0.98, transition: { duration: 0.45 } }}
          >
            {avatar && (
              <div className="flex items-center gap-3">
                <Bar reduced={reduced} className="size-11 rounded-full" />
                <div className="flex-1 space-y-2"><Bar reduced={reduced} className="h-3 w-1/2" /><Bar reduced={reduced} className="h-2.5 w-1/3" /></div>
              </div>
            )}
            {rows.map((w, i) => <Bar key={i} reduced={reduced} className="h-3" style={{ width: `${w}%` }} />)}
          </motion.div>
        )}
      </AnimatePresence>
      {loaded && (
        <motion.div
          className="col-start-1 row-start-1"
          initial={reduced ? { opacity: 0 } : { opacity: 0, filter: "blur(10px)", y: 6 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: reduced ? 0.15 : 0.6, delay: reduced ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

function Bar({ className, style, reduced }: { className?: string; style?: React.CSSProperties; reduced: boolean }) {
  return (
    <div className={cn("relative overflow-hidden rounded-md bg-muted", className)} style={style}>
      {!reduced && (
        <motion.span
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}

/** Convenience hook for demos: flips to loaded after `ms`. */
export function useFakeLoad(ms = 1600, key: unknown = 0) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(false);
    const t = setTimeout(() => setLoaded(true), ms);
    return () => clearTimeout(t);
  }, [ms, key]);
  return loaded;
}
