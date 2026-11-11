"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "@kinetik/core";
import { Canvas3DShell } from "../canvas-3d-shell/canvas-3d-shell";

export interface ThreeCoinProps {
  /** Short mark embossed on the front face (1–3 characters read best). */
  front?: string;
  /** Text on the back face. */
  back?: string;
  color?: string;
  className?: string;
  /** Increment to flip the coin (e.g. from a button). */
  flipKey?: number;
}

/** Draws a face into a canvas texture: rim ring, ridged edge marks and the label. */
function faceTexture(label: string, base: string, small: boolean) {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const col = new THREE.Color(base);
  const dark = `#${col.clone().multiplyScalar(0.55).getHexString()}`;
  const light = `#${col.clone().lerp(new THREE.Color("#fff"), 0.45).getHexString()}`;
  const grad = g.createRadialGradient(size * 0.35, size * 0.3, 10, size / 2, size / 2, size / 2);
  grad.addColorStop(0, light);
  grad.addColorStop(1, `#${col.getHexString()}`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  g.strokeStyle = dark;
  g.lineWidth = 10;
  g.beginPath();
  g.arc(size / 2, size / 2, size * 0.41, 0, Math.PI * 2);
  g.stroke();
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    g.beginPath();
    g.moveTo(size / 2 + Math.cos(a) * size * 0.44, size / 2 + Math.sin(a) * size * 0.44);
    g.lineTo(size / 2 + Math.cos(a) * size * 0.48, size / 2 + Math.sin(a) * size * 0.48);
    g.lineWidth = 4;
    g.stroke();
  }
  g.fillStyle = dark;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `800 ${small ? 64 : 200}px system-ui, sans-serif`;
  g.fillText(label, size / 2, size / 2 + (small ? 0 : 10));
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function Coin({ front, back, color, flipKey }: Required<Omit<ThreeCoinProps, "className">>) {
  const reduced = useReducedMotion();
  const mesh = useRef<THREE.Mesh>(null);
  const materials = useMemo(() => {
    const edge = new THREE.MeshStandardMaterial({ color, metalness: 1, roughness: 0.28 });
    const f = new THREE.MeshStandardMaterial({ map: faceTexture(front, color, false), metalness: 0.9, roughness: 0.3 });
    const b = new THREE.MeshStandardMaterial({ map: faceTexture(back, color, true), metalness: 0.9, roughness: 0.3 });
    return [edge, f, b];
  }, [front, back, color]);
  useEffect(() => () => materials.forEach((m) => { m.map?.dispose(); m.dispose(); }), [materials]);

  // Flip = add half-turns to a target and spring toward it; a little hop sells the toss.
  const anim = useRef({ target: 0, current: 0, vel: 0, hop: 0 });
  useEffect(() => {
    if (!flipKey) return;
    anim.current.target += Math.PI * 3;
    anim.current.hop = 1;
  }, [flipKey]);

  useFrame((s, dt) => {
    const m = mesh.current;
    if (!m) return;
    const a = anim.current;
    if (reduced) { a.current = a.target; a.vel = 0; a.hop = 0; }
    a.vel += (a.target - a.current) * 60 * dt;
    a.vel *= Math.exp(-9 * dt);
    a.current += a.vel * dt;
    a.hop = Math.max(0, a.hop - dt * 1.6);
    m.rotation.x = Math.PI / 2 + a.current + s.pointer.y * 0.25;
    m.rotation.z = -s.pointer.x * 0.5 + (reduced ? 0 : Math.sin(s.clock.elapsedTime * 0.8) * 0.15);
    m.position.y = Math.sin(a.hop * Math.PI) * 0.9;
  });

  return (
    <mesh ref={mesh} material={materials} rotation={[Math.PI / 2, 0, 0]}>
      {/* CylinderGeometry groups: 0 = side, 1 = top, 2 = bottom */}
      <cylinderGeometry args={[1.25, 1.25, 0.16, 96]} />
    </mesh>
  );
}

/** A metallic 3D coin with canvas-drawn embossed faces. It flips with a spring and a hop, and tilts toward the pointer. */
export function ThreeCoin({ front = "K", back = "KINETIK · 2026", color = "#d4a017", className, flipKey = 0 }: ThreeCoinProps) {
  return (
    <Canvas3DShell className={className} camera={{ position: [0, 0, 5], fov: 40 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={2} />
      <Coin front={front} back={back} color={color} flipKey={flipKey} />
      <Environment resolution={256}>
        <Lightformer intensity={5} position={[0, 5, -3]} scale={[10, 2, 1]} />
        <Lightformer intensity={2} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer intensity={2} color="#fde68a" position={[5, -1, 2]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
      </Environment>
    </Canvas3DShell>
  );
}
