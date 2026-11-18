import { footer as f } from '../data/content.js';
import { logo, icon } from '../utils/icons.js';
export const Footer = () => `
<footer class="footer"><div class="container">
  <div class="footer__top"><div class="footer__brand">${logo()}<p>${f.text}</p><a class="btn btn--accent btn--sm" href="#contact">Обсудить задачу ${icon('arrow',14)}</a></div>
  <nav class="footer__cols">${f.cols.map(c=>`<div>${c.map(([t,h])=>`<a href="${h}">${t}</a>`).join('')}</div>`).join('')}</nav></div>
  <div class="footer__bot"><span>${f.copy}</span><span>${f.disclaimer}</span></div>
</div><div class="footer-pixel-word" aria-label="GOULASH.TECH" data-pixel-word="GOULASH.TECH">GOULASH.TECH</div></footer>`;
