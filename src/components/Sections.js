
import { problems, cycle, system } from '../data/content.js';
import { icon } from '../utils/icons.js';

export const Problems = () => `
<section class="section section--light" id="problems">
  <div class="container">
    <div class="problems__intro">
      <p class="eyebrow reveal">${problems.eyebrow}</p>
      <h2 class="h2 reveal">${problems.title}</h2>
      <p class="lead reveal">${problems.text}</p>
    </div>

    <div class="problems__grid">
      ${problems.items.map(([t,d,s],i) => `
        <article class="problem-card reveal" style="--d:${i * 0.07}s">
          <div class="problem-card__top">
            <span class="num">0${i + 1}</span>
            <h3>${t}</h3>
          </div>
          <p class="problem-card__description">${d}</p>
          <div class="problem-card__solution">
            ${icon('check',16)}
            <span>${s}</span>
          </div>
        </article>
      `).join('')}
    </div>
  </div>
</section>`;

export const Cycle = () => `
<section class="section section--center" id="process">
  <div class="container">
    <p class="eyebrow reveal">${cycle.eyebrow}</p>
    <h2 class="h2 reveal">${cycle.title}</h2>
    <p class="lead reveal">${cycle.text}</p>

    <div class="badge reveal">
      ${icon('layers',20)}
      <div>
        <b>${cycle.badge[0]}</b>
        <span>${cycle.badge[1]}</span>
      </div>
    </div>

    <ol class="cycle">
      ${cycle.steps.map(([t,d],i) => `
        <li class="reveal" style="--d:${i * 0.12}s">
          <span class="cycle__n">0${i + 1}</span>
          <h3>${t}</h3>
          <p>${d}</p>
        </li>
      `).join('')}
    </ol>
  </div>
</section>`;

export const Features = () => `
<section class="section section--system" id="system">
  <div class="container">
    <p class="eyebrow reveal">${system.eyebrow}</p>
    <h2 class="h2 pixel-title" data-text="${system.title}">${system.title}</h2>
    <p class="lead reveal">${system.text}</p>

    <ol class="system-flow" aria-label="Этапы единой операционной системы">
      ${system.steps.map((step,i) => `
        <li class="system-flow__step reveal" style="--d:${i * 0.06}s">
          <span>${String(i + 1).padStart(2,'0')}</span>
          <b>${step}</b>
        </li>
      `).join('')}
    </ol>

    <div class="features-bento">
      ${system.items.map(([t,d,ic],i) => `
        <article class="card bento-card bento-card--${i + 1} reveal" style="--d:${(i % 3) * 0.07}s">
          <div class="bento-card__top">
            <span class="bento-card__icon">${icon(ic,22)}</span>
            <span class="bento-card__index">0${i + 1} / MODULE</span>
          </div>
          <div class="bento-card__body">
            <h3>${t}</h3>
            <p>${d}</p>
          </div>
          <span class="bento-card__signal" aria-hidden="true">
            <i></i><i></i><i></i><i></i><i></i><i></i>
            <i></i><i></i><i></i><i></i><i></i><i></i>
          </span>
        </article>
      `).join('')}
    </div>

    <p class="foot-line reveal">
      ${icon('arrow',16)} ${system.foot}
    </p>
  </div>
</section>`;

export const BrandPrinciple = () => `
<section class="section brand-principle" id="company">
  <div class="container">

    <div class="brand-principle__label reveal">
      <span class="brand-principle__label-dot" aria-hidden="true"></span>
      <span>Goulash.tech</span>
      <i aria-hidden="true"></i>
      <span>Технологическая компания</span>
    </div>

    <div class="brand-principle__head">
      <div>
        <h2 class="h2 reveal">
          Разные отрасли.<br>
          <span class="accent">Один принцип управления.</span>
        </h2>
      </div>
      <p class="lead reveal">
        Мы создаём отраслевые системы для бизнеса, где результат зависит от десятков связанных действий. Не разрозненные инструменты, а единый контур — от первого события до измеримого результата.
      </p>
    </div>

    <div class="brand-principle__grid">
      <article class="brand-principle__item reveal">
        <span class="brand-principle__index">01 / RESTAURANT OPERATIONS</span>
        <h3>Ресторанная доставка</h3>
        <p>От первого клика и приёма заказа до кухни, маршрута курьера и повторного заказа гостя.</p>
        <a href="https://goulash.tech/" target="_blank" rel="noopener noreferrer">
          Решение для ресторанов ${icon('arrow',15)}
        </a>
      </article>

      <article class="brand-principle__item brand-principle__item--active reveal">
        <span class="brand-principle__index">02 / FIELD SERVICE</span>
        <h3>Выездной сервис</h3>
        <p>От первого обращения до назначения специалиста, выезда на объект, закрытия работы и аналитики.</p>
        <span class="brand-principle__current">Вы на сайте этого направления</span>
      </article>
    </div>

    <p class="brand-principle__foot reveal">
      <b>Общая основа Goulash.tech:</b>
      связать людей, задачи, ресурсы и данные в один управляемый процесс. Отраслевой язык, интерфейс и сценарии — свои для каждого бизнеса.
    </p>
  </div>
</section>`;
