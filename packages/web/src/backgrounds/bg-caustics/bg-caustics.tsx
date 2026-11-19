"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface BgCausticsProps {
  children?: ReactNode;
  /** Deep water colour. */
  deep?: string;
  /** Light colour of the caustic lines. */
  light?: string;
  speed?: number;
  className?: string;
}

const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uPointer; uniform vec3 uDeep; uniform vec3 uLight;
// classic iterated caustic: light focusing through a moving water surface
float caustic(vec2 uv, float t){
  vec2 p = mod(uv * 6.2831, 6.2831) - 250.0;
  vec2 i = p; float c = 1.0; float inten = .005;
  for (int n = 0; n < 5; n++) {
    float tt = t * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
  }
  c /= 5.0; c = 1.17 - pow(c, 1.4);
  return pow(abs(c), 8.0);
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes; vec2 asp = vec2(uRes.x / uRes.y, 1.0);
  vec2 q = uv * asp * .55;
  // ripple pushed by the pointer
  float d = distance(uv * asp, uPointer * asp);
  q += .02 * sin(d * 40.0 - uTime * 4.0) * exp(-d * 6.0);
  float c = caustic(q, uTime * .5) + .5 * caustic(q * 1.7 + .3, uTime * .35);
  vec3 col = mix(uDeep, uDeep * 1.6, uv.y);
  col += uLight * clamp(c, 0.0, 1.2) * .8;
  col *= .85 + .15 * smoothstep(1.2, .2, length((uv - .5) * asp));
  gl_FragColor = vec4(col, 1.0);
}`;
const VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const hex = (c: string) => { const v = parseInt(c.slice(1), 16); return [(v >> 16) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255]; };

/**
 * Pool-floor caustics in a ~1 KB fragment shader: iterated light focusing in two layers, a deep-to-
 * shallow gradient, and a ripple that follows the pointer. Pauses off-screen; reduced motion
 * renders one still frame. Falls back to a CSS gradient without WebGL.
 */
export function BgCaustics({ children, deep = "#04364a", light = "#a5f3fc", speed = 1, className }: BgCausticsProps) {
  const reduced = useReducedMotion();
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current;
    const gl = c?.getContext("webgl", { antialias: false });
    if (!c || !gl) return;
    const sh = (t: number, s: string) => { const x = gl.createShader(t)!; gl.shaderSource(x, s); gl.compileShader(x); return x; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(prog, 0, "p");
    gl.linkProgram(prog);
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    gl.uniform3fv(u("uDeep"), hex(deep));
    gl.uniform3fv(u("uLight"), hex(light));
    const pointer = [0.5, 0.5], target = [0.5, 0.5];
    const resize = () => {
      const dpr = Math.min(1.5, devicePixelRatio || 1);
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
      gl.viewport(0, 0, c.width, c.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    resize();
    const host = c.parentElement!;
    const move = (e: PointerEvent) => { const r = c.getBoundingClientRect(); target[0] = (e.clientX - r.left) / r.width; target[1] = 1 - (e.clientY - r.top) / r.height; };
    host.addEventListener("pointermove", move);
    let raf = 0, visible = true;
    const t0 = performance.now();
    const draw = () => {
      pointer[0] += (target[0] - pointer[0]) * 0.08;
      pointer[1] += (target[1] - pointer[1]) * 0.08;
      gl.uniform2f(u("uRes"), c.width, c.height);
      gl.uniform1f(u("uTime"), reduced ? 3 : ((performance.now() - t0) / 1000) * speed);
      gl.uniform2f(u("uPointer"), pointer[0], pointer[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = () => { draw(); raf = visible && !reduced && !document.hidden ? requestAnimationFrame(loop) : 0; };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) loop(); });
    io.observe(c);
    loop();
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); host.removeEventListener("pointermove", move); gl.getExtension("WEBGL_lose_context")?.loseContext(); };
  }, [deep, light, speed, reduced]);

  return (
    <div className={cn("relative isolate overflow-hidden", className)} style={{ background: `linear-gradient(to top, ${deep}, #0e7490)` }}>
      <canvas ref={canvas} aria-hidden className="absolute inset-0 -z-10 size-full" />
      {children}
    </div>
  );
}
