#!/usr/bin/env node
/** Renders 8 procedural "photo" scenes (license-free demo art) to apps/docs/public/demo/photo-N.jpg using headless Chromium. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

// Uses the pre-installed Playwright (NODE_PATH=$(npm root -g)) or a local one.
const { chromium } = createRequire(import.meta.url)("playwright");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "apps/docs/public/demo");
fs.mkdirSync(out, { recursive: true });

const scenes = [
  { sky: ["#2b1055", "#d53a9d", "#ff9a5a"], layers: ["#c4486f", "#8f2f63", "#511b4f", "#2a0f33"], sun: "#ffd29a", kind: "dunes" },
  { sky: ["#0b1d51", "#3f51b5", "#9fa8da"], layers: ["#4a5aa8", "#34418a", "#222c66", "#121a42"], sun: "#e8ecff", kind: "mountains" },
  { sky: ["#05010f", "#3b0a5a", "#ff2e88"], layers: ["#2a0c45", "#1c0833", "#120522", "#0a0314"], sun: "#ff5fa2", kind: "city" },
  { sky: ["#0c3b2e", "#2e7d5b", "#b7e4c7"], layers: ["#2d6a4f", "#1b4332", "#123528", "#081c15"], sun: "#f1faee", kind: "forest" },
  { sky: ["#3d1f00", "#e07a1f", "#ffd166"], layers: ["#c96b1e", "#9a4d14", "#6b330d", "#3a1b06"], sun: "#fff3c4", kind: "road" },
  { sky: ["#030712", "#1e1b4b", "#4c1d95"], layers: ["#1e1b4b", "#17153b", "#0f0d29", "#070614"], sun: "#a7f3d0", kind: "aurora" },
  { sky: ["#023e8a", "#0096c7", "#caf0f8"], layers: ["#0077b6", "#005f8f", "#03456b", "#022a43"], sun: "#ffffff", kind: "ocean" },
  { sky: ["#3c1530", "#c06c84", "#f8b195"], layers: ["#d48a9a", "#a85d74", "#7a3e57", "#4b2238"], sun: "#ffe5d9", kind: "studio" },
];

const html = `<canvas id="c" width="1200" height="900"></canvas><script>
function rnd(seed){return()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646}}
window.draw=(s,i)=>{const c=document.getElementById('c'),x=c.getContext('2d'),W=1200,H=900,r=rnd(i*977+13);
const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,s.sky[0]);g.addColorStop(.55,s.sky[1]);g.addColorStop(1,s.sky[2]);x.fillStyle=g;x.fillRect(0,0,W,H);
if(s.kind==='aurora'||s.kind==='city'){for(let k=0;k<260;k++){x.fillStyle='rgba(255,255,255,'+(r()*.8)+')';x.fillRect(r()*W,r()*H*.6,r()*2+.5,r()*2+.5)}}
if(s.kind==='aurora'){for(let b=0;b<3;b++){x.save();x.globalCompositeOperation='screen';const ag=x.createLinearGradient(0,100,0,520);ag.addColorStop(0,'rgba(0,0,0,0)');ag.addColorStop(.5,b%2?'rgba(167,139,250,.55)':'rgba(52,211,153,.6)');ag.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=ag;x.beginPath();x.moveTo(0,520);for(let px=0;px<=W;px+=20)x.lineTo(px,200+b*60+Math.sin(px/170+b*2)*90+Math.sin(px/53)*20);x.lineTo(W,520);x.filter='blur(18px)';x.fill();x.restore()}}
const sx=W*(.25+r()*.5),sy=H*(s.kind==='ocean'?.42:.38);const sg=x.createRadialGradient(sx,sy,0,sx,sy,260);sg.addColorStop(0,s.sun);sg.addColorStop(.25,s.sun+'cc');sg.addColorStop(1,s.sun+'00');x.fillStyle=sg;x.beginPath();x.arc(sx,sy,260,0,7);x.fill();
if(s.kind!=='aurora'){x.fillStyle=s.sun;x.beginPath();x.arc(sx,sy,s.kind==='city'?90:70,0,7);x.fill()}
if(s.kind==='city'){x.fillStyle='rgba(255,46,136,.25)';for(let k=0;k<12;k++)x.fillRect(0,sy+20+k*14,W,4)}
s.layers.forEach((col,li)=>{const base=H*(.52+li*.12);x.fillStyle=col;x.beginPath();x.moveTo(0,H);
if(s.kind==='city'&&li>0){let px=0;while(px<W){const bw=40+r()*90,bh=80+r()*(260-li*40);x.lineTo(px,base-bh);x.lineTo(px+bw,base-bh);px+=bw}x.lineTo(W,H)}
else{const amp=s.kind==='mountains'?160-li*25:s.kind==='forest'?40:s.kind==='ocean'?10+li*4:60-li*8,f1=.002+r()*.003,f2=.01+r()*.01,ph=r()*10;
for(let px=0;px<=W;px+=4){let y=base-Math.sin(px*f1+ph)*amp-Math.sin(px*f2+ph*2)*amp*.25;if(s.kind==='mountains')y-=Math.abs(Math.sin(px*.006+ph))*amp*.8;if(s.kind==='forest')y-=(Math.floor(px/14)%2?r()*50:0);x.lineTo(px,y)}x.lineTo(W,H)}
x.closePath();x.fill()});
if(s.kind==='road'){x.fillStyle='#1d0e03';x.beginPath();x.moveTo(W/2-20,H*.6);x.lineTo(W/2+20,H*.6);x.lineTo(W*.85,H);x.lineTo(W*.15,H);x.fill();x.strokeStyle='#ffd166';x.lineWidth=6;x.setLineDash([30,30]);x.beginPath();x.moveTo(W/2,H*.62);x.lineTo(W/2,H);x.stroke()}
if(s.kind==='ocean'){x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=2;for(let k=0;k<40;k++){const y=H*.55+r()*H*.45;x.beginPath();x.moveTo(r()*W,y);x.lineTo(r()*W,y);x.stroke()}}
if(s.kind==='studio'){x.fillStyle='rgba(255,255,255,.18)';x.beginPath();x.arc(W*.7,H*.62,120,0,7);x.fill();x.fillStyle='rgba(60,21,48,.55)';x.fillRect(W*.2,H*.55,180,260)}
const img=x.getImageData(0,0,W,H),d=img.data;for(let p=0;p<d.length;p+=4){const n=(r()-.5)*18;d[p]+=n;d[p+1]+=n;d[p+2]+=n}x.putImageData(img,0,0);
const v=x.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H*.9);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.45)');x.fillStyle=v;x.fillRect(0,0,W,H);
return c.toDataURL('image/jpeg',.82)}
</script>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html);
for (let i = 0; i < scenes.length; i++) {
  const data = await page.evaluate(([s, i]) => window.draw(s, i + 1), [scenes[i], i]);
  fs.writeFileSync(path.join(out, `photo-${i + 1}.jpg`), Buffer.from(data.split(",")[1], "base64"));
}
await browser.close();
console.log(`wrote ${scenes.length} demo images to ${path.relative(root, out)}`);
