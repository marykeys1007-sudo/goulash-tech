import { calc } from '../data/content.js';
import { icon } from '../utils/icons.js';
const rows=[['trips','Выездов в день',10,300,5,60,''],['min','Время в пути на один выезд, мин',10,60,1,28,''],['rate','Стоимость часа работы, ₽',300,3000,50,1200,'']];
export const Calculator = () => `
<section class="section" id="calculator"><div class="container">
  <p class="eyebrow reveal">${calc.eyebrow}</p><h2 class="h2 reveal">${calc.title}</h2>
  <div class="calc reveal"><div class="calc__in">${rows.map(([k,l,mn,mx,st,v])=>`<label class="rng"><span>${l}</span><output id="o-${k}"></output><input type="range" id="r-${k}" min="${mn}" max="${mx}" step="${st}" value="${v}"><small><i>${mn.toLocaleString('ru')}</i><i>${mx.toLocaleString('ru')}</i></small></label>`).join('')}
  <p class="fine">${calc.note}</p></div>
  <div class="calc__out"><p class="eyebrow sm">Оценка по вашим цифрам</p>
    <div><b id="c-day"></b><span>ч / день</span><small>Освободившееся время на перемещения</small></div>
    <div><b id="c-mon"></b><span>ч / мес</span><small>При ${calc.days} сменах в месяц</small></div>
    <div class="acc"><b id="c-rub"></b><span>₽ / мес</span><small>Условная стоимость этого времени</small></div>
    <a class="link" href="#contact">Обсудить расчёт на ваших данных ${icon('up',14)}</a></div></div>
</div></section>`;
export function initCalc(){
  const g=k=>+document.getElementById('r-'+k).value, f=n=>n.toLocaleString('ru-RU'), set=(id,v)=>document.getElementById(id).textContent=v;
  const run=()=>{ const day=g('trips')*g('min')/60*calc.saving, mon=day*calc.days, rub=Math.round(mon*g('rate'));
    set('o-trips',f(g('trips')));set('o-min',f(g('min')));set('o-rate',f(g('rate')));
    set('c-day',day.toFixed(1).replace('.',','));set('c-mon',Math.round(mon));set('c-rub',f(rub).replace(/\u00a0/g,' '));
    ['trips','min','rate'].forEach(k=>{const e=document.getElementById('r-'+k);e.style.setProperty('--p',((e.value-e.min)/(e.max-e.min)*100)+'%')}); };
  document.querySelectorAll('.calc input').forEach(i=>i.addEventListener('input',run)); run();
}
