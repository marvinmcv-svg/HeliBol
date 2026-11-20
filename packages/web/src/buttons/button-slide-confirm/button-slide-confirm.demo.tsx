"use client";
import { useState } from "react";
import { DemoCenter } from "../../_demo";
import { ButtonSlideConfirm } from "./button-slide-confirm";

export default function Demo() {
  const [k, setK] = useState(0);
  return (
    <DemoCenter className="flex-col gap-5">
      <p className="text-sm text-muted-foreground">Total <span className="font-semibold text-foreground">$128.40</span></p>
      <ButtonSlideConfirm key={k} label="Slide to pay" doneLabel="Paid · $128.40" />
      <button onClick={() => setK((x) => x + 1)} className="text-xs text-muted-foreground underline underline-offset-4">Reset</button>
    </DemoCenter>
  );
}
