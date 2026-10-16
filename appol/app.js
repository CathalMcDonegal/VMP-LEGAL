const DATA=window.APPOL_DATA||[];
const $=s=>document.querySelector(s),sheet=$('#sheet'),content=$('#content');
let history=JSON.parse(localStorage.getItem('appol-history')||'[]');
let fav=JSON.parse(localStorage.getItem('appol-fav')||'[]');
let nav=[];
function save(){localStorage.setItem('appol-history',JSON.stringify(history.slice(0,50)));localStorage.setItem('appol-fav',JSON.stringify(fav));}
function esc(v){return String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\\':'&#39;'}[c]));}
function remember(items){const ids=items.map(x=>x.id);history=[...ids,...history.filter(id=>!ids.includes(id))].slice(0,50);save();}
function show(){sheet.classList.remove('hidden');}
function hide(){sheet.classList.add('hidden');nav=[];}
function render(title,html,back=true){content.innerHTML='<div class="sheet-head"><div><button class="back" id="innerBack" '+(back?'':'hidden')+'>← Enrere</button><h2>'+esc(title)+'</h2></div><span>'+DATA.length+' fitxes</span></div>'+html;show();}
function open(title,items,push=true){if(push)nav.push({title,items});remember(items);const groups={};items.forEach(x=>(groups[x.sub||x.cat]??=[]).push(x));render(title,items.length?Object.entries(groups).map(([g,list])=>'<div class="group"><h3>'+esc(g)+'</h3>'+list.map(card).join('')+'</div>').join(''):'<p class="empty">No hi ha resultats.</p>');}
function card(x){return '<article class="row"><button class="fav" data-fav="'+esc(x.id)+'">'+(fav.includes(x.id)?'★':'☆')+'</button><b>'+esc(x.a)+'</b><h3>'+esc(x.t)+'</h3><p>'+esc(x.r)+'</p><div class="legal"><strong>Penes:</strong> '+esc(x.p)+'</div><div class="source"><strong>Font:</strong> '+esc(x.f)+'</div></article>';}
function list(cat){open(cat,DATA.filter(x=>x.cat===cat));}
function sublist(cat,sub){open(sub,DATA.filter(x=>x.cat===cat&&x.sub===sub));}
function showMenu(title,subs){nav.push({menu:title,subs});render(title,'<p class="muted">Selecciona una categoria per continuar.</p><div class="menu-grid">'+subs.map(s=>'<button type="button" class="menu-btn" data-sub="'+esc(s)+'">'+(s==='VMP'?'🛴':s==='VTC'?'🚕':s==='Eines'?'🔎':s==='Actuació'?'👮':s==='Penal'?'⚖️':s==='Procediment'?'📋':s==='Circulació'?'🚦':'🏛️')+'<strong>'+esc(s)+'</strong><small>'+(s==='Eines'?'Matrícula · REAT':DATA.filter(x=>x.sub===s).length+' entrades')+'</small></button>').join('') );}
function search(){const q=$('#q').value.trim().toLowerCase();if(!q){open('Cercador general',[]);return;}const terms=q.split(/\s+/).filter(Boolean);const items=DATA.filter(x=>terms.every(t=>(x.a+' '+x.t+' '+x.r+' '+x.p+' '+x.f).toLowerCase().includes(t)));open('Resultats',items);}
document.querySelectorAll('[data-module]').forEach(b=>b.addEventListener('click',()=>{const m=b.dataset.module;if(m==='mob')showMenu('Mobilitat',['VMP','VTC','Eines']);else if(m==='int')showMenu('Intervenció',['Actuació','Penal','Procediment','Circulació','Ordenances']);else if(m==='fav')open('Favorits',DATA.filter(x=>fav.includes(x.id)));else if(m==='hist')open('Historial',history.map(id=>DATA.find(x=>x.id===id)).filter(Boolean));}));
content.addEventListener('click',e=>{const favBtn=e.target.closest('[data-fav]');if(favBtn){const id=favBtn.dataset.fav;fav=fav.includes(id)?fav.filter(x=>x!==id):[...fav,id];save();favBtn.textContent=fav.includes(id)?'★':'☆';return;}const sub=e.target.closest('[data-sub]');if(sub){const s=sub.dataset.sub;const parent=nav[nav.length-1];if(s==='Eines'){APPOL_TOOLS.render(content);return;}sublist(parent?.menu||'Mobilitat',s);return;}if(e.target.id==='innerBack'){nav.pop();const p=nav[nav.length-1];if(!p){hide();return;}if(p.menu)showMenu(p.menu,p.subs);else open(p.title,p.items,false);}});
$('#go').addEventListener('click',search);$('#q').addEventListener('keydown',e=>{if(e.key==='Enter')search();});
$('#close').onclick=hide;sheet.addEventListener('click',e=>{if(e.target===sheet)hide();});
let deferred;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;$('#install').hidden=false});$('#install').onclick=async()=>{if(deferred){deferred.prompt();await deferred.userChoice;deferred=null;$('#install').hidden=true;}};
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});