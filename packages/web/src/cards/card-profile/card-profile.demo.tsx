"use client";
import { CardProfile } from "./card-profile";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <CardProfile name="Ava Lin" handle="avamotion" avatar="/demo/photo-8.jpg" cover="/demo/photo-6.jpg" bio="Design engineer. I tune springs for a living." stats={[{ label: "Followers", value: 12840 }, { label: "Following", value: 312 }, { label: "Components", value: 71 }]} />
    </div>
  );
}
