import { pricing as p } from '../data/content.js';
import { icon } from '../utils/icons.js';
export const Pricing = () => `
<section class="section" id="pricing"><div class="container">
  <div class="grid-3 plans">${p.plans.map((pl,i)=>`<article class="plan ${pl.hot?'plan--hot':''} reveal" style="--d:${i*.08}s">
    <header><h3>${pl.name}</h3>${pl.badge?`<span class="tag tag--acc">${pl.badge}</span>`:''}</header><p class="muted">${pl.for}</p>
    <p class="price">${p.price}</p><small class="muted">${p.priceNote}</small>
    <ul>${pl.feat.map(f=>`<li>${icon('check',15)}${f}</li>`).join('')}</ul>
    <a class="btn ${pl.hot?'btn--accent btn--block':'btn--text'}" href="#contact">${p.cta} ${icon('arrow',14)}</a></article>`).join('')}</div>
  <p class="fine reveal">${p.foot}</p>
</div></section>`;
