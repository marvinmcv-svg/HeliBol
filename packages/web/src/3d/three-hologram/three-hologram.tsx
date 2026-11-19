"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@kinetik/core";
import { Canvas3DShell } from "../canvas-3d-shell/canvas-3d-shell";

export type HologramShape = "knot" | "head" | "ring" | "crystal";

export interface ThreeHologramProps {
  shape?: HologramShape;
  color?: string;
  className?: string;
}

const vertexShader = /* glsl */ `
uniform float uTime; uniform float uGlitch;
varying vec3 vNormal; varying vec3 vView; varying vec3 vWorld;
float rand(vec2 c){ return fract(sin(dot(c, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  vec4 world = modelMatrix * vec4(position, 1.0);
  // glitch: horizontal slice displacement in short bursts
  float band = step(.985, rand(vec2(floor(world.y * 18.0), floor(uTime * 8.0))));
  world.x += band * (rand(vec2(uTime)) - .5) * .35 * uGlitch;
  vWorld = world.xyz;
  vec4 mv = viewMatrix * world;
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

const fragmentShader = /* glsl */ `
uniform float uTime; uniform vec3 uColor;
varying vec3 vNormal; varying vec3 vView; varying vec3 vWorld;
void main(){
  float fres = pow(1.0 - abs(dot(vNormal, vView)), 2.0);
  float lines = step(.5, fract(vWorld.y * 22.0 - uTime * 1.6)) * .55 + .45;
  float flicker = .92 + .08 * sin(uTime * 37.0);
  float a = (fres * 1.25 + .08) * lines * flicker;
  gl_FragColor = vec4(uColor * (1.0 + fres), a);
}`;

function Holo({ shape, color }: { shape: HologramShape; color: string }) {
  const reduced = useReducedMotion();
  const mesh = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uGlitch: { value: reduced ? 0 : 1 }, uColor: { value: new THREE.Color(color) } }), [color, reduced]);
  useFrame((s, dt) => {
    if (reduced) return;
    uniforms.uTime.value += dt;
    if (mesh.current) {
      mesh.current.rotation.y += dt * 0.4;
      mesh.current.rotation.x += (s.pointer.y * 0.4 - mesh.current.rotation.x) * 0.05;
    }
  });
  return (
    <group>
      <mesh ref={mesh}>
        {shape === "knot" && <torusKnotGeometry args={[0.8, 0.26, 220, 32]} />}
        {shape === "head" && <sphereGeometry args={[1, 64, 64]} />}
        {shape === "ring" && <torusGeometry args={[0.9, 0.3, 48, 128]} />}
        {shape === "crystal" && <octahedronGeometry args={[1.15, 1]} />}
        <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
      {/* projector base */}
      <mesh position={[0, -1.45, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.6, 0.75, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, -0.75, 0]}>
        <coneGeometry args={[1.1, 1.4, 64, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={0.06} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

/**
 * Sci-fi hologram: a fresnel-rim shader with scrolling scanlines, flicker and occasional horizontal
 * glitch slices, additive-blended over a projector cone. Pick a knot, head, ring or crystal.
 */
export function ThreeHologram({ shape = "knot", color = "#22d3ee", className }: ThreeHologramProps) {
  return (
    <Canvas3DShell className={className} camera={{ position: [0, 0.2, 4.4], fov: 45 }}>
      <Holo shape={shape} color={color} />
    </Canvas3DShell>
  );
}
