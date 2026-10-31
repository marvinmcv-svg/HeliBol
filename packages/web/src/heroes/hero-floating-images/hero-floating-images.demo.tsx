"use client";
import { photos } from "../../_demo";
import { HeroFloatingImages } from "./hero-floating-images";
export default function Demo() {
  return <HeroFloatingImages images={photos} className="h-full" />;
}
