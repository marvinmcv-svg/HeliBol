"use client";
import { motion } from "motion/react";
import { DemoCenter, photos } from "../../_demo";
import { MockupTabletRotate } from "./mockup-tablet-rotate";

const spring = { type: "spring" as const, stiffness: 140, damping: 20 };

export default function Demo() {
  return (
    <DemoCenter>
      <MockupTabletRotate size={420}>
        {(o) => (
          <div className={o === "landscape" ? "grid h-full grid-cols-[1.2fr_1fr] gap-2 p-2" : "grid h-full grid-rows-[1fr_auto] gap-2 p-2"}>
            <motion.img layout transition={spring} src={photos[3]} alt="" className="h-full min-h-0 w-full rounded-lg object-cover" />
            <motion.div layout transition={spring} className={o === "landscape" ? "flex flex-col justify-center gap-1.5 p-2" : "grid grid-cols-3 gap-2"}>
              <motion.p layout="position" className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Field notes</motion.p>
              <motion.h3 layout="position" className="text-lg font-semibold leading-tight tracking-tight">Canopy at dawn</motion.h3>
              {o === "landscape" && <p className="text-[11px] leading-snug text-muted-foreground">Rotate the tablet — the device spins and the layout reflows to fit.</p>}
              {o === "portrait" && <motion.img layout src={photos[1]} alt="" className="aspect-square w-full rounded-md object-cover" />}
            </motion.div>
          </div>
        )}
      </MockupTabletRotate>
    </DemoCenter>
  );
}
