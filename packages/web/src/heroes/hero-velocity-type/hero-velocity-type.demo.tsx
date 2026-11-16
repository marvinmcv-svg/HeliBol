"use client";
import { photos } from "../../_demo";
import { HeroVelocityType } from "./hero-velocity-type";
export default function Demo() {
  return <HeroVelocityType className="h-full" image={photos[4]} />;
}
