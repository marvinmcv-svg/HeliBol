"use client";
import { Phone } from "../../_shared/phone";
import { FlowPaywall } from "./flow-paywall";

export default function Demo({ initialStep }: { initialStep?: number }) {
  return <Phone dark><FlowPaywall initialStep={initialStep} /></Phone>;
}
