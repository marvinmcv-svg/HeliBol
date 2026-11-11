"use client";
import { useEffect, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(ScrollTrigger);

export interface Waypoint {
  title: string;
  body?: string;
  /** Camera position for this stop. */
  position: [number, number, number];
  /** Point the camera looks at. */
  target: [number, number, number];
}

export interface GsapThreeWaypointsProps {
  waypoints: Waypoint[];
  scroller?: RefObject<HTMLElement | null>;
  className?: string;
}

/** Shared mutable camera state: GSAP tweens it, R3F reads it every frame. */
type Rig = { px: number; py: number; pz: number; tx: number; ty: number; tz: number };

function CameraRig({ rig }: { rig: Rig }) {
  const look = useRef(new THREE.Vector3());
  useFrame(({ camera }) => {
    camera.position.set(rig.px, rig.py, rig.pz);
    look.current.set(rig.tx, rig.ty, rig.tz);
    camera.lookAt(look.current);
  });
  return null;
}

/** A small "city" of blocks so each waypoint has something to frame. */
function Scene() {
  const blocks = Array.from({ length: 42 }, (_, i) => {
    const x = ((i % 7) - 3) * 1.6, z = (Math.floor(i / 7) - 3) * 1.6, h = 0.4 + ((i * 37) % 9) * 0.35;
    return { x, z, h, hot: i % 9 === 4 };
  });
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2}><planeGeometry args={[30, 30]} /><meshStandardMaterial color="#111827" /></mesh>
      {blocks.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]}>
          <boxGeometry args={[1, b.h, 1]} />
          <meshStandardMaterial color={b.hot ? "#f97316" : "#334155"} emissive={b.hot ? "#f97316" : "#000"} emissiveIntensity={b.hot ? 0.6 : 0} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 3.4, 0]}><torusKnotGeometry args={[0.6, 0.18, 160, 24]} /><meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.15} /></mesh>
    </group>
  );
}

/**
 * Scroll-driven camera flight: a GSAP timeline (scrubbed by ScrollTrigger) tweens a plain object
 * between waypoints; the R3F camera copies it every frame. Captions fade in per stop.
 */
export function GsapThreeWaypoints({ waypoints, scroller, className }: GsapThreeWaypointsProps) {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const first = waypoints[0];
  const rig = useRef<Rig>({ px: first.position[0], py: first.position[1], pz: first.position[2], tx: first.target[0], ty: first.target[1], tz: first.target[2] });

  useEffect(() => {
    if (reduced || !section.current) return;
    const captions = section.current.querySelectorAll<HTMLElement>("[data-caption]");
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, scrollTrigger: { trigger: section.current, scroller: scroller?.current ?? undefined, start: "top top", end: "bottom bottom", scrub: 1 } });
      gsap.set(captions, { autoAlpha: 0, y: 30 });
      gsap.set(captions[0], { autoAlpha: 1, y: 0 });
      waypoints.slice(1).forEach((w, i) => {
        tl.to(rig.current, { px: w.position[0], py: w.position[1], pz: w.position[2], tx: w.target[0], ty: w.target[1], tz: w.target[2], duration: 1 }, i)
          .to(captions[i], { autoAlpha: 0, y: -30, duration: 0.3 }, i)
          .to(captions[i + 1], { autoAlpha: 1, y: 0, duration: 0.3 }, i + 0.7);
      });
    }, section);
    return () => ctx.revert();
  }, [reduced, scroller, waypoints]);

  if (reduced) {
    // No camera flight: each stop becomes a static card.
    return (
      <section className={cn("grid gap-4 p-6", className)}>
        {waypoints.map((w) => (
          <article key={w.title} className="rounded-2xl border border-border bg-card p-5"><h3 className="text-lg font-semibold">{w.title}</h3>{w.body && <p className="text-sm text-muted-foreground">{w.body}</p>}</article>
        ))}
      </section>
    );
  }

  return (
    <section ref={section} className={cn("relative", className)} style={{ height: `${waypoints.length * 90}cqh` }}>
      <div className="sticky top-0 h-[100cqh] overflow-hidden bg-[#0b1120]">
        <Canvas dpr={[1, 1.75]} camera={{ fov: 45 }} gl={{ antialias: true }}>
          <fog attach="fog" args={["#0b1120", 8, 26]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 8, 3]} intensity={2} />
          <Scene />
          <CameraRig rig={rig.current} />
          <Environment resolution={128}><Lightformer intensity={2} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} /></Environment>
        </Canvas>
        {waypoints.map((w, i) => (
          <div key={w.title} data-caption className="pointer-events-none absolute bottom-8 left-6 max-w-xs text-white" style={{ visibility: i ? "hidden" : undefined }}>
            <p className="text-[10px] uppercase tracking-[0.3em] text-orange-300">Stop {String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight">{w.title}</h3>
            {w.body && <p className="mt-1 text-sm text-white/60">{w.body}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
