"use client";
import { Phone } from "../../_shared/phone";
import { FlowMusicPlayer } from "./flow-music-player";
export default function Demo({ initialStep }: { initialStep?: number }) { return <Phone dark><FlowMusicPlayer initialStep={initialStep} /></Phone>; }
