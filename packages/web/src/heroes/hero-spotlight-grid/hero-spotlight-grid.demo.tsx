"use client";
import { photos } from "../../_demo";
import { HeroSpotlightGrid } from "./hero-spotlight-grid";
export default function Demo() {
  return <HeroSpotlightGrid avatars={photos} className="h-full" />;
}
