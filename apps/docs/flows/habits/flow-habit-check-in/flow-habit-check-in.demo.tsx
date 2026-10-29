"use client";
import { Phone } from "../../_shared/phone";
import { FlowHabitCheckIn } from "./flow-habit-check-in";

export default function Demo({ initialStep }: { initialStep?: number }) {
  return <Phone dark><FlowHabitCheckIn initialStep={initialStep} /></Phone>;
}
