const VIDEO_SRC = '/videos/demo-video.mp4';
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
        <video class="video__player" playsinline preload="none" poster="${VIDEO_POSTER}" aria-label="Имиджевое видео GOULASH.TECH">
          <source src="${VIDEO_SRC}" type="video/mp4">
          Ваш браузер не поддерживает воспроизведение видео.
        </video>
        <button class="video__play" type="button" aria-label="Воспроизвести видео GOULASH.TECH">
          <span class="video__play-icon" aria-hidden="true">▶</span>
          <span>Смотреть видео</span>
        </button>
      </div>
    </div>
  </div>
</section>`;

export const initVideoShowcase = () => {
  const frame = document.querySelector('.video__frame');
  if (!frame) return;

  const video = frame.querySelector('.video__player');
  const playButton = frame.querySelector('.video__play');
  if (!video || !playButton) return;

  playButton.addEventListener('click', async () => {
    try {
      await video.play();
      video.controls = true;
      playButton.hidden = true;
    } catch (error) {
      playButton.hidden = false;
      console.error('Не удалось запустить видео GOULASH.TECH:', error);
    }
  });

  video.addEventListener('ended', () => {
    video.controls = false;
    video.currentTime = 0;
    playButton.hidden = false;
  });
};
