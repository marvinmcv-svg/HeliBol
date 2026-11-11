"use client";
import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(ScrollTrigger);

export interface GsapShaderScrollProps {
  /** Text panels shown as you scroll; the shader morphs across them. */
  panels: ReactNode[];
  /** One colour pair per panel: [deep, bright]. */
  palettes?: [string, string][];
  scroller?: RefObject<HTMLElement | null>;
  className?: string;
}

const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uProgress;
uniform vec3 uA; uniform vec3 uB;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes; vec2 p=(uv-.5)*vec2(uRes.x/uRes.y,1.);
  // scroll progress twists and zooms the domain; time keeps it alive
  float t=uTime*.08+uProgress*3.;
  float ang=uProgress*2.2; p*=mat2(cos(ang),-sin(ang),sin(ang),cos(ang));
  p*=1.6+uProgress*1.4;
  vec2 q=vec2(fbm(p+t),fbm(p+vec2(5.2,1.3)-t));
  float f=fbm(p+2.*q);
  vec3 col=mix(uA,uB,smoothstep(.25,.85,f));
  col+=pow(f,4.)*.6;
  col*=1.-.35*length(uv-.5);
  gl_FragColor=vec4(col,1.);
}`;
const VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

const hex = (c: string) => {
  const v = parseInt(c.replace("#", ""), 16);
  return [(v >> 16) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
};

const DEFAULT_PALETTES: [string, string][] = [["#1e1b4b", "#a78bfa"], ["#042f2e", "#5eead4"], ["#431407", "#fb923c"], ["#4a044e", "#f0abfc"]];

/**
 * A full-screen fragment shader (raw WebGL, ~1 KB) whose uniforms are scrubbed by ScrollTrigger:
 * scrolling twists and zooms the noise field and crossfades the palette panel by panel. Time keeps
 * it gently moving. Reduced motion: no time animation, palette still follows scroll.
 */
export function GsapShaderScroll({ panels, palettes = DEFAULT_PALETTES, scroller, className }: GsapShaderScrollProps) {
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current, sec = section.current;
    const gl = c?.getContext("webgl", { antialias: false, alpha: false });
    if (!c || !sec || !gl) return; // no WebGL: the CSS gradient fallback stays visible
    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
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
    const uRes = u("uRes"), uTime = u("uTime"), uProg = u("uProgress"), uA = u("uA"), uB = u("uB");

    const cols = palettes.map(([a, b]) => [hex(a), hex(b)]);
    const state = { progress: 0 };
    const mix = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i] - v) * t);

    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
      gl.viewport(0, 0, c.width, c.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);

    let raf = 0, visible = true;
    const start = performance.now();
    const draw = () => {
      const seg = state.progress * (cols.length - 1);
      const i = Math.min(cols.length - 2, Math.floor(seg)), f = seg - i;
      gl.uniform2f(uRes, c.width, c.height);
      gl.uniform1f(uTime, reduced ? 0 : (performance.now() - start) / 1000);
      gl.uniform1f(uProg, state.progress);
      gl.uniform3fv(uA, mix(cols[i][0], cols[i + 1][0], f));
      gl.uniform3fv(uB, mix(cols[i][1], cols[i + 1][1], f));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = () => { draw(); raf = visible && !reduced ? requestAnimationFrame(loop) : 0; };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf && !reduced) loop(); });
    io.observe(sec);

    const st = ScrollTrigger.create({
      trigger: sec,
      scroller: scroller?.current ?? undefined,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
      onUpdate: (self) => {
        gsap.to(state, { progress: self.progress, duration: 0.6, ease: "power2.out", overwrite: true, onUpdate: () => reduced && draw() });
      },
    });
    loop();
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); st.kill(); gl.getExtension("WEBGL_lose_context")?.loseContext(); };
  }, [palettes, reduced, scroller]);

  return (
    <section ref={section} className={cn("relative", className)} style={{ height: `${panels.length * 100}cqh` }}>
      <canvas ref={canvas} aria-hidden className="sticky top-0 block h-[100cqh] w-full bg-[linear-gradient(135deg,#1e1b4b,#7c3aed)]" />
      <div className="absolute inset-0">
        {panels.map((p, i) => (
          <div key={i} className="grid h-[100cqh] place-items-center p-8 text-center text-white">{p}</div>
        ))}
      </div>
    </section>
  );
}
