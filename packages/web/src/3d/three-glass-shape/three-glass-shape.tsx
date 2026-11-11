"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import type { Mesh } from "three";
import { useReducedMotion } from "@kinetik/core";
import { Canvas3DShell } from "../canvas-3d-shell/canvas-3d-shell";

export type GlassGeometry = "icosahedron" | "torus" | "knot" | "octahedron";

export interface ThreeGlassShapeProps {
  geometry?: GlassGeometry;
  /** Faceted (flat-shaded, low-poly) or smooth glass. */
  faceted?: boolean;
  /** Colour cast inside the glass. */
  tint?: string;
  /** Chromatic aberration strength (0–1). */
  dispersion?: number;
  className?: string;
}

function Shape({ geometry, faceted, tint, dispersion }: Required<Omit<ThreeGlassShapeProps, "className">>) {
  const reduced = useReducedMotion();
  const mesh = useRef<Mesh>(null);
  useFrame((s, dt) => {
    const m = mesh.current;
    if (!m || reduced) return;
    m.rotation.y += dt * 0.3;
    m.rotation.x += (s.pointer.y * 0.6 - m.rotation.x) * 0.04;
    m.rotation.z += (-s.pointer.x * 0.4 - m.rotation.z) * 0.04;
  });
  const detail = faceted ? 0 : 12;
  return (
    <Float speed={reduced ? 0 : 1.4} floatIntensity={0.8} rotationIntensity={0.3}>
      <mesh ref={mesh} scale={1.3}>
        {geometry === "icosahedron" && <icosahedronGeometry args={[1.1, faceted ? 0 : 8]} />}
        {geometry === "octahedron" && <octahedronGeometry args={[1.2, detail ? 6 : 0]} />}
        {geometry === "torus" && <torusGeometry args={[0.85, 0.36, faceted ? 8 : 64, faceted ? 16 : 128]} />}
        {geometry === "knot" && <torusKnotGeometry args={[0.75, 0.26, faceted ? 64 : 220, faceted ? 6 : 32]} />}
        <MeshTransmissionMaterial
          flatShading={faceted}
          color={tint}
          thickness={1.4}
          roughness={0.02}
          ior={1.35}
          chromaticAberration={dispersion}
          anisotropicBlur={0.2}
          distortion={0.15}
          distortionScale={0.4}
          temporalDistortion={reduced ? 0 : 0.08}
          backside
          samples={6}
          resolution={512}
        />
      </mesh>
    </Float>
  );
}

/** Colourful shapes stay behind the glass so the refraction has something to bend. */
function Backdrop() {
  return (
    <group position={[0, 0, -2.4]}>
      <mesh position={[-1.6, 0.6, 0]}><sphereGeometry args={[0.7, 32, 32]} /><meshBasicMaterial color="#f472b6" /></mesh>
      <mesh position={[1.7, -0.5, 0]}><boxGeometry args={[1, 1, 1]} /><meshBasicMaterial color="#22d3ee" /></mesh>
      <mesh position={[0.2, 1.4, -0.5]} rotation={[0.4, 0.2, 0]}><torusGeometry args={[0.5, 0.18, 16, 48]} /><meshBasicMaterial color="#facc15" /></mesh>
      <mesh position={[0, -1.5, -0.3]}><planeGeometry args={[6, 0.25]} /><meshBasicMaterial color="#a78bfa" /></mesh>
    </group>
  );
}

/**
 * A refracting glass object (MeshTransmissionMaterial) floating in front of coloured shapes:
 * real-time refraction, chromatic dispersion and a faceted or smooth cut. Pointer tilts it.
 */
export function ThreeGlassShape({ geometry = "icosahedron", faceted = true, tint = "#ffffff", dispersion = 0.6, className }: ThreeGlassShapeProps) {
  return (
    <Canvas3DShell className={className} maxDpr={1.75} camera={{ position: [0, 0, 5], fov: 42 }}>
      <Backdrop />
      <Shape geometry={geometry} faceted={faceted} tint={tint} dispersion={dispersion} />
      <Environment resolution={256}>
        <Lightformer intensity={4} position={[0, 4, -4]} scale={[10, 3, 1]} />
        <Lightformer intensity={3} color="#c4b5fd" position={[-5, 0, 0]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer intensity={3} color="#67e8f9" position={[5, 0, 0]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} />
      </Environment>
    </Canvas3DShell>
  );
}
