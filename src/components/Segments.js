import { segments as s } from '../data/content.js';
import { icon } from '../utils/icons.js';

export const Segments = () => `
<section class="section section--segments" id="segments"><div class="container">
  <p class="eyebrow reveal">${s.eyebrow}</p><h2 class="h2 reveal">${s.title.join('<br>')}</h2><p class="lead reveal">${s.text}</p>
  <div class="grid-2 seg-cards">${s.items.map(([t,ic,tags,pain,fix],i)=>`<article class="card reveal" style="--d:${(i%2)*.1}s"><header>${icon(ic,22)}<h3>${t}</h3></header><p class="tags">${tags.join(' — ')}</p><p class="pain">${pain}</p><p class="solve">${icon('arrow',14)}<span>${fix}</span></p></article>`).join('')}</div>
  <div class="chips-row reveal">${s.chips.map(c=>`<span>${c}</span>`).join('')}</div>
  <div class="persona-carousel reveal" data-persona-carousel aria-label="Типичные пользователи Goulash">
    <button class="persona-carousel__arrow persona-carousel__arrow--prev" type="button" aria-label="Предыдущая карточка" data-persona-prev>${icon('arrow',20)}</button>
    <div class="persona-carousel__viewport">
      ${s.personas.map(([n,m,p,q],i)=>`<article class="persona-slide ${i===0?'is-active':''}" data-persona-slide="${i}" aria-hidden="${i===0?'false':'true'}">
        <div class="persona-slide__photo"><img src="/images/personas/persona-${i+1}.webp" alt="${n}" loading="lazy" decoding="async"><span>PROFILE / 0${i+1}</span></div>
        <div class="persona-slide__content"><span class="persona-slide__index">0${i+1} / 0${s.personas.length}</span><h3>${n}</h3><p class="persona-slide__meta">${m}</p><p class="persona-slide__description">${p}</p><div class="persona-slide__need"><small>ТИПИЧНАЯ ЗАДАЧА</small><p>${q}</p></div></div>
      </article>`).join('')}
    </div>
    <button class="persona-carousel__arrow persona-carousel__arrow--next" type="button" aria-label="Следующая карточка" data-persona-next>${icon('arrow',20)}</button>
    <div class="persona-carousel__pagination" aria-label="Выбрать пользователя">${s.personas.map((_,i)=>`<button type="button" data-persona-dot="${i}" aria-label="Карточка ${i+1}" aria-current="${i===0?'true':'false'}"></button>`).join('')}</div>
  </div>
</div></section>`;

export function initPersonaCarousel() {
  const root = document.querySelector('[data-persona-carousel]');
  if (!root) return;
  const slides = [...root.querySelectorAll('[data-persona-slide]')];
  const dots = [...root.querySelectorAll('[data-persona-dot]')];
  const prev = root.querySelector('[data-persona-prev]');
  const next = root.querySelector('[data-persona-next]');
  let active = 0;
  const show = index => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const selected = i === active;
      slide.classList.toggle('is-active', selected);
      slide.setAttribute('aria-hidden', String(!selected));
    });
    dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === active)));
  };
  prev?.addEventListener('click', () => show(active - 1));
  next?.addEventListener('click', () => show(active + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
  root.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') show(active - 1);
    if (event.key === 'ArrowRight') show(active + 1);
  });
}
