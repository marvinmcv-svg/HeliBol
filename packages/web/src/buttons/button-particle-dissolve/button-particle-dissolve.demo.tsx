"use client";
import { useState } from "react";
import { DemoCenter } from "../../_demo";
import { ButtonParticleDissolve } from "./button-particle-dissolve";

export default function Demo() {
  const [k, setK] = useState(0);
  return (
    <DemoCenter className="flex-col gap-6">
      <ButtonParticleDissolve key={k} doneLabel="Invite sent">Send invite</ButtonParticleDissolve>
      <button onClick={() => setK((x) => x + 1)} className="text-xs text-muted-foreground underline underline-offset-4">Reset</button>
    </DemoCenter>
  );
}
