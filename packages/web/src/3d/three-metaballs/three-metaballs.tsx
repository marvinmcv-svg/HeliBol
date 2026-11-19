"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MarchingCube, MarchingCubes } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "@kinetik/core";
import { Canvas3DShell } from "../canvas-3d-shell/canvas-3d-shell";

export interface ThreeMetaballsProps {
  /** Colours of the blobs; one blob per colour (plus the pointer blob). */
  colors?: string[];
  /** Marching-cubes grid resolution (quality vs. cost). */
  resolution?: number;
  className?: string;
}

const DEFAULT_COLORS = ["#a78bfa", "#f472b6", "#22d3ee", "#facc15", "#34d399"];

function Blob({ color, i, n, reduced }: { color: string; i: number; n: number; reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const c = useMemo(() => new THREE.Color(color), [color]);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = reduced ? i : clock.elapsedTime * 0.45 + (i / n) * Math.PI * 2;
    ref.current.position.set(Math.sin(t * 1.1 + i) * 0.42, Math.cos(t * 0.9 + i * 2) * 0.32, Math.sin(t * 0.7 + i * 3) * 0.25);
  });
  return <MarchingCube ref={ref} strength={0.5} subtract={12} color={c} />;
}

function PointerBlob() {
  const ref = useRef<THREE.Group>(null);
  const v = useRef(new THREE.Vector3());
  const white = useMemo(() => new THREE.Color("#ffffff"), []);
  useFrame(({ pointer }) => {
    if (!ref.current) return;
    v.current.set(pointer.x * 0.55, pointer.y * 0.4, 0.15);
    ref.current.position.lerp(v.current, 0.12);
  });
  return <MarchingCube ref={ref} strength={0.45} subtract={12} color={white} />;
}

/**
 * Liquid metaballs (marching cubes via drei): glossy blobs drift on looping paths and merge into one
 * another like lava-lamp wax; an extra blob follows the pointer so you can pull the liquid around.
 * Vertex colours blend where blobs meet. Lazy-load; pauses off-screen.
 */
export function ThreeMetaballs({ colors = DEFAULT_COLORS, resolution = 56, className }: ThreeMetaballsProps) {
  const reduced = useReducedMotion();
  return (
    <Canvas3DShell className={className} maxDpr={1.75} camera={{ position: [0, 0, 3.2], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 3, 4]} intensity={2} />
      <MarchingCubes resolution={resolution} maxPolyCount={22000} enableUvs={false} enableColors scale={2.2}>
        <meshPhysicalMaterial vertexColors roughness={0.12} clearcoat={1} clearcoatRoughness={0.05} metalness={0.1} />
        {colors.map((c, i) => <Blob key={i} color={c} i={i} n={colors.length} reduced={reduced} />)}
        {!reduced && <PointerBlob />}
      </MarchingCubes>
      <Environment resolution={256}>
        <Lightformer intensity={4} position={[0, 4, 3]} scale={[8, 3, 1]} />
        <Lightformer intensity={2} color="#c4b5fd" position={[-4, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer intensity={2} color="#67e8f9" position={[4, -1, 2]} rotation-y={-Math.PI / 2} scale={[6, 4, 1]} />
      </Environment>
    </Canvas3DShell>
  );
}
