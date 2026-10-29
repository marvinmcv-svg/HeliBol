"use client";
import { Phone } from "../../_shared/phone";
import { FlowAuth } from "./flow-auth";

export default function Demo({ initialStep }: { initialStep?: number }) {
  return <Phone><FlowAuth initialStep={initialStep} /></Phone>;
}
