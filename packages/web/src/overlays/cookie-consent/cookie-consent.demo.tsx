"use client";
import { useState } from "react";
import { CookieConsent } from "./cookie-consent";

export default function Demo() {
  const [key, setKey] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  return (
    <div className="relative flex h-full flex-col items-center justify-end p-4">
      <p className="absolute inset-x-0 top-8 text-center text-sm text-muted-foreground" aria-live="polite">
        {result ? <>Saved: {result} · <button onClick={() => (setResult(null), setKey((k) => k + 1))} className="underline underline-offset-4">show again</button></> : "Your site content…"}
      </p>
      <CookieConsent key={key} onDecide={(g) => setResult(Object.entries(g).filter(([, v]) => v).map(([k]) => k).join(", "))} />
    </div>
  );
}
