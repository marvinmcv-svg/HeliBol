"use client";
import { BgDotGlow } from "@web/backgrounds/bg-dot-glow/bg-dot-glow";
import { InputFloatingLabel } from "@web/forms/input-floating-label/input-floating-label";
import { SelectAnimated } from "@web/forms/select-animated/select-animated";
import { ButtonSend } from "@web/buttons/button-send/button-send";

export function ContactSection() {
  return (
    <BgDotGlow className="h-full">
      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-14 md:grid-cols-2">
        <div>
          <h2 className="text-4xl font-semibold tracking-tight">Let&apos;s make something move.</h2>
          <p className="mt-3 text-muted-foreground">Tell us about your project — we reply within one business day.</p>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground"><li>✦ Motion audits</li><li>✦ Design-system tokens</li><li>✦ Native + web parity</li></ul>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-3 rounded-3xl border border-border bg-card/90 p-6 shadow-xl backdrop-blur">
          <InputFloatingLabel label="Name" />
          <InputFloatingLabel label="Work email" type="email" />
          <SelectAnimated label="Budget" className="w-full" options={[{ value: "s", label: "$5k – $15k" }, { value: "m", label: "$15k – $50k" }, { value: "l", label: "$50k+" }]} />
          <textarea rows={3} placeholder="Project details" className="w-full resize-none rounded-xl border border-input bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring/40" />
          <div className="flex justify-end"><ButtonSend label="Send inquiry" /></div>
        </form>
      </section>
    </BgDotGlow>
  );
}
