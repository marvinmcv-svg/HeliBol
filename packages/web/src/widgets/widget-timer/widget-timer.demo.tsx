"use client";
import { WidgetTimer } from "./widget-timer";
export default function Demo() {
  return <div className="flex h-full w-full items-center justify-center p-6"><WidgetTimer seconds={25} label="Sprint" /></div>;
}
