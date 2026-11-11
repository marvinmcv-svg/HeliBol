"use client";
import { useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "@kinetik/core";
import { Canvas3DShell } from "../canvas-3d-shell/canvas-3d-shell";

export interface ThreeFloatingShapesProps {
  /** Candy palette used round-robin for the shapes. */
  palette?: string[];
  count?: number;
  className?: string;
}

const DEFAULT_PALETTE = ["#fb7185", "#fbbf24", "#34d399", "#60a5fa", "#c084fc", "#f9a8d4"];
const KINDS = ["sphere", "torus", "capsule", "box", "cone", "knot"] as const;

function Shape({ kind, color, position, scale, speed }: { kind: (typeof KINDS)[number]; color: string; position: [number, number, number]; scale: number; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const hovered = useRef(0);
  useFrame((_, dt) => {
    const m = ref.current;
    if (!m) return;
    const s = scale * (1 + hovered.current * 0.18);
    m.scale.lerp(new THREE.Vector3(s, s, s), Math.min(1, dt * 10));
  });
  return (
    <Float speed={speed} rotationIntensity={1.2} floatIntensity={1.4}>
      <mesh ref={ref} position={position} scale={scale} onPointerOver={() => (hovered.current = 1)} onPointerOut={() => (hovered.current = 0)}>
        {kind === "sphere" && <sphereGeometry args={[0.5, 48, 48]} />}
        {kind === "torus" && <torusGeometry args={[0.42, 0.17, 32, 96]} />}
        {kind === "capsule" && <capsuleGeometry args={[0.25, 0.5, 12, 32]} />}
        {kind === "box" && <boxGeometry args={[0.7, 0.7, 0.7]} />}
        {kind === "cone" && <coneGeometry args={[0.45, 0.8, 48]} />}
        {kind === "knot" && <torusKnotGeometry args={[0.32, 0.11, 160, 24]} />}
        <meshPhysicalMaterial color={color} roughness={0.25} clearcoat={1} clearcoatRoughness={0.15} />
      </mesh>
    </Float>
  );
}

function Rig({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!g.current || reduced) return;
    g.current.rotation.y += (s.pointer.x * 0.35 - g.current.rotation.y) * 0.05;
    g.current.rotation.x += (-s.pointer.y * 0.2 - g.current.rotation.x) * 0.05;
  });
  return <group ref={g}>{children}</group>;
}

/** Playful clay-like primitives bobbing in a soft studio, with pointer parallax and hover swell — the "jelly garden" hero. */
export function ThreeFloatingShapes({ palette = DEFAULT_PALETTE, count = 14, className }: ThreeFloatingShapesProps) {
  const reduced = useReducedMotion();
  const shapes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = i * 2.399; // golden angle spreads them evenly
        const r = 1.2 + (i % 4) * 0.55;
        return {
          kind: KINDS[i % KINDS.length],
          color: palette[i % palette.length],
          position: [Math.cos(a) * r * 1.4, Math.sin(a) * r * 0.7, -((i * 37) % 5) * 0.4] as [number, number, number],
          scale: 0.7 + ((i * 13) % 5) * 0.12,
          speed: reduced ? 0 : 1 + (i % 3) * 0.4,
        };
      }),
    [count, palette, reduced],
  );
  return (
    <Canvas3DShell className={className} camera={{ position: [0, 0, 7], fov: 45 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 4]} intensity={2.4} />
      <Rig>
        {shapes.map((s, i) => <Shape key={i} {...s} />)}
      </Rig>
      <ContactShadows position={[0, -2.6, 0]} opacity={0.35} scale={14} blur={2.6} far={5} />
      <Environment resolution={128}>
        <Lightformer intensity={3} position={[0, 4, 4]} scale={[8, 4, 1]} />
        <Lightformer intensity={1.5} position={[-4, 0, 2]} rotation-y={Math.PI / 2} scale={[4, 4, 1]} />
      </Environment>
    </Canvas3DShell>
  );
}
