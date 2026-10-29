"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { spring } from "@kinetik/tokens";
import { BgGridDots } from "@web/backgrounds/bg-grid-dots/bg-grid-dots";
import { ButtonStateful } from "@web/buttons/button-stateful/button-stateful";
import { InputFloatingLabel } from "@web/forms/input-floating-label/input-floating-label";
import { OtpInput } from "@web/forms/otp-input/otp-input";
import { SuccessCheck } from "@web/loaders/success-check/success-check";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function AuthCard() {
  const [step, setStep] = useState<"email" | "code" | "done">("email");
  const [email, setEmail] = useState("ava@kinetik.dev");
  return (
    <BgGridDots className="grid h-full place-items-center p-6">
      <motion.div layout transition={spring.smooth} className="w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card/90 p-7 shadow-2xl backdrop-blur">
        <AnimatePresence mode="popLayout" initial={false}>
          {step === "email" && (
            <motion.div key="email" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={spring.smooth} className="space-y-5">
              <div><h2 className="text-xl font-semibold">Sign in to kinetik</h2><p className="text-sm text-muted-foreground">We&apos;ll email you a magic code.</p></div>
              <InputFloatingLabel label="Work email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <ButtonStateful className="w-full" successLabel="Code sent" onAction={async () => { await wait(900); setTimeout(() => setStep("code"), 600); }}>Continue with email</ButtonStateful>
            </motion.div>
          )}
          {step === "code" && (
            <motion.div key="code" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={spring.smooth} className="space-y-5 text-center">
              <div><h2 className="text-xl font-semibold">Check your inbox</h2><p className="text-sm text-muted-foreground">Code sent to {email}. Try <b className="font-mono text-foreground">424242</b>.</p></div>
              <OtpInput onComplete={(c) => { const ok = c === "424242"; if (ok) setTimeout(() => setStep("done"), 500); return ok; }} />
              <button onClick={() => setStep("email")} className="text-xs text-muted-foreground hover:text-foreground">← Use a different email</button>
            </motion.div>
          )}
          {step === "done" && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={spring.smooth} className="flex flex-col items-center gap-3 py-4 text-center">
              <SuccessCheck status="success" />
              <h2 className="text-xl font-semibold">You&apos;re in</h2>
              <button onClick={() => setStep("email")} className="text-xs text-muted-foreground hover:text-foreground">Restart demo</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </BgGridDots>
  );
}
