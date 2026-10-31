"use client";
import { Phone } from "../../_shared/phone";
import { FlowBreathe } from "./flow-breathe";
export default function Demo({ initialStep }: { initialStep?: number }) { return <Phone dark><FlowBreathe initialStep={initialStep} /></Phone>; }
