"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@kinetik/core";
import { Canvas3DShell } from "../canvas-3d-shell/canvas-3d-shell";

export type MorphShape = "sphere" | "torus" | "helix" | "cube" | "wave";

export interface ThreeParticleMorphProps {
  /** Shapes to cycle through, in order. */
  shapes?: MorphShape[];
  /** Number of particles. 4–12k is a good range. */
  count?: number;
  /** Seconds each shape holds before morphing to the next. */
  hold?: number;
  colors?: [string, string];
  className?: string;
  /** Called with the index of the shape the particles are heading to. */
  onShapeChange?: (index: number) => void;
}

const DEFAULT_SHAPES: MorphShape[] = ["sphere", "torus", "helix", "cube", "wave"];

function shapePositions(shape: MorphShape, n: number) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    let x = 0, y = 0, z = 0;
    if (shape === "sphere") {
      // Fibonacci sphere: even spacing, no poles clumping
      const phi = Math.acos(1 - 2 * (i + 0.5) / n);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      x = Math.cos(theta) * Math.sin(phi) * 1.6; y = Math.cos(phi) * 1.6; z = Math.sin(theta) * Math.sin(phi) * 1.6;
    } else if (shape === "torus") {
      const u = t * Math.PI * 2 * 40, v = t * Math.PI * 2;
      const r = 1.2 + 0.45 * Math.cos(u);
      x = r * Math.cos(v); y = 0.45 * Math.sin(u); z = r * Math.sin(v);
    } else if (shape === "helix") {
      const strand = i % 2 ? Math.PI : 0;
      const a = t * Math.PI * 8 + strand;
      const jitter = ((i * 9301 + 49297) % 233280) / 233280 - 0.5;
      x = Math.cos(a) * 0.9 + jitter * 0.12; y = (t - 0.5) * 3.6; z = Math.sin(a) * 0.9 + jitter * 0.12;
    } else if (shape === "cube") {
      const face = i % 6, a = ((i * 7919) % n) / n * 2 - 1, b = ((i * 104729) % n) / n * 2 - 1, s = 1.15;
      const p = [[s, a, b], [-s, a, b], [a, s, b], [a, -s, b], [a, b, s], [a, b, -s]][face];
      [x, y, z] = [p[0] * s, p[1] * s, p[2] * s];
    } else {
      const side = Math.ceil(Math.sqrt(n));
      const gx = (i % side) / side - 0.5, gz = Math.floor(i / side) / side - 0.5;
      x = gx * 4; z = gz * 4; y = Math.sin(gx * 9) * Math.cos(gz * 9) * 0.35;
    }
    out.set([x, y, z], i * 3);
  }
  return out;
}

function Particles({ shapes, count, hold, colors, onShapeChange }: Required<Omit<ThreeParticleMorphProps, "className" | "onShapeChange">> & Pick<ThreeParticleMorphProps, "onShapeChange">) {
  const reduced = useReducedMotion();
  const points = useRef<THREE.Points>(null);
  const targets = useMemo(() => shapes.map((s) => shapePositions(s, count)), [shapes, count]);
  const { positions, colorArr } = useMemo(() => {
    const c1 = new THREE.Color(colors[0]), c2 = new THREE.Color(colors[1]), c = new THREE.Color();
    const colorArr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) colorArr.set(c.copy(c1).lerp(c2, i / count).toArray(), i * 3);
    return { positions: targets[0].slice(), colorArr };
  }, [targets, colors, count]);
  const state = useRef({ index: 0, clock: 0 });

  useFrame((s, dt) => {
    const p = points.current;
    if (!p) return;
    const st = state.current;
    st.clock += dt;
    if (st.clock > hold) {
      st.clock = 0;
      st.index = (st.index + 1) % targets.length;
      onShapeChange?.(st.index);
    }
    const target = targets[st.index];
    const arr = p.geometry.attributes.position.array as Float32Array;
    // Per-particle ease toward the target; the index-based rate staggers the morph like a wave.
    for (let i = 0; i < arr.length; i += 3) {
      const k = Math.min(1, dt * (1.6 + ((i / 3) % 97) / 40));
      arr[i] += (target[i] - arr[i]) * k;
      arr[i + 1] += (target[i + 1] - arr[i + 1]) * k;
      arr[i + 2] += (target[i + 2] - arr[i + 2]) * k;
    }
    p.geometry.attributes.position.needsUpdate = true;
    p.rotation.y += dt * 0.15;
    p.rotation.x += (s.pointer.y * 0.35 - p.rotation.x) * 0.05;
    p.rotation.z += (-s.pointer.x * 0.2 - p.rotation.z) * 0.05;
  });

  return (
    <points ref={points} rotation={reduced ? [0.3, 0.6, 0] : undefined}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colorArr, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.028} vertexColors transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}

/**
 * Thousands of particles that flow from one shape to the next (sphere → torus → helix → cube → wave).
 * Each particle eases to its slot at a slightly different rate, so the morph ripples instead of snapping.
 */
export function ThreeParticleMorph({ shapes = DEFAULT_SHAPES, count = 8000, hold = 3.2, colors = ["#a78bfa", "#22d3ee"], className, onShapeChange }: ThreeParticleMorphProps) {
  return (
    <Canvas3DShell className={className} camera={{ position: [0, 0, 5.2], fov: 45 }}>
      <Particles shapes={shapes} count={count} hold={hold} colors={colors} onShapeChange={onShapeChange} />
    </Canvas3DShell>
  );
}
