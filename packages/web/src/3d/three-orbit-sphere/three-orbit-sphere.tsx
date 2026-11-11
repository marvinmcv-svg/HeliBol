"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@kinetik/core";
import { Canvas3DShell } from "../canvas-3d-shell/canvas-3d-shell";

export interface ThreeOrbitSphereProps {
  /** Dots on the core sphere. */
  dots?: number;
  /** Orbiting satellites per ring; one entry per ring. */
  rings?: number[];
  color?: string;
  accent?: string;
  className?: string;
}

const DEFAULT_RINGS = [5, 8, 12];

function Scene({ dots, rings, color, accent }: Required<Omit<ThreeOrbitSphereProps, "className">>) {
  const reduced = useReducedMotion();
  const root = useRef<THREE.Group>(null);
  const ringRefs = useRef<(THREE.Group | null)[]>([]);
  const sphere = useMemo(() => {
    const arr = new Float32Array(dots * 3);
    for (let i = 0; i < dots; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / dots);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      arr.set(new THREE.Vector3().setFromSphericalCoords(1.2, phi, theta).toArray(), i * 3);
    }
    return arr;
  }, [dots]);
  // Each ring: radius, tilt, speed — tilted planes read as "orbits" instead of flat circles.
  const ringDefs = useMemo(() => rings.map((n, i) => ({ n, r: 1.65 + i * 0.42, tilt: [0.5 + i * 0.35, i * 0.8, 0.2 * i] as [number, number, number], speed: (i % 2 ? -1 : 1) * (0.5 - i * 0.1) })), [rings]);

  useFrame((s, dt) => {
    if (reduced) return;
    ringRefs.current.forEach((g, i) => g && (g.rotation.z += dt * ringDefs[i].speed));
    const r = root.current;
    if (r) {
      r.rotation.y += dt * 0.12;
      r.rotation.x += (s.pointer.y * 0.5 - r.rotation.x) * 0.04;
    }
  });

  return (
    <group ref={root}>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[sphere, 3]} /></bufferGeometry>
        <pointsMaterial size={0.035} color={color} transparent opacity={0.85} sizeAttenuation depthWrite={false} />
      </points>
      <mesh><sphereGeometry args={[1.17, 48, 48]} /><meshBasicMaterial color="#000" transparent opacity={0.6} /></mesh>
      {ringDefs.map((d, i) => (
        <group key={i} rotation={d.tilt}>
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[d.r, 0.003, 8, 160]} />
            <meshBasicMaterial color={color} transparent opacity={0.25} />
          </mesh>
          <group ref={(g) => { ringRefs.current[i] = g; }}>
            {Array.from({ length: d.n }, (_, k) => {
              const a = (k / d.n) * Math.PI * 2;
              return (
                <mesh key={k} position={[Math.cos(a) * d.r, Math.sin(a) * d.r, 0]}>
                  <sphereGeometry args={[k === 0 ? 0.07 : 0.035, 16, 16]} />
                  <meshBasicMaterial color={k === 0 ? accent : color} />
                </mesh>
              );
            })}
          </group>
        </group>
      ))}
    </group>
  );
}

/** A dotted planet with tilted orbit rings and satellites — the "network / coverage" hero visual. */
export function ThreeOrbitSphere({ dots = 2400, rings = DEFAULT_RINGS, color = "#e4e4e7", accent = "#f97316", className }: ThreeOrbitSphereProps) {
  return (
    <Canvas3DShell className={className} camera={{ position: [0, 0, 6.2], fov: 45 }}>
      <Scene dots={dots} rings={rings} color={color} accent={accent} />
    </Canvas3DShell>
  );
}
