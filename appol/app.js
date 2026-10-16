const DATA=window.APPOL_DATA||[];
const $=s=>document.querySelector(s),sheet=$('#sheet'),content=$('#content');
let visitHistory=JSON.parse(localStorage.getItem('appol-history')||'[]');
let fav=JSON.parse(localStorage.getItem('appol-fav')||'[]');
let nav=[];
let rootOpen=false;
let changingHistory=false;
function save(){localStorage.setItem('appol-history',JSON.stringify(visitHistory.slice(0,50)));localStorage.setItem('appol-fav',JSON.stringify(fav));}
function esc(v){return String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));}
function remember(items){const ids=items.map(x=>x.id);visitHistory=[...ids,...visitHistory.filter(id=>!ids.includes(id))].slice(0,50);save();}
function show(){sheet.classList.remove('hidden');rootOpen=true;}
function hide(fromPop=false){sheet.classList.add('hidden');nav=[];rootOpen=false;if(!fromPop&&location.hash==='#appol'){changingHistory=true;window.history.back();}}
function enterHistory(){window.history.pushState({appol:true},'',location.pathname+'#appol');}
function header(title,back=true,count=''){return '<div class="sheet-head"><div>'+(back?'<button type="button" class="back" id="innerBack">← Enrere</button>':'')+'<h2>'+esc(title)+'</h2></div><span>'+esc(count)+'</span></div>';}
function render(title,html,back=true,count=''){content.innerHTML=header(title,back,count)+html;show();}
function push(screen){nav.push(screen);enterHistory();return screen;}
function renderCurrent(){const s=nav[nav.length-1];if(!s){hide(true);return;}if(s.type==='menu')renderMenu(s);else if(s.type==='list')renderList(s);else if(s.type==='detail')renderDetail(s.item);else if(s.type==='tools')renderTools();}
function openList(title,items){remember(items);push({type:'list',title,items});renderList(nav[nav.length-1]);}
function renderList(s){const groups={};s.items.forEach(x=>(groups[x.sub||x.cat]??=[]).push(x));const html=s.items.length?Object.entries(groups).map(([g,list])=>'<div class="group"><h3>'+esc(g)+'</h3>'+list.map(card).join('')+'</div>').join(''):'<p class="empty">No hi ha resultats.</p>';render(s.title,html,true,s.items.length+' fitxes');}
function card(x){return '<article class="row legal-card" data-open="'+esc(x.id)+'"><button type="button" class="fav" data-fav="'+esc(x.id)+'">'+(fav.includes(x.id)?'★':'☆')+'</button><b>'+esc(x.a)+'</b><h3>'+esc(x.t)+'</h3><p>'+esc(x.r)+'</p><div class="legal"><strong>Penes:</strong> '+esc(x.p)+'</div><div class="source"><strong>Font:</strong> '+esc(x.f)+'</div><small>Toca per veure la fitxa completa →</small></article>';}
function renderDetail(x){remember([x]);const html='<article class="detail-card"><div class="detail-top"><div><b>'+esc(x.a)+'</b><h2>'+esc(x.t)+'</h2></div><button type="button" class="fav detail-fav" data-fav="'+esc(x.id)+'">'+(fav.includes(x.id)?'★':'☆')+'</button></div><section><h3>Article</h3><p>'+esc(x.a)+'</p></section><section><h3>Resum</h3><p>'+esc(x.r)+'</p></section><section><h3>Penes</h3><p>'+esc(x.p)+'</p></section><section><h3>Font</h3><p>'+esc(x.f)+'</p></section><div class="notice">Consulta la font oficial abans d’adoptar una actuació definitiva.</div></article>';render(x.t,html,true,'Fitxa legal');}
function renderMenu(s){const html='<p class="muted">Selecciona una categoria per continuar.</p><div class="menu-grid">'+s.subs.map(sub=>{const icon=sub==='VMP'?'🛴':sub==='VTC'?'🚕':sub==='Eines'?'🔎':sub==='Actuació'?'👮':sub==='Penal'?'⚖️':sub==='Procediment'?'📋':sub==='Circulació'?'🚦':'🏛️';const n=sub==='Eines'?'Consulta i matrícula':DATA.filter(x=>x.cat===s.title&&x.sub===sub).length+' entrades';return '<button type="button" class="menu-btn" data-sub="'+esc(sub)+'"><span>'+icon+'</span><strong>'+esc(sub)+'</strong><small>'+esc(n)+'</small></button>';}).join('')+'</div>';render(s.title,html,false,'');}
function openMenu(title,subs){push({type:'menu',title,subs});renderMenu(nav[nav.length-1]);}
function renderTools(){content.innerHTML=header('Eines de mobilitat',true,'Consulta local')+'<div id="toolContent"></div>';show();if(window.APPOL_TOOLS)window.APPOL_TOOLS.render(content.querySelector('#toolContent'));else content.querySelector('#toolContent').innerHTML='<p class="empty">Les eines encara no s’han carregat. Torna a obrir l’apartat.</p>';}
function search(){const q=$('#q').value.trim().toLowerCase();if(!q){openList('Cercador general',[]);return;}const terms=q.split(/\s+/).filter(Boolean);const items=DATA.filter(x=>terms.every(t=>(x.a+' '+x.t+' '+x.r+' '+x.p+' '+x.f).toLowerCase().includes(t)));openList('Resultats',items);}
function back(fromPop=false){if(nav.length>1){nav.pop();renderCurrent();if(!fromPop){changingHistory=true;window.history.back();}return;}hide(fromPop);}

document.addEventListener('click',e=>{
  const module=e.target.closest('[data-module]');
  if(module){const m=module.dataset.module;if(m==='mob')openMenu('Mobilitat',['VMP','VTC','Eines']);else if(m==='int')openMenu('Intervenció',['Actuació','Penal','Procediment','Circulació','Ordenances']);else if(m==='fav')openList('Favorits',DATA.filter(x=>fav.includes(x.id)));else if(m==='hist')openList('Historial',visitHistory.map(id=>DATA.find(x=>x.id===id)).filter(Boolean));return;}
  const favBtn=e.target.closest('[data-fav]');
  if(favBtn){e.stopPropagation();const id=favBtn.dataset.fav;fav=fav.includes(id)?fav.filter(x=>x!==id):[...fav,id];save();document.querySelectorAll('[data-fav="'+CSS.escape(id)+'"]').forEach(b=>b.textContent=fav.includes(id)?'★':'☆');return;}
  const openBtn=e.target.closest('[data-open]');
  if(openBtn){const x=DATA.find(v=>v.id===openBtn.dataset.open);if(x){push({type:'detail',item:x});renderDetail(x);}return;}
  const sub=e.target.closest('[data-sub]');
  if(sub){const s=sub.dataset.sub;const parent=nav[nav.length-1];if(s==='Eines'){push({type:'tools'});renderTools();}else if(parent){openList(s,DATA.filter(x=>x.cat===parent.title&&x.sub===s));}return;}
  if(e.target.closest('#innerBack')){back();return;}
  if(e.target.closest('#close')){hide();return;}
});

$('#go').addEventListener('click',search);
$('#q').addEventListener('keydown',e=>{if(e.key==='Enter')search();});
sheet.addEventListener('click',e=>{if(e.target===sheet)hide();});
window.addEventListener('popstate',()=>{if(changingHistory){changingHistory=false;return;}if(rootOpen)back(true);});
let deferred;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;$('#install').hidden=false;});
$('#install').onclick=async()=>{if(deferred){deferred.prompt();await deferred.userChoice;deferred=null;$('#install').hidden=true;}};
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});