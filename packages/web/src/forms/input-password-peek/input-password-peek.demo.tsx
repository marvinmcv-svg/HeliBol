"use client";
import { DemoCenter } from "../../_demo";
import { InputPasswordPeek } from "./input-password-peek";

export default function Demo() {
  return (
    <DemoCenter>
      <InputPasswordPeek label="Choose a password" autoComplete="new-password" />
    </DemoCenter>
  );
}
