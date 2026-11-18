# Визуальная корректировка GOULASH.TECH

- Network Live теперь наклоняется целиком: трансформ применяется к `.netlive`, а карта внутри не перемещается и не наклоняется отдельно. Амплитуда — до 4,5°.
- Удалён внутренний сдвиг карты (`--shift-x/--shift-y`).
- Возвращена фирменная палитра исходного макета: почти чёрная основа, тёмные графитово-зелёные поверхности и бирюзовый акцент.
- Сохранены пиксельные заголовки, pixel-flow, анимация появления цифровых блоков и оригинальный пиксельный знак из `public/favicon.svg`.
- Архитектура, контентные блоки и порядок секций не перестраивались.


## 2026-11-18 — Audience contrast and technician hologram
- Replaced the bright light audience panel with a dark Goulash surface and high-contrast readable text; cyan is now used for accents only.
- Added a full-width technician hologram scene immediately after the audience section.
- Added scroll-triggered pixel assembly, a transition from neutral expression to a smiling hologram, and a continuous low-amplitude pixel shimmer.
- Added reduced-motion fallback and documented the two image assets.


## Дополнительная стабилизация интерфейса (18.11.2026)

- В демо-панели оболочка и вкладки больше не пересоздаются при каждом клике: обновляется только содержимое активной панели. Убрана принудительная прокрутка `window.scrollTo`, сохраняется внутреннее положение списка и фокус поля поиска.
- Полоса прокрутки списков демо стилизована под фирменный тёмный интерфейс с бирюзовым бегунком.
- В подвале используется тот же квадратный знак `/logo-mark.png`, что и в шапке, рядом с текстовым названием.
- Голограмма загружает исходники из `/images/`, не запускает пустой Canvas при отсутствии контекста или частиц и показывает базовый образ как резерв, если рендеринг не удался. Инициализация перенесена раньше остальных декоративных эффектов.
