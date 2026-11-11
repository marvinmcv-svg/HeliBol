"use client";
import { GsapPathWaypoints } from "./gsap-path-waypoints";

export default function Demo() {
  return (
    <div className="grid h-full w-full place-items-center p-6">
      <GsapPathWaypoints
        className="max-w-xl"
        waypoints={[
          { label: "Order placed", at: 0, detail: "We got it — 09:12" },
          { label: "Packed", at: 0.27, detail: "Boxed with care in Lisbon" },
          { label: "In transit", at: 0.55, detail: "Somewhere over the Pyrenees" },
          { label: "Out for delivery", at: 0.8, detail: "Driver is 4 stops away" },
          { label: "Delivered", at: 1, detail: "Left at the front door" },
        ]}
      />
    </div>
  );
}
