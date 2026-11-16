"use client";
import { HeroCurvedCollage } from "./hero-curved-collage";
import { photos } from "../../_demo";
export default function Demo() {
  return <HeroCurvedCollage className="h-full" images={[photos[0], photos[6], photos[3], photos[7]]} />;
}
