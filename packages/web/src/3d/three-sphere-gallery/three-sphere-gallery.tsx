"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "@kinetik/core";
import { Canvas3DShell } from "../canvas-3d-shell/canvas-3d-shell";

export interface ThreeSphereGalleryProps {
  images: string[];
  /** How many tiles to place on the sphere (images repeat to fill). */
  tiles?: number;
  radius?: number;
  /** Idle spin in radians per second. */
  autoRotate?: number;
  className?: string;
}

function Gallery({ images, tiles, radius, autoRotate }: Required<Omit<ThreeSphereGalleryProps, "className">>) {
  const reduced = useReducedMotion();
  const group = useRef<THREE.Group>(null);
  const textures = useTexture(images);
  textures.forEach((t) => (t.colorSpace = THREE.SRGBColorSpace));
  const gl = useThree((s) => s.gl);

  // Fibonacci lattice → even spacing; each tile looks outward from the centre.
  const placements = useMemo(() => {
    const out: { pos: THREE.Vector3; quat: THREE.Quaternion; tex: number }[] = [];
    const m = new THREE.Matrix4();
    for (let i = 0; i < tiles; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / tiles);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const pos = new THREE.Vector3().setFromSphericalCoords(radius, phi, theta);
      m.lookAt(pos.clone().multiplyScalar(2), pos, new THREE.Vector3(0, 1, 0));
      out.push({ pos, quat: new THREE.Quaternion().setFromRotationMatrix(m), tex: i % images.length });
    }
    return out;
  }, [tiles, radius, images.length]);

  // Drag to spin with inertia — pointer events on the canvas element, so it works with touch too.
  const drag = useRef({ down: false, x: 0, y: 0, vx: 0, vy: 0 });
  useEffect(() => {
    const el = gl.domElement;
    el.style.touchAction = "pan-y";
    el.style.cursor = "grab";
    const d = drag.current;
    const down = (e: PointerEvent) => { d.down = true; d.x = e.clientX; d.y = e.clientY; el.style.cursor = "grabbing"; };
    const move = (e: PointerEvent) => {
      if (!d.down) return;
      d.vx = (e.clientX - d.x) * 0.006; d.vy = (e.clientY - d.y) * 0.006; d.x = e.clientX; d.y = e.clientY;
    };
    const up = () => { d.down = false; el.style.cursor = "grab"; };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { el.removeEventListener("pointerdown", down); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [gl]);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const d = drag.current;
    g.rotation.y += d.vx;
    g.rotation.x = THREE.MathUtils.clamp(g.rotation.x + d.vy, -0.9, 0.9);
    if (!d.down) {
      // friction back toward the idle spin
      d.vx += ((reduced ? 0 : autoRotate) * dt - d.vx) * 0.04;
      d.vy *= 0.9;
    } else { d.vx *= 0.5; d.vy *= 0.5; }
  });

  const w = (radius * 2.6) / Math.sqrt(tiles);
  return (
    <group ref={group}>
      {placements.map((p, i) => (
        <mesh key={i} position={p.pos} quaternion={p.quat}>
          <planeGeometry args={[w * 1.25, w, 1, 1]} />
          <meshBasicMaterial map={textures[p.tex]} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Photos tiled over a sphere you can grab and spin, with inertia and a slow idle rotation. */
export function ThreeSphereGallery({ images, tiles = 48, radius = 2.2, autoRotate = 0.12, className }: ThreeSphereGalleryProps) {
  return (
    <Canvas3DShell className={className} camera={{ position: [0, 0, 6.4], fov: 45 }}>
      <fog attach="fog" args={["#05050a", 5, 9.5]} />
      <Gallery images={images} tiles={tiles} radius={radius} autoRotate={autoRotate} />
    </Canvas3DShell>
  );
}
