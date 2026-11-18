
export function initReveal() {
  const els = document.querySelectorAll('.reveal');

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(e => e.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver(
    es => es.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  );

  els.forEach(e => io.observe(e));
}


// Пиксельная сборка заголовков.
export function initPixelTitles() {
  document.querySelectorAll('.pixel-title').forEach(el => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      run(el);
    }, { threshold: 0.4 });

    io.observe(el);
  });

  function run(el) {
    const cs = getComputedStyle(el);
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);

    const text = el.dataset.text;
    const cv = document.createElement('canvas');

    cv.width = w * dpr;
    cv.height = h * dpr;
    cv.className = 'pixel-canvas';

    const ctx = cv.getContext('2d');
    const src = document.createElement('canvas');

    src.width = cv.width;
    src.height = cv.height;

    const sx = src.getContext('2d');
    sx.fillStyle = cs.color;
    sx.font = `${cs.fontWeight} ${parseFloat(cs.fontSize) * dpr}px ${cs.fontFamily}`;
    sx.textBaseline = 'middle';
    sx.fillText(text, 0, src.height / 2);

    el.style.position = 'relative';
    el.classList.add('is-pixel');
    el.appendChild(cv);

    const sizes = [28, 20, 14, 10, 6, 3, 1];
    let i = 0;

    (function step() {
      const s = sizes[i] * dpr;
      const tiny = document.createElement('canvas');

      tiny.width = Math.ceil(src.width / s);
      tiny.height = Math.ceil(src.height / s);

      tiny.getContext('2d').drawImage(
        src, 0, 0, tiny.width, tiny.height
      );

      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        tiny, 0, 0, tiny.width * s, tiny.height * s
      );

      if (++i < sizes.length) {
        setTimeout(step, 110);
      } else {
        el.classList.remove('is-pixel');
        setTimeout(() => cv.remove(), 60);
      }
    })();
  }
}


export function initFooterPixels() {
  const el = document.querySelector('.footer-pixel-word');
  if (!el) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    io.disconnect();

    if (reduce) {
      el.classList.add('is-visible');
      return;
    }

    const run = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(devicePixelRatio || 1, 1.5);

      const canvas = document.createElement('canvas');
      canvas.className = 'footer-pixel-canvas';
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      const ctx = canvas.getContext('2d');

      if (!ctx) {
        el.classList.add('is-visible');
        return;
      }

      const source = document.createElement('canvas');
      source.width = canvas.width;
      source.height = canvas.height;

      const sx = source.getContext('2d');
      const cs = getComputedStyle(el);

      sx.scale(dpr, dpr);
      sx.font = `900 ${parseFloat(cs.fontSize)}px ${cs.fontFamily}`;
      sx.textAlign = 'center';
      sx.textBaseline = 'middle';
      sx.fillStyle = '#00FFFF';
      sx.fillText('GOULASH.TECH', w / 2, h / 2, w * 0.98);

      el.appendChild(canvas);
      el.classList.add('is-pixel-building');

      const sizes = [18, 12, 8, 5, 3, 1];
      let i = 0;

      const step = () => {
        const size = sizes[i] * dpr;
        const small = document.createElement('canvas');

        small.width = Math.max(1, Math.ceil(source.width / size));
        small.height = Math.max(1, Math.ceil(source.height / size));

        small.getContext('2d').drawImage(
          source, 0, 0, small.width, small.height
        );

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
          small, 0, 0, small.width * size, small.height * size
        );

        i++;

        if (i < sizes.length) {
          setTimeout(step, 95);
        } else {
          el.classList.remove('is-pixel-building');
          el.classList.add('is-visible');
          setTimeout(() => canvas.remove(), 80);
        }
      };

      step();
    };

    requestAnimationFrame(run);
  }, { threshold: 0.12 });

  io.observe(el);
}


export function initNetworkTilt() {
  const card = document.querySelector('.netlive');

  if (
    !card ||
    matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !matchMedia('(pointer: fine)').matches ||
    matchMedia('(max-width: 767px)').matches
  ) return;

  let frame = 0;
  let pending = null;

  const move = e => {
    const r = card.getBoundingClientRect();

    const x = Math.max(
      -0.5,
      Math.min(0.5, (e.clientX - r.left) / r.width - 0.5)
    );

    const y = Math.max(
      -0.5,
      Math.min(0.5, (e.clientY - r.top) / r.height - 0.5)
    );

    pending = { x, y };

    if (!frame) {
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!pending) return;

        card.style.setProperty(
          '--tilt-x',
          `${(-pending.y * 4.5).toFixed(2)}deg`
        );

        card.style.setProperty(
          '--tilt-y',
          `${(pending.x * 4.5).toFixed(2)}deg`
        );

        pending = null;
      });
    }
  };

  const reset = () => {
    pending = null;

    if (frame) cancelAnimationFrame(frame);
    frame = 0;

    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  };

  card.addEventListener('pointermove', move, { passive: true });
  card.addEventListener('pointerleave', reset, { passive: true });
  card.addEventListener('pointercancel', reset, { passive: true });

  addEventListener('pagehide', () => {
    reset();
    card.removeEventListener('pointermove', move);
    card.removeEventListener('pointerleave', reset);
    card.removeEventListener('pointercancel', reset);
  }, { once: true });
}


export function initPixelTrail() {
  // Эффект работает в секции «Проблема».
  const section = document.getElementById('problems');

  if (!section) return;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;

  if (reduceMotion || !finePointer) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'problems-pixel-trail';
  canvas.setAttribute('aria-hidden', 'true');

  section.prepend(canvas);

  const ctx = canvas.getContext('2d', { alpha: true });

  if (!ctx) {
    canvas.remove();
    return;
  }

  // Размер ячейки пиксельной сетки.
  const CELL = 11;

  // Радиус действия курсора оставлен прежним.
  const RADIUS = 155;
  const MAX_DPR = 1.5;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let columns = 0;
  let rows = 0;
  let pixels = [];
  let raf = 0;
  let lastTime = 0;
  let pointerInside = false;

  const pointer = {
    x: -10000,
    y: -10000,
    targetX: -10000,
    targetY: -10000
  };

  function resize() {
    const rect = section.getBoundingClientRect();

    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    columns = Math.ceil(width / CELL);
    rows = Math.ceil(height / CELL);

    pixels = [];

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        pixels.push({
          x: x * CELL,
          y: y * CELL,
          alpha: 0,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    schedule();
  }

  // Плавное движение курсора.
  function updatePointer() {
    const smoothing = 0.19;

    pointer.x += (pointer.targetX - pointer.x) * smoothing;
    pointer.y += (pointer.targetY - pointer.y) * smoothing;
  }

  function draw(time) {
    raf = 0;

    const delta = lastTime
      ? Math.min((time - lastTime) / 16.67, 2)
      : 1;

    lastTime = time;

    updatePointer();
    ctx.clearRect(0, 0, width, height);

    let hasVisiblePixels = false;

    for (const p of pixels) {
      const centerX = p.x + CELL / 2;
      const centerY = p.y + CELL / 2;

      const dx = centerX - pointer.x;
      const dy = centerY - pointer.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      let targetAlpha = 0;

      if (pointerInside && distance < RADIUS) {
        const influence = 1 - distance / RADIUS;
        const smooth = influence * influence * (3 - 2 * influence);

        targetAlpha = smooth * 0.58;
      }

      const speed = targetAlpha > p.alpha ? 0.2 : 0.105;
      p.alpha += (targetAlpha - p.alpha) * speed * delta;

      if (p.alpha > 0.008) {
        hasVisiblePixels = true;

        // Пульсация размера пикселей.
        // Каждый пиксель имеет собственную фазу,
        // поэтому сетка выглядит живой, а не мигает целиком.
        const pulse = (
          Math.sin(time * 0.002 + p.phase) + 1
        ) / 2;

        // Пиксели слегка увеличиваются и соприкасаются.
        const pixelSize = CELL - 0.6 + pulse * 1.6;

        const shimmer =
          0.88 + Math.sin(time * 0.0015 + p.phase) * 0.12;

        const alpha = p.alpha * shimmer;

        ctx.fillStyle = `rgba(0, 145, 150, ${alpha})`;

        ctx.fillRect(
          centerX - pixelSize / 2,
          centerY - pixelSize / 2,
          pixelSize,
          pixelSize
        );
      }
    }

    const pointerMoving =
      Math.abs(pointer.targetX - pointer.x) > 0.3 ||
      Math.abs(pointer.targetY - pointer.y) > 0.3;

    if (hasVisiblePixels || pointerMoving) {
      raf = requestAnimationFrame(draw);
    } else {
      lastTime = 0;
    }
  }

  function schedule() {
    if (!raf) {
      raf = requestAnimationFrame(draw);
    }
  }

  function onPointerMove(event) {
    const rect = section.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (x < 0 || y < 0 || x > width || y > height) {
      return;
    }

    if (!pointerInside) {
      pointer.x = x;
      pointer.y = y;
    }

    pointer.targetX = x;
    pointer.targetY = y;
    pointerInside = true;

    schedule();
  }

  function onPointerLeave() {
    pointerInside = false;
    pointer.targetX = -10000;
    pointer.targetY = -10000;

    schedule();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(section);

  section.addEventListener('pointermove', onPointerMove, {
    passive: true
  });

  section.addEventListener('pointerleave', onPointerLeave, {
    passive: true
  });

  window.addEventListener('resize', resize, { passive: true });

  resize();

  window.addEventListener('pagehide', () => {
    if (raf) cancelAnimationFrame(raf);

    resizeObserver.disconnect();

    section.removeEventListener('pointermove', onPointerMove);
    section.removeEventListener('pointerleave', onPointerLeave);

    window.removeEventListener('resize', resize);

    canvas.remove();
  }, { once: true });
}


// Пиксельная волна на границах секций.
export function initMatrixFlow() {
  const main = document.querySelector('main');

  // This ambient full-viewport canvas is decorative and comparatively costly
  // on touch devices, so keep it for desktop and leave mobile scrolling light.
  if (
    !main ||
    matchMedia('(prefers-reduced-motion: reduce)').matches ||
    matchMedia('(max-width: 767px), (pointer: coarse)').matches
  ) {
    return;
  }

  const sections = [...main.querySelectorAll(':scope > section.section')];

  if (sections.length < 2) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'matrix-flow';
  canvas.setAttribute('aria-hidden', 'true');

  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d', { alpha: true });

  if (!ctx) {
    canvas.remove();
    return;
  }

  const mobile = matchMedia('(max-width: 700px)').matches;
  const step = mobile ? 18 : 13;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let raf = 0;
  let disposed = false;

  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, mobile ? 1.25 : 1.5);

    width = innerWidth;
    height = innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    schedule();
  };

  const draw = (time = 0) => {
    raf = 0;

    if (disposed) return;

    ctx.clearRect(0, 0, width, height);

    let visible = false;

    sections.slice(0, -1).forEach((section, index) => {
      const y = section.getBoundingClientRect().bottom;

      if (y < -64 || y > height + 64) return;

      visible = true;

      const next = sections[index + 1];
      const light = next.classList.contains('section--light');
      const color = light ? '0,127,131' : '0,255,255';

      const fade = Math.max(
        0,
        1 - Math.abs(y - height * 0.5) / (height * 0.68)
      );

      for (let x = step / 2; x < width; x += step) {
        const wave = Math.sin(x * 0.018 + time * 0.00055 + index * 0.8);
        const drift = Math.sin(x * 0.007 - time * 0.00028) * 5;

        const py = y + wave * (mobile ? 7 : 12) + drift;
        const alpha = (0.12 + (0.16 * (wave + 1) / 2)) * fade;
        const size = mobile ? 2.5 : 3.5;

        ctx.fillStyle = `rgba(${color},${alpha})`;

        ctx.fillRect(
          Math.round(x / step) * step,
          Math.round(py / step) * step,
          size,
          size
        );
      }
    });

    if (visible) {
      raf = requestAnimationFrame(draw);
    }
  };

  function schedule() {
    if (!raf && !disposed) {
      raf = requestAnimationFrame(draw);
    }
  }

  const onScroll = () => schedule();

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', resize, { passive: true });

  const ro = new ResizeObserver(resize);
  ro.observe(main);

  resize();

  addEventListener('pagehide', () => {
    disposed = true;

    if (raf) cancelAnimationFrame(raf);

    ro.disconnect();

    removeEventListener('scroll', onScroll);
    removeEventListener('resize', resize);

    canvas.remove();
  }, { once: true });
}


// Голограмма.
export function initHologram() {
  const stage = document.querySelector('[data-hologram-stage]');

  if (!stage) return;

  const canvas = stage.querySelector('.hologram__canvas');
  const base = stage.querySelector('.hologram__image--base');
  const smile = stage.querySelector('.hologram__image--smile');

  if (!base || !smile) return;

  const reduced = window.matchMedia?.(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const showFallback = () => {
    base.style.opacity = '1';
    smile.style.opacity = '0';

    if (canvas) canvas.style.opacity = '0';
  };

  showFallback();

  if (reduced) {
    base.style.opacity = '0';
    smile.style.opacity = '1';
    return;
  }

  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  const grid = 160;

  const a = document.createElement('canvas');
  const b = document.createElement('canvas');

  a.width = a.height = b.width = b.height = grid;

  const ac = a.getContext('2d');
  const bc = b.getContext('2d');

  if (!ac || !bc) return;

  let w = 0;
  let h = 0;
  let dpr = 1;
  let raf = 0;
  let phase = 'idle';
  let phaseAt = 0;
  let last = 0;
  let disposed = false;
  let observer = null;
  let resizeObserver = null;

  const wait = img => img.complete
    ? Promise.resolve(img.naturalWidth > 0)
    : new Promise(resolve => {
        img.addEventListener(
          'load',
          () => resolve(img.naturalWidth > 0),
          { once: true }
        );

        img.addEventListener(
          'error',
          () => resolve(false),
          { once: true }
        );
      });

  const resize = () => {
    const r = stage.getBoundingClientRect();

    if (!r.width || !r.height) return;

    w = r.width;
    h = r.height;
    dpr = Math.min(devicePixelRatio || 1, 1.5);

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const prepare = (target, img) => {
    target.clearRect(0, 0, grid, grid);
    target.drawImage(img, 0, 0, grid, grid);

    const im = target.getImageData(0, 0, grid, grid);

    for (let i = 0; i < im.data.length; i += 4) {
      const v = Math.max(
        im.data[i],
        im.data[i + 1],
        im.data[i + 2]
      );

      im.data[i + 3] = v < 10
        ? 0
        : Math.min(255, Math.round((v - 10) * 3.4));
    }

    target.putImageData(im, 0, 0);
  };

  const box = () => {
    const size = Math.min(w * 1.18, h * 1.22);

    return {
      x: (w - size) / 2,
      y: Math.max(-8, (h - size) * 0.15),
      size
    };
  };

  const draw = (source, block) => {
    const { x, y, size } = box();
    const n = Math.max(2, Math.ceil(grid / block));

    const small = document.createElement('canvas');
    small.width = small.height = n;

    const sc = small.getContext('2d');

    sc.imageSmoothingEnabled = true;
    sc.drawImage(source, 0, 0, n, n);

    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(small, x, y, size, size);
    ctx.imageSmoothingEnabled = true;
  };

  const pulse = now => {
    const { x, y, size } = box();
    const cell = size / grid;
    const data = b.getImageData(0, 0, grid, grid).data;

    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    for (let py = 0; py < grid; py++) {
      for (let px = 0; px < grid; px++) {
        const i = (py * grid + px) * 4;
        const alpha = data[i + 3] / 255;

        if (alpha < 0.035) continue;

        const wave = (
          Math.sin(now * 0.0016 + px * 0.13 + py * 0.08) +
          Math.sin(now * 0.0008 - py * 0.1 + px * 0.05)
        ) * 0.5;

        const k = 0.88 + wave * 0.14;

        ctx.fillStyle = `rgba(${Math.min(255, data[i] * k)},${Math.min(255, data[i + 1] * k)},${Math.min(255, data[i + 2] * k)},${Math.min(1, alpha * (0.88 + wave * 0.1))})`;

        ctx.fillRect(
          x + px * cell,
          y + py * cell,
          cell + 0.35,
          cell + 0.35
        );
      }
    }

    ctx.restore();
  };

  const frame = now => {
    raf = 0;

    if (disposed) return;

    if (phase === 'build') {
      const steps = [36, 28, 21, 16, 12, 9, 6, 4, 2, 1];

      const idx = Math.min(
        steps.length - 1,
        Math.floor((now - phaseAt) / 135)
      );

      draw(a, steps[idx]);

      if (idx === steps.length - 1) {
        phase = 'smile';
        phaseAt = now;
      }

      raf = requestAnimationFrame(frame);
      return;
    }

    if (phase === 'smile') {
      const t = Math.min(1, (now - phaseAt) / 1000);

      const mix = document.createElement('canvas');
      mix.width = mix.height = grid;

      const m = mix.getContext('2d');

      m.drawImage(a, 0, 0);
      m.globalAlpha = t;
      m.drawImage(b, 0, 0);

      draw(mix, 1);

      if (t >= 1) {
        phase = 'pulse';
        last = 0;
      }

      raf = requestAnimationFrame(frame);
      return;
    }

    if (phase === 'pulse') {
      if (now - last > 34) {
        last = now;
        pulse(now);
      }

      raf = requestAnimationFrame(frame);
    }
  };

  const start = async () => {
    if (phase !== 'idle' || disposed) return;

    phase = 'loading';

    try {
      const ok = await Promise.all([wait(base), wait(smile)]);

      if (disposed) return;

      if (!ok[0] || !ok[1] || !w || !h) {
        phase = 'fallback';
        showFallback();
        return;
      }

      prepare(ac, base);
      prepare(bc, smile);

      phase = 'build';
      phaseAt = performance.now();

      canvas.style.opacity = '1';

      const first = () => {
        if (disposed) return;

        draw(a, 36);
        base.style.opacity = '0';

        raf = requestAnimationFrame(frame);
      };

      first();
    } catch (e) {
      console.warn('Hologram fallback:', e);

      phase = 'fallback';
      showFallback();
    }
  };

  resize();

  resizeObserver = window.ResizeObserver
    ? new ResizeObserver(resize)
    : null;

  resizeObserver?.observe(stage);

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        observer.disconnect();
        start();
      }
    }, {
      threshold: 0.02,
      rootMargin: '180px 0px'
    });

    observer.observe(stage);
  } else {
    start();
  }

  window.addEventListener('pagehide', () => {
    disposed = true;

    if (raf) cancelAnimationFrame(raf);

    observer?.disconnect();
    resizeObserver?.disconnect();
  }, { once: true });
}
