import { demoHead } from '../data/content.js';
import { specialists, initialRequests, statusLabel, nextStatus, nextLabel, districts, periods } from '../data/demoData.js';
import { icon } from '../utils/icons.js';

const state = { tab:'requests', filter:'all', q:'', sel:'А-1042', period:'day', reqs:initialRequests(), msg:'Демонстрационные данные: 7 заявок, 5 специалистов, одна смена.', timers:[], playing:false };
const spec = id => specialists.find(s=>s.id===id);
const active = r => r.status!=='new' && r.status!=='done';
const load = s => { const n=state.reqs.filter(r=>r.spec===s.id).length; return Math.min(99, s.base + Math.max(0,n-s.baseAssigned)*8); };
const count = s => state.reqs.filter(r=>r.spec===s.id).length;
const badge = st => `<span class="st st--${st}"><i></i>${statusLabel[st]}</span>`;
const visible = () => state.reqs.filter(r=>{
  const f=state.filter; if(f==='new'&&r.status!=='new')return false; if(f==='work'&&!active(r))return false;
  if(f==='done'&&r.status!=='done')return false; if(f==='high'&&!r.high)return false;
  const q=state.q.trim().toLowerCase(); return !q||[r.id,r.title,r.address,r.district].join(' ').toLowerCase().includes(q); });

const tabs = [['requests','clipboard','Заявки'],['map','pin','Карта'],['masters','users','Мастера'],['analytics','chart','Аналитика']];

function reqCard(r){
  const s=r.spec?spec(r.spec):null, sel=r.id===state.sel;
  return `<article class="req ${sel?'is-sel':''}" data-id="${r.id}" tabindex="0">
    <div class="req__top"><small>${r.id}</small>${badge(r.status)}</div>
    <h4>${r.title}</h4><p>${r.address} · ${r.district} · окно ${r.window}</p>
    <div class="req__meta"><span>${r.type}</span><span class="pr ${r.high?'pr--high':''}"><i></i>${r.high?'Высокий':'Обычный'} приоритет</span>${s?`<span>· ${s.name}</span>`:''}</div>
    ${r.status==='new'?`<select class="assign" data-id="${r.id}" aria-label="Назначить специалиста"><option value="">Выберите специалиста</option>${specialists.map(x=>`<option value="${x.id}">${x.name} · ${x.district} · ${load(x)}%</option>`).join('')}</select>`:''}
    ${r.status==='done'?'<p class="ok">Результат передан в аналитику</p>':''}
  </article>`;
}
function detail(){
  const r=state.reqs.find(x=>x.id===state.sel); if(!r) return '<div class="detail"><p class="muted">Выберите заявку</p></div>';
  const s=r.spec?spec(r.spec):null;
  return `<aside class="detail"><p class="eyebrow sm">Карточка заявки</p><h3>${r.title}</h3>
    <dl><dt>Номер</dt><dd>${r.id}</dd><dt>Адрес</dt><dd>${r.address}</dd><dt>Район</dt><dd>${r.district}</dd><dt>Окно</dt><dd>${r.window}</dd><dt>Тип</dt><dd>${r.type}</dd><dt>Статус</dt><dd>${statusLabel[r.status]}</dd><dt>Специалист</dt><dd>${s?s.name:'не назначен'}</dd></dl>
    ${nextStatus[r.status]?`<button class="btn btn--accent btn--sm" data-adv="${r.id}">${nextLabel[r.status]} ${icon('arrow',14)}</button>`:''}
    ${r.status==='done'?'<p class="ok">Результат передан в аналитику</p>':''}</aside>`;
}
function tabRequests(){
  const c=n=>state.reqs.filter(n).length; const list=visible();
  const fl=[['all','Все'],['new','Новые'],['work','В работе'],['done','Выполнены'],['high','Высокий приоритет']];
  return `<div class="kpis"><div><b>${state.reqs.length}</b><span>Заявок в контуре</span></div><div class="k-acc"><b>${c(r=>r.status==='new')}</b><span>Новые</span></div><div><b>${c(active)}</b><span>В работе</span></div><div><b>${c(r=>r.status==='done')}</b><span>Выполнено</span></div></div>
  <div class="filters"><div class="chips">${fl.map(([k,t])=>`<button class="chipb ${state.filter===k?'is-on':''}" data-filter="${k}">${t}</button>`).join('')}</div>
  <label class="search">${icon('search',16)}<input id="dq" type="search" placeholder="Адрес, район или номер" value="${state.q}"></label></div>
  <div class="split"><div class="list">${list.length?list.map(reqCard).join(''):'<p class="muted">Ничего не найдено</p>'}</div>${detail()}</div>`;
}
function mapSvg(){
  const done = state.reqs.filter(r=>r.status==='done').length;
  return `<svg viewBox="0 0 500 300" class="netlive__map"><g fill="#172321"><rect x="10" y="20" width="60" height="50"/><rect x="95" y="15" width="70" height="45"/><rect x="330" y="25" width="80" height="45"/><rect x="215" y="105" width="50" height="40"/><rect x="60" y="230" width="60" height="55"/><rect x="420" y="215" width="70" height="60"/></g><g stroke="#20334a" stroke-width="10"><path d="M0 60H500M0 125H500M0 200H500M100 0V300M240 0V300M345 0V300"/></g>
  <path class="route-ghost" d="M40 210V150H150V85H285V165H390"/><path class="route" d="M40 210V150H150V85H285V165H390" pathLength="1"/>
  ${[['01',150,150],['02',285,85],['03',330,225],['04',105,60]].map(([n,x,y])=>`<g class="nodes" transform="translate(${x},${y})"><rect x="-9" y="-9" width="18" height="18" rx="3" style="fill:#080b0b;stroke:var(--accent)"/><text y="3" style="fill:var(--accent);font-size:9px;text-anchor:middle">${n}</text></g>`).join('')}
  <rect class="base" x="34" y="204" width="12" height="12" rx="2"/><rect class="base" x="384" y="164" width="14" height="14" rx="2"/><text class="lbl" x="406" y="176">КЛИЕНТ</text>
  <g class="marker"><rect x="-17" y="-9" width="34" height="18" rx="3"/><text y="3.5">М-04</text><animateMotion dur="9s" repeatCount="indefinite"><mpath href="#mp2"/></animateMotion></g><path id="mp2" d="M40 210V150H150V85H285V165H390" fill="none"/></svg>`;
}
function tabMap(){
  return `<p class="muted">Смена · 12 июня · маршрут М-04</p><div class="split split--map"><div class="mapbox"><span class="live"><i class="dot"></i>LIVE</span>${mapSvg()}</div>
  <div class="maplist">${state.reqs.slice(0,5).map(r=>{const s=r.spec?spec(r.spec):null;return `<div class="mi ${r.id===state.sel?'is-sel':''}" data-id="${r.id}"><div><b>${r.title}</b>${badge(r.status)}</div><small>${r.district} · окно ${r.window}${s?' · '+s.name:''}</small></div>`}).join('')}</div></div>`;
}
function tabMasters(){
  const avg=Math.round(specialists.reduce((a,s)=>a+load(s),0)/specialists.length), free=specialists.filter(s=>load(s)<50).length, none=state.reqs.filter(r=>r.status==='new').length;
  return `<div class="kpis"><div><b>${specialists.length}</b><span>На смене</span></div><div><b>${avg}%</b><span>Средняя загрузка</span></div><div><b>${free}</b><span>Свободных окон</span></div><div><b>${none}</b><span>Заявок без мастера</span></div></div>
  <div class="masters">${specialists.map(s=>`<article class="master"><div><h4>${s.name}</h4><small>${s.role} · ${s.district}</small></div><span class="st st--assigned"><i></i>На смене</span><div class="bar"><span>Загрузка смены</span><b>${load(s)}%</b><div><i style="width:${load(s)}%"></i></div></div><small>${count(s)} заявок закреплено · доступен для назначения</small></article>`).join('')}</div>`;
}
function tabAnalytics(){
  const p=periods[state.period], inCircuit=state.reqs.length, avg=Math.round(specialists.reduce((a,s)=>a+load(s),0)/specialists.length), closed=state.reqs.filter(r=>r.status==='done').length;
  const live=state.period==='day';
  return `<div class="seg">${Object.entries(periods).map(([k,v])=>`<button class="chipb ${state.period===k?'is-on':''}" data-period="${k}">${v.label}</button>`).join('')}<small>Показатели периода — демонстрационные</small></div>
  <div class="kpis"><div><b>${inCircuit}</b><span>В контуре сейчас</span></div><div><b>${live?14+closed-1:p.shift}</b><span>Выездов за смену</span></div><div><b>${avg}%</b><span>Средняя загрузка команды</span></div><div><b>${live?closed:p.closed}</b><span>Закрыто без возврата</span></div></div>
  <div class="split split--an"><div class="chart"><small>Динамика выездов</small><div class="bars">${p.bars.map((v,i)=>`<div><i style="height:${Math.round(v*100)}%" class="${i===p.bars.length-1&&live?'last':''}"></i><span>${p.labels[i]}</span></div>`).join('')}</div></div>
  <div class="dist"><small>Заявки по районам</small>${districts.map(d=>{const n=state.reqs.filter(r=>r.district===d).length;return `<div><span>${d}</span><i style="width:${n*30}px"></i><em>${n}</em></div>`}).join('')}<small class="fine">Районы и счётчики считаются по текущим заявкам в демо. Исторические показатели периода — условные.</small></div></div>`;
}
function paint(){
  const root=document.getElementById('demo-root'); if(!root) return;
  const bodyMarkup = ({requests:tabRequests,map:tabMap,masters:tabMasters,analytics:tabAnalytics}[state.tab])();
  // Build the shell once. Subsequent interactions update only the changing panel,
  // so the page and surrounding controls do not jump or lose their scroll position.
  if(!root.querySelector('.demo__body')){
    root.innerHTML = `<div class="demo__bar"><span><i class="dot"></i><b>GOULASH · ДЕМО-КОНТУР</b> <em class="tag">данные условные</em></span><button class="btn btn--text" id="scn">${icon(state.playing?'stop':'play',14)} ${state.playing?'Остановить':'Проиграть сценарий'}</button></div>
    <div class="tabs" role="tablist">${tabs.map(([k,i,t])=>`<button type="button" role="tab" class="tab ${state.tab===k?'is-on':''}" data-tab="${k}" aria-selected="${state.tab===k}">${icon(i,16)}${t}</button>`).join('')}</div>
    <p class="demo__msg" aria-live="polite">${state.msg}</p><div class="demo__body fade"></div>`;
  }
  const oldList = root.querySelector('.list');
  const oldMapList = root.querySelector('.maplist');
  const listScroll = oldList?.scrollTop ?? 0;
  const mapScroll = oldMapList?.scrollTop ?? 0;
  const activeInput = document.activeElement?.id === 'dq';
  const caret = activeInput ? document.activeElement.selectionStart : null;
  root.querySelector('.demo__body').innerHTML = bodyMarkup;
  root.querySelectorAll('[data-tab]').forEach(button=>{
    const selected=button.dataset.tab===state.tab;
    button.classList.toggle('is-on',selected);
    button.setAttribute('aria-selected',String(selected));
  });
  root.querySelector('.demo__msg').textContent=state.msg;
  const scenario=root.querySelector('#scn');
  if(scenario) scenario.innerHTML=`${icon(state.playing?'stop':'play',14)} ${state.playing?'Остановить':'Проиграть сценарий'}`;
  const newList=root.querySelector('.list'); if(newList) newList.scrollTop=listScroll;
  const newMapList=root.querySelector('.maplist'); if(newMapList) newMapList.scrollTop=mapScroll;
  if(activeInput){
    const input=root.querySelector('#dq');
    if(input){input.focus({preventScroll:true});input.setSelectionRange(caret,caret);}
  }
}
const setMsg = m => { state.msg = m; };
function assign(id,sp){ const r=state.reqs.find(x=>x.id===id); if(!r||!sp)return; r.spec=sp; r.status='assigned'; state.sel=id; setMsg(`Заявка ${id} назначена: ${spec(sp).name}.`); paint(); }
function advance(id){ const r=state.reqs.find(x=>x.id===id); if(!r||!nextStatus[r.status])return; r.status=nextStatus[r.status]; setMsg(r.status==='done'?`Заявка ${id} закрыта, результат вернулся в аналитику.`:`Заявка ${id}: ${statusLabel[r.status]}.`); paint(); }
function stop(){ state.timers.forEach(clearTimeout); state.timers=[]; state.playing=false; }
function play(){
  stop(); state.reqs=initialRequests(); state.tab='requests'; state.filter='all'; state.q=''; state.playing=true;
  const steps=[()=>{state.sel='А-1042';setMsg('Сценарий: заявка А-1042 поступает в систему.');paint()},
    ()=>{setMsg('Диспетчер распределяет: выбран специалист по району и квалификации.');assign('А-1042','romanova')},
    ()=>advance('А-1042'),()=>advance('А-1042'),()=>advance('А-1042'),
    ()=>{state.tab='analytics';setMsg('Результат вернулся в аналитику: счётчики пересчитаны.');paint()},
    ()=>{state.tab='requests';state.playing=false;setMsg('Сценарий завершён. Продолжайте вручную.');paint()}];
  steps.forEach((f,i)=>state.timers.push(setTimeout(f,i*1700))); 
}
export const DemoDashboard = () => `
<section class="section" id="demo"><div class="container">
  <p class="eyebrow reveal">${demoHead.eyebrow}</p>
  <h2 class="h2 reveal">${demoHead.title.join('<br>')}</h2><p class="lead reveal">${demoHead.text}</p>
  <div class="demo reveal" id="demo-root"></div>
</div></section>`;
export function initDemo(){
  paint(); const root=document.getElementById('demo-root');
  root.addEventListener('click',e=>{
    const t=e.target.closest('[data-tab],[data-filter],[data-period],[data-adv],.req,.mi,#scn,.assign'); if(!t||t.classList.contains('assign'))return;
    if(t.id==='scn'){ state.playing?(stop(),setMsg('Сценарий остановлен.'),paint()):play(); return; }
    if(t.dataset.tab){ state.tab=t.dataset.tab; paint(); }
    else if(t.dataset.filter){ state.filter=t.dataset.filter; paint(); }
    else if(t.dataset.period){ state.period=t.dataset.period; paint(); }
    else if(t.dataset.adv){ advance(t.dataset.adv); }
    else if(t.dataset.id){ state.sel=t.dataset.id; paint(); }
  });
  root.addEventListener('change',e=>{ if(e.target.classList.contains('assign')) assign(e.target.dataset.id,e.target.value); });
  root.addEventListener('keydown',e=>{
    const card=e.target.closest('.req,.mi');
    if(card && (e.key==='Enter'||e.key===' ')){
      if(e.target.matches('select,input,button'))return;
      e.preventDefault();state.sel=card.dataset.id;paint();
    }
  });
  root.addEventListener('input',e=>{ if(e.target.id==='dq'){ state.q=e.target.value; paint(); } });
}
