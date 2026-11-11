"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export interface DatePickerProps {
  value?: Date | null;
  onChange?: (d: Date) => void;
  /** Locale for month/day names. */
  locale?: string;
  /** First day of the week, 0 = Sunday. */
  weekStart?: 0 | 1;
  label?: string;
  className?: string;
}

const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/**
 * A popover date picker: the calendar springs open from the field, months slide in the direction you
 * navigate, the selection circle glides between days (shared layout) and the full WAI-ARIA grid
 * keyboard model works (arrows, Home/End, PageUp/PageDown, Enter, Esc).
 */
export function DatePicker({ value = null, onChange, locale = "en-US", weekStart = 1, label = "Date", className }: DatePickerProps) {
  const reduced = useReducedMotion();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date | null>(value);
  const [focus, setFocus] = useState<Date>(value ?? new Date());
  const [dir, setDir] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const today = useMemo(() => new Date(), []);

  const month = new Date(focus.getFullYear(), focus.getMonth(), 1);
  const days = useMemo(() => {
    const offset = (month.getDay() - weekStart + 7) % 7;
    return Array.from({ length: 42 }, (_, i) => addDays(month, i - offset));
  }, [month.getTime(), weekStart]); // eslint-disable-line react-hooks/exhaustive-deps
  const weekdays = useMemo(() => Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(locale, { weekday: "narrow" }).format(new Date(2024, 0, 7 + weekStart + i))), [locale, weekStart]);
  const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, o).format(d);

  const move = (d: Date) => {
    if (d.getMonth() !== focus.getMonth() || d.getFullYear() !== focus.getFullYear()) setDir(d > focus ? 1 : -1);
    setFocus(d);
  };
  const choose = (d: Date) => { setSelected(d); setFocus(d); onChange?.(d); setOpen(false); };

  useEffect(() => {
    if (!open) return;
    grid.current?.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus();
  }, [open, focus]);
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", down);
    return () => document.removeEventListener("pointerdown", down);
  }, [open]);

  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focus, -1), ArrowRight: () => addDays(focus, 1), ArrowUp: () => addDays(focus, -7), ArrowDown: () => addDays(focus, 7),
      Home: () => addDays(focus, -((focus.getDay() - weekStart + 7) % 7)), End: () => addDays(focus, 6 - ((focus.getDay() - weekStart + 7) % 7)),
      PageUp: () => new Date(focus.getFullYear(), focus.getMonth() - 1, focus.getDate()), PageDown: () => new Date(focus.getFullYear(), focus.getMonth() + 1, focus.getDate()),
    };
    if (map[e.key]) { e.preventDefault(); move(map[e.key]()); }
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(focus); }
    if (e.key === "Escape") setOpen(false);
  };

  const slide = { enter: (d: number) => ({ x: reduced ? 0 : d * 40, opacity: 0 }), center: { x: 0, opacity: 1 }, exit: (d: number) => ({ x: reduced ? 0 : d * -40, opacity: 0 }) };

  return (
    <div ref={root} className={cn("relative inline-block", className)}>
      <span id={`${id}-l`} className="mb-1 block text-sm font-medium">{label}</span>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby={`${id}-l ${id}-v`}
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-60 items-center gap-2 rounded-xl border border-border bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <CalendarDays className="size-4 text-muted-foreground" />
        <span id={`${id}-v`} className={selected ? "" : "text-muted-foreground"}>{selected ? fmt(selected, { dateStyle: "medium" }) : "Pick a date"}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-label="Choose date"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.96 }}
            transition={reduced ? { duration: 0.1 } : spring.snappy}
            style={{ transformOrigin: "top left" }}
            className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-border bg-popover p-3 text-popover-foreground shadow-xl"
          >
            <div className="flex items-center justify-between px-1 pb-2">
              <button type="button" aria-label="Previous month" onClick={() => move(new Date(focus.getFullYear(), focus.getMonth() - 1, 1))} className="grid size-8 place-items-center rounded-lg hover:bg-muted"><ChevronLeft className="size-4" /></button>
              <AnimatePresence mode="popLayout" custom={dir} initial={false}>
                <motion.span key={month.getTime()} custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={reduced ? { duration: 0.1 } : spring.smooth} className="text-sm font-semibold" aria-live="polite">
                  {fmt(month, { month: "long", year: "numeric" })}
                </motion.span>
              </AnimatePresence>
              <button type="button" aria-label="Next month" onClick={() => move(new Date(focus.getFullYear(), focus.getMonth() + 1, 1))} className="grid size-8 place-items-center rounded-lg hover:bg-muted"><ChevronRight className="size-4" /></button>
            </div>
            <div className="grid grid-cols-7 text-center text-[11px] text-muted-foreground" aria-hidden>{weekdays.map((w, i) => <span key={i} className="py-1">{w}</span>)}</div>
            <AnimatePresence mode="popLayout" custom={dir} initial={false}>
              <motion.div key={month.getTime()} ref={grid} role="grid" aria-label={fmt(month, { month: "long", year: "numeric" })} onKeyDown={onKey} custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={reduced ? { duration: 0.1 } : spring.smooth} className="grid grid-cols-7 gap-y-0.5">
                {days.map((d) => {
                  const inMonth = d.getMonth() === month.getMonth();
                  const isSel = selected && sameDay(d, selected);
                  const isFocus = sameDay(d, focus);
                  return (
                    <button
                      key={d.getTime()}
                      type="button"
                      role="gridcell"
                      tabIndex={isFocus ? 0 : -1}
                      aria-selected={!!isSel}
                      aria-label={fmt(d, { dateStyle: "full" })}
                      onClick={() => choose(d)}
                      className={cn("relative mx-auto grid size-9 place-items-center rounded-full text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring", !inMonth && "text-muted-foreground/50", isSel ? "text-primary-foreground" : "hover:bg-muted")}
                    >
                      {isSel && <motion.span layoutId={`${id}-sel`} transition={reduced ? { duration: 0 } : spring.bouncy} className="absolute inset-0 rounded-full bg-primary" />}
                      <span className="relative">{d.getDate()}</span>
                      {sameDay(d, today) && !isSel && <span className="absolute bottom-1 size-1 rounded-full bg-primary" />}
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
