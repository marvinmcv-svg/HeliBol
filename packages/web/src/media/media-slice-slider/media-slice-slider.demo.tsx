"use client";
import { photoAlt, photos } from "../../_demo";
import { MediaSliceSlider } from "./media-slice-slider";

const slides = [1, 3, 5, 6, 0].map((n, i) => ({ image: photos[n], title: photoAlt[n], caption: `Chapter ${i + 1}` }));

export default function Demo() {
  return (
    <div className="h-full p-3">
      <MediaSliceSlider slides={slides} />
    </div>
  );
}
