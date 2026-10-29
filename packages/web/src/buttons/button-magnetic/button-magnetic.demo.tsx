"use client";
import { ArrowUpRight } from "lucide-react";
import { ButtonMagnetic } from "./button-magnetic";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-8">
      <ButtonMagnetic>
        Let&apos;s talk <ArrowUpRight className="size-4" />
      </ButtonMagnetic>
      <p className="text-xs text-muted-foreground">Move your cursor near the button</p>
    </div>
  );
}
