"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@kinetik/core";
import { Canvas3DShell } from "../canvas-3d-shell/canvas-3d-shell";

export interface ThreeGalaxyProps {
  count?: number;
  branches?: number;
  /** How much each arm winds around the core. */
  spin?: number;
  radius?: number;
  inside?: string;
  outside?: string;
  className?: string;
}

function Galaxy({ count, branches, spin, radius, inside, outside }: Required<Omit<ThreeGalaxyProps, "className">>) {
  const reduced = useReducedMotion();
  const points = useRef<THREE.Points>(null);
  const camera = useThree((s) => s.camera);
  useEffect(() => camera.lookAt(0, 0, 0), [camera]);
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cIn = new THREE.Color(inside), cOut = new THREE.Color(outside), c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 1.6) * radius;
      const branch = ((i % branches) / branches) * Math.PI * 2;
      const twist = r * spin;
      // Random offset biased toward the arm (power curve) and shrinking toward the rim.
      const rnd = () => Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5 * (1 + r * 0.25);
      positions.set([Math.cos(branch + twist) * r + rnd(), rnd() * 0.5, Math.sin(branch + twist) * r + rnd()], i * 3);
      colors.set(c.copy(cIn).lerp(cOut, r / radius).toArray(), i * 3);
    }
    return { positions, colors };
  }, [count, branches, spin, radius, inside, outside]);

  useFrame((s, dt) => {
    const p = points.current;
    if (!p || reduced) return;
    p.rotation.y += dt * 0.08;
    s.camera.position.x += (s.pointer.x * 1.2 - s.camera.position.x) * 0.03;
    s.camera.position.y += (2.4 + s.pointer.y * 0.8 - s.camera.position.y) * 0.03;
    s.camera.lookAt(0, 0, 0);
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} vertexColors depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}

/** A procedural spiral galaxy: particles thrown along winding arms, warm core to cool rim, with pointer parallax. */
export function ThreeGalaxy({ count = 40000, branches = 4, spin = 1.1, radius = 4, inside = "#ffb36b", outside = "#3b5bfd", className }: ThreeGalaxyProps) {
  return (
    <Canvas3DShell className={className} camera={{ position: [0, 2.4, 5.5], fov: 55 }}>
      <Galaxy count={count} branches={branches} spin={spin} radius={radius} inside={inside} outside={outside} />
    </Canvas3DShell>
  );
}
