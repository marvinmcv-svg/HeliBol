"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { spring } from "@kinetik/tokens";
import { FormStepper } from "@web/forms/form-stepper/form-stepper";
import { SuccessCheck } from "@web/loaders/success-check/success-check";
import { InputFloatingLabel } from "@web/forms/input-floating-label/input-floating-label";

function Confetti() {
  const colors = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden">
      {Array.from({ length: 40 }, (_, i) => {
        const x = ((i * 37) % 100) - 50;
        return (
          <motion.span
            key={i}
            className="absolute top-1/3 left-1/2 h-2.5 w-1.5 rounded-sm"
            style={{ background: colors[i % colors.length] }}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{ x: x * 6, y: [0, -140 - (i % 5) * 30, 320], rotate: (i % 2 ? 1 : -1) * 540, opacity: [1, 1, 0] }}
            transition={{ duration: 1.8 + (i % 4) * 0.2, ease: [0.2, 0.6, 0.4, 1] }}
          />
        );
      })}
    </div>
  );
}

export function CheckoutSteps() {
  const [done, setDone] = useState(false);
  return (
    <div className="relative grid h-full place-items-center overflow-hidden p-6">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={spring.smooth} className="flex flex-col items-center gap-3 text-center">
            <Confetti />
            <SuccessCheck status="success" size={88} />
            <h2 className="text-2xl font-semibold">Order confirmed</h2>
            <p className="text-sm text-muted-foreground">Receipt #KN-2048 sent to your email.</p>
            <button onClick={() => setDone(false)} className="mt-2 text-xs text-muted-foreground hover:text-foreground">Restart demo</button>
          </motion.div>
        ) : (
          <motion.div key="form" exit={{ opacity: 0, scale: 0.97 }} className="grid w-full max-w-3xl gap-6 md:grid-cols-[1.3fr_1fr]">
            <div className="rounded-3xl border border-border bg-card p-6">
              <FormStepper
                onFinish={() => setDone(true)}
                steps={[
                  { title: "Shipping", content: <div className="space-y-3"><InputFloatingLabel label="Full name" defaultValue="Ava Lin" /><InputFloatingLabel label="Address" defaultValue="221B Baker St" /></div> },
                  { title: "Payment", content: <div className="space-y-3"><InputFloatingLabel label="Card number" defaultValue="4242 4242 4242 4242" /><div className="grid grid-cols-2 gap-3"><InputFloatingLabel label="Expiry" defaultValue="12/29" /><InputFloatingLabel label="CVC" defaultValue="123" /></div></div> },
                  { title: "Review", content: <p className="text-sm text-muted-foreground">Everything look right? Press Finish to place your order.</p> },
                ]}
              />
            </div>
            <aside className="space-y-3 rounded-3xl border border-border bg-card/60 p-6 text-sm">
              <p className="font-semibold">Order summary</p>
              {[["Aurora Print", 64, 6], ["Neon City Print", 48, 3]].map(([n, p, img]) => (
                <div key={n as string} className="flex items-center gap-3"><img src={`/demo/photo-${img}.jpg`} alt="" className="size-12 rounded-lg object-cover" /><span className="flex-1">{n}</span><span className="tabular-nums">${p}</span></div>
              ))}
              <div className="flex justify-between border-t border-border pt-3 font-semibold"><span>Total</span><span>$112</span></div>
            </aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
