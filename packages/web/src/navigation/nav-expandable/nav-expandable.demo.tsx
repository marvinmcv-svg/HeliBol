"use client";
import { NavExpandable } from "./nav-expandable";

const links = [
  { label: "Work", href: "#work", description: "Selected projects, 2019–2026" },
  { label: "Studio", href: "#studio", description: "People and process" },
  { label: "Journal", href: "#journal", description: "Notes on motion" },
  { label: "Contact", href: "#contact", description: "Start a project" },
];

export default function Demo() {
  return (
    <div className="flex h-full justify-center bg-[linear-gradient(160deg,rgb(244_63_94/.12),transparent_50%),linear-gradient(20deg,rgb(99_102_241/.15),transparent_50%)] pt-6">
      <NavExpandable
        brand="◐ Halo"
        links={links}
        cta={<a href="#book" className="block rounded-2xl bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground">Book a call</a>}
      />
    </div>
  );
}
