// ── EASTER EGG ────────────────────────────────────────────────
console.log('%c💣 BOOM.', 'font-size:2.5rem;font-weight:900;color:#e8401c;');
console.log(
  '%cT\'as inspecté le code. Respect.\n\nEvan Ropars — Data Marketing\n📩 evanropars63@gmail.com\n🔗 linkedin.com/in/evan-ropars-900147292\n\nSi tu cherches quelqu\'un qui sait ce qu\'il fait côté data & marketing\n(et qui code ses propres portfolios), on a des choses à se dire 👀',
  'font-size:.85rem;color:#f5d440;line-height:1.8;'
);
console.log('%c— Fait maison, sans template. 🖤', 'font-size:.7rem;color:rgba(255,255,255,.35);');

/* ============================================================
   EVAN ROPARS — Portfolio · script.js
   ============================================================


   TABLE DES MATIÈRES
   ──────────────────
   1.  Cursor personnalisé
   2.  Navigation scroll & lien actif
   3.  Stickers parallax (mousemove)
   4.  Letter stickers (hover sur nom)
   5.  Bouton 3D (tilt au hover)
   6.  Reveal on scroll (IntersectionObserver)

   ============================================================ */


// === CURSOR ===
const cd = document.getElementById('cd'),
  crr = document.getElementById('crr');
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cd.style.transform = `translate(${mx-6}px,${my-6}px)`
});
(function loop() {
  rx += (mx - rx - 22) * .1;
  ry += (my - ry - 22) * .1;
  document.getElementById('cr').style.transform = `translate(${rx}px,${ry}px)`;
  requestAnimationFrame(loop)
})();
document.querySelectorAll('a,button,.project-row,.sticker').forEach(el => {
  el.addEventListener('mouseenter', () => crr.classList.add('hover'));
  el.addEventListener('mouseleave', () => crr.classList.remove('hover'));
});

// === NAV SCROLL ===
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', scrollY > 60);
  const sections = ['work', 'about', 'data', 'contact'];
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && scrollY >= el.offsetTop - 200) current = id;
  });
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.remove('nav-link-active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('nav-link-active');
  });
});

// === STICKERS PARALLAX ===
const stickers = document.querySelectorAll('.sticker[data-depth]');
document.addEventListener('mousemove', e => {
  const cx = window.innerWidth / 2,
    cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx,
    dy = (e.clientY - cy) / cy;
  stickers.forEach(s => {
    const depth = parseFloat(s.dataset.depth || 4);
    const rot = s.style.transform.match(/rotate\(([^)]+)\)/);
    const r = rot ? rot[0] : 'rotate(0deg)';
    s.style.transform = `${r} translate(${dx*depth}px,${dy*depth}px)`;
  });
});

// === LETTER IMAGE STICKERS ===
const lsMap = {
  'E': 'ls-E',
  'V': 'ls-V',
  'A': 'ls-A',
  'N': 'ls-N',
  'R1': 'ls-R',
  'O': 'ls-O',
  'P': 'ls-P',
  'A2': 'ls-A2',
  'S': 'ls-S'
};
let currentLS = null;

function showSticker(key, x, y) {
  const id = lsMap[key];
  if (!id) return;
  if (currentLS && currentLS !== id) {
    const prev = document.getElementById(currentLS);
    if (prev) prev.classList.remove('visible');
  }
  currentLS = id;
  const el = document.getElementById(id);
  if (el) {
    el.style.left = (x + 20) + 'px';
    el.style.top = (y - 20) + 'px';
    void el.offsetWidth;
    el.classList.add('visible');
  }
}

function hideSticker(key) {
  const id = lsMap[key];
  if (!id) return;
  const el = document.getElementById(id);
  if (el) el.classList.remove('visible');
  currentLS = null;
}

function moveSticker(key, x, y) {
  const id = lsMap[key];
  if (!id) return;
  const el = document.getElementById(id);
  if (el) {
    el.style.left = (x + 20) + 'px';
    el.style.top = (y - 20) + 'px';
  }
}

document.querySelectorAll('.letter-wrap').forEach(lw => {
  const key = lw.dataset.letter;
  lw.addEventListener('mouseenter', e => showSticker(key, e.clientX, e.clientY));
  lw.addEventListener('mousemove', e => moveSticker(key, e.clientX, e.clientY));
  lw.addEventListener('mouseleave', () => hideSticker(key));
});

// === 3D BUTTON ===
const bigBtn = document.getElementById('bigBtn');
if (bigBtn) {
  bigBtn.addEventListener('mousemove', e => {
    const r = bigBtn.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - .5) * 20;
    const y = -((e.clientY - r.top) / r.height - .5) * 20;
    bigBtn.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg)`;
  });
  bigBtn.addEventListener('mouseleave', () => {
    bigBtn.style.transform = 'perspective(600px) rotateX(0) rotateY(0)';
  });
}
// === LECTEUR AUDIO ===
const audio = document.getElementById('amAudio');
const playBtn = document.getElementById('amPlay');
const playIcon = document.getElementById('amPlayIcon');
const fill = document.getElementById('amFill');
const bar = document.getElementById('amBar');
const current = document.getElementById('amCurrent');
const duration = document.getElementById('amDuration');

function fmt(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m + ':' + (sec < 10 ? '0' : '') + sec;
}

if (audio && playBtn) {
  audio.addEventListener('loadedmetadata', () => {
    duration.textContent = fmt(audio.duration);
  });
  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      playIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    } else {
      audio.pause();
      playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
    }
  });
  audio.addEventListener('timeupdate', () => {
    const pct = (audio.currentTime / audio.duration) * 100;
    fill.style.width = pct + '%';
    current.textContent = fmt(audio.currentTime);
  });
  bar.addEventListener('click', e => {
    const rect = bar.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  });
  document.getElementById('amBack').addEventListener('click', () => {
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  });
  document.getElementById('amForward').addEventListener('click', () => {
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
  });
}

// ── COUNTDOWN DISPO ───────────────────────────────────────────
(function () {
  const target = new Date('2026-09-01T00:00:00');
  function update() {
    const diff = Math.ceil((target - new Date()) / 86400000);
    const el = document.getElementById('countdownNum');
    if (el) el.textContent = diff > 0 ? diff : 0;
  }
  update();
  setInterval(update, 60000);
})();

// ── I18N ──────────────────────────────────────────────────────
const I18N = {
  fr: {
    'nav-work':'Projets','nav-about':'Histoire','nav-data':'Compétences','nav-cta':'Me recruter',
    'hero-eyebrow':'Disponible en alternance · Data Marketing · Lyon',
    'hero-intro':'Étudiant en marketing, je construis une expertise<br>à l\'intersection du <strong>créatif</strong> et de la <strong>data.</strong>',
    'sticker-abonnes':'ABONNÉS','sticker-dispo':'Dispo sept. 2026',
    'countdown-label':'jours avant ma dispo',
    'personal-label':'Qui je suis vraiment',
    'personal-title':'Au-delà<br><em>du CV.</em>',
    'quote-label':'Citation préférée',
    'quote-text':'« Il fait toute chose bonne en son temps\u00a0; même il a mis dans leur cœur la pensée de l\'éternité... »',
    'quote-ref':'Ecclésiaste 3:11',
    'bio-label':'À propos',
    'about-label':'Mon histoire',
    'about-h2':'Le travail n\'a jamais<br>été une option.',
    'about-p1':'C\'est une conviction que j\'ai depuis longtemps. Pas parce qu\'on me l\'a imposé, mais parce que j\'ai compris très tôt que rien ne tombe du ciel. Avant même d\'arriver en marketing, j\'ai enchaîné les expériences : commercial en agence de communication, hôte d\'accueil, chef de pôle dans une association étudiante, préparation militaire. <strong>J\'ai toujours cherché à me confronter au terrain, pas juste à apprendre en cours.</strong>',
    'about-p2':'Ce qui m\'a progressivement attiré, c\'est la jonction entre <strong>la créativité et la mesure</strong>. Créer une belle campagne c\'est bien, mais comprendre pourquoi elle performe, analyser les données, optimiser en temps réel, c\'est ce qui me fascine vraiment. Mon objectif est clair : <strong>un master en e-Business et Data Marketing</strong>.',
    'about-p3':'Chez <strong>Venandi</strong>, j\'ai eu la chance de tout piloter en autonomie, Google Ads, site Shopify, SEO, réseaux. Avant ça, chez <strong>Beelive Community</strong>, j\'ai géré des actions marketing complètes. Ce n\'est pas un hasard si on me fait confiance sur des missions larges aussi tôt. C\'est le résultat de plusieurs années à toujours mettre un peu plus que ce qu\'on attendait de moi.',
    'about-p4':'Basé à <strong>Lyon</strong>, disponible en <strong>alternance dès septembre 2026</strong>. Je cherche une équipe ambitieuse, un environnement où la data et le marketing se parlent vraiment.',
    'work-h2':'Mes <em>projets</em>','work-sub':'03 réalisations',
    'proj1-stat-label':'abonnés en 6 mois','proj1-sub':'Responsable Marketing & Communication · Alternance',
    'proj2-stat-val':'Brandbook','proj2-stat-label':'complet','proj2-sub':'Brand Identity complète — nature sauvage',
    'proj3-stat-label':'jury simulé banque','proj3-sub':'Concept bar à vin fictif',
    'data-label':'Mon expertise cible',
    'data-h2':'La data au service<br>du <strong>marketing</strong>',
    'tool1-name':'Analytics','tool1-desc':'GA4, Looker Studio, dashboards de performance — transformer les données en décisions concrètes.',
    'tool2-name':'IA & Automatisation','tool2-desc':'Prompting avancé, ChatGPT, Midjourney, automatisation de workflows — utiliser l\'IA comme levier de productivité marketing.',
    'tool3-name':'SEO / SEMrush','tool3-desc':'Optimisation on-page sur 40+ pages, stratégie de contenu et suivi de la visibilité organique.',
    'tool4-name':'Shopify / WordPress','tool4-desc':'Architecture, UX, intégration contenus et mise en ligne — de la conception à la publication.',
    'tool5-name':'Branding & Stratégie','tool5-desc':'Identité de marque, positionnement, proposition de valeur — le fond derrière la forme.',
    'tool6-name':'Social & Contenu','tool6-desc':'Vidéo, posts, stories — +1 600 abonnés en 6 mois avec analyse et optimisation des formats.',
    'contact-h2':'Travaillons<br><em>ensemble.</em>',
    'contact-p':'Je cherche une alternance en data marketing ou e-business à Lyon dès septembre 2026. Si vous construisez quelque chose d\'ambitieux et que vous voulez quelqu\'un qui s\'investit à fond, on a des choses à se dire.',
    'contact-hint':'Appuyez sur ce bouton pour m\'envoyer un courriel',
    'contact-btn':'Me contacter',
    'footer-p':'Data Marketing · Sup de Pub Lyon · Disponible sept. 2026',
    'cv-download':'Télécharger mon CV',
    'cv-badge-dispo':'Dispo 09/26',
    'cv-sec-0':'Formation','cv-sec-1':'Expériences','cv-sec-2':'Compétences','cv-sec-3':'Langues','cv-sec-4':'Centres d\'intérêt',
    'cv-edu1-title':'Bachelor Stratégie de Marque','cv-edu2-title':'BUT Techniques de Commercialisation','cv-edu3-title':'BAC STMG — Mention Assez Bien',
    'cv-exp1-title':'Responsable Mktg & Com — Venandi','cv-exp1-date':'Depuis sept. 2025','cv-exp1-sub':'Alternance · Lyon','cv-exp1-desc':'SEO · Google Ads · Shopify · Google Analytics · +1 600 abonnés en 6 mois',
    'cv-exp2-title':'Resp. Com. & Développement — Beelive','cv-exp2-date':'Avr–Juin 2025','cv-exp2-desc':'Marketing, événements, digital, prospection, partenariats',
    'cv-exp3-title':'Chef Pôle Communication — ProTeCo','cv-exp3-date':'Oct. 2023–Avr. 2025','cv-exp3-sub':'Association étudiante · Management de 13 étudiants','cv-exp3-desc':'Vidéos, réseaux sociaux, newsletter, événements, gestion de projets',
    'cv-exp4-title':'Commercial — Octopus Communication','cv-exp4-date':'Mai–Juin 2024','cv-exp4-desc':'Campagne publicitaire, fiches produits, prospection, Instagram',
    'cv-exp5-title':'Hôte d\'accueil — Vulcania','cv-exp5-date':'Étés 2023, 2024, 2025','cv-exp5-desc':'Accueil, billetterie, gestion de la clientèle',
    'cv-lang1':'🇫🇷 Français — natif','cv-lang2':'🇬🇧 Anglais — B2','cv-lang3':'🇪🇸 Espagnol — B1',
    'cv-int1':'🎬 Cinéma','cv-int2':'🍷 Vins','cv-int3':'💪 Sport','cv-int4':'🎖️ Prépa militaire',
  },
  en: {
    'nav-work':'Projects','nav-about':'Story','nav-data':'Skills','nav-cta':'Hire me',
    'hero-eyebrow':'Available for apprenticeship · Data Marketing · Lyon',
    'hero-intro':'Marketing student, I\'m building expertise<br>at the intersection of <strong>creativity</strong> and <strong>data.</strong>',
    'sticker-abonnes':'FOLLOWERS','sticker-dispo':'Available Sept. 2026',
    'countdown-label':'days until available',
    'personal-label':'Who I really am',
    'personal-title':'Beyond<br><em>the Resume.</em>',
    'quote-label':'Favorite quote',
    'quote-text':'« He has made everything beautiful in its time; he has also set eternity in the human heart... »',
    'quote-ref':'Ecclesiastes 3:11',
    'bio-label':'About',
    'about-label':'My story',
    'about-h2':'Work has never<br>been optional.',
    'about-p1':'It\'s a conviction I\'ve held for a long time. Not because it was imposed on me, but because I understood early on that nothing falls from the sky. Even before entering marketing, I stacked experiences: sales rep at a communications agency, welcome host, team leader in a student association, military prep. <strong>I\'ve always sought to face the field head-on, not just learn in class.</strong>',
    'about-p2':'What gradually drew me in was the junction between <strong>creativity and measurement</strong>. Creating a great campaign is good, but understanding why it performs, analysing the data, optimising in real time — that\'s what truly fascinates me. My goal is clear: <strong>a master\'s in e-Business and Data Marketing</strong>.',
    'about-p3':'At <strong>Venandi</strong>, I had the chance to handle everything autonomously — Google Ads, Shopify website, SEO, social media. Before that, at <strong>Beelive Community</strong>, I managed complete marketing campaigns. It\'s no coincidence that I\'m trusted with broad missions this early. It\'s the result of years of always giving a little more than expected.',
    'about-p4':'Based in <strong>Lyon</strong>, available for <strong>apprenticeship from September 2026</strong>. I\'m looking for an ambitious team, an environment where data and marketing truly speak to each other.',
    'work-h2':'My <em>projects</em>','work-sub':'03 projects',
    'proj1-stat-label':'followers in 6 months','proj1-sub':'Marketing & Communication Manager · Apprenticeship',
    'proj2-stat-val':'Brandbook','proj2-stat-label':'complete','proj2-sub':'Complete Brand Identity — wild nature',
    'proj3-stat-label':'simulated bank jury','proj3-sub':'Fictional wine bar concept',
    'data-label':'My target expertise',
    'data-h2':'Data at the service<br>of <strong>marketing</strong>',
    'tool1-name':'Analytics','tool1-desc':'GA4, Looker Studio, performance dashboards — turning data into concrete decisions.',
    'tool2-name':'AI & Automation','tool2-desc':'Advanced prompting, ChatGPT, Midjourney, workflow automation — using AI as a marketing productivity lever.',
    'tool3-name':'SEO / SEMrush','tool3-desc':'On-page optimisation across 40+ pages, content strategy and organic visibility tracking.',
    'tool4-name':'Shopify / WordPress','tool4-desc':'Architecture, UX, content integration and go-live — from conception to publication.',
    'tool5-name':'Branding & Strategy','tool5-desc':'Brand identity, positioning, value proposition — the substance behind the style.',
    'tool6-name':'Social & Content','tool6-desc':'Video, posts, stories — +1,600 followers in 6 months with format analysis and optimisation.',
    'contact-h2':'Let\'s work<br><em>together.</em>',
    'contact-p':'I\'m looking for an apprenticeship in data marketing or e-business in Lyon from September 2026. If you\'re building something ambitious and want someone who gives their all, we have things to talk about.',
    'contact-hint':'Click this button to send me an email',
    'contact-btn':'Contact me',
    'footer-p':'Data Marketing · Sup de Pub Lyon · Available Sept. 2026',
    'cv-download':'Download my Resume',
    'cv-badge-dispo':'Avail. 09/26',
    'cv-sec-0':'Education','cv-sec-1':'Experience','cv-sec-2':'Skills','cv-sec-3':'Languages','cv-sec-4':'Interests',
    'cv-edu1-title':'Brand Strategy Bachelor','cv-edu2-title':'Marketing Techniques Bachelor','cv-edu3-title':'High School Diploma STMG — Merit',
    'cv-exp1-title':'Marketing & Com Manager — Venandi','cv-exp1-date':'Since Sept. 2025','cv-exp1-sub':'Apprenticeship · Lyon','cv-exp1-desc':'SEO · Google Ads · Shopify · Google Analytics · +1,600 followers in 6 months',
    'cv-exp2-title':'Com. & Dev. Manager — Beelive','cv-exp2-date':'Apr–Jun 2025','cv-exp2-desc':'Marketing, events, digital, prospecting, partnerships',
    'cv-exp3-title':'Communication Lead — ProTeCo','cv-exp3-date':'Oct. 2023–Apr. 2025','cv-exp3-sub':'Student association · Managing 13 students','cv-exp3-desc':'Videos, social media, newsletter, events, project management',
    'cv-exp4-title':'Sales Rep — Octopus Communication','cv-exp4-date':'May–Jun 2024','cv-exp4-desc':'Ad campaign, product sheets, prospecting, Instagram',
    'cv-exp5-title':'Welcome Host — Vulcania','cv-exp5-date':'Summers 2023, 2024, 2025','cv-exp5-desc':'Reception, ticketing, customer management',
    'cv-lang1':'🇫🇷 French — native','cv-lang2':'🇬🇧 English — B2','cv-lang3':'🇪🇸 Spanish — B1',
    'cv-int1':'🎬 Cinema','cv-int2':'🍷 Wines','cv-int3':'💪 Sport','cv-int4':'🎖️ Military prep',
  }
};

let i18nLang = 'fr';
let i18nMap = null;

function buildI18nMap() {
  const tc  = document.querySelectorAll('.tool-card');
  const cvS = document.querySelectorAll('.cv-sec-title');
  const cvI = document.querySelectorAll('.cv-item');
  const cvL = document.querySelectorAll('.cv-lang');
  const cvN = document.querySelectorAll('.cv-interest');
  const cvB = document.querySelectorAll('.cv-badge');
  const ab  = document.querySelectorAll('.about-body');
  const pc  = document.querySelectorAll('.proj-card');
  return [
    { el: document.querySelector('a.nav-link[href="#work"]'),    k:'nav-work' },
    { el: document.querySelector('a.nav-link[href="#about"]'),   k:'nav-about' },
    { el: document.querySelector('a.nav-link[href="#data"]'),    k:'nav-data' },
    { el: document.querySelector('.nav-cta-pill'),               k:'nav-cta' },
    { el: document.getElementById('heroEyebrowTxt'),             k:'hero-eyebrow' },
    { el: document.getElementById('heroIntro'),                  k:'hero-intro', html:true },
    { el: document.getElementById('stickerAbonnesLabel'),        k:'sticker-abonnes' },
    { el: document.getElementById('countdownLabel'),             k:'countdown-label' },
    { el: document.querySelector('.sticker-badge'),              k:'sticker-dispo' },
    { el: document.querySelector('.personal-header .about-label'), k:'personal-label' },
    { el: document.querySelector('.personal-title'),             k:'personal-title', html:true },
    { el: document.querySelector('.card-quote .quote-label'),    k:'quote-label' },
    { el: document.querySelector('.quote-text'),                 k:'quote-text' },
    { el: document.querySelector('.quote-ref'),                  k:'quote-ref' },
    { el: document.querySelector('.card-bio .quote-label'),      k:'bio-label' },
    { el: document.querySelector('.about-l .about-label'),       k:'about-label' },
    { el: document.querySelector('.about-l h2'),                 k:'about-h2', html:true },
    { el: ab[0], k:'about-p1', html:true }, { el: ab[1], k:'about-p2', html:true },
    { el: ab[2], k:'about-p3', html:true }, { el: ab[3], k:'about-p4', html:true },
    { el: document.querySelector('.work-header h2'),             k:'work-h2', html:true },
    { el: document.querySelector('.work-sub'),                   k:'work-sub' },
    { el: pc[0]?.querySelector('.proj-stat-label'),              k:'proj1-stat-label' },
    { el: pc[0]?.querySelector('.proj-subtitle'),                k:'proj1-sub' },
    { el: pc[1]?.querySelector('.proj-stat-val'),                k:'proj2-stat-val' },
    { el: pc[1]?.querySelector('.proj-stat-label'),              k:'proj2-stat-label' },
    { el: pc[1]?.querySelector('.proj-subtitle'),                k:'proj2-sub' },
    { el: pc[2]?.querySelector('.proj-stat-label'),              k:'proj3-stat-label' },
    { el: pc[2]?.querySelector('.proj-subtitle'),                k:'proj3-sub' },
    { el: document.querySelector('.data-label'),                 k:'data-label' },
    { el: document.querySelector('.data-section h2'),            k:'data-h2', html:true },
    ...[0,1,2,3,4,5].flatMap(i => [
      { el: tc[i]?.querySelector('.tool-name'), k:`tool${i+1}-name` },
      { el: tc[i]?.querySelector('.tool-desc'), k:`tool${i+1}-desc` },
    ]),
    { el: document.querySelector('.contact h2'),                 k:'contact-h2', html:true },
    { el: document.querySelector('.contact-l p'),                k:'contact-p' },
    { el: document.querySelector('.contact-hint'),               k:'contact-hint' },
    { el: document.querySelector('.big-3d-btn-face'),            k:'contact-btn' },
    { el: document.querySelector('footer p'),                    k:'footer-p' },
    { el: document.querySelector('.cv-download-btn span:nth-of-type(2)'), k:'cv-download' },
    { el: cvB[0], k:'cv-badge-dispo' },
    ...[0,1,2,3,4].map(i => ({ el: cvS[i], k:`cv-sec-${i}` })),
    { el: cvI[0]?.querySelector('.cv-item-title'), k:'cv-edu1-title' },
    { el: cvI[1]?.querySelector('.cv-item-title'), k:'cv-edu2-title' },
    { el: cvI[2]?.querySelector('.cv-item-title'), k:'cv-edu3-title' },
    { el: cvI[3]?.querySelector('.cv-item-title'), k:'cv-exp1-title' },
    { el: cvI[3]?.querySelector('.cv-item-date'),  k:'cv-exp1-date' },
    { el: cvI[3]?.querySelector('.cv-item-sub'),   k:'cv-exp1-sub' },
    { el: cvI[3]?.querySelector('.cv-item-desc'),  k:'cv-exp1-desc' },
    { el: cvI[4]?.querySelector('.cv-item-title'), k:'cv-exp2-title' },
    { el: cvI[4]?.querySelector('.cv-item-date'),  k:'cv-exp2-date' },
    { el: cvI[4]?.querySelector('.cv-item-desc'),  k:'cv-exp2-desc' },
    { el: cvI[5]?.querySelector('.cv-item-title'), k:'cv-exp3-title' },
    { el: cvI[5]?.querySelector('.cv-item-date'),  k:'cv-exp3-date' },
    { el: cvI[5]?.querySelector('.cv-item-sub'),   k:'cv-exp3-sub' },
    { el: cvI[5]?.querySelector('.cv-item-desc'),  k:'cv-exp3-desc' },
    { el: cvI[6]?.querySelector('.cv-item-title'), k:'cv-exp4-title' },
    { el: cvI[6]?.querySelector('.cv-item-date'),  k:'cv-exp4-date' },
    { el: cvI[6]?.querySelector('.cv-item-desc'),  k:'cv-exp4-desc' },
    { el: cvI[7]?.querySelector('.cv-item-title'), k:'cv-exp5-title' },
    { el: cvI[7]?.querySelector('.cv-item-date'),  k:'cv-exp5-date' },
    { el: cvI[7]?.querySelector('.cv-item-desc'),  k:'cv-exp5-desc' },
    { el: cvL[0], k:'cv-lang1' }, { el: cvL[1], k:'cv-lang2' }, { el: cvL[2], k:'cv-lang3' },
    { el: cvN[0], k:'cv-int1'  }, { el: cvN[1], k:'cv-int2'  },
    { el: cvN[2], k:'cv-int3'  }, { el: cvN[3], k:'cv-int4'  },
  ].filter(item => item.el);
}

function applyI18n(lang) {
  if (!i18nMap) i18nMap = buildI18nMap();
  const t = I18N[lang];
  i18nMap.forEach(({ el, k, html }) => {
    if (!t[k]) return;
    if (html) el.innerHTML = t[k];
    else el.textContent = t[k];
  });
  document.getElementById('langSwitch').textContent = lang === 'fr' ? 'EN' : 'FR';
  document.documentElement.lang = lang;
  i18nLang = lang;
}

document.getElementById('langSwitch').addEventListener('click', () => {
  applyI18n(i18nLang === 'fr' ? 'en' : 'fr');
});

/* ── BURGER MENU ── */
const navBurger = document.getElementById('navBurger');
const navMobileMenu = document.getElementById('navMobileMenu');
if (navBurger && navMobileMenu) {
  navBurger.addEventListener('click', () => {
    const open = navMobileMenu.classList.toggle('open');
    navBurger.classList.toggle('open', open);
    navBurger.setAttribute('aria-expanded', open);
    navMobileMenu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  const closeMenu = () => {
    navMobileMenu.classList.remove('open');
    navBurger.classList.remove('open');
    navBurger.setAttribute('aria-expanded', 'false');
    navMobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  navMobileMenu.querySelectorAll('.nav-mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  const mobileCloseBtn = document.getElementById('navMobileClose');
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMenu);
}