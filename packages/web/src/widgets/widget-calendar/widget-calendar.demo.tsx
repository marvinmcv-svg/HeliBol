"use client";
import { WidgetCalendar } from "./widget-calendar";
export default function Demo() {
  return <div className="flex h-full w-full items-center justify-center p-6"><WidgetCalendar events={{ "2026-10-29": "Design review 10:00", "2026-10-31": "Launch kinetik 2.0 🚀", "2026-10-14": "Team offsite", "2026-11-05": "Retro" }} /></div>;
}
