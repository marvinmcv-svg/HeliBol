"use client";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface Step {
  title: string;
  content: ReactNode;
}

export interface FormStepperProps {
  steps: Step[];
  onFinish?: () => void;
  className?: string;
}

export function FormStepper({ steps, onFinish, className }: FormStepperProps) {
  const [[step, dir], setStep] = useState<[number, number]>([0, 1]);
  const go = (n: number) => setStep([n, n > step ? 1 : -1]);
  const last = step === steps.length - 1;

  return (
    <div className={cn("w-full", className)}>
      <ol className="mb-6 flex items-center">
        {steps.map((s, i) => (
          <li key={s.title} className="flex flex-1 items-center last:flex-none">
            <motion.span
              animate={{ scale: i === step ? 1.1 : 1 }}
              transition={spring.bouncy}
              aria-current={i === step ? "step" : undefined}
              className={cn("relative grid size-8 shrink-0 place-items-center rounded-full border-2 text-xs font-semibold transition-colors duration-300", i < step ? "border-foreground bg-foreground text-background" : i === step ? "border-foreground" : "border-border text-muted-foreground")}
            >
              {i < step ? <Check className="size-4" /> : i + 1}
            </motion.span>
            {i < steps.length - 1 && (
              <span className="mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-border">
                <motion.span className="block h-full origin-left bg-foreground" animate={{ scaleX: i < step ? 1 : 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />
              </span>
            )}
          </li>
        ))}
      </ol>
      <div className="relative overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={{ enter: (d: number) => ({ x: d * 60, opacity: 0, filter: "blur(4px)" }), center: { x: 0, opacity: 1, filter: "blur(0px)" }, exit: (d: number) => ({ x: d * -60, opacity: 0, filter: "blur(4px)" }) }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring.smooth}
          >
            <h3 className="mb-3 text-lg font-semibold">{steps[step].title}</h3>
            {steps[step].content}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-6 flex justify-between">
        <button onClick={() => go(step - 1)} disabled={step === 0} className="rounded-lg px-3 py-2 text-sm hover:bg-accent disabled:opacity-0">Back</button>
        <button onClick={() => (last ? onFinish?.() : go(step + 1))} className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background">{last ? "Finish" : "Continue"}</button>
      </div>
    </div>
  );
}
