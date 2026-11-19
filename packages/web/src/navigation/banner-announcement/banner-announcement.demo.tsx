"use client";
import { BannerAnnouncement } from "./banner-announcement";

export default function Demo() {
  return (
    <div className="h-full">
      <BannerAnnouncement
        items={[
          { label: "New", text: "kinetik 2.3 — templates, saved collections and MCP", href: "#" },
          { label: "Event", text: "Motion Summit — live on Nov 28", href: "#" },
          { text: "Now with 13 three.js components", href: "#" },
        ]}
      />
      <div className="flex items-center justify-between border-b border-border px-6 py-4 text-sm">
        <span className="font-semibold">Acme</span>
        <span className="text-muted-foreground">Product · Pricing · Docs</span>
      </div>
      <div className="grid h-48 place-items-center text-sm text-muted-foreground">Hover to pause · dismiss to collapse</div>
    </div>
  );
}
