import { blog as b } from '../data/content.js';
import { icon } from '../utils/icons.js';
// Пиксельные иллюстрации: генерируются детерминированно из seed (оригинальная графика в видео не читается детально)
const photoMeta=[
  ['technician.webp','Технический специалист обслуживает оборудование на объекте'],
  ['dispatch-team.webp','Команда диспетчеризации обсуждает маршруты и заявки'],
  ['analytics.webp','Ноутбук с картой и аналитическими показателями']
];
const art=(seed)=>{let s=seed*9301+49297,c='';for(let y=0;y<8;y++)for(let x=0;x<16;x++){s=(s*9301+49297)%233280;const r=s/233280;if(r>.62)c+=`<rect x="${x*10}" y="${y*10}" width="9" height="9" fill="#00FFFF" opacity="${(.15+r*.7).toFixed(2)}"/>`}return `<svg viewBox="0 0 160 80" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${c}</svg>`};
export const Blog = () => `
<section class="section" id="blog"><div class="container">
  <p class="eyebrow reveal">${b.eyebrow}</p><h2 class="h2 reveal">${b.title}</h2><p class="lead reveal">${b.text}</p>
  <div class="grid-3 blog">${b.items.map(([t,d],i)=>`<article class="card post reveal" style="--d:${i*.08}s"><div class="post__art post__photo"><img src="/images/blog/${photoMeta[i][0]}" alt="${photoMeta[i][1]}" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="post__placeholder" hidden>${art(i+3)}<span>${photoMeta[i][1]} · фото</span></div></div><small class="eyebrow sm">Блог</small><h3>${t}</h3><p>${d}</p><a class="link" href="#contact">Обсудить тему ${icon('arrow',14)}</a></article>`).join('')}</div>
</div></section>`;
