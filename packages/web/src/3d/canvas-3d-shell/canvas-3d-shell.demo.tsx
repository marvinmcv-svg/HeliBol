"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, MeshDistortMaterial } from "@react-three/drei";
import type { Mesh } from "three";
import { Canvas3DShell } from "./canvas-3d-shell";

function Blob() {
  const mesh = useRef<Mesh>(null);
  useFrame((state, dt) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += dt * 0.25;
    mesh.current.rotation.x = state.pointer.y * 0.4;
    mesh.current.rotation.z = state.pointer.x * 0.3;
  });
  return (
    <Float speed={1.6} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={mesh} scale={1.45}>
        <torusKnotGeometry args={[0.9, 0.32, 220, 32]} />
        <MeshDistortMaterial color="#8b5cf6" roughness={0.15} metalness={0.4} distort={0.28} speed={2} />
      </mesh>
    </Float>
  );
}

export default function Demo() {
  return (
    <div className="relative h-full w-full bg-[radial-gradient(circle_at_50%_40%,rgb(139_92_246/.25),transparent_60%)]">
      <Canvas3DShell>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} />
        <pointLight position={[-4, -2, -2]} intensity={30} color="#22d3ee" />
        <Blob />
        {/* Local studio lighting — no HDR download */}
        <Environment resolution={256}>
          <Lightformer intensity={4} position={[0, 4, -6]} scale={[10, 4, 1]} />
          <Lightformer intensity={2} color="#a78bfa" position={[-5, 0, -2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
          <Lightformer intensity={2} color="#22d3ee" position={[5, -1, 0]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} />
        </Environment>
      </Canvas3DShell>
      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs backdrop-blur">Move your pointer · renders only while on screen</p>
    </div>
  );
}
