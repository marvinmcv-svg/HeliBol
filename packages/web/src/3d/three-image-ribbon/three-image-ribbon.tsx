"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "@kinetik/core";
import { Canvas3DShell } from "../canvas-3d-shell/canvas-3d-shell";

export interface ThreeImageRibbonProps {
  images: string[];
  radius?: number;
  /** Panel height in world units. */
  height?: number;
  /** Idle drift, radians per second. */
  speed?: number;
  className?: string;
}

function Ribbon({ images, radius, height, speed }: Required<Omit<ThreeImageRibbonProps, "className">>) {
  const reduced = useReducedMotion();
  const group = useRef<THREE.Group>(null);
  const textures = useTexture(images);
  textures.forEach((t) => (t.colorSpace = THREE.SRGBColorSpace));
  const gl = useThree((s) => s.gl);
  const n = images.length;
  const gap = 0.04;
  const arc = (Math.PI * 2) / n - gap;
  // Open cylinder slices → each photo is genuinely curved, not a flat card on a circle.
  const geometries = useMemo(() => Array.from({ length: n }, (_, i) => new THREE.CylinderGeometry(radius, radius, height, 24, 1, true, i * (arc + gap), arc)), [n, radius, height, arc]);
  useEffect(() => () => geometries.forEach((g) => g.dispose()), [geometries]);

  // Wheel and drag add velocity; it decays back to the idle drift.
  const vel = useRef(0);
  useEffect(() => {
    const el = gl.domElement;
    let down = false, lastX = 0;
    const wheel = (e: WheelEvent) => { vel.current += (e.deltaY + e.deltaX) * 0.0004; };
    const pd = (e: PointerEvent) => { down = true; lastX = e.clientX; };
    const pm = (e: PointerEvent) => { if (down) { vel.current = (e.clientX - lastX) * 0.004; lastX = e.clientX; } };
    const pu = () => (down = false);
    el.addEventListener("wheel", wheel, { passive: true });
    el.addEventListener("pointerdown", pd);
    window.addEventListener("pointermove", pm);
    window.addEventListener("pointerup", pu);
    el.style.cursor = "grab";
    return () => { el.removeEventListener("wheel", wheel); el.removeEventListener("pointerdown", pd); window.removeEventListener("pointermove", pm); window.removeEventListener("pointerup", pu); };
  }, [gl]);

  useFrame((s, dt) => {
    const g = group.current;
    if (!g) return;
    vel.current += ((reduced ? 0 : speed * dt) - vel.current) * 0.05;
    g.rotation.y += vel.current;
    g.rotation.z += ((reduced ? -0.12 : -0.12 + s.pointer.y * 0.06) - g.rotation.z) * 0.05;
  });

  return (
    <group ref={group} rotation={[0.05, 0, -0.12]}>
      {geometries.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          {/* BackSide: we look at the inside of the ribbon from its centre-ish */}
          <meshBasicMaterial map={textures[i]} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Photos wrapped on a tilted, curved ribbon that drifts, and spins faster with wheel or drag — the video-ribbon portfolio look. */
export function ThreeImageRibbon({ images, radius = 2.4, height = 1.2, speed = 0.15, className }: ThreeImageRibbonProps) {
  return (
    <Canvas3DShell className={className} camera={{ position: [0, 0.4, 5.2], fov: 45 }}>
      <Ribbon images={images} radius={radius} height={height} speed={speed} />
    </Canvas3DShell>
  );
}
