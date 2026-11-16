"use client";
import { HeroStoryRail } from "./hero-story-rail";
import { photos } from "../../_demo";
export default function Demo() {
  return <HeroStoryRail className="h-full" images={photos} />;
}
