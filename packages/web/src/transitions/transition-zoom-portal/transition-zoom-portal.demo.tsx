"use client";
import { photos } from "../../_demo";
import { TransitionZoomPortal } from "./transition-zoom-portal";

const story = (place: string) => (
  <>
    <p>We arrived in {place} just before the light turned. Everything slowed down: the wind, the water, our footsteps.</p>
    <p className="mt-4">This is the kind of place that makes you put the camera down for a minute — and then pick it up again, because you know you&apos;ll want to remember exactly this.</p>
  </>
);

export default function Demo() {
  return (
    <TransitionZoomPortal
      items={[
        { id: "a", kicker: "Iceland", title: "Violet aurora", image: photos[5], page: story("Lofoten") },
        { id: "b", kicker: "Utah", title: "Amber road", image: photos[4], page: story("Utah") },
        { id: "c", kicker: "Azores", title: "Ocean glass", image: photos[6], page: story("the Azores") },
      ]}
    />
  );
}
