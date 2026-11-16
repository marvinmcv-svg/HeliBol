"use client";
import { HeroScribbleStrike } from "./hero-scribble-strike";
import { photos } from "../../_demo";
export default function Demo() {
  return <HeroScribbleStrike className="h-full" image={photos[4]} />;
}
