"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ShoppingBag } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface ProductVariant { name: string; color: string; image: string; price: number }
export interface CardProductSwatchProps {
  title: string;
  subtitle?: string;
  variants: ProductVariant[];
  currency?: string;
  className?: string;
}

/**
 * Product card that changes with the colourway: picking a swatch floods the backdrop with the new
 * colour from the swatch's side, the product slides out and the next one swings in, the name and
 * price roll, and the selection ring glides between swatches. "Add to bag" morphs into a check.
 */
export function CardProductSwatch({ title, subtitle, variants, currency = "$", className }: CardProductSwatchProps) {
  const reduced = useReducedMotion();
  const [[i, dir], setSel] = useState<[number, number]>([0, 0]);
  const [added, setAdded] = useState(false);
  const v = variants[i]!;
  const pick = (n: number) => n !== i && (setSel([n, n > i ? 1 : -1]), setAdded(false));
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 260, damping: 26 };

  return (
    <div className={cn("relative w-80 overflow-hidden rounded-[28px] border bg-card shadow-xl", className)}>
      <div className="relative h-60 overflow-hidden">
        <motion.div className="absolute inset-0" animate={{ backgroundColor: v.color }} transition={{ duration: reduced ? 0 : 0.5 }} />
        <motion.div aria-hidden className="absolute -right-10 -top-10 size-48 rounded-full bg-white/25 blur-2xl" animate={{ x: dir * -10 }} />
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.img
            key={v.image + i}
            src={v.image}
            alt={`${title} in ${v.name}`}
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: reduced ? 0 : d * 220, rotate: reduced ? 0 : d * 18, opacity: 0 }),
              center: { x: 0, rotate: -6, opacity: 1 },
              exit: (d: number) => ({ x: reduced ? 0 : d * -220, rotate: reduced ? 0 : d * -18, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring}
            className="absolute left-1/2 top-1/2 -ml-24 -mt-[76px] h-[152px] w-48 rounded-2xl object-cover shadow-[0_30px_40px_-15px_rgb(0_0_0/.5)]"
          />
        </AnimatePresence>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold leading-tight">{title}</h3>
            <div className="relative h-5 overflow-hidden text-sm text-muted-foreground">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.p key={v.name} initial={{ y: reduced ? 0 : 20 * (dir || 1), opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: reduced ? 0 : -20 * (dir || 1), opacity: 0 }} transition={spring}>{subtitle ? `${subtitle} · ` : ""}{v.name}</motion.p>
              </AnimatePresence>
            </div>
          </div>
          <div className="relative h-7 overflow-hidden font-mono text-xl font-semibold tabular-nums">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span key={v.price} className="block" initial={{ y: reduced ? 0 : 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: reduced ? 0 : -28, opacity: 0 }} transition={spring}>{currency}{v.price}</motion.span>
            </AnimatePresence>
          </div>
        </div>
        <div role="radiogroup" aria-label="Colour" className="flex gap-2.5">
          {variants.map((x, n) => (
            <button key={x.name} type="button" role="radio" aria-checked={n === i} aria-label={x.name} onClick={() => pick(n)} className="relative grid size-8 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {n === i && <motion.span layoutId={`kn-swatch-${title}`} className="absolute inset-0 rounded-full ring-2 ring-foreground" transition={spring} />}
              <span className="size-6 rounded-full ring-1 ring-black/10" style={{ background: x.color }} />
            </button>
          ))}
        </div>
        <motion.button
          type="button"
          layout
          onClick={() => setAdded(true)}
          className={cn("flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-medium text-white", added ? "bg-emerald-500" : "bg-foreground text-background")}
          transition={spring}
          aria-live="polite"
        >
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span key="ok" className="flex items-center gap-2" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}><Check className="size-4" /> Added to bag</motion.span>
            ) : (
              <motion.span key="add" className="flex items-center gap-2" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}><ShoppingBag className="size-4" /> Add to bag</motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
