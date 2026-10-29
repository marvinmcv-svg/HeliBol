"use client";
import { useState } from "react";
import { ErrorShake } from "./error-shake";

export default function Demo() {
  const [tries, setTries] = useState(0);
  const [pw, setPw] = useState("");
  const wrong = tries > 0;
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <form
        className="w-full max-w-xs space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (pw !== "kinetik") setTries((t) => t + 1);
          else setTries(0);
        }}
      >
        <ErrorShake trigger={tries}>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password (hint: kinetik)"
            aria-invalid={wrong || undefined}
            aria-describedby="k-shake-err"
            className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring/40 aria-invalid:border-destructive aria-invalid:bg-destructive/5"
          />
        </ErrorShake>
        <p id="k-shake-err" role="alert" className="h-4 text-xs text-destructive">{wrong ? `Incorrect password (${tries})` : ""}</p>
        <button className="h-10 w-full rounded-xl bg-foreground text-sm font-medium text-background">Sign in</button>
      </form>
    </div>
  );
}
