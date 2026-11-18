
import { nav } from '../data/content.js';
import { icon } from '../utils/icons.js';

export const Header = () => `
<header class="header" id="top">
  <div class="header__in container">
    <a class="logo" href="#top" aria-label="Goulash.tech">
      <img
        class="logo__mark"
        src="/logo-mark.png"
        width="42"
        height="42"
        alt=""
        aria-hidden="true"
      >
      <span class="logo__name">Goulash<span>.tech</span></span>
    </a>

    <nav class="nav" id="primary-navigation" aria-label="Основная навигация">
      ${nav.map(([t,h]) => `<a href="${h}" data-nav="${h.slice(1)}">${t}</a>`).join('')}
    </nav>

    <a class="btn btn--accent btn--sm header__cta" href="#contact">
      Обсудить задачу ${icon('arrow',16)}
    </a>

    <button
      class="burger"
      type="button"
      aria-label="Меню"
      aria-controls="primary-navigation"
      aria-expanded="false"
    >
      <span></span><span></span>
    </button>
  </div>
</header>`;

export function initHeader() {
  const h = document.querySelector('.header');
  if (!h) return;

  const b = h.querySelector('.burger');

  addEventListener('scroll', () => {
    h.classList.toggle('is-scrolled', scrollY > 8);
  }, { passive: true });

  b.addEventListener('click', () => {
    const opened = h.classList.toggle('is-open');
    b.setAttribute('aria-expanded', String(opened));
  });

  const closeMenu = () => {
    h.classList.remove('is-open');
    b.setAttribute('aria-expanded', 'false');
  };

  h.querySelectorAll('.nav a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  const links = [...h.querySelectorAll('[data-nav]')];

  const map = Object.fromEntries(
    ['product', 'process', 'company', 'demo', 'segments', 'faq']
      .map(id => [id, document.getElementById(id)])
  );

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(link => {
          link.classList.toggle(
            'is-active',
            link.dataset.nav === e.target.id
          );
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  Object.values(map).forEach(el => {
    if (el) io.observe(el);
  });
}
