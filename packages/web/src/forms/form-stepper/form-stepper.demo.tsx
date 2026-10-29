"use client";
import { FormStepper } from "./form-stepper";

const field = (label: string, ph: string) => (
  <label className="mb-3 block text-sm">
    <span className="mb-1 block text-muted-foreground">{label}</span>
    <input placeholder={ph} className="h-10 w-full rounded-lg border border-input bg-card px-3 outline-none focus:ring-2 focus:ring-ring/40" />
  </label>
);

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <FormStepper
        className="max-w-sm"
        steps={[
          { title: "Your account", content: <>{field("Email", "you@company.com")}{field("Password", "••••••••")}</> },
          { title: "Workspace", content: <>{field("Workspace name", "Northwind")}{field("Team size", "12")}</> },
          { title: "Pick a plan", content: <div className="grid grid-cols-2 gap-2">{["Hobby", "Pro"].map((p) => <button key={p} className="rounded-xl border border-border p-3 text-left text-sm hover:border-foreground"><b>{p}</b><p className="text-xs text-muted-foreground">{p === "Pro" ? "$19/mo" : "Free"}</p></button>)}</div> },
        ]}
      />
    </div>
  );
}
