"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@kinetik/core";
import { Canvas3DShell } from "../canvas-3d-shell/canvas-3d-shell";

export interface ThreeWaveTerrainProps {
  /** Points per side of the grid. */
  resolution?: number;
  size?: number;
  color?: string;
  /** Background/fog colour so the far edge dissolves. */
  fog?: string;
  className?: string;
}

const vertexShader = /* glsl */ `
uniform float uTime; uniform vec2 uPointer; uniform float uPress;
varying float vH;
void main(){
  vec3 p = position;
  float h = sin(p.x * .6 + uTime) * .25 + cos(p.z * .8 + uTime * .7) * .25 + sin((p.x + p.z) * .35 + uTime * .5) * .35;
  float d = distance(p.xz, uPointer);
  h += exp(-d * d * .35) * (.9 + uPress) * sin(d * 3. - uTime * 4.) ;
  p.y += h;
  vH = h;
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_PointSize = 2.2 * (8. / -mv.z);
  gl_Position = projectionMatrix * mv;
}`;
const fragmentShader = /* glsl */ `
uniform vec3 uColor; uniform vec3 uFog; varying float vH;
void main(){
  float r = length(gl_PointCoord - .5); if (r > .5) discard;
  float depth = gl_FragCoord.z / gl_FragCoord.w;
  float f = smoothstep(4., 14., depth);
  vec3 c = uColor * (.55 + vH * .6);
  gl_FragColor = vec4(mix(c, uFog, f), 1. - f * .9);
}`;

function Terrain({ resolution, size, color, fog }: Required<Omit<ThreeWaveTerrainProps, "className">>) {
  const reduced = useReducedMotion();
  const positions = useMemo(() => {
    const arr = new Float32Array(resolution * resolution * 3);
    for (let i = 0; i < resolution; i++)
      for (let j = 0; j < resolution; j++) arr.set([(i / resolution - 0.5) * size, 0, (j / resolution - 0.5) * size], (i * resolution + j) * 3);
    return arr;
  }, [resolution, size]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPointer: { value: new THREE.Vector2(0, 0) }, uPress: { value: 0 }, uColor: { value: new THREE.Color(color) }, uFog: { value: new THREE.Color(fog) } }), [color, fog]);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const press = useRef(0);
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const el = gl.domElement;
    const down = () => (press.current = 1.2);
    const up = () => (press.current = 0);
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => { el.removeEventListener("pointerdown", down); window.removeEventListener("pointerup", up); };
  }, [gl]);

  useFrame((s, dt) => {
    if (reduced) return;
    uniforms.uTime.value += dt;
    // Project the pointer onto the ground plane so the ripple sits under the cursor.
    s.raycaster.setFromCamera(s.pointer, s.camera);
    if (s.raycaster.ray.intersectPlane(plane, hit)) uniforms.uPointer.value.lerp(new THREE.Vector2(hit.x, hit.z), 0.08);
    uniforms.uPress.value += (press.current - uniforms.uPress.value) * 0.1;
  });

  return (
    <points>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} transparent depthWrite={false} />
    </points>
  );
}

/** A rolling field of points (GPU-displaced in a vertex shader) with a ripple that follows the cursor; press to amplify. */
export function ThreeWaveTerrain({ resolution = 140, size = 18, color = "#5eead4", fog = "#020617", className }: ThreeWaveTerrainProps) {
  return (
    <Canvas3DShell className={className} camera={{ position: [0, 2.6, 6.5], fov: 50 }}>
      <group rotation={[-0.08, 0, 0]}>
        <Terrain resolution={resolution} size={size} color={color} fog={fog} />
      </group>
    </Canvas3DShell>
  );
}
