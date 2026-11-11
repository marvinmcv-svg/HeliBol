"use client";
import { photos } from "../../_demo";
import { GsapObserverSlides } from "./gsap-observer-slides";

const slides = [
  { title: "Violet Aurora", kicker: "Chapter 01", image: photos[5] },
  { title: "Amber Road", kicker: "Chapter 02", image: photos[4] },
  { title: "Glass Ocean", kicker: "Chapter 03", image: photos[6] },
  { title: "Neon Haze", kicker: "Chapter 04", image: photos[2] },
];

export default function Demo() {
  return <GsapObserverSlides slides={slides} />;
}
