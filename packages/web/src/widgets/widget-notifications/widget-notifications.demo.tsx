"use client";
import { WidgetNotifications } from "./widget-notifications";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-start justify-center overflow-hidden p-6">
      <WidgetNotifications items={[
        { icon: "💸", title: "Payment received", body: "Ava paid $49 for Pro", time: "now", color: "#dcfce7" },
        { icon: "👤", title: "New signup", body: "leo@northwind.io joined", time: "1m", color: "#e0e7ff" },
        { icon: "💬", title: "New message", body: "“Can we ship the paywall today?”", time: "3m", color: "#fef3c7" },
        { icon: "🚀", title: "Deploy ready", body: "kinetik-docs → production", time: "5m", color: "#fce7f3" },
      ]} />
    </div>
  );
}
