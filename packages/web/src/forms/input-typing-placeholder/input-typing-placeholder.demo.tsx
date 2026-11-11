"use client";
import { InputTypingPlaceholder } from "./input-typing-placeholder";

export default function Demo() {
  return (
    <div className="grid h-full place-items-center p-8">
      <div className="w-full max-w-md space-y-2">
        <label htmlFor="kn-typing-search" className="text-sm font-medium">Ask anything</label>
        <InputTypingPlaceholder id="kn-typing-search" type="search" suggestions={["a landing page with a 3D hero", "a pricing table that animates", "an onboarding flow for iOS"]} />
      </div>
    </div>
  );
}
