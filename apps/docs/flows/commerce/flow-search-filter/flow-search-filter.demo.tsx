"use client";
import { Phone } from "../../_shared/phone";
import { FlowSearchFilter } from "./flow-search-filter";
export default function Demo({ initialStep }: { initialStep?: number }) { return <Phone><FlowSearchFilter initialStep={initialStep} /></Phone>; }
