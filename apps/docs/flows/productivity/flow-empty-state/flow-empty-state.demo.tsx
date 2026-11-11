"use client";
import { Phone } from "../../_shared/phone";
import { FlowEmptyState } from "./flow-empty-state";
export default function Demo({ initialStep }: { initialStep?: number }) { return <Phone><FlowEmptyState initialStep={initialStep} /></Phone>; }
