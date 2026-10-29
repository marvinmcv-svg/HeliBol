"use client";
import { useState } from "react";
import { AnimatePresence, motion, useAnimation } from "motion/react";
import { ArrowLeft, Delete } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";
import { haptic } from "../../_shared/phone";

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

export function FlowAuth({ initialStep = 0 }: { initialStep?: number }) {
  const [step, setStep] = useState(initialStep);
  const [phone, setPhone] = useState("4155550142");
  const [code, setCode] = useState(initialStep === 1 ? "42" : "");
  const shake = useAnimation();

  const press = async (k: string) => {
    haptic("light");
    if (step === 0) {
      setPhone((p) => (k === "del" ? p.slice(0, -1) : (p + k).slice(0, 10)));
      return;
    }
    const next = k === "del" ? code.slice(0, -1) : (code + k).slice(0, 4);
    setCode(next);
    if (next.length === 4) {
      if (next === "4242") {
        haptic("success");
        setTimeout(() => setStep(2), 350);
      } else {
        haptic("error");
        await shake.start({ x: [0, -12, 12, -8, 8, -3, 0], transition: { duration: 0.45 } });
        setCode("");
      }
    }
  };

  const fmt = (p: string) => p.replace(/(\d{0,3})(\d{0,3})(\d{0,4})/, (_, a, b, c) => [a && `(${a}`, a.length === 3 ? ") " : "", b, c && `-${c}`].join(""));

  return (
    <div className="flex h-full flex-col bg-white px-6 pt-14 pb-6 text-zinc-900">
      <AnimatePresence mode="popLayout" initial={false}>
        {step === 0 && (
          <motion.div key="p" className="flex-1" initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} transition={spring.smooth}>
            <h2 className="text-[26px] font-semibold tracking-tight">What&apos;s your number?</h2>
            <p className="mt-1 text-sm text-zinc-500">We&apos;ll text you a code to sign in.</p>
            <div className="mt-8 flex items-center gap-2 border-b-2 border-zinc-900 pb-2 text-2xl font-medium tabular-nums">
              <span className="text-zinc-400">+1</span>
              <span>{fmt(phone) || <span className="text-zinc-300">(555) 000-0000</span>}</span>
              <span className="h-7 w-0.5 animate-pulse bg-violet-500" />
            </div>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="c" className="flex-1" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} transition={spring.smooth}>
            <button onClick={() => setStep(0)} aria-label="Back" className="-ml-1 mb-3 grid size-8 place-items-center rounded-full bg-zinc-100"><ArrowLeft className="size-4" /></button>
            <h2 className="text-[26px] font-semibold tracking-tight">Enter the code</h2>
            <p className="mt-1 text-sm text-zinc-500">Sent to +1 {fmt(phone)} · try <b>4242</b></p>
            <motion.div animate={shake} className="mt-8 flex justify-center gap-3">
              {[0, 1, 2, 3].map((n) => (
                <div key={n} className={cn("grid size-14 place-items-center rounded-2xl border-2 text-2xl font-semibold transition-colors", n === code.length ? "border-violet-500" : code[n] ? "border-zinc-900" : "border-zinc-200")}>
                  <AnimatePresence>{code[n] && <motion.span initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.3, opacity: 0 }} transition={spring.bouncy}>{code[n]}</motion.span>}</AnimatePresence>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="s" className="flex flex-1 flex-col items-center justify-center text-center" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={spring.bouncy}>
            <svg viewBox="0 0 52 52" className="size-24">
              <motion.circle cx="26" cy="26" r="24" fill="none" stroke="#10b981" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
              <motion.path d="M15 27l7 7 15-16" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.4 }} />
            </svg>
            <h2 className="mt-4 text-2xl font-semibold">You&apos;re verified</h2>
            <button onClick={() => { setStep(0); setCode(""); }} className="mt-4 text-xs text-zinc-400">Restart demo</button>
          </motion.div>
        )}
      </AnimatePresence>
      {step < 2 && (
        <>
          {step === 0 && (
            <motion.button whileTap={{ scale: 0.97 }} disabled={phone.length < 10} onClick={() => { haptic("medium"); setStep(1); }} className="mb-4 h-13 rounded-2xl bg-zinc-900 py-3.5 text-[15px] font-semibold text-white transition-opacity disabled:opacity-30">
              Send code
            </motion.button>
          )}
          <div className="grid grid-cols-3 gap-y-1">
            {keys.map((k, n) => (
              k ? (
                <motion.button key={n} whileTap={{ scale: 0.88, backgroundColor: "rgb(228 228 231)" }} onClick={() => press(k)} aria-label={k === "del" ? "Delete" : k} className="mx-auto grid h-12 w-20 place-items-center rounded-2xl text-2xl font-medium">
                  {k === "del" ? <Delete className="size-6" /> : k}
                </motion.button>
              ) : <span key={n} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
