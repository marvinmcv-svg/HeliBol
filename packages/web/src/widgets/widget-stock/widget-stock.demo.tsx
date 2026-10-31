"use client";
import { WidgetStock } from "./widget-stock";
export default function Demo() {
  return <div className="flex h-full w-full flex-wrap items-center justify-center gap-4 p-6"><WidgetStock symbol="KNTK" name="Kinetik Labs" /><WidgetStock symbol="SPRG" name="Spring Dynamics" start={64.1} className="hidden sm:block" /></div>;
}
