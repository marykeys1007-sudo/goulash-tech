import { hero } from '../data/content.js';
import { icon } from '../utils/icons.js';
const route = 'M40 210 V150 H150 V85 H285 V165 H390';
export const Hero = () => `
<section class="hero" id="product"><div class="container hero__grid">
  <div class="hero__copy">
    <p class="eyebrow reveal">${hero.eyebrow}</p>
    <h1 class="hero__title reveal">${hero.title.join('<br>')}<br><span class="accent">${hero.accent}</span></h1>
    <p class="lead reveal">${hero.text}</p>
    <div class="hero__cta reveal"><a class="btn btn--accent" href="#demo">Открыть демо-интерфейс ${icon('arrow',16)}</a><a class="btn btn--ghost" href="#contact">Обсудить задачу</a></div>
    <p class="note reveal">${hero.note}</p>
    <div class="hero__stats reveal">${hero.stats.map(([n,t])=>`<div><b>${n}</b><span>${t}</span></div>`).join('')}</div>
    <p class="hero__tags reveal">${hero.tags}</p>
  </div>
  <div class="netlive reveal" aria-label="Схема операционного контура">
    <div class="netlive__bar"><span><i class="dot"></i>NETWORK LIVE</span><em>ДЕМО · СМЕНА 12 ИЮНЯ</em></div>
    <svg viewBox="0 0 500 300" class="netlive__map" role="img" aria-label="Маршрут от базы до клиента">
      <g class="blocks" fill="#172321"><rect x="10" y="20" width="60" height="50"/><rect x="95" y="15" width="70" height="45"/><rect x="200" y="20" width="60" height="40"/><rect x="330" y="25" width="80" height="45"/><rect x="430" y="30" width="60" height="50"/><rect x="15" y="100" width="60" height="55"/><rect x="215" y="105" width="50" height="40"/><rect x="310" y="110" width="45" height="35"/><rect x="60" y="230" width="60" height="55"/><rect x="170" y="215" width="80" height="55"/><rect x="420" y="215" width="70" height="60"/></g>
      <g stroke="#20334a" stroke-width="10"><path d="M0 60H500M0 125H500M0 200H500M100 0V300M240 0V300M345 0V300"/></g>
      <path class="route-ghost" d="${route}" />
      <path class="route" d="${route}" pathLength="1"/>
      <g class="nodes"><g transform="translate(150,150)"><rect x="-9" y="-9" width="18" height="18" rx="3"/><text y="3">01</text></g><g transform="translate(285,85)"><rect x="-9" y="-9" width="18" height="18" rx="3"/><text y="3">02</text></g><g class="idle" transform="translate(330,225)"><rect x="-9" y="-9" width="18" height="18" rx="3"/><text y="3">03</text></g><g class="idle" transform="translate(105,60)"><rect x="-9" y="-9" width="18" height="18" rx="3"/><text y="3">04</text></g></g>
      <rect class="base" x="34" y="204" width="12" height="12" rx="2"/><text class="lbl" x="56" y="224">БАЗА</text>
      <rect class="base" x="384" y="164" width="14" height="14" rx="2"/><text class="lbl" x="406" y="176">КЛИЕНТ</text>
      <g class="marker"><rect x="-17" y="-9" width="34" height="18" rx="3"/><text y="3.5">М-04</text><animateMotion dur="9s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear"><mpath href="#mpath"/></animateMotion></g>
      <path id="mpath" d="${route}" fill="none"/>
    </svg>
    <div class="netlive__meta">МАРШРУТ · 4 ТОЧКИ · 14,2 КМ</div>
    <div class="netlive__legend"><span><i class="dot"></i>маршрут</span><span><i class="ring"></i>заявка</span><span><b class="chip">М-04</b>мастер</span></div>
    <div class="netlive__foot"><span>Один маркер исполнителя · маршрут от базы до клиента</span><em>в демо</em></div>
  </div>
</div></section>`;
