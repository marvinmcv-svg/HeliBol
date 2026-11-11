"use client";
import { photoAlt, photos } from "../../_demo";
import { GsapFlipCarousel } from "./gsap-flip-carousel";

const items = photos.slice(0, 7).map((image, i) => ({ image, title: photoAlt[i] }));

export default function Demo() {
  return <GsapFlipCarousel items={items} />;
}
