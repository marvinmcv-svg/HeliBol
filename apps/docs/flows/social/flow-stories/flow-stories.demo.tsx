"use client";
import { Phone } from "../../_shared/phone";
import { FlowStories } from "./flow-stories";
export default function Demo({ initialStep }: { initialStep?: number }) { return <Phone dark><FlowStories initialStep={initialStep} /></Phone>; }
