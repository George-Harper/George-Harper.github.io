(function(){
  const canvas=document.getElementById('roadmap');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  const nodes=[
    {x:-220,y:20,r:24,title:'HNC Computing',sub:'2021'},
    {x:-80,y:-45,r:25,title:'Cloud Top Technology',sub:'2021–22'},
    {x:80,y:15,r:25,title:'OGL Computers',sub:'2022–25'},
    {x:230,y:-60,r:25,title:'Telent',sub:'2025'},
    {x:360,y:25,r:26,title:'Feridax',sub:'2025–26'},
    {x:500,y:-60,r:26,title:'Forest Garden',sub:'2026'},
    {x:500,y:100,r:25,title:'IT Support',sub:'Next chapter'},
    {x:330,y:120,r:23,title:'PowerShell',sub:'Automation'},
  ];
  let scale=1, ox=0, oy=0, drag=false, sx=0, sy=0, startOx=0, startOy=0;
  const dpr=()=>window.devicePixelRatio||1;
  function resize(){const r=canvas.getBoundingClientRect();canvas.width=r.width*dpr();canvas.height=r.height*dpr();draw()}
  function fit(){scale=1;ox=0;oy=0;draw()}
  function worldToScreen(x,y){return [canvas.clientWidth/2+(x+ox)*scale,canvas.clientHeight/2+(y+oy)*scale]}
  function draw(){
    const w=canvas.clientWidth,h=canvas.clientHeight,s=dpr();ctx.setTransform(s,0,0,s,0,0);ctx.clearRect(0,0,w,h);
    ctx.fillStyle='#0b1624';ctx.fillRect(0,0,w,h);
    const step=24;ctx.lineWidth=1;ctx.strokeStyle='rgba(26,70,96,.28)';
    for(let x=0;x<w;x+=step){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}
    for(let y=0;y<h;y+=step){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
    // connections
    ctx.setLineDash([4,5]);ctx.lineWidth=1;ctx.strokeStyle='rgba(22,201,255,.45)';
    for(let i=0;i<nodes.length-1;i++){const a=worldToScreen(nodes[i].x,nodes[i].y),b=worldToScreen(nodes[i+1].x,nodes[i+1].y);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke()}
    ctx.setLineDash([]);
    nodes.forEach((n,i)=>{const [x,y]=worldToScreen(n.x,n.y);if(x<-60||x>w+60||y<-60||y>h+60)return;ctx.beginPath();ctx.arc(x,y,n.r*scale,0,Math.PI*2);ctx.fillStyle=i===nodes.length-1?'#0b2733':'#101c2b';ctx.fill();ctx.lineWidth=1;ctx.strokeStyle=i===nodes.length-1?'#1fd5ff':'#1f3448';ctx.stroke();ctx.shadowBlur=12;ctx.shadowColor='rgba(22,201,255,.2)';ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#d9e5f4';ctx.textAlign='center';ctx.font=`700 ${Math.max(7,8*scale)}px Inter, system-ui, sans-serif`;ctx.fillText(n.title,x,y-1*scale);ctx.fillStyle='#7890a8';ctx.font=`600 ${Math.max(6,6.5*scale)}px Inter, system-ui, sans-serif`;ctx.fillText(n.sub,x,y+9*scale)});
  }
  function pointer(e){const r=canvas.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top}}
  canvas.addEventListener('pointerdown',e=>{drag=true;canvas.setPointerCapture(e.pointerId);const p=pointer(e);sx=p.x;sy=p.y;startOx=ox;startOy=oy});
  canvas.addEventListener('pointermove',e=>{if(!drag)return;const p=pointer(e);ox=startOx+(p.x-sx)/scale;oy=startOy+(p.y-sy)/scale;draw()});
  canvas.addEventListener('pointerup',()=>drag=false);canvas.addEventListener('pointercancel',()=>drag=false);
  canvas.addEventListener('wheel',e=>{e.preventDefault();const p=pointer(e);const before=[(p.x-canvas.clientWidth/2)/scale-ox,(p.y-canvas.clientHeight/2)/scale-oy];scale=Math.max(.55,Math.min(1.8,scale*(e.deltaY<0?1.08:.92)));const after=[(p.x-canvas.clientWidth/2)/scale,(p.y-canvas.clientHeight/2)/scale];ox+=before[0]-after[0];oy+=before[1]-after[1];draw()},{passive:false});
  const reset=document.getElementById('roadmap-reset');if(reset)reset.addEventListener('click',fit);window.addEventListener('resize',resize);resize();
})();

document.querySelectorAll('.job-head').forEach(h=>h.addEventListener('click',()=>h.closest('.job').classList.toggle('open')));
