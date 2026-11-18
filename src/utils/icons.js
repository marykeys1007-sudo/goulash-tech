const P = {
  clipboard:'<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>',
  nodes:'<circle cx="12" cy="5" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M12 7v4M12 11l-6 5M12 11l6 5"/>',
  users:'<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5a3 3 0 010 6M18 14c2 .7 3 2.4 3 5"/>',
  route:'<circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 6h6a3 3 0 010 6H10a3 3 0 000 6h6"/>',
  signal:'<circle cx="12" cy="12" r="2"/><path d="M7.5 7.5a6 6 0 000 9M16.5 7.5a6 6 0 010 9M4.5 4.5a10 10 0 000 15M19.5 4.5a10 10 0 010 15"/>',
  chart:'<path d="M5 20V10M12 20V4M19 20v-7"/>',
  pin:'<path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  wrench:'<path d="M14.7 6.3a4 4 0 005 5L21 13l-8 8-3-3 8-8zM3 21l5-5"/>',
  alert:'<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
  flask:'<path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3"/>',
  net:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="8.5" y="14" width="7" height="7"/><path d="M6.5 10v2h11v-2M12 12v2"/>',
  layers:'<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check:'<path d="M5 12l5 5 9-10"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  play:'<path d="M7 4l13 8-13 8z"/>', stop:'<rect x="6" y="6" width="12" height="12"/>',
  plus:'<path d="M12 5v14M5 12h14"/>', up:'<path d="M7 17L17 7M8 7h9v9"/>'
};
export const icon = (n, s = 18) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;
export const logo = () => `<a class="logo logo--footer" href="#top" aria-label="Goulash.tech">
  <img class="logo__mark" src="/logo-mark.png" width="42" height="42" alt="" aria-hidden="true" decoding="async">
  <span class="logo__name">Goulash<span>.tech</span></span>
</a>`;
