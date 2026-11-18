# Hologram visibility fix

## What was wrong
The previous implementation made the technician depend on a JavaScript canvas animation. It also hid the base image in reduced-motion mode. If the canvas animation did not start, the image could be invisible.

## What changed
- The base hologram image is now visible by default in the HTML/CSS.
- The image stage no longer depends on the generic `.reveal` animation to become visible.
- Both image frames are loaded eagerly; the canvas only takes over after both images are confirmed loaded and prepared.
- The black image background is converted to transparency before pixel assembly.
- If image loading, canvas setup, or animation fails, the base image remains visible.
- With `prefers-reduced-motion`, the final smiling image is shown directly and the canvas animation is disabled.
- If IntersectionObserver is unavailable, the static image remains visible and animation starts immediately.

## Files changed
- `src/components/HologramShowcase.js`
- `src/utils/animations.js`
- `src/styles/components.css`

## Check locally
```powershell
npm ci
npm run dev
```
Scroll to the section after “Кому подходит”. The technician should be visible even before the animation starts. After the section enters the viewport, the pixel build and smile transition should play.
