"use client";
import { Phone } from "../../_shared/phone";
import { FlowChat } from "./flow-chat";
export default function Demo({ initialStep }: { initialStep?: number }) { return <Phone><FlowChat initialStep={initialStep} /></Phone>; }
