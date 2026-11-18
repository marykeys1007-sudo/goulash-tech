import './styles/variables.css';
import './styles/global.css';
import './styles/components.css';
import './styles/responsive.css';
import './styles/hologram.css';

import { Header, initHeader } from './components/Header.js';
import { Hero } from './components/Hero.js';
import { VideoShowcase } from './components/VideoShowcase.js';
import { Problems, Features } from './components/Sections.js';
import { DemoDashboard, initDemo } from './components/DemoDashboard.js';
import { Segments, initPersonaCarousel } from './components/Segments.js';
import { HologramShowcase } from './components/HologramShowcase.js';
import { Calculator, initCalc } from './components/Calculator.js';
import { Blog } from './components/Blog.js';
import { FAQ, initFAQ } from './components/FAQ.js';
import { LeadForm, initForm } from './components/LeadForm.js';
import { Footer } from './components/Footer.js';
import {
  initReveal,
  initPixelTitles,
  initFooterPixels,
  initNetworkTilt,
  initPixelTrail,
  initMatrixFlow
} from './utils/animations.js';
import { initHologram } from './utils/hologram.js';

document.getElementById('app').innerHTML = Header() + '<main>' + [
  Hero,
  VideoShowcase,
  HologramShowcase,
  Problems,
  Features,
  DemoDashboard,
  Segments,
  Calculator,
  Blog,
  FAQ,
  LeadForm
].map(component => component()).join('') + '</main>' + Footer();

initHeader();
initDemo();
initCalc();
initFAQ();
initForm();
initHologram();
initReveal();
initPixelTitles();
initFooterPixels();
initNetworkTilt();
initPixelTrail();
initMatrixFlow();
initPersonaCarousel();
