"use client";
import { PasswordStrength } from "./password-strength";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <PasswordStrength className="max-w-xs" />
    </div>
  );
}
