"use client";
import { photos } from "../../_demo";
import { WaitlistForm } from "./waitlist-form";

export default function Demo() {
  return (
    <div className="grid h-full place-items-center p-6">
      <div className="w-full max-w-sm space-y-5 text-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">Coming spring 2027</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight">Get early access</h3>
        </div>
        <WaitlistForm count={12840} avatars={photos.slice(0, 4)} className="mx-auto text-left" />
      </div>
    </div>
  );
}
