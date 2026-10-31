"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { cn, useReducedMotion } from "@kinetik/core";

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
const FRAG = `precision highp float;uniform vec2 r;uniform float t;uniform vec3 c1;uniform vec3 c2;uniform vec3 c3;
float n(vec2 p){return sin(p.x)*sin(p.y);}
void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=uv*3.;float tt=t*.15;
for(int i=1;i<5;i++){float fi=float(i);p.x+=.6/fi*sin(fi*p.y+tt+.3*fi)+.4;p.y+=.6/fi*cos(fi*p.x+tt+.3*fi)-.4;}
float m=.5+.5*sin(p.x+p.y);float k=.5+.5*cos(p.y*.8-p.x*.3);
vec3 col=mix(mix(c1,c2,m),c3,k*.6);
float g=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);col+= (g-.5)*.035;
gl_FragColor=vec4(col,1.);}`;

const DEFAULT: [string, string, string] = ["#1e1b4b", "#7c3aed", "#f472b6"];
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

/** Raw WebGL fragment shader: a slow, liquid, grain-dithered gradient (no three.js — ~1 KB). */
export function BgShader({ children, colors = DEFAULT, className }: { children?: ReactNode; colors?: [string, string, string]; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!canvas || !gl) return;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    colors.forEach((c, i) => gl.uniform3fv(u(`c${i + 1}`), hex(c)));
    let raf = 0;
    let visible = true;
    const t0 = performance.now();
    const draw = () => {
      const dpr = Math.min(1.5, devicePixelRatio || 1);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(u("r"), w, h);
      gl.uniform1f(u("t"), reduced ? 4 : (performance.now() - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduced && visible && !document.hidden) raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      draw();
    });
    io.observe(canvas);
    const onVis = () => (cancelAnimationFrame(raf), draw());
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced, colors.join()]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <canvas ref={ref} aria-hidden className="absolute inset-0 -z-10 h-full w-full" />
      {children}
    </div>
  );
}
