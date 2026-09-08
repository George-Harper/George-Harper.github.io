/*
 * George Harper Portfolio — Canvas Animation
 *
 * Animation is intentionally always enabled.
 * This avoids the previous prefers-reduced-motion check preventing
 * the Byrne-style moving hexagons and roadmap lines from rendering.
 */

(function(){
  // Animated full-page hexagonal background, matching the original visual language.
  const bg = document.createElement('canvas');
  bg.id = 'hex-canvas';
  bg.setAttribute('aria-hidden','true');
  document.body.prepend(bg);
  const bctx = bg.getContext('2d');
  let bw=0,bh=0,bdpr=1,hexes=[];
  const rand=(a,b)=>Math.random()*(b-a)+a;
  function resizeBg(){
    bdpr=window.devicePixelRatio||1; bw=innerWidth; bh=innerHeight;
    bg.width=bw*bdpr; bg.height=bh*bdpr; bg.style.width=bw+'px'; bg.style.height=bh+'px';
    hexes=[];
    const spacing=88, rowH=76;
    for(let y=-rowH;y<bh+rowH;y+=rowH){
      const row=Math.round(y/rowH); const offset=(row%2)*44;
      for(let x=-spacing;x<bw+spacing;x+=spacing){
        hexes.push({x:x+offset+rand(-5,5),y:y+rand(-4,4),r:25+rand(-2,2),phase:rand(0,Math.PI*2),speed:rand(.0008,.0018),drift:rand(2.0,5.5),pulseSpeed:rand(.0008,.0018)});
      }
    }
  }
  function hexPath(c,x,y,r){
    c.beginPath(); for(let i=0;i<6;i++){const a=Math.PI/6+i*Math.PI/3; const px=x+Math.cos(a)*r,py=y+Math.sin(a)*r; i?c.lineTo(px,py):c.moveTo(px,py)} c.closePath();
  }
  function drawBg(t){
    const s=bdpr;bctx.setTransform(s,0,0,s,0,0);bctx.clearRect(0,0,bw,bh);bctx.fillStyle='#07111b';bctx.fillRect(0,0,bw,bh);
    for(const h of hexes){
      const drift=Math.sin(t*h.speed+h.phase)*h.drift;
      const pulse=.28+.42*(.5+.5*Math.sin(t*h.pulseSpeed+h.phase));
      hexPath(bctx,h.x+drift,h.y+drift*.5,h.r);
      bctx.lineWidth=1;bctx.strokeStyle=`rgba(19,89,126,${pulse})`;bctx.stroke();
    }
    requestAnimationFrame(drawBg);
  }
  resizeBg(); window.addEventListener('resize',resizeBg); drawBg(0);

  const canvas=document.getElementById('roadmap');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');

  // Interactive career roadmap. Each node has a modal with more detail.
  const nodes=[
    {x:-360,y:0,r:34,title:'King Charles I School',sub:'GCSEs · BTEC Sport',tone:'base',detail:{title:'King Charles I School',eyebrow:'Secondary Education',body:'Completed secondary education at King Charles I School, including 5 GCSEs with English and Maths, plus a BTEC in Sport.'}},
    {x:-205,y:-70,r:36,title:'Halesowen College',sub:'IT · 2018–2021',tone:'blue',detail:{title:'Halesowen College',eyebrow:'IT Education',body:'Studied OCR Cambridge Technical qualifications in IT, progressing from Level 2 to Level 3 before completing an HNC in Computing.'}},
    {x:-45,y:5,r:36,title:'Cloud Top Technology',sub:'IT Support · 2021–22',tone:'green',detail:{title:'Cloud Top Technology',eyebrow:'IT Support Engineer · Sep 2021 – Feb 2022',body:'Built practical experience supporting clients, setting up Microsoft 365 tenants, configuring DNS and shared mailboxes, creating SharePoint and Teams environments, implementing MFA and researching technical topics for the team.',bullets:['Microsoft 365 tenant setup and administration','DNS, shared mailboxes, SharePoint and Teams','Device setup and Office application support','MFA implementation and customer support']}},
    {x:125,y:-65,r:37,title:'OGL / Wavenet',sub:'1st → 2nd Line · 2022–25',tone:'green',detail:{title:'OGL Computer / Wavenet',eyebrow:'1st Line & 2nd Line Support Engineer · May 2022 – Mar 2025',body:'Started in 1st Line support and progressed to 2nd Line Engineer in 2024, developing broad experience across end-user support, Microsoft 365, hardware, networking and service management.',bullets:['First and second-line IT support','Microsoft 365, SharePoint, OneDrive and Teams','Hardware, printers, scanners and peripherals','Remote support, documentation and incident management']}},
    {x:295,y:5,r:37,title:'Telent',sub:'NOC Engineer · 2025',tone:'red',detail:{title:'Telent Technology Services',eyebrow:'NOC Engineer · Apr 2025 – Sep 2025',body:'Worked in a Network Operations Centre monitoring critical infrastructure, responding to incidents and helping maintain reliability and SLAs.',bullets:['SolarWinds, SCOM and Squared Up monitoring','Network and infrastructure troubleshooting','ServiceNow incident and request management','Trend analysis, maintenance and escalation']}},
    {x:465,y:-65,r:38,title:'Feridax',sub:'IT Assistant · 2025–26',tone:'green',detail:{title:'Feridax (1957) Ltd',eyebrow:'IT Assistant · Oct 2025 – Feb 2026',body:'Worked alongside the Head of IT in a small internal team, covering Microsoft 365, Azure, Intune, business systems, hardware and process improvement.',bullets:['Microsoft 365 and Azure administration','Intune, MDM and Conditional Access','Business Central and Magento support','PowerShell automation and product-data web scraping']}},
    {x:625,y:5,r:39,title:'Forest Garden',sub:'IT Support Engineer · 2026',tone:'green',detail:{title:'Forest Garden LTD',eyebrow:'IT Support Engineer · Apr 2026 – Jul 2026',body:'Worked in a small internal IT team across systems administration, endpoint management, cybersecurity, automation and end-user support.',bullets:['Microsoft 365, AD, Exchange, Teams and SharePoint','Intune and device lifecycle management','Microsoft Defender improvement work','PowerShell and Intune automation','Documentation, Freshservice and Jira Service Management research']}},
    {x:300,y:120,r:32,title:'PowerShell',sub:'Automation',tone:'blue',detail:{title:'PowerShell & Automation',eyebrow:'Technical Focus',body:'A recurring theme across my roles has been using PowerShell and automation to reduce repetitive administration, improve consistency and free up time for higher-value support work.'}},
    {x:470,y:125,r:32,title:'Cybersecurity',sub:'Defender · MFA · CA',tone:'blue',detail:{title:'Cybersecurity',eyebrow:'Technical Focus',body:'Hands-on experience with Microsoft Defender, MFA, Conditional Access, phishing awareness, device compliance and access controls.'}}
  ];

  const links=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,8],[5,7],[4,7],[3,7]];
  let scale=1,ox=0,oy=0,drag=false,sx=0,sy=0,startOx=0,startOy=0,animStart=performance.now(),moved=false;
  const dpr=()=>window.devicePixelRatio||1;

  function resize(){const r=canvas.getBoundingClientRect();canvas.width=Math.max(1,r.width*dpr());canvas.height=Math.max(1,r.height*dpr());}
  function fit(){scale=1;ox=0;oy=0;}
  function worldToScreen(x,y){return [canvas.clientWidth/2+(x+ox)*scale,canvas.clientHeight/2+(y+oy)*scale]}
  function hitNode(px,py){
    let hit=null,best=Infinity;
    nodes.forEach(n=>{const [x,y]=worldToScreen(n.x,n.y);const d=Math.hypot(px-x,py-y);const rr=Math.max(24,n.r*scale+6);if(d<=rr&&d<best){best=d;hit=n;}});
    return hit;
  }
  function draw(t){
    const w=canvas.clientWidth,h=canvas.clientHeight,s=dpr();
    ctx.setTransform(s,0,0,s,0,0);ctx.clearRect(0,0,w,h);
    ctx.fillStyle='#0b1624';ctx.fillRect(0,0,w,h);
    const step=28;ctx.lineWidth=1;ctx.strokeStyle='rgba(90,130,155,.13)';
    for(let x=0;x<w;x+=step){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}
    for(let y=0;y<h;y+=step){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}

    const elapsed=t-animStart;
    // Moving dashed connections + travelling light, matching the original's animated roadmap feel.
    links.forEach(([ai,bi],li)=>{
      const a=nodes[ai],b=nodes[bi];
      const ap=worldToScreen(a.x,a.y),bp=worldToScreen(b.x,b.y);
      ctx.save();
      ctx.setLineDash([7,8]);
      ctx.lineDashOffset=-(elapsed*.065+li*20);
      ctx.lineWidth=1.2;
      ctx.strokeStyle=b.tone==='red'?'rgba(255,74,84,.65)':b.tone==='green'?'rgba(32,220,150,.55)':'rgba(22,201,255,.48)';
      ctx.beginPath();ctx.moveTo(ap[0],ap[1]);ctx.lineTo(bp[0],bp[1]);ctx.stroke();
      ctx.restore();
      {
        const p=((elapsed*.00042+li*.11)%1),px=ap[0]+(bp[0]-ap[0])*p,py=ap[1]+(bp[1]-ap[1])*p;
        ctx.beginPath();ctx.arc(px,py,2.2,0,Math.PI*2);ctx.fillStyle=b.tone==='red'?'#ff5862':'#28d9ff';ctx.shadowBlur=10;ctx.shadowColor=ctx.fillStyle;ctx.fill();ctx.shadowBlur=0;
      }
    });
    nodes.forEach((n,i)=>{
      const bob=Math.sin(elapsed*.0013+i*.75)*3.5; const [x,y]=worldToScreen(n.x,n.y+bob);
      if(x<-90||x>w+90||y<-90||y>h+90)return;
      const pulse=1+Math.sin(elapsed*.0022+i)*.055; const rr=n.r*scale*pulse;
      const stroke=n.tone==='red'?'#ff4d58':n.tone==='green'?'#16d89b':n.tone==='blue'?'#159fe0':'#1f3448';
      ctx.beginPath();ctx.arc(x,y,rr,0,Math.PI*2);ctx.fillStyle=i===0||n.tone==='base'?'#101c2b':'#0d202c';ctx.fill();
      ctx.lineWidth=1.3;ctx.strokeStyle=stroke;ctx.shadowBlur=16;ctx.shadowColor=stroke;ctx.stroke();ctx.shadowBlur=0;
      ctx.fillStyle='#dce8f5';ctx.textAlign='center';ctx.font=`800 ${Math.max(9,10.5*scale)}px Inter,system-ui,sans-serif`;
      const title=n.title.length>18?n.title.replace(' / ',' /\n'):n.title;
      const parts=title.split('\n'); parts.forEach((line,j)=>ctx.fillText(line,x,y+(j-(parts.length-1)/2)*12*scale));
      ctx.fillStyle='#7890a8';ctx.font=`650 ${Math.max(7.5,8*scale)}px Inter,system-ui,sans-serif`;ctx.fillText(n.sub,x,y+15*scale);
    });
    requestAnimationFrame(draw);
  }
  function pointer(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
  canvas.addEventListener('pointerdown',e=>{drag=true;moved=false;canvas.setPointerCapture(e.pointerId);const p=pointer(e);sx=p.x;sy=p.y;startOx=ox;startOy=oy});
  canvas.addEventListener('pointermove',e=>{if(!drag)return;const p=pointer(e);if(Math.hypot(p.x-sx,p.y-sy)>5)moved=true;ox=startOx+(p.x-sx)/scale;oy=startOy+(p.y-sy)/scale});
  canvas.addEventListener('pointerup',e=>{if(!moved){const p=pointer(e),hit=hitNode(p.x,p.y);if(hit)openRoadmapModal(hit.detail)}drag=false});
  canvas.addEventListener('pointercancel',()=>drag=false);
  canvas.addEventListener('wheel',e=>{e.preventDefault();const p=pointer(e);const before=[(p.x-canvas.clientWidth/2)/scale-ox,(p.y-canvas.clientHeight/2)/scale-oy];scale=Math.max(.55,Math.min(1.8,scale*(e.deltaY<0?1.08:.92)));const after=[(p.x-canvas.clientWidth/2)/scale,(p.y-canvas.clientHeight/2)/scale];ox+=before[0]-after[0];oy+=before[1]-after[1]},{passive:false});
  canvas.addEventListener('mousemove',e=>{canvas.style.cursor=hitNode(pointer(e).x,pointer(e).y)?'pointer':'grab'});
  const reset=document.getElementById('roadmap-reset');if(reset)reset.addEventListener('click',fit);
  window.addEventListener('resize',resize);resize();draw(animStart);

  function openRoadmapModal(detail){
    if(!detail)return;
    let modal=document.getElementById('roadmap-modal');
    if(!modal){
      modal=document.createElement('div');modal.id='roadmap-modal';modal.className='roadmap-modal';
      modal.innerHTML='<div class="roadmap-modal-backdrop" data-close></div><div class="roadmap-dialog" role="dialog" aria-modal="true" aria-labelledby="roadmap-modal-title"><button class="roadmap-close" type="button" aria-label="Close" data-close>×</button><div class="roadmap-eyebrow"></div><h2 id="roadmap-modal-title"></h2><div class="roadmap-body"></div></div>';
      document.body.appendChild(modal);
      modal.addEventListener('click',e=>{if(e.target.hasAttribute('data-close'))closeRoadmapModal()});
      document.addEventListener('keydown',e=>{if(e.key==='Escape')closeRoadmapModal()});
    }
    modal.querySelector('.roadmap-eyebrow').textContent=detail.eyebrow||'';
    modal.querySelector('#roadmap-modal-title').textContent=detail.title||'';
    const body=modal.querySelector('.roadmap-body');body.innerHTML='';
    if(detail.body){const p=document.createElement('p');p.textContent=detail.body;body.appendChild(p)}
    if(detail.bullets){const ul=document.createElement('ul');detail.bullets.forEach(x=>{const li=document.createElement('li');li.textContent=x;ul.appendChild(li)});body.appendChild(ul)}
    modal.classList.add('show');document.body.classList.add('modal-open');modal.querySelector('.roadmap-close').focus();
  }
  function closeRoadmapModal(){const modal=document.getElementById('roadmap-modal');if(modal){modal.classList.remove('show');document.body.classList.remove('modal-open')}}
})();

document.querySelectorAll('.job-head').forEach(h=>h.addEventListener('click',()=>h.closest('.job').classList.toggle('open')));
