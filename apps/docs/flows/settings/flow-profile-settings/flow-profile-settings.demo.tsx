"use client";
import { Phone } from "../../_shared/phone";
import { FlowProfileSettings } from "./flow-profile-settings";

export default function Demo({ initialStep }: { initialStep?: number }) {
  return <Phone><FlowProfileSettings initialStep={initialStep} /></Phone>;
}
