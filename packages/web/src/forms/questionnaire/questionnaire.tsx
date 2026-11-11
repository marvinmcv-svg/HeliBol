"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Check } from "lucide-react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export interface Question {
  id: string;
  title: string;
  hint?: string;
  options: string[];
  /** Allow picking several options. */
  multiple?: boolean;
}

export interface QuestionnaireProps {
  questions: Question[];
  onComplete?: (answers: Record<string, string[]>) => void;
  className?: string;
}

/**
 * One question at a time, Typeform-style: answers slide the next question in from the direction of
 * travel, a progress bar springs forward, number keys pick options and Enter continues.
 */
export function Questionnaire({ questions, onComplete, className }: QuestionnaireProps) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const done = step >= questions.length;
  const q = questions[Math.min(step, questions.length - 1)];
  const picked = answers[q.id] ?? [];

  const go = (d: number) => {
    setDir(d);
    const next = step + d;
    if (next === questions.length) onComplete?.(answers);
    setStep(Math.max(0, Math.min(questions.length, next)));
  };
  const pick = (opt: string) => {
    const cur = answers[q.id] ?? [];
    const val = q.multiple ? (cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt]) : [opt];
    setAnswers((a) => ({ ...a, [q.id]: val }));
    if (!q.multiple) setTimeout(() => go(1), reduced ? 0 : 260);
  };

  const variants = {
    enter: (d: number) => (reduced ? { opacity: 0 } : { opacity: 0, y: d * 40, filter: "blur(6px)" }),
    center: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: (d: number) => (reduced ? { opacity: 0 } : { opacity: 0, y: d * -40, filter: "blur(6px)" }),
  };

  return (
    <div
      className={cn("flex h-full w-full max-w-lg flex-col", className)}
      onKeyDown={(e) => {
        if (done) return;
        const n = Number(e.key);
        if (n >= 1 && n <= q.options.length) pick(q.options[n - 1]);
        if (e.key === "Enter" && picked.length) go(1);
      }}
    >
      <div className="h-1 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={step}>
        <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${(step / questions.length) * 100}%` }} transition={reduced ? { duration: 0 } : spring.smooth} />
      </div>
      <div className="relative mt-8 flex-1">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          {done ? (
            <motion.div key="done" variants={variants} custom={dir} initial="enter" animate="center" exit="exit" transition={spring.smooth} className="flex flex-col items-start gap-3">
              <span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-6" /></span>
              <h3 className="text-2xl font-semibold tracking-tight">All set — thanks!</h3>
              <p className="text-sm text-muted-foreground">We tailored your workspace from {Object.keys(answers).length} answers.</p>
              <button type="button" onClick={() => (setAnswers({}), setDir(-1), setStep(0))} className="text-sm underline underline-offset-4">Start over</button>
            </motion.div>
          ) : (
            <motion.fieldset key={q.id} variants={variants} custom={dir} initial="enter" animate="center" exit="exit" transition={reduced ? { duration: 0.15 } : spring.smooth}>
              <legend className="text-sm text-muted-foreground">
                {step + 1} → {questions.length}
              </legend>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight">{q.title}</h3>
              {q.hint && <p className="mt-1 text-sm text-muted-foreground">{q.hint}</p>}
              <div className="mt-5 grid gap-2">
                {q.options.map((opt, i) => {
                  const on = picked.includes(opt);
                  return (
                    <motion.button
                      key={opt}
                      type="button"
                      role={q.multiple ? "checkbox" : "radio"}
                      aria-checked={on}
                      onClick={() => pick(opt)}
                      whileTap={reduced ? undefined : { scale: 0.98 }}
                      animate={on && !reduced ? { scale: [1, 1.02, 1] } : undefined}
                      className={cn("flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", on ? "border-primary bg-primary/10" : "border-border hover:bg-muted")}
                    >
                      <kbd className={cn("grid size-6 place-items-center rounded-md border text-[11px]", on ? "border-primary bg-primary text-primary-foreground" : "border-border")}>{on ? <Check className="size-3.5" /> : i + 1}</kbd>
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
              <div className="mt-6 flex items-center gap-3">
                {step > 0 && (
                  <button type="button" onClick={() => go(-1)} aria-label="Previous question" className="grid size-9 place-items-center rounded-lg border border-border hover:bg-muted"><ArrowLeft className="size-4" /></button>
                )}
                {q.multiple && (
                  <button type="button" disabled={!picked.length} onClick={() => go(1)} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40">
                    Continue <span className="opacity-60">↵</span>
                  </button>
                )}
              </div>
            </motion.fieldset>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
