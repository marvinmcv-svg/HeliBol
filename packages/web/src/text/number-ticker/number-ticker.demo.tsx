"use client";
import { NumberTicker } from "./number-ticker";

export default function Demo() {
  return (
    <div className="grid h-full w-full grid-cols-1 place-content-center gap-8 p-8 text-center sm:grid-cols-3">
      {[
        { v: 12840, label: "Developers", suffix: "+" },
        { v: 99.98, label: "Uptime", suffix: "%", decimals: 2 },
        { v: 4.2, label: "ARR", prefix: "$", suffix: "M", decimals: 1 },
      ].map((s) => (
        <div key={s.label}>
          <NumberTicker value={s.v} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} className="text-4xl font-semibold tracking-tight sm:text-5xl" />
          <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
