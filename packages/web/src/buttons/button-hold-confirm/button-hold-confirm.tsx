"use client";
import { useRef, useState, type ReactNode } from "react";
import { animate, motion, useMotionValue, useTransform, type AnimationPlaybackControls } from "motion/react";
import { cn } from "@kinetik/core";
import { durationS } from "@kinetik/tokens";

export interface ButtonHoldConfirmProps {
  children: ReactNode;
  onConfirm: () => void;
  /** Seconds the user must hold. */
  holdDuration?: number;
  confirmedLabel?: ReactNode;
  className?: string;
}

export function ButtonHoldConfirm({ children, onConfirm, holdDuration = 1.4, confirmedLabel = "Deleted", className }: ButtonHoldConfirmProps) {
  const progress = useMotionValue(0);
  const clip = useTransform(progress, (p) => `inset(0 ${100 - p * 100}% 0 0)`);
  const ctrl = useRef<AnimationPlaybackControls | null>(null);
  const [done, setDone] = useState(false);

  const start = () => {
    if (done) return;
    ctrl.current?.stop();
    ctrl.current = animate(progress, 1, {
      duration: holdDuration * (1 - progress.get()),
      ease: "linear",
      onComplete: () => {
        setDone(true);
        onConfirm();
        setTimeout(() => {
          setDone(false);
          progress.set(0);
        }, 1600);
      },
    });
  };
  const cancel = () => {
    if (done) return;
    ctrl.current?.stop();
    ctrl.current = animate(progress, 0, { duration: durationS.moderate, ease: [0.4, 0, 1, 1] });
  };

  const label = done ? confirmedLabel : children;
  return (
    <button
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !e.repeat && (e.preventDefault(), start())}
      onKeyUp={(e) => (e.key === "Enter" || e.key === " ") && cancel()}
      aria-label={typeof children === "string" ? `${children} (press and hold to confirm)` : undefined}
      className={cn(
        "relative inline-flex h-11 select-none items-center justify-center overflow-hidden rounded-xl border border-destructive/30 bg-destructive/10 px-5 text-sm font-medium text-destructive outline-none transition-transform active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <span className="flex items-center gap-2">{label}</span>
      <motion.span aria-hidden style={{ clipPath: clip }} className="absolute inset-0 flex items-center justify-center gap-2 bg-destructive text-white">
        {label}
      </motion.span>
    </button>
  );
}
