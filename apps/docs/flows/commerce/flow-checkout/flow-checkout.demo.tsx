"use client";
import { Phone } from "../../_shared/phone";
import { FlowCheckout } from "./flow-checkout";

export default function Demo({ initialStep }: { initialStep?: number }) {
  return <Phone><FlowCheckout initialStep={initialStep} /></Phone>;
}
