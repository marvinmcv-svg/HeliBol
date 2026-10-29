"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface ToggleSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function ToggleSwitch({ checked: controlled, defaultChecked = false, onCheckedChange, label, disabled, className }: ToggleSwitchProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const checked = controlled ?? internal;
  const set = () => {
    if (controlled === undefined) setInternal(!checked);
    onCheckedChange?.(!checked);
  };
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-3 text-sm", disabled && "cursor-not-allowed opacity-50", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={set}
        className={cn(
          "relative flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          checked ? "justify-end bg-emerald-500" : "justify-start bg-muted-foreground/30",
        )}
      >
        <motion.span layout transition={spring.snappy} whileTap={{ width: 30 }} className="block h-6 w-6 rounded-full bg-white shadow-[0_2px_6px_rgb(0_0_0/.25)]" />
      </button>
      {label && <span>{label}</span>}
    </label>
  );
}
