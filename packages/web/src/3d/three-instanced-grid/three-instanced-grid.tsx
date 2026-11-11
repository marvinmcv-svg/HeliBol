"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "@kinetik/core";
import { Canvas3DShell } from "../canvas-3d-shell/canvas-3d-shell";

export interface ThreeInstancedGridProps {
  /** Columns × rows of pillars. */
  size?: number;
  color?: string;
  accent?: string;
  /** How far the cursor's influence reaches, in grid cells. */
  radius?: number;
  className?: string;
}

function Grid({ size, color, accent, radius }: Required<Omit<ThreeInstancedGridProps, "className">>) {
  const reduced = useReducedMotion();
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = size * size;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const heights = useMemo(() => new Float32Array(count), [count]);
  const base = useMemo(() => new THREE.Color(color), [color]);
  const hot = useMemo(() => new THREE.Color(accent), [accent]);
  const tmp = useMemo(() => new THREE.Color(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const hit = useMemo(() => new THREE.Vector3(999, 0, 999), []);
  const gap = 0.32;

  useFrame((s, dt) => {
    const m = mesh.current;
    if (!m) return;
    s.raycaster.setFromCamera(s.pointer, s.camera);
    if (!s.raycaster.ray.intersectPlane(plane, hit)) hit.set(999, 0, 999);
    const t = s.clock.elapsedTime;
    let i = 0;
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++, i++) {
        const px = (x - size / 2) * gap, pz = (z - size / 2) * gap;
        const d = Math.hypot(px - hit.x, pz - hit.z) / gap;
        const lift = Math.max(0, 1 - d / radius);
        const idle = reduced ? 0 : (Math.sin(px * 1.4 + t) + Math.cos(pz * 1.2 + t * 0.8)) * 0.08;
        const target = 0.15 + idle + lift * lift * 1.6;
        // critically-damped-ish follow so pillars settle smoothly when the cursor leaves
        heights[i] = reduced ? target : heights[i] + (target - heights[i]) * Math.min(1, dt * 8);
        dummy.position.set(px, heights[i] / 2, pz);
        dummy.scale.set(1, heights[i], 1);
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
        m.setColorAt(i, tmp.copy(base).lerp(hot, Math.min(1, lift * 1.4)));
      }
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[gap * 0.82, 1, gap * 0.82]} />
      <meshStandardMaterial roughness={0.35} metalness={0.2} />
    </instancedMesh>
  );
}

/** A field of instanced pillars that rise and glow under the cursor and breathe at rest — thousands of boxes, one draw call. */
export function ThreeInstancedGrid({ size = 36, color = "#27272a", accent = "#a3e635", radius = 4, className }: ThreeInstancedGridProps) {
  return (
    <Canvas3DShell className={className} camera={{ position: [6, 7, 6], fov: 40 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 8, 2]} intensity={2.2} />
      <group rotation={[0, 0, 0]}>
        <Grid size={size} color={color} accent={accent} radius={radius} />
      </group>
      <Environment resolution={128}>
        <Lightformer intensity={2} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
      </Environment>
      <CameraAim />
    </Canvas3DShell>
  );
}

function CameraAim() {
  useFrame(({ camera }) => camera.lookAt(0, 0, 0));
  return null;
}
