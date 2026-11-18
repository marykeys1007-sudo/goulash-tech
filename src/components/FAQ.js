import { faq as f } from '../data/content.js';
import { icon } from '../utils/icons.js';
export const FAQ = () => `
<section class="section section--light" id="faq"><div class="container faq">
  <div class="faq__side"><p class="eyebrow reveal">${f.eyebrow}</p><h2 class="h2 reveal">${f.title}</h2><p class="lead reveal">${f.text}</p><a class="btn btn--ghost reveal" href="#contact">${f.cta} ${icon('arrow',14)}</a></div>
  <div class="faq__list reveal">${f.items.map(([q,a],i)=>`<div class="acc ${i===0?'is-open':''}"><button class="acc__q" aria-expanded="${i===0}" aria-controls="fa${i}">${q}<span>${icon('plus',18)}</span></button><div class="acc__a" id="fa${i}"><div><p>${a}</p></div></div></div>`).join('')}</div>
</div></section>`;
export function initFAQ(){
  document.querySelectorAll('.acc__q').forEach(b=>b.addEventListener('click',()=>{
    const it=b.parentElement, open=!it.classList.contains('is-open');
    document.querySelectorAll('.acc.is-open').forEach(o=>{o.classList.remove('is-open');o.querySelector('.acc__q').setAttribute('aria-expanded',false)});
    if(open){it.classList.add('is-open');b.setAttribute('aria-expanded',true)} }));
}
