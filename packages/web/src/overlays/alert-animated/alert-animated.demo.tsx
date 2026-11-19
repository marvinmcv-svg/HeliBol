"use client";
import { useState } from "react";
import { AlertAnimated } from "./alert-animated";

export default function Demo() {
  const [key, setKey] = useState(0);
  return (
    <div key={key} className="mx-auto flex h-full max-w-md flex-col justify-center gap-3 p-6">
      <AlertAnimated tone="success" title="Deployment complete" duration={6000}>Production is live on 3 regions.</AlertAnimated>
      <AlertAnimated tone="warning" title="Usage at 85%" action={<button className="text-xs font-medium underline underline-offset-4">Upgrade plan</button>}>You&apos;ll hit your limit in about 4 days.</AlertAnimated>
      <AlertAnimated tone="danger" title="Payment failed">Your card was declined. Update it to keep your workspace.</AlertAnimated>
      <p className="text-center text-sm text-muted-foreground">Dismiss one and watch the rest close the gap · <button onClick={() => setKey((k) => k + 1)} className="underline underline-offset-4">reset</button></p>
    </div>
  );
}
