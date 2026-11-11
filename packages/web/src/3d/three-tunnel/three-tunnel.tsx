"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@kinetik/core";
import { Canvas3DShell } from "../canvas-3d-shell/canvas-3d-shell";

export interface ThreeTunnelProps {
  /** Number of rings in the tunnel. */
  rings?: number;
  /** Forward speed in world units per second. */
  speed?: number;
  colors?: [string, string];
  /** Shape of each ring: smooth circle or polygon with this many sides (3–8). */
  sides?: number;
  className?: string;
}

function Tunnel({ rings, speed, colors, sides }: Required<Omit<ThreeTunnelProps, "className">>) {
  const reduced = useReducedMotion();
  const mesh = useRef<THREE.InstancedMesh>(null);
  const spacing = 0.9;
  const depth = rings * spacing;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const palette = useMemo(() => {
    const a = new THREE.Color(colors[0]), b = new THREE.Color(colors[1]);
    return Array.from({ length: rings }, (_, i) => a.clone().lerp(b, (Math.sin(i * 0.35) + 1) / 2));
  }, [rings, colors]);
  const z = useRef(0);
  const steer = useRef(new THREE.Vector2());

  useFrame((s, dt) => {
    const m = mesh.current;
    if (!m) return;
    if (!reduced) z.current = (z.current + dt * speed) % spacing;
    steer.current.lerp(s.pointer, 0.04);
    for (let i = 0; i < rings; i++) {
      const pz = -i * spacing + z.current;
      // The tunnel bends with depth — the pointer steers where the far end points.
      const bend = (-pz / depth) ** 2;
      dummy.position.set(steer.current.x * bend * 6, steer.current.y * bend * 4, pz);
      dummy.rotation.set(0, 0, i * 0.12 + (reduced ? 0 : s.clock.elapsedTime * 0.2));
      const fade = 1 - Math.min(1, -pz / depth);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, palette[i].clone().multiplyScalar(0.25 + fade * 1.2));
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, rings]}>
      <torusGeometry args={[2, 0.025, 6, sides >= 3 && sides <= 8 ? sides : 64]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

/** An endless warp tunnel of glowing rings (one InstancedMesh) that bends toward the pointer. */
export function ThreeTunnel({ rings = 80, speed = 3, colors = ["#f0abfc", "#38bdf8"], sides = 6, className }: ThreeTunnelProps) {
  return (
    <Canvas3DShell className={className} camera={{ position: [0, 0, 1.5], fov: 70 }}>
      <fog attach="fog" args={["#000", 10, 60]} />
      <Tunnel rings={rings} speed={speed} colors={colors} sides={sides} />
    </Canvas3DShell>
  );
}
