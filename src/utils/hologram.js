/**
 * GOULASH.TECH — particle hologram
 * The source images are used only as luminance/color maps. Their black
 * backgrounds are converted to transparency before particles are created.
 */
export function initHologram() {
  const stage = document.querySelector('[data-hologram-stage]');
  if (!stage) return;

  const canvas = stage.querySelector('.hologram__canvas');
  const base = stage.querySelector('.hologram__image--base');
  const smile = stage.querySelector('.hologram__image--smile');
  if (!canvas || !base || !smile) return;

  const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
  if (!ctx) {
    stage.classList.add('hologram-fallback');
    base.style.opacity = '1';
    return;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Desktop keeps the exact dense particle look from the approved version.
  // Mobile only changes rendering budget; particle assembly and pulse remain the same.
  const mobile = window.matchMedia('(max-width: 767px)').matches;
  const finePointer = !mobile && window.matchMedia('(pointer: fine)').matches;
  const SOURCE_SIZE = 360;
  const SAMPLE_STEP = 3; // preserve the approved square-pixel structure on both platforms
  const MAX_DPR = mobile ? 1.0 : 1.5;
  const PARTICLE_LIMIT = mobile ? 4200 : 9500;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let imageBox = { x: 0, y: 0, width: 0, height: 0 };
  let particles = [];
  let raf = 0;
  let disposed = false;
  let inView = false;
  let started = false;
  let ready = false;
  let phase = 'idle';
  let phaseAt = 0;
  let lastFrame = 0;
  let pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false };
  let resizeObserver;
  let intersectionObserver;

  const sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = sourceCanvas.height = SOURCE_SIZE;
  const sourceCtx = sourceCanvas.getContext('2d', { willReadFrequently: true });

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const smoothstep = (a, b, x) => {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };

  function scheduleDraw() {
    if (raf || disposed || !inView) return;
    raf = requestAnimationFrame(now => {
      raf = 0;
      // Mobile targets a steady ~30 FPS; desktop remains on the original full RAF cadence.
      if (mobile && now - lastFrame < 32) { scheduleDraw(); return; }
      lastFrame = now;
      try {
        draw(now);
      } catch (error) {
        console.warn('GOULASH hologram render fallback:', error);
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        stage.classList.remove('hologram-rendered', 'hologram-ready');
        stage.classList.add('hologram-fallback');
        base.style.opacity = '1';
        canvas.style.display = 'none';
      }
    });
  }

  const waitForImage = img => {
    if (img.complete) return Promise.resolve(Boolean(img.naturalWidth));
    return new Promise(resolve => {
      const done = () => resolve(Boolean(img.naturalWidth));
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    });
  };

  function imagePixels(img) {
    sourceCtx.clearRect(0, 0, SOURCE_SIZE, SOURCE_SIZE);
    const scale = Math.min(SOURCE_SIZE / img.naturalWidth, SOURCE_SIZE / img.naturalHeight);
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    sourceCtx.drawImage(img, (SOURCE_SIZE - drawW) / 2, (SOURCE_SIZE - drawH) / 2, drawW, drawH);

    const data = sourceCtx.getImageData(0, 0, SOURCE_SIZE, SOURCE_SIZE).data;
    const result = new Map();

    for (let y = 0; y < SOURCE_SIZE; y += SAMPLE_STEP) {
      for (let x = 0; x < SOURCE_SIZE; x += SAMPLE_STEP) {
        const i = (y * SOURCE_SIZE + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Cyan luminance is retained; near-black background becomes transparent.
        const brightness = Math.max(r, g, b);
        const alpha = smoothstep(9, 72, brightness) * (data[i + 3] / 255);
        if (alpha < 0.035) continue;
        result.set(`${x}:${y}`, {
          u: x / SOURCE_SIZE,
          v: y / SOURCE_SIZE,
          r: Math.max(0, r),
          g: Math.max(0, g),
          b: Math.max(0, b),
          alpha
        });
      }
    }
    return result;
  }

  function buildParticles() {
    const a = imagePixels(base);
    const b = imagePixels(smile);
    const keys = new Set([...a.keys(), ...b.keys()]);
    const list = [];

    for (const key of keys) {
      const p = a.get(key);
      const q = b.get(key);
      const source = p || q;
      const angle = Math.random() * Math.PI * 2;
      const distance = 55 + Math.random() * Math.max(width, height) * 0.42;
      list.push({
        u: source.u,
        v: source.v,
        x0: source.u * SOURCE_SIZE,
        y0: source.v * SOURCE_SIZE,
        scatterX: Math.cos(angle) * distance + (Math.random() - 0.5) * 110,
        scatterY: Math.sin(angle) * distance - Math.random() * 130,
        delay: Math.random() * 0.72,
        size: SAMPLE_STEP * (0.82 + Math.random() * 0.34),
        phase: Math.random() * Math.PI * 2,
        drift: 0.45 + Math.random() * 1.5,
        a: p || { ...source, alpha: 0 },
        b: q || { ...source, alpha: 0 }
      });
    }

    // Keep the densest, brightest points when a source is unusually detailed.
    if (list.length > PARTICLE_LIMIT) {
      list.sort((p, q) => Math.max(q.a.alpha, q.b.alpha) - Math.max(p.a.alpha, p.b.alpha));
      list.length = PARTICLE_LIMIT;
    }
    particles = list;
  }

  function resize() {
    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Preserve the image's proportions and let it fill the central visual field.
    const size = Math.min(width * 0.92, height * 0.96);
    imageBox = {
      x: (width - size) / 2,
      y: Math.max(-height * 0.015, (height - size) * 0.43),
      width: size,
      height: size
    };
  }

  function draw(now) {
    raf = 0;
    if (disposed || !inView) return;

    const elapsed = now - phaseAt;
    if (phase === 'assemble' && elapsed >= 3000) {
      phase = 'smile';
      phaseAt = now;
    } else if (phase === 'smile' && elapsed >= 1500) {
      phase = 'pulse';
      phaseAt = now;
    }

    pointer.x += (pointer.tx - pointer.x) * 0.08;
    pointer.y += (pointer.ty - pointer.y) * 0.08;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // Subtle animated cyan field keeps the hologram legible between pixel pulses.
    const fieldPulse = 0.035 + (Math.sin(now * 0.0018) + 1) * 0.018;
    const field = ctx.createRadialGradient(width * 0.5, height * 0.48, 4, width * 0.5, height * 0.48, Math.min(width, height) * 0.48);
    field.addColorStop(0, `rgba(0,255,255,${fieldPulse})`);
    field.addColorStop(1, 'rgba(0,255,255,0)');
    ctx.fillStyle = field;
    ctx.fillRect(0, 0, width, height);

    const morph = phase === 'smile'
      ? smoothstep(0, 1500, elapsed)
      : phase === 'pulse' ? 1 : 0;
    const assembly = phase === 'assemble'
      ? clamp(elapsed / 3000, 0, 1)
      : 1;

    for (const p of particles) {
      const local = clamp((assembly - p.delay * 0.58) / (1 - p.delay * 0.58), 0, 1);
      const ease = 1 - Math.pow(1 - local, 3);
      const targetX = imageBox.x + p.u * imageBox.width;
      const targetY = imageBox.y + p.v * imageBox.height;
      const scatterX = targetX + p.scatterX;
      const scatterY = targetY + p.scatterY;
      let x = scatterX + (targetX - scatterX) * ease;
      let y = scatterY + (targetY - scatterY) * ease;

      const alphaA = p.a.alpha;
      const alphaB = p.b.alpha;
      const alpha = alphaA + (alphaB - alphaA) * morph;
      if (alpha < 0.025) continue;

      // Fade the lower waist into the surrounding field instead of cutting it off.
      const lowerFade = 1 - smoothstep(0.70, 0.99, p.v);
      const pulseWave = (Math.sin(now * 0.0026 + p.phase) + 1) / 2;
      const pulse = 0.58 + pulseWave * 0.42;
      const shimmer = 0.72 + (Math.sin(now * 0.005 + p.phase * 1.7) + 1) * 0.24;
      const cursorDx = pointer.active ? (pointer.x - x) : 0;
      const cursorDy = pointer.active ? (pointer.y - y) : 0;
      const cursorDistance = Math.hypot(cursorDx, cursorDy);
      const cursorInfluence = pointer.active ? Math.max(0, 1 - cursorDistance / 190) : 0;

      if (phase === 'pulse') {
        // Make the hologram visibly breathe: each square pixel gently expands,
        // contracts and drifts independently instead of moving the whole image.
        x += Math.sin(now * 0.0007 + p.phase) * p.drift * 1.35;
        y -= (0.35 + Math.sin(now * 0.0009 + p.phase) * 0.3) * p.drift * 1.2;
      }

      x -= cursorDx * cursorInfluence * 0.018;
      y -= cursorDy * cursorInfluence * 0.018;

      const color = p.a.alpha + (p.b.alpha - p.a.alpha) * morph;
      const r = p.a.r + (p.b.r - p.a.r) * morph;
      const g = p.a.g + (p.b.g - p.a.g) * morph;
      const b = p.a.b + (p.b.b - p.a.b) * morph;
      const opacity = alpha * lowerFade * pulse * shimmer;
      if (opacity < 0.018) continue;

      const size = p.size * (phase === 'pulse' ? 0.72 + pulseWave * 0.82 : 0.68 + ease * 0.42);
      ctx.fillStyle = `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${Math.min(1, opacity)})`;
      ctx.fillRect(x - size / 2, y - size / 2, size, size);

      // A restrained secondary sparkle adds depth without a heavy per-particle blur.
      if (opacity > 0.34 && p.phase > 5.1) {
        ctx.fillStyle = `rgba(185,255,255,${opacity * 0.22})`;
        ctx.fillRect(x - 0.8, y - 0.8, 1.6, 1.6);
      }
    }

    ctx.restore();

    // Switch from the temporary source image to the particle render only after
    // a real Canvas frame has been painted successfully.
    if (!stage.classList.contains('hologram-rendered')) {
      stage.classList.add('hologram-rendered');
      base.style.opacity = '0';
      smile.style.opacity = '0';
    }

    if (phase === 'assemble' || phase === 'smile' || phase === 'pulse') {
      scheduleDraw();
    }
  }

  function start() {
    if (started || disposed || !inView || !ready) return;
    started = true;
    phase = 'assemble';
    phaseAt = performance.now();
    // Keep the source image visible until Canvas has actually painted its first frame.
    // This prevents the stage from flashing empty while it waits outside the viewport.
    canvas.style.display = 'block';
    scheduleDraw();
  }

  function onPointerMove(event) {
    if (!finePointer) return;
    const r = stage.getBoundingClientRect();
    pointer.tx = event.clientX - r.left;
    pointer.ty = event.clientY - r.top;
    pointer.active = true;
    if (phase === 'pulse' && !raf && inView) scheduleDraw();
  }

  function onPointerLeave() {
    pointer.active = false;
  }

  const boot = async () => {
    try {
      const ok = await Promise.all([waitForImage(base), waitForImage(smile)]);
      if (disposed) return;
      if (!ok[0] || !ok[1]) {
        stage.classList.remove('hologram-rendered', 'hologram-ready');
        stage.classList.add('hologram-fallback');
        base.style.opacity = '1';
        canvas.style.display = 'none';
        return;
      }
      buildParticles();
      resize();
      if (!particles.length) throw new Error('Не удалось собрать частицы из исходных изображений');
      ready = true;
      if (reduceMotion) {
        stage.classList.remove('hologram-rendered', 'hologram-ready');
        stage.classList.add('hologram-fallback');
        base.style.opacity = '1';
        return;
      }
      if (inView) start();
    } catch (error) {
      console.warn('GOULASH hologram fallback:', error);
      stage.classList.add('hologram-fallback');
      base.style.opacity = '1';
      canvas.style.display = 'none';
    }
  };

  resizeObserver = new ResizeObserver(() => {
    resize();
    if (phase === 'pulse' && inView && !raf) scheduleDraw();
  });
  resizeObserver.observe(stage);

  intersectionObserver = new IntersectionObserver(entries => {
    const visible = entries.some(entry => entry.isIntersecting);
    inView = visible;
    if (visible) {
      if (!started) start();
      else if (phase === 'pulse' && !raf) scheduleDraw();
    } else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  }, { threshold: 0.12, rootMargin: '80px 0px' });
  intersectionObserver.observe(stage);

  stage.addEventListener('pointermove', onPointerMove, { passive: true });
  stage.addEventListener('pointerleave', onPointerLeave, { passive: true });
  window.addEventListener('resize', resize, { passive: true });

  boot();

  window.addEventListener('pagehide', () => {
    disposed = true;
    if (raf) cancelAnimationFrame(raf);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    stage.removeEventListener('pointermove', onPointerMove);
    stage.removeEventListener('pointerleave', onPointerLeave);
    window.removeEventListener('resize', resize);
  }, { once: true });
}
