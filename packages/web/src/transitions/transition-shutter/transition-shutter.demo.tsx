"use client";
import { photos } from "../../_demo";
import { TransitionShutter } from "./transition-shutter";

const page = (title: string, img: string, body: string) => (
  <div className="grid h-full grid-cols-2">
    <img src={img} alt="" className="h-full w-full object-cover" />
    <div className="flex flex-col justify-center gap-2 p-8">
      <h3 className="text-3xl font-semibold tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground">{body}</p>
    </div>
  </div>
);

export default function Demo() {
  return (
    <TransitionShutter
      pages={[
        { key: "work", label: "Work", content: page("Selected work", photos[2], "Twelve projects, four continents.") },
        { key: "studio", label: "Studio", content: page("The studio", photos[0], "Eight people who sweat the details.") },
        { key: "contact", label: "Contact", content: page("Say hello", photos[6], "New projects from March.") },
      ]}
    />
  );
}
