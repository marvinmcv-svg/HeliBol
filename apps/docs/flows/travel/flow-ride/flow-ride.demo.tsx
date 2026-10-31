"use client";
import { Phone } from "../../_shared/phone";
import { FlowRide } from "./flow-ride";
export default function Demo({ initialStep }: { initialStep?: number }) { return <Phone><FlowRide initialStep={initialStep} /></Phone>; }
