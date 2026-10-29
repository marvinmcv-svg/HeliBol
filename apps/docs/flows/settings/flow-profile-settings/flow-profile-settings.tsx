"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Bell, ChevronRight, Lock, Moon, Sparkles, Vibrate } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";
import { haptic } from "../../_shared/phone";

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button role="switch" aria-checked={on} onClick={() => { haptic(); onChange(); }} className={cn("flex h-[30px] w-[50px] rounded-full p-0.5 transition-colors", on ? "justify-end bg-emerald-500" : "justify-start bg-zinc-300")}>
      <motion.span layout transition={spring.snappy} className="size-[26px] rounded-full bg-white shadow" />
    </button>
  );
}

export function FlowProfileSettings({ initialStep = 0 }: { initialStep?: number }) {
  const scroller = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scroller });
  const avatar = useTransform(scrollY, [0, 120], [1, 0.4]);
  const avatarY = useTransform(scrollY, [0, 120], [0, -30]);
  const bigTitle = useTransform(scrollY, [40, 110], [1, 0]);
  const smallTitle = useTransform(scrollY, [90, 130], [0, 1]);
  const headerBg = useTransform(scrollY, [90, 130], ["rgb(244 244 245 / 0)", "rgb(244 244 245 / .9)"]);
  const [prefs, setPrefs] = useState({ notif: true, haptics: true, dark: initialStep === 1, reduce: false });
  const flip = (k: keyof typeof prefs) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  const rows: [keyof typeof prefs, string, typeof Bell, string][] = [
    ["notif", "Notifications", Bell, "#ef4444"],
    ["haptics", "Haptics", Vibrate, "#8b5cf6"],
    ["dark", "Dark mode", Moon, "#0ea5e9"],
    ["reduce", "Reduce motion", Sparkles, "#f59e0b"],
  ];

  return (
    <div className="relative h-full bg-zinc-100 text-zinc-900">
      <motion.div style={{ backgroundColor: headerBg }} className="absolute inset-x-0 top-0 z-20 flex h-[88px] items-end justify-center pb-2.5 backdrop-blur">
        <motion.span style={{ opacity: smallTitle }} className="text-[15px] font-semibold">Ava Lin</motion.span>
      </motion.div>
      <div ref={scroller} className="h-full overflow-y-auto pt-16 pb-10">
        <div className="flex flex-col items-center pt-4">
          <motion.img src="/demo/photo-8.jpg" alt="" style={{ scale: avatar, y: avatarY }} className="size-24 rounded-full object-cover ring-4 ring-white" />
          <motion.div style={{ opacity: bigTitle }} className="mt-3 text-center">
            <h2 className="text-2xl font-semibold">Ava Lin</h2>
            <p className="text-sm text-zinc-500">Design Engineer · Pro</p>
          </motion.div>
        </div>
        <p className="mt-6 px-8 text-xs font-medium tracking-wide text-zinc-500 uppercase">Preferences</p>
        <div className="mx-4 mt-2 divide-y divide-zinc-200 overflow-hidden rounded-2xl bg-white">
          {rows.map(([k, label, Icon, color]) => (
            <div key={k} className="flex items-center gap-3 px-3.5 py-2.5">
              <span className="grid size-8 place-items-center rounded-lg text-white" style={{ background: color }}><Icon className="size-4" /></span>
              <span className="flex-1 text-[15px]">{label}</span>
              <Toggle on={prefs[k]} onChange={() => flip(k)} />
            </div>
          ))}
        </div>
        <p className="mt-6 px-8 text-xs font-medium tracking-wide text-zinc-500 uppercase">Account</p>
        <div className="mx-4 mt-2 divide-y divide-zinc-200 overflow-hidden rounded-2xl bg-white">
          {["Subscription", "Privacy & data", "Connected apps", "Export motion tokens", "Help center", "About"].map((l) => (
            <motion.button key={l} whileTap={{ backgroundColor: "rgb(228 228 231)" }} className="flex w-full items-center gap-3 px-3.5 py-3.5 text-left text-[15px]">
              <span className="grid size-8 place-items-center rounded-lg bg-zinc-200"><Lock className="size-4 text-zinc-600" /></span>
              <span className="flex-1">{l}</span>
              <ChevronRight className="size-4 text-zinc-400" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
