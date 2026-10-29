"use client";
import { motion } from "motion/react";
import { TextScramble } from "@web/text/text-scramble/text-scramble";
import { ButtonMagnetic } from "@web/buttons/button-magnetic/button-magnetic";
import { BgGridDots } from "@web/backgrounds/bg-grid-dots/bg-grid-dots";

export function NotFoundPlayful() {
  return (
    <BgGridDots className="grid h-full place-items-center overflow-hidden p-6 text-center">
      <div className="flex flex-col items-center">
        <div className="relative flex items-center font-mono text-[9rem] leading-none font-bold tracking-tighter sm:text-[12rem]">
          <span>4</span>
          <motion.span
            className="mx-2 inline-grid size-[0.8em] place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-transparent shadow-[0_0_80px_rgb(139_92_246/.5)]"
            animate={{ y: [0, -18, 0], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            0
          </motion.span>
          <span>4</span>
        </div>
        <TextScramble as="p" className="font-mono text-lg">PAGE NOT FOUND</TextScramble>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">This page drifted out of orbit. Let&apos;s get you back to solid ground.</p>
        <div className="mt-8"><ButtonMagnetic onClick={() => (window.location.href = "/")}>Take me home</ButtonMagnetic></div>
      </div>
    </BgGridDots>
  );
}
