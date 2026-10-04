// ONION ACADEMY v3 — portal engine. Vanilla, offline-first.
(function(){
"use strict";
try{window.__engine='v8';window.__errs=[];
window.__renderErr=function(){try{var errs=window.__errs;var b=document.getElementById('engbadge');if(!b||!errs.length)return;var e=errs[errs.length-1];var loc=((e.f||'').split('/').pop()||'?')+':'+(e.l||'?')+':'+(e.c||'?');
var ext=(e.m==='Script error.'&&!e.f&&!e.l&&!e.c);
b.style.cssText='position:fixed;left:8px;bottom:8px;z-index:200;background:'+(ext?'#7a5410':'#c22e2e')+';color:#fff;font:700 11px/1.5 monospace;padding:8px 12px;border-radius:8px;max-width:92vw;cursor:pointer;white-space:pre-wrap;word-break:break-all';
if(b.dataset.full==='1'){b.textContent=errs.length+' ERRORS, latest:\n'+(e.m||'unknown')+'\n'+(e.f||'?')+' : '+(e.l||'?')+' : '+(e.c||'?')+'\n'+String(e.st||'').split('\n').slice(0,4).join('\n')+'\n(tap to collapse)';}
else{b.textContent=ext?('Extension noise ('+errs.length+'): course engine healthy — tap to dismiss'):('ENGINE ERROR ('+errs.length+'): '+(e.m||'unknown')+' @ '+loc+' — tap for details');}}catch(_){}};
window.__pushErr=function(m,f,l,c,st){try{if(window.__extQuiet&&m==='Script error.'&&!f&&!l&&!c){window.__errs.push({m:m,f:f,l:l,c:c,st:st});return;}window.__errs.push({m:m,f:f,l:l,c:c,st:st});var b=document.getElementById('engbadge');if(!b){b=document.createElement('div');b.id='engbadge';b.setAttribute('role','alert');try{document.body.appendChild(b);}catch(_){return;}b.onclick=function(){try{var errs=window.__errs;var last=errs[errs.length-1];if(last&&last.m==='Script error.'&&!last.f&&!last.l&&!last.c){window.__extQuiet=1;try{b.remove();}catch(_){}return;}}catch(_){}b.dataset.full=b.dataset.full==='1'?'':'1';window.__renderErr();};}window.__renderErr();}catch(_){}};
window.addEventListener('error',function(e){window.__pushErr(e.message,e.filename,e.lineno,e.colno,e.error&&e.error.stack);});
window.addEventListener('unhandledrejection',function(e){var r=e.reason;window.__pushErr('rejected: '+((r&&r.message)||r),'',0,0,r&&r.stack);});
}catch(_){}
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const LS={get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v);}catch(e){return d;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}};

/* ---------- nav + lang ---------- */
const here=(location.pathname.split('/').pop()||'index.html').split('?')[0].split('#')[0];
$$('nav.pages a').forEach(a=>{if(a.getAttribute('href')===here)a.classList.add('on');});
function setLang(l){document.body.dataset.lang=l;LS.set('oa-lang',l);$$('.lang button').forEach(x=>x.classList.toggle('on',x.dataset.l===l));}
$$('.lang button').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.l)));
setLang(LS.get('oa-lang','both'));

/* ---------- XP / progress model ---------- */
const LEVELS=["L1","L2","L3","L4","L5","L6"];
const CHAPTERS=["c1","c2","c3","c4","c5","c6"];
let xp=LS.get('oa-xp',0), doneLv=LS.get('oa-levels-done',{}), doneCh=LS.get('oa-notes-done',{});
const levelXP={L1:100,L2:120,L3:120,L4:150,L5:150,L6:160};
function rankName(){if(xp>=700)return"Diamond";if(xp>=550)return"Gold";if(xp>=350)return"Silver";if(xp>=150)return"Bronze";return"Sprout";}
function refreshHUD(){
  const n=LEVELS.filter(k=>doneLv[k]).length, cn=CHAPTERS.filter(k=>doneCh[k]).length;
  const pct=Math.round((n/6)*100);
  $$('#xpVal').forEach(e=>e.textContent=xp+" XP");
  $$('#rankVal').forEach(e=>e.textContent=rankName());
  $$('#lvlCount').forEach(e=>e.textContent=n+" / 6 levels");
  $$('#noteCount').forEach(e=>e.textContent=cn+" / 6 notes");
  $$('#pathfill').forEach(e=>e.style.width=pct+'%');
  $$('#pathPct').forEach(e=>e.textContent=pct+'%');
  const gate=$('#examGate');
  if(gate){const open=n>=6;gate.style.opacity=open?'1':'.5';gate.style.pointerEvents=open?'auto':'none';gate.textContent=open?'Enter Final Exam':'Final Exam locked — finish 6 levels';}
}
function addXP(n){xp+=n;LS.set('oa-xp',xp);refreshHUD();}
try{window.__addXP=addXP;}catch(e){}
function toast(t){const el=$('#toast');if(!el)return;el.textContent=t;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),1800);}
function stamp(ok,word){const s=$('#stamp');if(!s)return;s.classList.remove('show','bad');void s.offsetWidth;$('#stampTxt').textContent=word;s.classList.toggle('bad',!ok);s.classList.add('show');setTimeout(()=>s.classList.remove('show'),750);}
document.addEventListener('click',e=>{if(e.target.closest?.('.opt.picked-bad')){document.body.classList.remove('rumble');void document.body.offsetWidth;document.body.classList.add('rumble');setTimeout(()=>document.body.classList.remove('rumble'),350);}});

/* ---------- search ---------- */
const IDX=[
 {p:'learn.html',t:'Notes — full course',k:'signal analog digital binary adc dac transmission notes learn'},
 {p:'levels.html',t:'Levels 1-6 — game path',k:'levels xp mission unlock quiz game'},
 {p:'lab.html',t:'Lab — waves + bits',k:'lab frequency amplitude oscilloscope simulator hear freeze'},
 {p:'quiz.html',t:'Practice quiz + flashcards',k:'quiz mcq flashcards practice score'},
 {p:'exam.html',t:'Final exam — timed',k:'exam timer certificate grade'},
 {p:'learn.html#c1',t:'Ch1: What is a signal?',k:'signal information sound voltage time'},
 {p:'learn.html#c2',t:'Ch2: Analog',k:'analog sine smooth peak valley amplitude continuous'},
 {p:'learn.html#c3',t:'Ch3: Digital',k:'digital square high low discrete switch'},
 {p:'learn.html#c4',t:'Ch4: Binary',k:'binary bit byte nibble 2n combinations'},
 {p:'learn.html#c5',t:'Ch5: ADC DAC',k:'adc dac sampling microphone speaker record play'},
 {p:'learn.html#c6',t:'Ch6: Transmission',k:'transmission source channel noise distortion telephone radio fibre'},
];
const si=$('#sin'),drop=$('#sdrop');
if(si){si.addEventListener('input',()=>{const q=si.value.trim().toLowerCase();
  if(q.length<2){drop.style.display='none';return;}
  const m=IDX.filter(x=>(x.t+' '+x.k).toLowerCase().includes(q));
  drop.innerHTML=m.length?m.map(x=>`<a href="${x.p}"><b>${x.t}</b><br><small>${x.k}</small></a>`).join(''):'<div style="padding:10px">No match. Try: analog, binary, adc, noise…</div>';
  drop.style.display='block';});
  document.addEventListener('click',e=>{if(!e.target.closest('.searchwrap'))drop.style.display='none';});}

/* ---------- typing ---------- */
try{const t=$('#typeline');if(t){const s='> sampling reality… 0 1 0 1 1 0 — signal locked.';let i=0;(function tick(){t.innerHTML=s.slice(0,i)+'<span class="caret"></span>';if(i++<=s.length)setTimeout(tick,32);})();}}catch(e){}

/* ---------- reveal ---------- */
try{
  if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}}),{threshold:.1});
  $$('.panel,.chapter,.lvl,.q,.step-card').forEach(el=>{el.classList.add('rv');io.observe(el);});
  setTimeout(()=>$$('.rv:not(.in)').forEach(el=>el.classList.add('in')),1600);}
}catch(e){}

/* ---------- scopes (canvas art) ---------- */
function fit(c,h){const d=Math.min(2,devicePixelRatio||1);const r=()=>{if(!c.clientWidth)return;c.width=c.clientWidth*d;c.height=h*d;};r();addEventListener('resize',r);}
function sine(x,w,h,t,f,a,col){x.strokeStyle=col;x.lineWidth=Math.max(2,w/220);x.beginPath();for(let px=0;px<=w;px+=3){const y=h/2+Math.sin(px/w*Math.PI*2*f+t)*a;px===0?x.moveTo(px,y):x.lineTo(px,y);}x.stroke();
 x.strokeStyle='rgba(255,255,255,.22)';x.lineWidth=1;x.beginPath();x.moveTo(0,h/2);x.lineTo(w,h/2);x.stroke();}
function square(x,w,h,t,f,a,col){x.strokeStyle=col;x.lineWidth=Math.max(2,w/220);x.beginPath();for(let px=0;px<=w;px+=3){const ph=(((px/w*f+t/6.283)%1)+1)%1;const y=h/2+(ph<.5?-a:a);px===0?x.moveTo(px,y):x.lineTo(px,y);}x.stroke();}
let __pt=0;window.__frozen=false;
function loop(ts){const t=(__pt||ts)/1000;__pt=ts;
 if(!window.__frozen){
  const jobs=[['#heroA',{m:'both'}],['#anaScope',{m:'sine'}],['#cmpA',{m:'sine'}],['#cmpD',{m:'sq'}],['#labScope',{lab:1}],['#chainScope',{m:'sine',f:3}],['#txScope',{m:'both'}]];
  jobs.forEach(([sel,o])=>{const c=$(sel);if(!c||!c.width)return;const x=c.getContext('2d');if(!x)return;const w=c.width,h=c.height;x.clearRect(0,0,w,h);
   if(o.lab){const f=parseFloat($('#f')?.value||2),pc=parseFloat($('#a')?.value||55)/100*(h*.36),sp=parseFloat($('#s')?.value||2.2);
    const mode=$('.seg button.on')?.dataset.t||'analog';
    if(mode!=='digital')sine(x,w,h,t*sp,f,pc,'#d4ff3f');if(mode!=='analog')square(x,w,h,t*sp,f,pc||h*.2,'#ff6b2c');return;}
   if(o.m==='both'){sine(x,w,h,t*2,2,h*.28,'#d4ff3f');square(x,w,h,t*2,2,h*.18,'#ff6b2c');}
   else if(o.m==='sq')square(x,w,h,t*2,2,h*.28,'#ff6b2c');else sine(x,w,h,t*2,o.f||2,h*.3,'#5df2ff');
   x.fillStyle='rgba(255,255,255,.55)';x.font=`${Math.round(h/17)}px monospace`;x.fillText('TIME →',w-80,h-10);});
  const bw=$('#bulbScope');if(bw&&bw.width){const x=bw.getContext('2d');if(x){x.clearRect(0,0,bw.width,bw.height);const on=$('#sw')?.classList.contains('on');square(x,bw.width,bw.height,on?1.6:0,1,bw.height*.3,on?'#ffc53d':'#3a4160');}}
 }
 requestAnimationFrame(loop);}
$$('canvas.screen,canvas#bulbScope,canvas#anaScope,canvas#cmpA,canvas#cmpD,canvas#chainScope,canvas#txScope').forEach(c=>fit(c,c.id==='labScope'?260:c.id==='heroA'?240:170));
requestAnimationFrame(loop);
$$('.seg button').forEach(b=>b.addEventListener('click',()=>{$$('.seg button').forEach(x=>x.classList.remove('on'));b.classList.add('on');}));
const sw=$('#sw');if(sw)sw.addEventListener('click',()=>{const on=sw.classList.toggle('on');sw.setAttribute('aria-checked',on);$('#bulb')?.classList.toggle('lit',on);const s=$('#bstate');if(s)s.textContent=on?'ON — HIGH / 1, 5V':'OFF — LOW / 0, 0V';});

/* ---------- audio ---------- */
let AC=null,osc=null;
function tone(type,freq){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();stopTone();osc=AC.createOscillator();const g=AC.createGain();osc.type=type;osc.frequency.value=Math.min(880,110*freq);g.gain.value=.08;osc.connect(g);g.connect(AC.destination);osc.start();osc._g=g;}catch(e){}}
function stopTone(){try{osc?.stop();}catch(e){}osc=null;}
$$('[data-hear]').forEach(b=>b.addEventListener('click',()=>{const on=b.classList.toggle('live');$$('[data-hear]').forEach(x=>{if(x!==b)x.classList.remove('live');});
 if(!on){stopTone();b.textContent=b.dataset.label;return;}tone(b.dataset.hear,parseFloat($('#f')?.value||2));b.textContent='■ STOP';}));
$('#freeze')?.addEventListener('click',e=>{const on=e.currentTarget.classList.toggle('live');e.currentTarget.textContent=on?'▶ RESUME':'❚❚ FREEZE';window.__frozen=on;});

/* ---------- binary explorers ---------- */
function wireBits(boxId,boutId,doutId,n){const box=$('#'+boxId);if(!box)return;const bits=$$('.bit',box);let v=Array(n).fill(0);
 const r=()=>{bits.forEach((b,i)=>{b.textContent=v[i];b.classList.toggle('on',!!v[i]);});const s=v.join('');let d=0;v.forEach(x=>d=d*2+x);
  if(boutId&&$('#'+boutId))$('#'+boutId).textContent=s;if(doutId&&$('#'+doutId))$('#'+doutId).textContent=d;
  const tgt=$('#'+boxId+'Target');if(tgt){const goal=+tgt.dataset.goal;if(d===goal){tgt.innerHTML='Goal reached: <b>'+goal+'</b> — well done.';}else tgt.innerHTML='Build decimal <b>'+goal+'</b> — now at <b>'+d+'</b>';}};
 bits.forEach((b,i)=>b.addEventListener('click',()=>{v[i]=v[i]?0:1;r();}));r();}
wireBits('bits','bout','dout',4);wireBits('bitsL4','boutL4','doutL4',4);wireBits('bitsLab','boutLab','doutLab',4);

/* ---------- notes complete buttons ---------- */
$$('[data-note-done]').forEach(b=>{const k=b.dataset.noteDone;
 const paint=()=>b.textContent=doneCh[k]?'✓ Note done — undo':'Mark note done';
 paint();b.addEventListener('click',()=>{doneCh[k]=!doneCh[k];LS.set('oa-notes-done',doneCh);paint();refreshHUD();toast(doneCh[k]?'Note saved ✓':'Undone');
  $$('.toc a').forEach(a=>{const id=a.getAttribute('href')?.slice(1);if(id&&doneCh[id])a.classList.add('read');});});});
$$('.toc a').forEach(a=>{const id=a.getAttribute('href')?.slice(1);if(id&&doneCh[id])a.classList.add('read');});

/* ---------- levels engine ---------- */
const GATE={
 L1:[["What is a signal?",["A quantity changing with time, carrying info","Only sound","A program","A battery"],0,"Signal = change + information."],
     ["Voice shaking air is…",["Noise","A signal","A byte","An error"],1,"Shaking pattern carries the message."],
     ["Which is NOT a signal?",["Changing voltage","Wobbling air","A fixed 5V that never changes","Radio wave"],2,"No change over time = no signal."]],
 L2:[["Analog means…",["Only 0/1","Continuous — any value in range","Frozen value","Digital packets"],1,"Range भित्र जुनसुकै मान।"],
     ["Analog wave looks…",["Square steps","Smooth sine 〰","Dots","Flat zero"],1,"Smooth continuous."],
     ["Amplitude is…",["Speed","Wave height = strength","Noise","Bit count"],1,"Bigger swing = louder/stronger."]],
 L3:[["Digital uses…",["Infinite values","0 and 1 only","Only sine","Any voltage"],1,"HIGH=1, LOW=0."],
     ["Digital wave looks…",["Smooth sine","Square steps ▓","Circle","Random"],1,"Steps, not smooth."],
     ["ON bulb = …",["LOW / 0","HIGH / 1 · 5V","Noise","ADC"],1,"ON = HIGH = 1."]],
 L4:[["1 byte =",["4 bits","8 bits","16 bits","2 bits"],1,"8 bits = 1 byte."],
     ["2³ = ?",["6","8","9","5"],1,"n bits → 2ⁿ."],
     ["Binary 1010 =",["5","8","10","12"],2,"8+2 = 10."]],
 L5:[["ADC does…",["Analog to Digital","Digital to Analog","Deletes files","Charges battery"],0,"A to D = record in."],
     ["DAC does…",["Analog to Digital","Digital to Analog","Prints","Scans"],1,"D to A = play out."],
     ["Mic → ? → PC",["DAC","ADC","Speaker","Antenna"],1,"Sound sampled into numbers."]],
 L6:[["Noise is…",["Useful message","Unwanted extra signal","A bit","An amplifier"],1,"Junk added on the way."],
     ["Digital wins because…",["It is louder","Regenerable + error-checkable","It needs no channel","It is analog"],1,"Exact copies + fix."],
     ["Correct order?",["Source→channel→decode","Source→encode→channel→decode","Noise→source→ear","DAC→ADC→mic"],1,"Same skeleton everywhere."]]
};
$$('.lvl').forEach(card=>{
 const id=card.dataset.level;const idx=LEVELS.indexOf(id);
 const locked=idx>0&&!doneLv[LEVELS[idx-1]];
 const tag=$('.status',card);
 const paint=()=>{card.classList.toggle('locked',locked&&!doneLv[id]);card.classList.toggle('done',!!doneLv[id]);
   if(tag)tag.textContent=doneLv[id]?'DONE':(locked?'LOCKED':'OPEN');
   const btn=$('[data-open]',card);if(btn){btn.textContent=doneLv[id]?'Review level':(locked?'Locked':'Start mission');btn.disabled=locked&&!doneLv[id];}};
 paint();
 $('[data-open]',card)?.addEventListener('click',()=>{if(locked&&!doneLv[id]){toast('Finish the previous level first.');return;}card.classList.toggle('open');});
 // build gate quiz
 const gbox=$('[data-gate]',card);if(!gbox)return;const qs=GATE[id]||[];let ans=Array(qs.length).fill(null);
 gbox.innerHTML=qs.map((q,i)=>`<div class="q" id="${id}q${i}"><span class="qtag">Q${i+1}</span><b>${q[0]}</b>`+q[1].map((o,j)=>`<button type="button" class="opt" data-i="${i}" data-j="${j}">${'ABCD'[j]} · ${o}</button>`).join('')+`<div class="why"></div></div>`).join('');
 gbox.addEventListener('click',e=>{const b=e.target.closest('.opt');if(!b||b.disabled)return;
  const i=+b.dataset.i,j=+b.dataset.j,q=qs[i];if(ans[i]!==null)return;ans[i]=j;const ok=j===q[2];
  const box=$('#'+id+'q'+i),opts=$$('.opt',box),w=$('.why',box);
  opts.forEach(x=>{x.disabled=true;if(+x.dataset.j!==q[2]&&x!==b)x.classList.add('dim');});
  b.classList.add(ok?'picked-ok':'picked-bad');if(!ok)opts[q[2]].classList.add('show-ok','picked-ok');
  box.classList.add(ok?'locked-ok':'locked-bad');w.style.display='block';w.innerHTML=(ok?'Correct. ':('Incorrect — answer: <b>'+q[1][q[2]]+'</b>. '))+q[3];
  if(ok){stamp(true,'CORRECT');}else{stamp(false,'WRONG');}
  if(ans.every(a=>a!==null)){const right=ans.filter((a,k)=>a===qs[k][2]).length;
   const msg=$('[data-gatemsg]',card);
   if(right===qs.length){if(!doneLv[id]){doneLv[id]=1;LS.set('oa-levels-done',doneLv);addXP(levelXP[id]||100);}
    if(msg)msg.innerHTML=`<b>Level clear. +${levelXP[id]} XP.</b> Next level unlocked.`;
    toast(`Level ${id} clear. +${levelXP[id]} XP`);stamp(true,'CLEAR!');refreshHUD();try{window.__burstAtEl(card)}catch(e){}
    $$('.lvl').forEach(c2=>{const id2=c2.dataset.level;const ix=LEVELS.indexOf(id2);const lk=ix>0&&!doneLv[LEVELS[ix-1]];
     c2.classList.toggle('locked',lk&&!doneLv[id2]);const st=$('.status',c2);if(st)st.textContent=doneLv[id2]?'DONE':(lk?'LOCKED':'OPEN');
     const bo=$('[data-open]',c2);if(bo){bo.disabled=lk&&!doneLv[id2];bo.textContent=doneLv[id2]?'Review level':(lk?'Locked':'Start mission');}});
   }else{if(msg)msg.innerHTML=`You got <b>${right}/${qs.length}</b>. <button type="button" class="btn dark" data-retry style="margin-top:8px">Retry gate</button>`;}
  }});
 gbox.addEventListener('click',e=>{const r=e.target.closest('[data-retry]');if(!r)return;ans=Array(qs.length).fill(null);
  $$('.q',gbox).forEach(bx=>{bx.classList.remove('locked-ok','locked-bad');});$$('.opt',gbox).forEach(o=>{o.disabled=false;o.classList.remove('picked-ok','picked-bad','show-ok','dim');});$$('.why',gbox).forEach(w=>{w.style.display='none';w.innerHTML='';});$('[data-gatemsg]',card).innerHTML='';});
});

/* ---------- main quiz (practice) + exam ---------- */
const QB=[
 ["What is a signal?",["A physical quantity changing with time, carrying information","Only sound","Only current","A program"],0,"Time-varying quantity with info."],
 ["Which is analog?",["Binary file","Human voice wave","1010","USB packets"],1,"Voice is continuous."],
 ["Analog wave looks…",["Square steps","Smooth / sine","Dots only","Flat 0"],1,"Smooth continuous."],
 ["Digital uses…",["Infinite values","0 and 1","Only negatives","Only sine"],1,"Binary HIGH/LOW."],
 ["HIGH means…",["0","1 · high voltage","No signal","Noise"],1,"HIGH=1, LOW=0."],
 ["One bit is…",["0 or 1","0–9","A–Z","Any voltage"],0,"Smallest unit."],
 ["1 byte =",["4 bits","8 bits","1024 bits","1 bit"],1,"8 bits."],
 ["4 bits =",["Byte","Nibble","KB","Bit"],1,"Nibble."],
 ["n bits → combos?",["2×n","n²","2ⁿ","n!"],2,"2 to the n."],
 ["3 bits → ?",["6","8","9","16"],1,"2³=8."],
 ["1010 in decimal?",["5","8","10","12"],2,"8+2=10."],
 ["0101 in decimal?",["4","5","6","7"],1,"4+1=5."],
 ["ADC =",["Analog to Digital Converter","Audio Data Cable","Auto Digital Computer","Analog Device Control"],0,"Analog→Digital. Recording."],
 ["DAC =",["Data Access Code","Digital to Analog Converter","Direct Analog Current","Disk and CPU"],1,"Digital→Analog. Playback."],
 ["Mic + ADC does…",["Play speaker","Record sound to PC","Print","Charge"],1,"Sound→ADC→storage."],
 ["DAC + speaker does…",["Store photos","Hear digital audio","Type","Email"],1,"Numbers back to sound."],
 ["Digital wave looks…",["Sine","Square / steps","Circle","Dots"],1,"Steps HIGH/LOW."],
 ["Noise is…",["Useful msg","Unwanted extra signal","Binary","Amplifier"],1,"Unwanted disturbance."],
 ["1024 MB =",["1 KB","1 MB","1 GB","1 TB"],2,"1024 MB = 1 GB."],
 ["Why digital for storage?",["Fades fast","Exact copies + error fix","Needs no device","Always analog"],1,"Regenerate + correct."],
 ["Peak of a wave is…",["Bottom point","Top point","Zero line","Noise"],1,"Peak = top (+V), valley = bottom."],
 ["Amplitude tells us…",["Signal strength","Signal color","Bit count","Channel name"],0,"Bigger amplitude = stronger."],
 ["Frequency means…",["How tall","How often it repeats per second","How noisy","How digital"],1,"High freq = crowded wave."],
 ["Distortion is…",["Junk added","Shape bent on the way","A byte","A converter"],1,"Noise = added; distortion = bent."],
 ["Channel example?",["Wire / air / fibre","Only wire","Only exam hall","A bit"],0,"Medium that carries the signal."],
 ["111 in binary weights 4-2-1 means…",["3","7","5","6"],1,"4+2+1 = 7."],
 ["Which device needs DAC?",["Microphone","Speaker playback","Keyboard","Camera sensor"],1,"Numbers → smooth voltage → sound."],
 ["Sampling means…",["Measuring analog height many times/sec","Deleting bits","Drawing circles","Heating wire"],0,"ADC samples then quantizes."],
 ["Regeneration is a superpower of…",["Analog","Digital","Noise","Distortion"],1,"Digital can be rebuilt cleanly."],
 ["Old radio is mostly…",["Digital","Analog","Binary","Packet"],1,"Continuous waves."],
];
function runQuiz(boxSel,qs,{exam=false,timed=false}={}){
 const qb=$(boxSel);if(!qb)return;
 let ans=Array(qs.length).fill(null),right=0,streak=0,best=0,timer=null,left=15*60;
 qb.innerHTML=qs.map((q,i)=>`<div class="q" id="qq${i}"><span class="qtag">Q${i+1} · UNTOUCHED</span><b>${q[0]}</b>`+q[1].map((o,j)=>`<button type="button" class="opt" data-q="${i}" data-j="${j}"><b>${'ABCD'[j]}</b> · ${o}</button>`).join('')+`<div class="why"></div></div>`).join('');
 const hud=()=>{const n=ans.filter(x=>x!==null).length;const hc=$('#hcount'),hs=$('#hscore'),hf=$('#hfill');
  if(hc)hc.textContent=`${n} / ${qs.length} answered`;if(hs)hs.textContent=`${right} right · streak ${streak} · best ${best}`;if(hf)hf.style.width=Math.round(n/qs.length*100)+'%';
  const sc=$('#score');if(sc&&n===qs.length){const p=Math.round(right/qs.length*100);
   sc.textContent=`DONE — ${right}/${qs.length} · ${p}% — `+(p>=90?'Distinction. Excellent work.':p>=70?'Solid pass. One more review.':p>=50?'Narrow pass — revisit converters and binary.':'Below pass — re-read the Notes, then retry.');
   if(timed&&timer){clearInterval(timer);timer=null;}
   if(exam&&n===qs.length){const cert=$('#cert');if(cert){cert.style.display='block';$('#certGrade').textContent=`${right}/${qs.length} · ${p}%`;$('#certRank').textContent=p>=90?'DISTINCTION — DIAMOND':p>=70?'FIRST DIVISION — GOLD':p>=50?'SECOND DIVISION — SILVER':'BELOW PASS — KEEP PRACTISING';cert.scrollIntoView({behavior:'smooth'});try{window.__burstCenter()}catch(e){}}
    if(p>=50)addXP(200);else addXP(40);}}
  const tc=$('#tcount');if(tc&&timed){const m=String(Math.floor(left/60)).padStart(2,'0'),s=String(left%60).padStart(2,'0');tc.textContent=`${m}:${s} remaining`;}};
 qb.addEventListener('click',e=>{const b=e.target.closest('.opt');if(!b||b.disabled)return;
  const qi=+b.dataset.q,ji=+b.dataset.j,q=qs[qi];if(ans[qi]!==null)return;ans[qi]=ji;const ok=ji===q[2];
  const box=$('#qq'+qi),opts=$$(`.opt[data-q="${qi}"]`,qb),w=$('.why',box);
  opts.forEach(x=>{x.disabled=true;if(+x.dataset.j!==q[2]&&x!==b)x.classList.add('dim');});
  b.classList.add(ok?'picked-ok':'picked-bad');if(!ok)opts[q[2]].classList.add('picked-ok','show-ok');
  box.classList.add(ok?'locked-ok':'locked-bad');box.querySelector('.qtag').textContent=`Q${qi+1} · ${ok?'CORRECT':'WRONG'}`;
  w.style.display='block';w.innerHTML=(ok?'Correct. ':'Incorrect — answer: <b>'+q[1][q[2]]+'</b>. ')+q[3];
  if(ok){right++;streak++;best=Math.max(best,streak);stamp(true,['CORRECT','CLEAN','LOCKED IN','PRECISE'][Math.floor(Math.random()*4)]);}else{streak=0;stamp(false,'WRONG');}
  hud();});
 $('#retry')?.addEventListener('click',()=>{ans=Array(qs.length).fill(null);right=0;streak=0;
  $$('.q',qb).forEach((box,i)=>{box.classList.remove('locked-ok','locked-bad');box.querySelector('.qtag').textContent=`Q${i+1} · UNTOUCHED`;});
  $$('.why',qb).forEach(x=>{x.style.display='none';x.innerHTML='';});$$('.opt',qb).forEach(o=>{o.disabled=false;o.classList.remove('picked-ok','picked-bad','show-ok','dim');});
  const cert=$('#cert');if(cert)cert.style.display='none';hud();});
 $('#check')?.addEventListener('click',()=>{qs.forEach((q,i)=>{if(ans[i]!==null)return;ans[i]=-1;
   const box=$('#qq'+i),opts=$$(`.opt[data-q="${i}"]`,qb),w=$('.why',box);
   opts.forEach(x=>{x.disabled=true;if(+x.dataset.j!==q[2])x.classList.add('dim');});opts[q[2]].classList.add('picked-ok','show-ok');
   box.classList.add('locked-bad');box.querySelector('.qtag').textContent=`Q${i+1} · REVEALED`;w.style.display='block';w.innerHTML='Skipped. Correct: <b>'+q[1][q[2]]+'</b>. '+q[3];});hud();});
 if(timed){timer=setInterval(()=>{left--;if(left<=0){clearInterval(timer);timer=null;toast("Time up. Submitting automatically.");
   qs.forEach((q,i)=>{if(ans[i]!==null)return;ans[i]=-1;const box=$('#qq'+i);if(!box)return;const opts=$$(`.opt[data-q="${i}"]`,qb),w=$('.why',box);
    opts.forEach(x=>{x.disabled=true;});opts[q[2]].classList.add('picked-ok','show-ok');w.style.display='block';w.innerHTML='Time up. Correct: <b>'+q[1][q[2]]+'</b>.';});hud();}else hud();},1000);}
 hud();
}
if($('#qbox')&&!$('#examMode'))runQuiz('#qbox',QB.slice(0,20),{});
if($('#examMode')){const pick=[...QB].sort(()=>Math.random()-.5).slice(0,20);runQuiz('#qbox',pick,{exam:true,timed:true});}

/* ---------- flashcards ---------- */
const F=[["Analog signal?","Continuously changing — any value. लगातार बदलिने।"],["Digital signal?","Discrete levels — 0/1."],["1 bit?","One binary digit: 0 or 1."],["1 byte?","8 bits."],["ADC?","Analog → Digital. Record in."],["DAC?","Digital → Analog. Play out."],["HIGH / LOW?","HIGH=1, LOW=0."],["n bits?","2ⁿ combos."],["3 bits?","8: 000–111."],["Analog wave?","Smooth sine 〰"],["Digital wave?","Square steps ▓"],["Noise vs distortion?","Noise = junk added. Distortion = shape bent."]];
const fg=$('#fgrid');
if(fg)F.forEach(f=>{const d=document.createElement('div');d.className='flash';d.tabIndex=0;
 d.innerHTML=`<div class="fin"><div class="face ff">${f[0]}<br><small style="opacity:.6">tap to flip</small></div><div class="face fb">${f[1]}</div></div>`;
 const t=()=>d.classList.toggle('flip');d.addEventListener('click',t);d.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();t();}});fg.appendChild(d);});

/* ---------- lab tabs ---------- */
$$('[data-tab]').forEach(b=>b.addEventListener('click',()=>{
 $$('[data-tab]').forEach(x=>x.classList.remove('on'));b.classList.add('on');
 $$('[data-pane]').forEach(p=>p.style.display=p.dataset.pane===b.dataset.tab?'block':'none');}));

/* ---------- reset ---------- */
$('#resetAll')?.addEventListener('click',()=>{if(!confirm('Reset all XP + progress?'))return;
 localStorage.removeItem('oa-xp');localStorage.removeItem('oa-levels-done');localStorage.removeItem('oa-notes-done');location.reload();});

/* ================= AUTO-EXPLAIN + DEMO THEATER =================
   Click-to-watch system: per-chapter films + page walkthroughs that
   perform the practicals live. Injected — no page markup required. */
})();
(function(){
"use strict";
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ----- widget drivers (perform the practicals) ----- */
function drvBits(id,pat){const b=$('#'+id);if(!b)return;$$('.bit',b).forEach((el,i)=>{if(pat[i]===undefined)return;const cur=el.classList.contains('on')?1:0;if(cur!==pat[i])el.click();});}
function drvSwitch(on){const s=$('#sw');if(!s)return;if(s.classList.contains('on')!==!!on)s.click();}
function drvSeg(t){const b=$(`.seg button[data-t="${t}"]`);if(b)b.click();}
function drvTab(t){const b=$(`[data-tab="${t}"]`);if(b)b.click();}
function drvOpen(i){const c=$$('.lvl[data-level]')[i];if(!c)return;if(!c.classList.contains('open')){const b=c.querySelector('[data-open]');if(b&&!b.disabled)b.click();}}

/* ----- particle bursts (level clear / cert) ----- */
function burstAtEl(el){try{
  const r=(el||document.body).getBoundingClientRect();
  const cx=r.left+r.width/2, cy=Math.max(60,r.top+r.height/3);
  const cols=['#d7ff3e','#ffb224','#e14d1f','#ffffff','#16140b'];
  for(let i=0;i<26;i++){const d=document.createElement('div');d.className='pt';
    d.style.background=cols[i%cols.length];d.style.left=cx+'px';d.style.top=cy+'px';document.body.appendChild(d);
    const dx=(Math.random()-.5)*360, dy=-80-Math.random()*260;
    d.animate([{transform:'translate(0,0) rotate(0deg)',opacity:1},{transform:`translate(${dx}px,${dy+320}px) rotate(${Math.random()*540-270}deg)`,opacity:0}],{duration:900+Math.random()*700,easing:'cubic-bezier(.2,.7,.3,1)'}).onfinish=()=>d.remove();}
}catch(e){}}
window.__burstAtEl=burstAtEl;
window.__burstCenter=()=>burstAtEl({getBoundingClientRect:()=>({left:innerWidth/2-100,width:200,top:140,height:120})});

/* ================= DEMO THEATER ================= */
const DEMOS={
d1:{tag:'FILM 01',title:'What a signal is',dur:14,steps:[
  {t:0,en:'Class, eyes on the screen. A signal is simply change over time. Watch this line draw itself, left to right.',ne:'समयसँग बदलिने रेखा नै सिग्नल हो।'},
  {t:.35,en:'And see this travelling dot? It is carrying information — the bits zero, one, zero, one, riding on the wave. Change plus message. That is a signal.'},
  {t:.62,en:'Now look below. A flat line that never moves. No change, no message. Say it with me: not a signal.'}]},
d2:{tag:'FILM 02',title:'Anatomy of an analog wave',dur:18,steps:[
  {t:0,en:'Analog is smooth, class. Smooth and continuous — every value between the top and the bottom is allowed.'},
  {t:.18,en:'This highest point? That is the PEAK — positive voltage. Point at it.'},
  {t:.33,en:'And the lowest dip is the VALLEY — negative voltage. Peak up, valley down.'},
  {t:.48,en:'Now, height from the middle line — that is AMPLITUDE. And amplitude means strength. Taller wave, louder sound. Write that down.'},
  {t:.66,en:'Watch the wave squeeze together. More cycles every second — frequency going up. Crowded means fast.',ne:'छिटो दोहोरिनु भनेको high frequency.'},
  {t:.86,en:'So for the exam you sketch one sine wave and label four things: time, amplitude, peak, valley. Easy marks.'}]},
d3:{tag:'FILM 03',title:'Digital steps: HIGH and LOW',dur:14,steps:[
  {t:0,en:'Digital is strict, class. Only fixed levels. This trace jumps — it never glides like analog.'},
  {t:.3,en:'Top band: HIGH. The lamp is lit. We read that as one — about five volts. Say it: HIGH is one.'},
  {t:.55,en:'Bottom band: LOW. Lamp dark. That is zero — about zero volts. LOW is zero.'},
  {t:.8,en:'Steps, not smooth. And that squareness is the whole idea — it is the only language computers understand.'}]},
d4:{tag:'FILM 04',title:'Binary: counting with 0 and 1',dur:18,steps:[
  {t:0,en:'Counting with only zero and one. One bit gives two patterns: zero, one. Watch the grid wake up.'},
  {t:.22,en:'Two bits: four patterns. Zero-zero, zero-one, one-zero, one-one. Count along with me.'},
  {t:.44,en:'Three bits: eight patterns, triple-zero to triple-one. Examiners love this row. Memorise it.'},
  {t:.66,en:'Four bits: sixteen patterns, zero to fifteen. The weights are eight, four, two, one.'},
  {t:.86,en:'And the golden rule behind everything: n bits give two-to-the-n combinations. Once more: n bits, two-to-the-n.',ne:'n bit, 2n वटा संयोजन।'}]},
d5:{tag:'FILM 05',title:'ADC records in, DAC plays out',dur:18,steps:[
  {t:0,en:'Class, how does your voice get inside a computer? A microphone hears smooth sound, and the ADC measures its height — thousands of times every second.'},
  {t:.3,en:'Each measurement becomes a number. The smooth wave turns into stair-steps a computer can store. That, class, is recording.'},
  {t:.55,en:'Playback runs the film backwards. The DAC rebuilds smooth voltage from those numbers.'},
  {t:.8,en:'The speaker shakes the air again — and there is your music. One honest warning: sampling always loses a little detail. That small loss is the price of going digital.'}]},
d6:{tag:'FILM 06',title:'Across the channel, through the noise',dur:18,steps:[
  {t:0,en:'Every phone call runs one route. Source, encode, channel, decode, ear. Five stops — learn them in order.'},
  {t:.3,en:'The channel is wire, air, or fibre. And look — red sparks, attacking mid-flight. The journey is dangerous.'},
  {t:.55,en:'Two words examiners love to mix up. NOISE is junk added on the way. DISTORTION is the shape itself, getting bent.'},
  {t:.8,en:'So why did digital win? Because the receiver regenerates it — clean, fresh, error-checked. That is the answer of a champion. Write it.'}]},
d7:{tag:'FINALE',title:'The whole story at once',dur:14,steps:[
  {t:0,en:'Six ideas, one story. Watch it all come together.'},
  {t:.35,en:'Smooth or stepped, counted in bits, bridged both ways.',ne:'सबै कुरा एकै ठाउँमा।'},
  {t:.7,en:'Surviving every channel. Now prove it — tick the answers.'}]}
};
function dSetup(cv){try{const d=Math.min(2,devicePixelRatio||1),W=880,H=420;cv.width=W*d;cv.height=H*d;
  const x=cv.getContext('2d');if(!x)return null;x.setTransform(d,0,0,d,0,0);return{x,W,H};}catch(e){return null;}}
function dBG(x,W,H){x.fillStyle='#0c0a05';x.fillRect(0,0,W,H);x.strokeStyle='rgba(215,255,62,.09)';x.lineWidth=1;
  for(let gx=0;gx<=W;gx+=44){x.beginPath();x.moveTo(gx,0);x.lineTo(gx,H);x.stroke();}
  for(let gy=0;gy<=H;gy+=44){x.beginPath();x.moveTo(0,gy);x.lineTo(W,gy);x.stroke();}
  x.fillStyle='rgba(0,0,0,.15)';for(let sy=0;sy<H;sy+=4){x.fillRect(0,sy,W,1);}}
function dMid(x,W,H){x.strokeStyle='rgba(255,255,255,.28)';x.setLineDash([7,7]);x.lineWidth=1.5;
  x.beginPath();x.moveTo(0,H/2);x.lineTo(W,H/2);x.stroke();x.setLineDash([]);}
function dLabel(x,txt,px,py,bg,fg,size){size=size||17;x.font=`800 ${size}px ui-monospace,Menlo,Consolas,monospace`;
  const w=x.measureText(txt).width+22;x.fillStyle=bg;x.fillRect(px,py-24,w,32);x.fillStyle=fg;x.fillText(txt,px+11,py-1);}
function dSineY(px,W,H,f,ph){return H/2+Math.sin(px/W*Math.PI*2*f+ph)*96;}
function dSqY(px,W,H,f,ph){const c=(((px/W*f+ph/(Math.PI*2))%1)+1)%1;return H/2+(c<.5?-80:80);}
function rnd(n){const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);}
const DRAW={
d1(x,W,H,p){dBG(x,W,H);dMid(x,W,H);
  x.strokeStyle='#d7ff3e';x.lineWidth=3.5;x.beginPath();
  for(let px=0;px<=p*W;px+=4){const y=dSineY(px,W,H,2,0);px===0?x.moveTo(px,y):x.lineTo(px,y);}x.stroke();
  if(p>0.02){const hx=p*W,hy=dSineY(hx,W,H,2,0);
    x.fillStyle='#0c0a05';x.beginPath();x.arc(hx,hy,13,0,7);x.fill();
    x.strokeStyle='#d7ff3e';x.lineWidth=3;x.beginPath();x.arc(hx,hy,13,0,7);x.stroke();
    x.fillStyle='#d7ff3e';x.beginPath();x.arc(hx,hy,5,0,7);x.fill();
    if(p>0.3)dLabel(x,'INFO: 0 1 0 1',Math.min(hx+22,W-190),Math.max(hy-44,40),'#d7ff3e','#16140b',15);}
  if(p>0.05)dLabel(x,'CHANGE OVER TIME →',24,44,'#16140b','#d7ff3e',15);
  if(p>0.6){x.strokeStyle='rgba(255,255,255,.4)';x.setLineDash([5,6]);x.lineWidth=2;
    x.beginPath();x.moveTo(0,H-56);x.lineTo(W,H-56);x.stroke();x.setLineDash([]);
    dLabel(x,'FLAT = NO SIGNAL',24,H-66,'#e14d1f','#fff',15);}},
d2(x,W,H,p){dBG(x,W,H);dMid(x,W,H);
  const f=2+p*2.2;x.strokeStyle='#d7ff3e';x.lineWidth=3.5;x.beginPath();
  for(let px=0;px<=W;px+=4){const y=H/2+Math.sin(px/W*Math.PI*2*f)*96;px===0?x.moveTo(px,y):x.lineTo(px,y);}x.stroke();
  const pkx=W/(4*f)*1, vly=W/(4*f)*3;
  if(p>0.2){x.fillStyle='#d7ff3e';x.beginPath();x.arc(pkx,H/2-96,7,0,7);x.fill();dLabel(x,'PEAK (+V)',pkx+16,H/2-108,'#d7ff3e','#16140b',15);}
  if(p>0.36){x.fillStyle='#e14d1f';x.beginPath();x.arc(vly,H/2+96,7,0,7);x.fill();dLabel(x,'VALLEY (−V)',vly+16,H/2+128,'#e14d1f','#fff',15);}
  if(p>0.52){const a=Math.min(1,(p-0.52)*4)*96;
    x.strokeStyle='#5df2ff';x.lineWidth=3;x.beginPath();x.moveTo(W-120,H/2);x.lineTo(W-120,H/2-a);x.stroke();
    x.beginPath();x.moveTo(W-120,H/2);x.lineTo(W-120,H/2+a);x.stroke();
    dLabel(x,'AMPLITUDE = STRENGTH',W-330,H/2-a-16,'#5df2ff','#0c0a05',15);}
  dLabel(x,'CYCLES/SEC: '+f.toFixed(1),24,44,'#16140b','#d7ff3e',15);
  if(p>0.7)dLabel(x,'SMOOTH = ANALOG',24,80,'#d7ff3e','#16140b',15);},
d3(x,W,H,p,fr){dBG(x,W,H);
  x.fillStyle='rgba(215,255,62,.07)';x.fillRect(0,0,W,H/2-8);x.fillStyle='rgba(225,77,31,.10)';x.fillRect(0,H/2+8,W,H/2);
  const ph=fr*0.03;x.strokeStyle='#d7ff3e';x.lineWidth=3.5;x.beginPath();
  for(let px=0;px<=W;px+=4){const y=dSqY(px,W,H,3,ph);px===0?x.moveTo(px,y):x.lineTo(px,y);}x.stroke();
  dMid(x,W,H);
  const on=((p*6)|0)%2===0;
  x.beginPath();x.arc(76,H/2,40,0,7);x.fillStyle=on?'#ffb224':'#23201a';x.fill();
  x.lineWidth=3;x.strokeStyle=on?'#7a5410':'#3a3524';x.stroke();
  if(on){x.strokeStyle='rgba(255,178,36,.5)';x.lineWidth=2;for(let r=48;r<=64;r+=8){x.beginPath();x.arc(76,H/2,r,0,7);x.stroke();}}
  dLabel(x,'HIGH = 1 · 5V',W-260,60,'#d7ff3e','#16140b',16);
  dLabel(x,'LOW = 0 · 0V',W-260,H-24,'#e14d1f','#fff',16);
  dLabel(x,on?'LAMP: ON → 1':'LAMP: OFF → 0',24,H-24,on?'#ffb224':'#8f8a76',on?'#16140b':'#fff',16);},
d4(x,W,H,p){dBG(x,W,H);
  const lit=Math.min(16,Math.floor(p*16.999));
  const cw=120,chh=62,gx0=(W-4*cw)/2,gy0=70;
  for(let i=0;i<16;i++){const cx=gx0+(i%4)*cw,cy=gy0+((i/4)|0)*chh;
    const isLit=i<lit,pat=i.toString(2).padStart(4,'0');
    x.fillStyle=isLit?'#d7ff3e':'#14110a';x.fillRect(cx+4,cy+4,cw-8,chh-8);
    if(!isLit){x.strokeStyle='#3a3524';x.lineWidth=2;x.strokeRect(cx+4,cy+4,cw-8,chh-8);}
    x.fillStyle=isLit?'#16140b':'#5c5747';x.font='800 20px ui-monospace,Menlo,monospace';
    x.fillText(pat,cx+16,cy+30);x.font='700 15px ui-monospace,Menlo,monospace';x.fillText('= '+i,cx+16,cy+52);}
  const stage=p<0.24?'2^1 = 2':p<0.48?'2^2 = 4':p<0.72?'2^3 = 8':'2^4 = 16';
  dLabel(x,lit+' / 16 PATTERNS LIT',24,44,'#16140b','#d7ff3e',16);
  x.font='900 34px ui-monospace,Menlo,monospace';x.fillStyle='#d7ff3e';
  const tw=x.measureText(stage).width;x.fillText(stage,(W-tw)/2,H-24);},
d5(x,W,H,p){dBG(x,W,H);dMid(x,W,H);
  x.strokeStyle='rgba(215,255,62,.4)';x.lineWidth=2;x.beginPath();
  for(let px=0;px<=W;px+=5){const y=dSineY(px,W,H,2,0);px===0?x.moveTo(px,y):x.lineTo(px,y);}x.stroke();
  const N=22;
  if(p<0.52){const q=p/0.52;
    x.strokeStyle='#ffb224';x.lineWidth=3;x.beginPath();let started=false,sy=H/2;
    for(let i=0;i<=N;i++){if(i/N>q)break;const sx=(i/N)*W,sv=dSineY(sx,W,H,2,0);
      if(!started){x.moveTo(0,sv);started=true;}else{x.lineTo(sx,sy);x.lineTo(sx,sv);}sy=sv;}
    x.stroke();
    x.fillStyle='#ffb224';for(let i=0;i<=N;i++){if(i/N>q)break;const sx=(i/N)*W;
      x.beginPath();x.arc(sx,dSineY(sx,W,H,2,0),5,0,7);x.fill();}
    dLabel(x,'ADC: SAMPLING → NUMBERS',24,44,'#ffb224','#16140b',16);
  }else{const r=(p-0.52)/0.48;
    x.strokeStyle='rgba(255,178,36,.35)';x.lineWidth=2;x.beginPath();let sy=H/2;let st=false;
    for(let i=0;i<=N;i++){const sx=(i/N)*W,sv=dSineY(sx,W,H,2,0);
      if(!st){x.moveTo(0,sv);st=true;}else{x.lineTo(sx,sy);x.lineTo(sx,sv);}sy=sv;}x.stroke();
    x.strokeStyle='#d7ff3e';x.lineWidth=3.5;x.beginPath();
    for(let px=0;px<=r*W;px+=4){const y=dSineY(px,W,H,2,0);px===0?x.moveTo(px,y):x.lineTo(px,y);}x.stroke();
    const ex=r*W,ey=dSineY(ex,W,H,2,0);
    for(let a=0;a<3;a++){x.strokeStyle=`rgba(215,255,62,${.7-a*.22})`;x.lineWidth=2.5;
      x.beginPath();x.arc(ex,ey,12+a*12+r*8,0,7);x.stroke();}
    dLabel(x,'DAC: NUMBERS → SMOOTH SOUND',24,44,'#d7ff3e','#16140b',16);
    if(p>0.8)dLabel(x,'PRICE: A LITTLE DETAIL LOST',24,80,'#e14d1f','#fff',15);}},
d6(x,W,H,p,fr){dBG(x,W,H);
  const nodes=['SOURCE','ENCODE','CHANNEL','DECODE','EAR'],nx=[70,255,440,625,810];
  x.fillStyle='rgba(225,77,31,.10)';x.fillRect(340,40,200,H-80);
  x.strokeStyle='rgba(255,255,255,.3)';x.lineWidth=2;x.beginPath();x.moveTo(40,H/2);x.lineTo(840,H/2);x.stroke();
  x.font='800 14px ui-monospace,Menlo,monospace';
  nodes.forEach((n,i)=>{x.fillStyle='#16140b';const w=x.measureText(n).width+20;
    x.fillStyle=i===2?'#e14d1f':'#f2eee1';x.fillRect(nx[i]-w/2,H/2-66,w,30);
    x.fillStyle=i===2?'#fff':'#16140b';x.fillText(n,nx[i]-w/2+10,H/2-45);
    x.fillStyle='#d7ff3e';x.beginPath();x.arc(nx[i],H/2,7,0,7);x.fill();});
  dLabel(x,'CHANNEL: WIRE / AIR / FIBRE',352,66,'#e14d1f','#fff',13);
  const inCh=p>0.32&&p<0.68;
  for(let k=0;k<46;k++){const inten=p<0.32?0:p<0.68?Math.min(1,(p-0.32)*4):Math.max(0,1-(p-0.68)*4);
    if(rnd(k*3.7+((fr/14)|0))>inten*.85)continue;
    const sx=350+rnd(k)*180,sy2=90+rnd(k*1.3)*250;
    x.strokeStyle='#e14d1f';x.lineWidth=2;x.beginPath();
    x.moveTo(sx,sy2);x.lineTo(sx+(rnd(k*2.1)-.5)*22,sy2+(rnd(k*2.9)-.5)*22);x.stroke();}
  const px=70+p*(810-70);
  const py=H/2+(inCh?(rnd(fr)-.5)*44:0);
  x.fillStyle='#0c0a05';x.beginPath();x.arc(px,py,12,0,7);x.fill();
  x.strokeStyle='#d7ff3e';x.lineWidth=3;x.beginPath();x.arc(px,py,12,0,7);x.stroke();
  x.fillStyle='#d7ff3e';x.beginPath();x.arc(px,py,4.5,0,7);x.fill();
  if(p>0.78){const rr=((fr*2.2)%46);
    x.strokeStyle='rgba(215,255,62,.8)';x.lineWidth=3;x.beginPath();x.arc(810,H/2,14+rr,0,7);x.stroke();
    dLabel(x,'REGENERATED CLEAN',620,H/2+120,'#d7ff3e','#16140b',14);}},
d7(x,W,H,p,fr){dBG(x,W,H);
  const A=p<0.3?1:Math.max(0,1-(p-0.3)*4);
  if(A>0){x.globalAlpha=A;
    x.strokeStyle='#d7ff3e';x.lineWidth=3.5;x.beginPath();
    for(let px=0;px<=W;px+=5){const y=dSineY(px,W,H,2,fr*0.03);px===0?x.moveTo(px,y):x.lineTo(px,y);}x.stroke();
    x.strokeStyle='#ff6b2c';x.lineWidth=3.5;x.beginPath();
    for(let px=0;px<=W;px+=5){const y=dSqY(px,W,H,3,fr*0.03);px===0?x.moveTo(px,y):x.lineTo(px,y);}x.stroke();
    x.globalAlpha=1;
    if(p>0.03)dLabel(x,'ANALOG + DIGITAL',24,44,'#d7ff3e','#16140b',15);}
  if(p>0.28&&p<0.64){const q=Math.min(1,(p-0.28)/0.34),lit=Math.floor(q*16);
    const cw=120,chh=62,gx0=(W-4*cw)/2,gy0=70;
    for(let i=0;i<16;i++){const cx=gx0+(i%4)*cw,cy=gy0+((i/4)|0)*chh,on=i<lit;
      x.fillStyle=on?(i%2?'#ffb224':'#d7ff3e'):'#14110a';x.fillRect(cx+4,cy+4,cw-8,chh-8);
      x.fillStyle=on?'#16140b':'#5c5747';x.font='800 20px ui-monospace,Menlo,monospace';
      x.fillText(i.toString(2).padStart(4,'0'),cx+16,cy+38);}
    dLabel(x,'BITS: 16 PATTERNS',24,44,'#16140b','#d7ff3e',15);}
  if(p>0.55){const r=Math.min(1,(p-0.55)/0.2);
    x.strokeStyle='#d7ff3e';x.lineWidth=3.5;x.beginPath();
    for(let px=0;px<=r*W;px+=4){const y=dSineY(px,W,H,2,fr*0.05);px===0?x.moveTo(px,y):x.lineTo(px,y);}x.stroke();}
  if(p>0.68){
    for(let k=0;k<26;k++){const cx=80+rnd(k*1.7)*720,cy=70+rnd(k*2.3)*280,rr=((fr*2.5)+k*23)%130;
      x.strokeStyle=k%3?'rgba(215,255,62,.75)':'rgba(255,178,36,.75)';x.lineWidth=2.5;
      x.beginPath();x.arc(cx,cy,14+rr*0.5,0,7);x.stroke();
      for(let s2=0;s2<6;s2++){const an=s2/6*Math.PI*2+k;
        x.beginPath();x.moveTo(cx+Math.cos(an)*(14+rr*0.5),cy+Math.sin(an)*(14+rr*0.5));
        x.lineTo(cx+Math.cos(an)*(24+rr*0.5),cy+Math.sin(an)*(24+rr*0.5));x.stroke();}}
    const pr=(fr*3)%90;
    x.strokeStyle='#ffffff';x.lineWidth=3;x.beginPath();x.arc(W/2,H/2,20+pr,0,7);x.stroke();
    dLabel(x,'REGENERATED',W/2-82,H/2+112,'#d7ff3e','#16140b',16);}}
};
/* ----- theater shell ----- */
let cur=null,raf=null,t0=0,acc=0,playing=false,capIdx=-1,list=null,li=0,sceneSeq=0,sceneNarDone=true;
function ensureShell(){
  if($('#demoOv'))return;
  document.body.insertAdjacentHTML('beforeend',
   `<div id="demoOv"><div id="demoBox" role="dialog" aria-modal="true" aria-label="Demonstration">`+
   `<div class="demo-head"><span class="d-k" id="demoK"></span><b id="demoT"></b><span class="veq" id="demoEq" title="teacher voice"><i></i><i></i><i></i><i></i></span><button class="tbtn" id="demoSnd">SOUND: ON</button><button class="tbtn" id="demoX">CLOSE</button></div>`+
   `<canvas id="demoCv"></canvas><div id="demoQuiz" style="display:none"></div><div class="demo-cap" id="demoCap"></div>`+
   `<div class="demo-bar"><div id="demoFill"></div></div>`+
   `<div class="demo-ctl"><button class="tbtn go" id="demoPlay">PAUSE</button><button class="tbtn" id="demoRe">REPLAY</button><button class="tbtn" id="demoSkip" style="display:none">NEXT FILM</button><span id="demoStep"></span></div>`+
   `</div></div>`);
  $('#demoX').addEventListener('click',closeDemo);
  $('#demoSnd').addEventListener('click',()=>{sndOn=!sndOn;
    $('#demoSnd').textContent=sndOn?'SOUND: ON':'SOUND: OFF';if(!sndOn){silence();sceneNarDone=true;}});
  $('#demoOv').addEventListener('click',e=>{if(e.target.id==='demoOv')closeDemo();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeDemo();exitTour();}});
  $('#demoPlay').addEventListener('click',()=>{if(!cur)return;
    const tot=cur._bTot||cur.dur;
    if(acc>=tot){if(list&&li>=list.length-1){li=0;startFilm(list[0]);return;}acc=0;capIdx=-1;sceneSeq++;sceneNarDone=false;}
    playing=!playing;$('#demoPlay').textContent=playing?'PAUSE':'PLAY';
    if(playing){t0=performance.now();if(!sceneNarDone&&capIdx>=0)speakScene(cur.steps[capIdx]);tick();}else{if(raf)cancelAnimationFrame(raf);silence();}});
  $('#demoRe').addEventListener('click',()=>{if(!cur)return;acc=0;capIdx=-1;
    if(!playing){playing=true;$('#demoPlay').textContent='PAUSE';t0=performance.now();tick();}});
  $('#demoSkip').addEventListener('click',()=>{if(list)nextFilm();});}
function paintHead(){const sk=$('#demoSkip');
  if(list&&list.length){$('#demoK').textContent='COURSE FILM '+(li+1)+' / '+list.length;if(sk)sk.style.display='';}
  else{$('#demoK').textContent=cur.tag;if(sk)sk.style.display='none';}
  $('#demoT').textContent=cur.title;}
function showFilmUI(){$('#demoQuiz').style.display='none';$('#demoCv').style.display='';$('#demoCap').style.display='';$('.demo-bar').style.display='';$('.demo-ctl').style.display='';}
function startFilm(key){const d=DEMOS[key];if(!d)return;ensureShell();showFilmUI();
  cur=d;acc=0;capIdx=-1;playing=true;sceneSeq++;sceneNarDone=false;computeBounds(cur);paintHead();
  $('#demoPlay').textContent='PAUSE';
  $('#demoOv').classList.add('show');document.body.style.overflow='hidden';
  t0=performance.now();tick();}
function openDemo(key){list=null;li=0;startFilm(key);}
function openPlaylist(){list=['d1','d2','d3','d4','d5','d6','d7'];li=0;startFilm(list[li]);}
function nextFilm(){if(!list)return;
  if(li<list.length-1){li++;startFilm(list[li]);return;}
  startCheck();}
/* ================= COURSE CHECK: watch, then tick =================
   One MCQ per film, each answerable straight from its film. */
const COURSE_Q=[
 {f:'FILM 01',q:'What is a signal?',opts:['Change over time that carries information','A flat line that never moves','Only loud sound','A computer program'],a:0,why:'The film drew it live: a moving line with a message riding on it. Flat lines carry nothing.'},
 {f:'FILM 02',q:'The amplitude of a wave tells us its…',opts:['Speed','Strength — a taller wave is stronger','Colour','Direction of travel'],a:1,why:'Height from the middle line. Taller wave, louder sound — the line you were told to write down.'},
 {f:'FILM 03',q:'HIGH on a digital line means…',opts:['Zero, lamp dark','One, lamp lit, about 5 volts','A broken wire','A smooth wave'],a:1,why:'Top band, lamp lit: HIGH is one. Bottom band, lamp dark: LOW is zero.'},
 {f:'FILM 04',q:'How many patterns do 3 bits give?',opts:['6','7','8, from 000 to 111','16'],a:2,why:'The grid filled it live: two-to-the-three is eight. The row examiners love.'},
 {f:'FILM 05',q:'Recording voice into a PC needs…',opts:['A DAC, to play sound out','An ADC, to sample sound into numbers','A louder speaker','A longer wire'],a:1,why:'ADC records inward, analog to digital. DAC plays outward, digital to analog.'},
 {f:'FILM 06',q:'Why does digital survive noise?',opts:['It is louder than analog','The receiver regenerates it cleanly and error-checks','Noise only attacks analog','It travels faster'],a:1,why:'Regenerate plus error-check — the closing line of the transmission film.'}];
let dqIdx=0,dqRight=0;
function startCheck(){playing=false;if(raf)cancelAnimationFrame(raf);silence();
  dqIdx=0;dqRight=0;list=null;
  $('#demoK').textContent='COURSE CHECK';$('#demoT').textContent='Tick the correct answer';
  $('#demoCv').style.display='none';$('#demoCap').style.display='none';$('.demo-bar').style.display='none';$('.demo-ctl').style.display='none';
  const qz=$('#demoQuiz');qz.style.display='block';qz.dataset.lock='';renderDQ();}
function renderDQ(){const qz=$('#demoQuiz');
  if(dqIdx>=COURSE_Q.length){const rw=dqRight*10;
    qz.innerHTML=`<div class="cert"><span class="fig lime">TUTORIAL CHECK COMPLETE</span><h2>${dqRight} / 6 CORRECT</h2><p class="small">${dqRight>=5?'Distinction pace — straight to Levels.':dqRight>=3?'Good base — replay any film, then attack Levels.':'Watch the course once more — it auto-plays, then tick again.'} Earned +${rw} XP.</p><p><a class="btn solid" href="levels.html">Go to Levels</a> <button class="tbtn" id="dqAgain" style="margin-left:8px">REPLAY COURSE</button></p></div>`;
    try{window.__addXP(rw);}catch(e){try{const x=+JSON.parse(localStorage.getItem('oa-xp')||'0')+rw;localStorage.setItem('oa-xp',JSON.stringify(x));}catch(_){}}
    if(dqRight>=3){for(let wv=0;wv<3;wv++){setTimeout(()=>{try{window.__burstCenter();}catch(e){}},wv*280);}}
    if(sndOn)narrate('Check complete. You scored '+dqRight+' out of 6. '+(dqRight>=3?'Now go clear the six levels.':'Watch the course once more, then tick again.'),null);
    const ag=$('#dqAgain');if(ag)ag.addEventListener('click',()=>openPlaylist());
    return;}
  const Q=COURSE_Q[dqIdx];
  qz.innerHTML=`<div class="dq-top">QUESTION ${dqIdx+1} / 6 · FROM ${Q.f}</div><div class="q"><b>${Q.q}</b>`+
   Q.opts.map((o,j)=>`<button type="button" class="opt" data-j="${j}"><b>${'ABCD'[j]}</b> · ${o}</button>`).join('')+`<div class="why"></div><div class="dq-next" id="dqNext"></div></div>`;
  if(sndOn)narrate('Question '+(dqIdx+1)+'. '+Q.q+' Tick the correct answer.',null);
  qz.querySelectorAll('.opt').forEach(b=>b.addEventListener('click',()=>answerDQ(b)));}
function answerDQ(b){const qz=$('#demoQuiz');if(qz.dataset.lock==='1')return;qz.dataset.lock='1';
  const Q=COURSE_Q[dqIdx],j=+b.dataset.j,ok=j===Q.a;
  const opts=[...qz.querySelectorAll('.opt')];
  opts.forEach(x=>{x.disabled=true;if(+x.dataset.j!==Q.a&&x!==b)x.classList.add('dim');});
  b.classList.add(ok?'picked-ok':'picked-bad');if(!ok)opts[Q.a].classList.add('picked-ok','show-ok');
  const box=qz.querySelector('.q');box.classList.add(ok?'locked-ok':'locked-bad');
  const w=qz.querySelector('.why');w.style.display='block';
  w.innerHTML=(ok?'Correct. ':'Not quite — the answer is <b>'+Q.opts[Q.a]+'</b>. ')+Q.why;
  if(ok)dqRight++;
  if(sndOn)narrate(ok?('Correct. '+Q.why):('Not quite. The answer is '+Q.opts[Q.a]+'. '+Q.why),null);
  let n=4;const nx=$('#dqNext');nx.textContent='Next question in '+n+'…';
  const cd=setInterval(()=>{if(!$('#demoOv').classList.contains('show')){clearInterval(cd);return;}
    n--;if(n<=0){clearInterval(cd);qz.dataset.lock='';dqIdx++;renderDQ();}
    else nx.textContent='Next question in '+n+'…';},1000);}
function closeDemo(){if(!$('#demoOv')||!$('#demoOv').classList.contains('show'))return;
  $('#demoOv').classList.remove('show');document.body.style.overflow='';
  playing=false;cur=null;silence();if(raf)cancelAnimationFrame(raf);}
function computeBounds(d){let t=0;const ends=d.steps.map(s=>{const w=s.en.split(/\s+/).length;const seg=Math.max(3.4,w/2.35+0.9);t+=seg;return t;});d._bEnds=ends.map(e=>e/t);d._bTot=t;}
function speakScene(s){const my=++sceneSeq;sceneNarDone=false;
  if(sndOn&&playing)narrate(s.en,()=>{if(my===sceneSeq)sceneNarDone=true;});
  else sceneNarDone=true;}
function tick(){if(!playing||!cur)return;try{
  const tot=cur._bTot||cur.dur,bnds=cur._bEnds;
  const now=performance.now(),dt=(now-t0)/1000;t0=now;
  const curEnd=capIdx>=0&&bnds?bnds[capIdx]*tot:tot;
  if(!(capIdx>=0&&!sceneNarDone&&acc>=curEnd-0.05))acc=Math.min(tot,acc+dt);
  const p=acc/tot,fr=Math.floor(acc*30);
  const cv=$('#demoCv'),setup=dSetup(cv);if(!setup)return;const{x,W,H}=setup;
  DRAW[Object.keys(DEMOS).find(k=>DEMOS[k]===cur)](x,W,H,p,fr);
  let idx=0;if(bnds)cur.steps.forEach((s,i)=>{if(p>=bnds[i])idx=i;});else cur.steps.forEach((s,i)=>{if(p>=s.t)idx=i;});
  if(idx!==capIdx){capIdx=idx;const s=cur.steps[idx],cap=$('#demoCap');
    cap.innerHTML=s.en+(s.ne?`<span class="d-ne">${s.ne}</span>`:'');
    cap.classList.remove('swap');void cap.offsetWidth;cap.classList.add('swap');
    speakScene(s);}
  $('#demoFill').style.width=(p*100)+'%';
  $('#demoStep').textContent=`SCENE ${capIdx+1} / ${cur.steps.length}`;
  if(acc>=tot){if(list){nextFilm();return;}playing=false;$('#demoPlay').textContent='REPLAY';return;}
  raf=requestAnimationFrame(tick);}catch(err){try{if(!window.__tickDead){window.__tickDead=1;if(window.__pushErr)window.__pushErr('film loop: '+(err&&err.message),'',0,0,err&&err.stack);}}catch(_){}playing=false;}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-demo]');if(b)openDemo(b.dataset.demo);});
document.addEventListener('click',e=>{const c=e.target.closest('[data-course]');if(c)openPlaylist();});
/* auto-add PLAY DEMO buttons to chapters */
for(let i=1;i<=6;i++){const h=$('#c'+i+' h3');if(h&&!h.querySelector('[data-demo]'))
  h.insertAdjacentHTML('beforeend',`<button class="btn solid demobtn" data-demo="d${i}">PLAY DEMO</button>`);}

/* ================= GUIDED TOURS ================= */
const TOURS={
learn:[
 {sel:'#c1 .chain',t:'01 / The route',x:'Every signal runs one route: information becomes a signal, travels, and is rebuilt. The live scope under it never stops moving — that motion is the point.'},
 {sel:'#c2 .darkbox',t:'02 / Read the smooth wave',x:'This is analog, alive. Peak is the top, valley the bottom, height is strength. Keep it moving in your head while you read.'},
 {sel:'#c3 .bulbring',t:'03 / The switch is digital',x:'Watch closely — I flip it ON: lamp, voltage, bit and wave change together. OFF is 0, ON is 1, nothing in between.',run:()=>{drvSwitch(true);setTimeout(()=>drvSwitch(false),1500);}},
 {sel:'#c4 #bits',t:'04 / Bits make numbers',x:'I set 0101. That reads 5, because the weights are 8, 4, 2, 1. Your turn next: build 1010, which is 10.',run:()=>drvBits('bits',[0,1,0,1])},
 {sel:'#c5 .chain',t:'05 / Bridges both ways',x:'ADC records inward, analog to digital. DAC plays outward, digital to analog. Recording versus playback answers half the exam.'},
 {sel:'#c6 #txScope',t:'06 / Surviving the trip',x:'Signals ride a channel and collect noise. Digital survives because it regenerates cleanly. Tour done — press PLAY DEMO on any chapter to watch it as a film.'}],
lab:[
 {sel:'.tabs',t:'01 / Three benches',x:'Waves, Bits, and Compare. I will walk all three and operate each one.'},
 {sel:'.seg',t:'02 / Three modes',x:'Analog, digital, or both on the same glass. Both at once shows smooth against steps best.',run:()=>drvSeg('both')},
 {sel:'.toolbar',t:'03 / The knobs',x:'Frequency crowds the wave; amplitude grows it. One knob at a time — that is the lab rule.'},
 {sel:'.tabs',t:'04 / Bit bench',x:'Opening the bit bench and building 10, which is 1010.',run:()=>{drvTab('bits');setTimeout(()=>drvBits('bitsLab',[1,0,1,0]),450);}}],
levels:[
 {sel:'.lvl[data-level="L1"]',t:'01 / Missions unlock in order',x:'Opening Level 01. Every level is the same shape: briefing, hands-on task, then a 3-question gate.',run:()=>drvOpen(0)},
 {sel:'.lvl[data-level="L4"]',t:'02 / Full clear or nothing',x:'A gate needs 3 of 3. XP lands only on a full clear — that is what keeps the XP honest.'},
 {sel:'#examGate',t:'03 / The prize',x:'Six of six opens the timed Final. Go earn it.'}],
index:[
 {sel:'.hero-vis',t:'01 / Two waves',x:'Everything on this site is these two traces: smooth analog against stepped digital.'},
 {sel:'.steps',t:'02 / The method',x:'Notes first, then levels, then the final. In that order — the locks enforce it.'},
 {sel:'.path',t:'03 / Six levels',x:'Cleared in sequence, each paying XP. Your progress bar lives above.'},
 {sel:'#examGate',t:'04 / The locked final',x:'Finish the path to sit it. Fifteen minutes, twenty questions.'}],
quiz:[
 {sel:'.hud',t:'01 / One attempt each',x:'Tap an option and it locks. The ruling plus the reason appears at once — always read the reason, it is the actual lesson.'},
 {sel:'#fgrid',t:'02 / Flashcards',x:'Flipping one card to show the motion.',run:()=>{const f=$('#fgrid .flash');if(f){f.classList.add('flip');setTimeout(()=>f.classList.remove('flip'),1600);}}},
 {sel:'a[href="exam.html"]',t:'03 / Then the final',x:'When practice clears 90 percent, take the timed Final.'}],
exam:[
 {sel:'#tcount',t:'01 / The clock',x:'Fifteen minutes, twenty questions, auto-submit at zero. Keep moving; a wrong answer still teaches.'},
 {sel:'#qbox',t:'02 / Play to pass',x:'Fifty percent passes, ninety is distinction. A pass pays 200 XP and prints the certificate below.'}]};
function pageKey(){if($('#examMode'))return'exam';if($('#c1'))return'learn';
  if($('[data-gate]'))return'levels';if($('[data-pane]'))return'lab';
  if($('#qbox')&&$('#fgrid'))return'quiz';return'index';}
let tourOn=false,tourIdx=0,autoMode=true,sndOn=true,speechTimer=null,speechToken=0,teacherVoice=null;
/* ----- voice casting: prefer the most natural English voice on the device ----- */
function pickVoice(){try{const vs=speechSynthesis.getVoices().filter(v=>v.lang&&v.lang.toLowerCase().indexOf('en')===0);
  if(!vs.length)return null;
  const pref=[/google us english/i,/google uk english female/i,/natural/i,/neural/i,/samantha/i,/aria/i,/jenny/i,/guy/i,/zira/i,/david/i,/daniel/i,/moira/i,/karen/i,/tessa/i,/fiona/i];
  for(const re of pref){const f=vs.find(v=>re.test(v.name));if(f)return f;}
  return vs.find(v=>/en[-_]us/i.test(v.lang))||vs[0];}catch(e){return null;}}
try{if('speechSynthesis' in window){teacherVoice=pickVoice();speechSynthesis.onvoiceschanged=()=>{teacherVoice=pickVoice();};}}catch(e){}
/* ----- narrator: speaks, then auto-advances. Falls back to timers. ----- */
function silence(){speechToken++;try{speechSynthesis.cancel();}catch(e){}if(speechTimer){clearTimeout(speechTimer);speechTimer=null;}try{document.body.classList.remove('speaking');}catch(e){}}
/* spoken form: codes like "02 / READ THE SMOOTH WAVE" become "Step 2: read the smooth wave." */
function sayStep(s,i){const clean=s.t.replace(/^\d+\s*\/\s*/,'').toLowerCase();return 'Step '+(i+1)+': '+clean+'. '+s.x;}
function narrate(text,onDone){
  silence();const my=++speechToken;let finished=false;
  const go=()=>{if(finished||my!==speechToken)return;finished=true;if(speechTimer){clearTimeout(speechTimer);speechTimer=null;}try{document.body.classList.remove('speaking');}catch(e){}if(onDone)onDone();};
  const fallback=()=>{if(speechTimer)clearTimeout(speechTimer);
    const words=text.split(/\s+/).length;
    speechTimer=setTimeout(go,Math.max(5600,2400+words*430));};
  try{
    if(!('speechSynthesis' in window))throw 0;
    const u=new SpeechSynthesisUtterance(text);u.rate=0.95;u.pitch=0.95;
    if(teacherVoice)u.voice=teacherVoice;
    u.onend=go;u.onerror=fallback;
    speechSynthesis.cancel();speechSynthesis.speak(u);
    try{document.body.classList.add('speaking');}catch(e){}
    speechTimer=setTimeout(go,Math.max(15000,2600+text.split(/\s+/).length*680));
  }catch(e){fallback();}}
function ensureTour(){
  if($('#tourCard'))return;
  document.body.insertAdjacentHTML('beforeend',
   `<button id="tourBtn">AUTO-EXPLAIN COURSE</button>`+
   `<div id="tourCard" role="dialog" aria-label="Guided explanation"><span class="t-step" id="tourK"></span><h3 id="tourT"></h3><p id="tourX"></p>`+
   `<div class="t-row"><button class="tbtn" id="tourBack">BACK</button><button class="tbtn go" id="tourNext">NEXT</button><button class="tbtn go" id="tourAuto">AUTO: ON</button><button class="tbtn" id="tourExit">EXIT</button><span class="t-count" id="tourC"></span></div></div>`);
  $('#tourBtn').addEventListener('click',()=>openPlaylist());
  $('#tourNext').addEventListener('click',()=>stepTour(1));
  $('#tourBack').addEventListener('click',()=>stepTour(-1));
  $('#tourExit').addEventListener('click',exitTour);
  $('#tourAuto').addEventListener('click',()=>{autoMode=!autoMode;
    $('#tourAuto').textContent=autoMode?'AUTO: ON':'AUTO: OFF';
    $('#tourAuto').classList.toggle('go',autoMode);
    if(!autoMode){silence();return;}
    const steps=TOURS[pageKey()];if(tourOn&&steps&&steps[tourIdx]){narrate(sayStep(steps[tourIdx],tourIdx),()=>{if(tourOn)stepTour(1);});}});}
function startTour(key){ensureTour();const steps=TOURS[key];if(!steps)return;
  autoMode=true;const ab=$('#tourAuto');if(ab){ab.textContent='AUTO: ON';ab.classList.add('go');}
  tourOn=true;tourIdx=0;$('#tourBtn').style.display='none';$('#tourCard').classList.add('show');showStep(steps);}
function showStep(steps){$$('.tour-hl').forEach(e=>e.classList.remove('tour-hl'));
  const s=steps[tourIdx],el=$(s.sel);
  if(el){el.scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'});
    setTimeout(()=>el.classList.add('tour-hl'),reduced?0:450);}
  $('#tourK').textContent='GUIDED EXPLANATION';
  $('#tourT').textContent=s.t;$('#tourX').textContent=s.x;
  $('#tourC').textContent=(tourIdx+1)+' / '+steps.length;
  $('#tourBack').disabled=tourIdx===0;
  $('#tourNext').textContent=tourIdx===steps.length-1?'FINISH':'NEXT';
  try{s.run&&s.run();}catch(e){}
  if(autoMode)narrate(sayStep(s,tourIdx),()=>{if(tourOn)stepTour(1);});}
function stepTour(d){const steps=TOURS[pageKey()];if(!steps)return;
  silence();tourIdx+=d;
  if(tourIdx>=steps.length){exitTour();localToast('Tour done. Now press PLAY DEMO on any chapter.');return;}
  if(tourIdx<0)tourIdx=0;showStep(steps);}
function exitTour(){if(!tourOn)return;tourOn=false;silence();
  $$('.tour-hl').forEach(e=>e.classList.remove('tour-hl'));
  const c=$('#tourCard');if(c)c.classList.remove('show');
  const b=$('#tourBtn');if(b)b.style.display='';}
function localToast(t){try{const el=$('#toast');if(!el)return;el.textContent=t;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),2200);}catch(e){}}
ensureTour();
})();

