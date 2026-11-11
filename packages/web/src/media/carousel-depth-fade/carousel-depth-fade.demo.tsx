"use client";
import { photoAlt, photos } from "../../_demo";
import { CarouselDepthFade } from "./carousel-depth-fade";

const items = photos.map((image, i) => ({ image, title: photoAlt[i], caption: `Collection · ${2019 + i}` }));

export default function Demo() {
  return <CarouselDepthFade items={items} />;
}
