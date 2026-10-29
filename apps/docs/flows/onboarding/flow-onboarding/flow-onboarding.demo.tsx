"use client";
import { Phone } from "../../_shared/phone";
import { FlowOnboarding } from "./flow-onboarding";

export default function Demo({ initialStep }: { initialStep?: number }) {
  return <Phone dark><FlowOnboarding initialStep={initialStep} /></Phone>;
}
