const {chromium}=require('playwright');
const DEFS=`<defs>
<linearGradient id="gm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff6c8"/><stop offset=".2" stop-color="#f4d06a"/><stop offset=".45" stop-color="#b8841c"/><stop offset=".58" stop-color="#f7d873"/><stop offset=".78" stop-color="#a86f12"/><stop offset="1" stop-color="#fbe9a6"/></linearGradient>
<linearGradient id="gt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3c0"/><stop offset=".5" stop-color="#f0c251"/><stop offset="1" stop-color="#b07a14"/></linearGradient>
<radialGradient id="lac" cx="38%" cy="32%" r="85%"><stop offset="0" stop-color="#3a2f1e"/><stop offset=".5" stop-color="#1a140c"/><stop offset="1" stop-color="#070503"/></radialGradient>
<linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></linearGradient>
<filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#000" flood-opacity=".8"/></filter>
<filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>`;
const cx=100,cy=100; const pt=(a,r)=>{const t=(a-90)*Math.PI/180;return [cx+r*Math.cos(t),cy+r*Math.sin(t)];};
const sector=(a0,a1,r0,r1)=>{const [ax,ay]=pt(a0,r1),[bx,by]=pt(a1,r1),[c1,d1]=pt(a1,r0),[dx,dy]=pt(a0,r0);return `M${ax},${ay} A${r1},${r1} 0 0 1 ${bx},${by} L${c1},${d1} A${r0},${r0} 0 0 0 ${dx},${dy} Z`;};
const GUA=[[0,1,0],[1,0,0],[0,0,1],[0,1,1],[1,0,1],[0,0,0],[1,1,0],[1,1,1]];
const gua=(a,bits,col)=>{const [gx,gy]=pt(a,60);let s='';bits.forEach((y,k)=>{const off=(k-1)*12,w=30,h=7;const T=`transform="translate(${gx} ${gy}) rotate(${a})" filter="url(#sh)"`;
  if(y)s+=`<rect x="${-w/2}" y="${off-h/2}" width="${w}" height="${h}" rx="2" fill="${col}" ${T}/>`;else s+=`<rect x="${-w/2}" y="${off-h/2}" width="${w/2-3.5}" height="${h}" rx="2" fill="${col}" ${T}/><rect x="3.5" y="${off-h/2}" width="${w/2-3.5}" height="${h}" rx="2" fill="${col}" ${T}/>`;});return s;};
let S=`<circle cx="${cx}" cy="${cy}" r="94" fill="url(#gm)" filter="url(#sh)"/><circle cx="${cx}" cy="${cy}" r="80" fill="url(#lac)"/><circle cx="${cx}" cy="${cy}" r="92" fill="none" stroke="#fff6c8" stroke-width="1" opacity=".6"/><circle cx="${cx}" cy="${cy}" r="81.5" fill="none" stroke="#5a3d08" stroke-width="1.5"/>`;
S+=`<path d="${sector(22.5,67.5,34,80)}" fill="url(#gm)" filter="url(#glow)"/><path d="${sector(22.5,67.5,34,80)}" fill="url(#sheen)"/>`;
S+=`<circle cx="${cx}" cy="${cy}" r="34" fill="url(#lac)" stroke="url(#gt)" stroke-width="3"/>`;
for(let i=0;i<8;i++) S+=gua(i*45,GUA[i],i===1?'#120d05':'url(#gt)');
{const a=45,r=29;const [tx,ty]=pt(a,r),[bx,by]=pt(a+180,r*0.72),[lx,ly]=pt(a+90,10),[rx,ry]=pt(a-90,10);
 S+=`<line x1="${pt(0,28)[0]}" y1="${pt(0,28)[1]}" x2="${pt(180,28)[0]}" y2="${pt(180,28)[1]}" stroke="#e0392f" stroke-width="1" opacity=".8"/>`;
 S+=`<polygon points="${tx},${ty} ${lx},${ly} ${bx},${by} ${rx},${ry}" fill="url(#gm)" filter="url(#sh)"/><polygon points="${tx},${ty} ${lx},${ly} ${cx},${cy} ${rx},${ry}" fill="#e0392f"/><circle cx="${cx}" cy="${cy}" r="7" fill="url(#gm)" stroke="#3a2504" stroke-width="1.5"/>`;}
S+=`<ellipse cx="${cx-30}" cy="${cy-45}" rx="75" ry="38" fill="url(#sheen)" transform="rotate(-35 ${cx-30} ${cy-45})"/>`;
(async()=>{const b=await chromium.launch();
for(const [name,size,maskable] of [['icon-512',512,false],['icon-512-maskable',512,true],['icon-192',192,false],['icon-180',180,false]]){
  const p=await b.newPage({viewport:{width:size,height:size}});
  const pad=maskable?size*0.12:size*0.03; const r=maskable?0:size*0.22;
  await p.setContent(`<style>html,body{margin:0;background:transparent}.box{width:${size}px;height:${size}px;border-radius:${r}px;background:#15110b;display:grid;place-items:center;overflow:hidden}svg{width:${size-pad*2}px;height:${size-pad*2}px}</style><div class="box"><svg viewBox="0 0 200 200">${DEFS}${S}</svg></div>`);
  await p.waitForTimeout(300); await (await p.$('.box')).screenshot({path:'/home/claude/site/icons/'+name+'.png',omitBackground:true}); await p.close();}
await b.close();})();
