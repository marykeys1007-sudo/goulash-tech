// Подключите файл после его добавления в public/videos:
// const VIDEO_SRC = '/videos/goulash-brand-film.mp4';
const VIDEO_SRC = '';
const VIDEO_POSTER = '/images/blog/dispatch-team.webp';

export const VideoShowcase = () => `
<section class="section section--video" id="video">
  <div class="container">
    <p class="eyebrow reveal">GOULASH.TECH · В работе</p>
    <div class="video__layout">
      <div class="video__copy">
        <h2 class="h2 reveal">От заявки до результата — в одной системе</h2>
        <p class="lead reveal">GOULASH.TECH объединяет клиентов, диспетчеров, специалистов, маршруты и контроль выполнения работ в единую управляемую операционную среду.</p>
        <p class="video__tagline reveal">Один контур. Все процессы. Полный контроль.</p>
      </div>
      <div class="video__frame reveal">
        ${VIDEO_SRC
          ? `<video class="video__player" controls playsinline preload="none" poster="${VIDEO_POSTER}">
              <source src="${VIDEO_SRC}" type="video/mp4">
              Ваш браузер не поддерживает воспроизведение видео.
            </video>`
          : `<div class="video__placeholder" role="img" aria-label="Обложка будущего рекламного видео GOULASH.TECH">
              <img src="${VIDEO_POSTER}" alt="" loading="lazy" decoding="async">
              <div class="video__placeholder-content">
                <span class="tag tag--acc">ИМИДЖЕВЫЙ РОЛИК</span>
                <strong>GOULASH.TECH</strong>
                <span>Видео будет подключено перед публикацией</span>
              </div>
            </div>`
        }
      </div>
    </div>
  </div>
</section>`;
