const DATA=window.APPOL_DATA||[];
const $=s=>document.querySelector(s),sheet=$('#sheet'),content=$('#content');
let history=JSON.parse(localStorage.getItem('appol-history')||'[]');
let fav=JSON.parse(localStorage.getItem('appol-fav')||'[]');
function save(){localStorage.setItem('appol-history',JSON.stringify(history.slice(0,50)));localStorage.setItem('appol-fav',JSON.stringify(fav));}
function esc(v){return String(v||'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\\':'&#39;'}[c]));}
function remember(items){const ids=items.map(x=>x.id);history=[...ids,...history.filter(id=>!ids.includes(id))].slice(0,50);save();}
function open(title,items){
  const groups={};
  items.forEach(x=>(groups[x.sub||x.cat]??=[]).push(x));
  content.innerHTML='<div class="sheet-head"><h2>'+esc(title)+'</h2><span>'+items.length+' consultes</span></div>'+
    (items.length?Object.entries(groups).map(([g,list])=>'<div class="group"><h3>'+esc(g)+'</h3>'+list.map(card).join('')+'</div>').join(''):'<p class="empty">No hi ha resultats.</p>');
  sheet.classList.remove('hidden');
  content.querySelectorAll('[data-fav]').forEach(b=>b.onclick=()=>{const id=b.dataset.fav;fav=fav.includes(id)?fav.filter(x=>x!==id):[...fav,id];save();b.textContent=fav.includes(id)?'★':'☆';});
}
function card(x){return '<article class="row"><button class="fav" data-fav="'+esc(x.id)+'">'+(fav.includes(x.id)?'★':'☆')+'</button><b>'+esc(x.a)+'</b><h3>'+esc(x.t)+'</h3><p>'+esc(x.r)+'</p><div class="legal"><strong>Penes:</strong> '+esc(x.p)+'</div><div class="source"><strong>Font:</strong> '+esc(x.f)+'</div></article>';}
function list(cat){const items=DATA.filter(x=>x.cat===cat);remember(items);open(cat,items);}
function sublist(cat,sub){const items=DATA.filter(x=>x.cat===cat&&x.sub===sub);remember(items);open(sub,items);}
document.querySelectorAll('[data-module]').forEach(b=>b.onclick=()=>{const m=b.dataset.module;if(m==='mob')showMenu('Mobilitat',['VMP','VTC']);else if(m==='int')showMenu('Intervenció',['Actuació','Penal','Procediment','Circulació','Ordenances']);else if(m==='fav')open('Favorits',DATA.filter(x=>fav.includes(x.id)));else if(m==='hist')open('Historial',history.map(id=>DATA.find(x=>x.id===id)).filter(Boolean));});
function showMenu(title,subs){content.innerHTML='<div class="sheet-head"><h2>'+title+'</h2><span>Tria una categoria</span></div><div class="menu-grid">'+subs.map(s=>'<button class="menu-btn" data-sub="'+esc(s)+'">'+(s==='VMP'?'🛴':s==='VTC'?'🚕':s==='Actuació'?'👮':s==='Penal'?'⚖️':s==='Procediment'?'📋':s==='Circulació'?'🚦':'🏛️')+'<strong>'+esc(s)+'</strong><small>'+DATA.filter(x=>x.sub===s).length+' entrades</small></button>').join('')+'</div>';sheet.classList.remove('hidden');content.querySelectorAll('[data-sub]').forEach(b=>b.onclick=()=>sublist(title,b.dataset.sub));}
$('#go').onclick=search;
$('#q').addEventListener('keydown',e=>{if(e.key==='Enter')search();});
function search(){const q=$('#q').value.trim().toLowerCase();if(!q)return open('Cercador general',DATA.slice(0,0));const terms=q.split(/\s+/).filter(Boolean);const items=DATA.filter(x=>terms.every(t=>(x.a+' '+x.t+' '+x.r+' '+x.p+' '+x.f).toLowerCase().includes(t)));remember(items);open('Resultats',items);}
$('#close').onclick=()=>sheet.classList.add('hidden');sheet.onclick=e=>{if(e.target===sheet)sheet.classList.add('hidden')};
let deferred;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;$('#install').hidden=false});$('#install').onclick=async()=>{if(deferred){deferred.prompt();await deferred.userChoice;deferred=null;$('#install').hidden=true}};
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});