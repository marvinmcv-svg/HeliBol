"use client";
import { Phone } from "../../_shared/phone";
import { FlowFoodOrder } from "./flow-food-order";
export default function Demo({ initialStep }: { initialStep?: number }) { return <Phone><FlowFoodOrder initialStep={initialStep} /></Phone>; }
