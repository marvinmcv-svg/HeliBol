"use client";
import { WidgetClock } from "./widget-clock";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-8 p-6">
      <WidgetClock timeZone="America/Los_Angeles" label="San Francisco" />
      <WidgetClock timeZone="Europe/Lisbon" label="Lisbon" />
      <WidgetClock timeZone="Asia/Tokyo" label="Tokyo" className="hidden sm:flex" />
    </div>
  );
}
