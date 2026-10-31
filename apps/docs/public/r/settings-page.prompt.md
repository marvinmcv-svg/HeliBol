You are given a task to integrate a block from the **kinetik** motion library into this codebase.

# Settings Page (`settings-page`)

Settings screen: collapsible sidebar, spring toggles, animated select, tag input and a hold-to-confirm danger zone.

## What it should do
Create a settings page: collapsible icon sidebar; notification rows with spring switches; appearance with an animated select (including a Reduced motion option) and a tag input; a red-bordered danger zone with a hold-to-confirm delete.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/settings-page.tsx`.

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/nav-sidebar.json https://marvzkineticlibrary.vercel.app/r/toggle-switch.json https://marvzkineticlibrary.vercel.app/r/select-animated.json https://marvzkineticlibrary.vercel.app/r/tag-input.json https://marvzkineticlibrary.vercel.app/r/button-hold-confirm.json
```

## Non-negotiables
- **Accessibility:** Switches, listbox and hold button are all keyboard operable.
- **Performance:** Small layout animations only.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/settings-page.tsx
```tsx
"use client";
import { Bell, CreditCard, Palette, Shield, User } from "lucide-react";
import { NavSidebar } from "@/components/kinetik/nav-sidebar";
import { ToggleSwitch } from "@/components/kinetik/toggle-switch";
import { SelectAnimated } from "@/components/kinetik/select-animated";
import { TagInput } from "@/components/kinetik/tag-input";
import { ButtonHoldConfirm } from "@/components/kinetik/button-hold-confirm";

export function SettingsPage() {
  return (
    <div className="flex h-full overflow-hidden">
      <NavSidebar brand="Settings" items={[{ icon: <User />, label: "Profile" }, { icon: <Bell />, label: "Notifications" }, { icon: <Palette />, label: "Appearance" }, { icon: <Shield />, label: "Security" }, { icon: <CreditCard />, label: "Billing" }]} />
      <main className="flex-1 space-y-8 overflow-auto p-6">
        <section className="space-y-4">
          <h2 className="font-semibold">Notifications</h2>
          {["Product updates", "Weekly digest", "Mentions"].map((l, i) => <div key={l} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">{l}<ToggleSwitch defaultChecked={i !== 1} /></div>)}
        </section>
        <section className="space-y-3">
          <h2 className="font-semibold">Appearance</h2>
          <SelectAnimated label="Motion" options={[{ value: "full", label: "Full motion" }, { value: "reduced", label: "Reduced motion", hint: "Opacity-only transitions" }, { value: "system", label: "Match system" }]} />
          <TagInput defaultTags={["design", "motion"]} placeholder="Interests…" label="Interests" />
        </section>
        <section className="space-y-3 rounded-2xl border border-destructive/30 p-4">
          <h2 className="font-semibold text-destructive">Danger zone</h2>
          <p className="text-sm text-muted-foreground">Deleting your workspace removes all components and collections.</p>
          <ButtonHoldConfirm onConfirm={() => {}}>Hold to delete workspace</ButtonHoldConfirm>
        </section>
      </main>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { SettingsPage } from "@/components/kinetik/settings-page";
export default function Demo() { return <SettingsPage />; }
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
