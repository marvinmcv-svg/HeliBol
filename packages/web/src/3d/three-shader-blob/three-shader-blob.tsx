"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@kinetik/core";
import { Canvas3DShell } from "../canvas-3d-shell/canvas-3d-shell";

export interface ThreeShaderBlobProps {
  colors?: [string, string, string];
  /** Noise displacement amplitude at rest; hovering pushes it up. */
  intensity?: number;
  speed?: number;
  className?: string;
}

// Compact 3D simplex noise (Ashima / Stefan Gustavson, MIT).
const noise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const vertexShader = /* glsl */ `
uniform float uTime; uniform float uAmp;
varying float vNoise; varying vec3 vNormal; varying vec3 vView;
${noise}
void main(){
  float n = snoise(normal * 1.6 + uTime * .35);
  vNoise = n;
  vec3 p = position + normal * n * uAmp;
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

const fragmentShader = /* glsl */ `
uniform vec3 uA; uniform vec3 uB; uniform vec3 uC;
varying float vNoise; varying vec3 vNormal; varying vec3 vView;
void main(){
  float fres = pow(1. - max(dot(vNormal, vView), 0.), 2.2);
  vec3 col = mix(uA, uB, smoothstep(-.6, .6, vNoise));
  col = mix(col, uC, fres);
  gl_FragColor = vec4(col + fres * .25, 1.);
}`;

function Blob({ colors, intensity, speed }: Required<Omit<ThreeShaderBlobProps, "className">>) {
  const reduced = useReducedMotion();
  const mesh = useRef<THREE.Mesh>(null);
  const hover = useRef(0);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: intensity },
      uA: { value: new THREE.Color(colors[0]) },
      uB: { value: new THREE.Color(colors[1]) },
      uC: { value: new THREE.Color(colors[2]) },
    }),
    [colors, intensity],
  );
  useFrame((s, dt) => {
    if (reduced) return;
    uniforms.uTime.value += dt * speed;
    uniforms.uAmp.value += (intensity * (1 + hover.current * 1.4) - uniforms.uAmp.value) * 0.06;
    if (mesh.current) {
      mesh.current.rotation.y += dt * 0.1;
      mesh.current.rotation.x += (s.pointer.y * 0.4 - mesh.current.rotation.x) * 0.05;
    }
  });
  return (
    <mesh ref={mesh} onPointerOver={() => (hover.current = 1)} onPointerOut={() => (hover.current = 0)}>
      <icosahedronGeometry args={[1.35, 64]} />
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
    </mesh>
  );
}

/** A living sphere: simplex-noise vertex displacement plus a fresnel rim in a custom ShaderMaterial. Hover makes it boil. */
export function ThreeShaderBlob({ colors = ["#4c1d95", "#ec4899", "#67e8f9"], intensity = 0.28, speed = 1, className }: ThreeShaderBlobProps) {
  return (
    <Canvas3DShell className={className} camera={{ position: [0, 0, 4.6], fov: 45 }}>
      <Blob colors={colors} intensity={intensity} speed={speed} />
    </Canvas3DShell>
  );
}
