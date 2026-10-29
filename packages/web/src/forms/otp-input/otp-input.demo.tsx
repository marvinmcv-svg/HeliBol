"use client";
import { OtpInput } from "./otp-input";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center">
      <div><p className="font-semibold">Check your inbox</p><p className="text-sm text-muted-foreground">Enter the code — try <b className="font-mono text-foreground">424242</b> (anything else shakes)</p></div>
      <OtpInput onComplete={(c) => c === "424242"} />
    </div>
  );
}
