export const HologramShowcase = () => `
<section class="hologram-section" id="company" aria-labelledby="hologram-title">
  <div class="hologram__grid" aria-hidden="true"></div>
  <div class="container hologram__container">
    <div class="hologram-bento">
      <div class="hologram__stage hologram-bento__visual" data-hologram-stage>
        <div class="hologram__scan" aria-hidden="true"></div>
        <div class="hologram__particles-glow" aria-hidden="true"></div>
        <img class="hologram__image hologram__image--base" src="/images/technician-hologram.png" alt="Голографический образ выездного специалиста" loading="eager" decoding="async" fetchpriority="high">
        <img class="hologram__image hologram__image--smile" src="/images/technician-hologram-smile.png" alt="" aria-hidden="true" loading="eager" decoding="async">
        <canvas class="hologram__canvas" aria-hidden="true"></canvas>
        <div class="hologram__floor" aria-hidden="true"></div>
        <span class="hologram__status"><i></i> FIELD SPECIALIST / ONLINE</span>
        <span class="hologram__coordinates" aria-hidden="true">GOULASH SYSTEM / FIELD UNIT 01</span>
      </div>

      <div class="hologram-bento__intro">
        <p class="eyebrow">GOULASH.TECH / PEOPLE AT WORK</p>
        <h2 class="h2" id="hologram-title">Технологии соединяют.<br><span>Люди делают работу.</span></h2>
        <p class="lead">Единая система помогает специалистам, диспетчерам и руководителям видеть общий процесс — от первого обращения до результата.</p>
        <div class="hologram-bento__principle">
          <span>ЕДИНЫЙ ПРИНЦИП</span>
          <b>Одна платформа. Прозрачный процесс. Управляемый результат.</b>
        </div>
      </div>

      <article class="hologram-bento__industry">
        <span class="brand-principle__index">01 / RESTAURANT OPERATIONS</span>
        <h3>Ресторанная доставка</h3>
        <p>От первого клика и приёма заказа до кухни, маршрута курьера и повторного заказа гостя.</p>
        <a href="https://goulash.tech/" target="_blank" rel="noopener noreferrer">Решение для ресторанов <span aria-hidden="true">↗</span></a>
      </article>
      <article class="hologram-bento__industry hologram-bento__industry--active">
        <span class="brand-principle__index">02 / FIELD SERVICE</span>
        <h3>Выездной сервис</h3>
        <p>От первого обращения до назначения специалиста, выезда на объект, закрытия работы и аналитики.</p>
        <span class="hologram-bento__current">Вы на сайте этого направления</span>
      </article>
      <div class="hologram-bento__footer">
        <span>GOULASH / OPERATING SYSTEMS</span>
        <p>Отраслевой язык, интерфейс и сценарии — свои для каждого бизнеса. Общая основа — связанные люди, задачи, ресурсы и данные.</p>
      </div>
    </div>
  </div>
</section>`;
