"use client";
import { Bell, CreditCard, Palette, Shield, User } from "lucide-react";
import { NavSidebar } from "@web/navigation/nav-sidebar/nav-sidebar";
import { ToggleSwitch } from "@web/buttons/toggle-switch/toggle-switch";
import { SelectAnimated } from "@web/forms/select-animated/select-animated";
import { TagInput } from "@web/forms/tag-input/tag-input";
import { ButtonHoldConfirm } from "@web/buttons/button-hold-confirm/button-hold-confirm";

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
