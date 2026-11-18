# Brand film

Place the final MP4 at `public/videos/goulash-brand-film.mp4`.

Then open `src/components/VideoShowcase.js` and change:

```js
const VIDEO_SRC = '';
```

to:

```js
const VIDEO_SRC = '/videos/goulash-brand-film.mp4';
```

The video block intentionally remains in poster-only mode until the actual file is supplied.
