"use client";
import { Trash2 } from "lucide-react";
import { ButtonHoldConfirm } from "./button-hold-confirm";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8">
      <ButtonHoldConfirm onConfirm={() => {}}>
        <Trash2 className="size-4" /> Hold to delete project
      </ButtonHoldConfirm>
      <p className="text-xs text-muted-foreground">Press and hold (mouse, touch, Enter or Space)</p>
    </div>
  );
}
