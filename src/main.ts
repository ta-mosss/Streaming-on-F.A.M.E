import './styles/main.css';
import { catalogue, categories, byId, byTag, type Title } from './data/catalogue';
import { initAnalytics, track } from './analytics';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('F.A.M.E app mount not found');

const esc = (value: string) => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c] ?? c));
const asset = (path: string) => path.replace(/^\//, './');
const $ = <T extends HTMLElement = HTMLElement>(sel: string, scope: ParentNode = document) => scope.querySelector<T>(sel);
const $$ = <T extends HTMLElement = HTMLElement>(sel: string, scope: ParentNode = document) => Array.from(scope.querySelectorAll<T>(sel));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pad = (n: number) => String(n).padStart(2, '0');

const svg = (body: string, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const ic = {
  play: `<svg class="ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.4-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z"/></svg>`,
  pause: `<svg class="ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4.5" height="16" rx="1.2"/><rect x="13.5" y="4" width="4.5" height="16" rx="1.2"/></svg>`,
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  check: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
  info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.01"/>'),
  search: svg('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>'),
  close: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  left: svg('<path d="m15 5-7 7 7 7"/>'),
  right: svg('<path d="m9 5 7 7-7 7"/>'),
  arrow: svg('<path d="M7 17 17 7M8 7h9v9"/>'),
  home: svg('<path d="m3.5 11 8.5-7 8.5 7M6 9.5V20h12V9.5"/>'),
  star: svg('<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9L3.5 9.7l5.9-.8Z"/>'),
  list: svg('<path d="M4 7h16M4 12h16M4 17h10"/>'),
  user: svg('<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20c.9-3.6 3.9-5.5 7.5-5.5s6.6 1.9 7.5 5.5"/>'),
  download: svg('<path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19.5h14"/>'),
  data: svg('<path d="M5 18a9 9 0 0 1 14 0M8 14.5a5 5 0 0 1 8 0"/><circle cx="12" cy="18.5" r=".8" fill="currentColor"/>'),
  wallet: svg('<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18M16.5 14.5h.01"/>'),
  globe: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.400 5.600 12 3Z"/>'),
  kids: svg('<circle cx="12" cy="12" r="9"/><path d="M8.500 14.500c.9 1.400 2 2 3.500 2s2.600-.6 3.500-2M9 9.500h.01M15 9.500h.01"/>'),
  live: svg('<circle cx="12" cy="12" r="2.2"/><path d="M7.500 7.500a6.400 6.400 0 0 0 0 9M16.500 7.500a6.400 6.400 0 0 1 0 9M4.600 4.600a10.500 10.500 0 0 0 0 14.800M19.400 4.600a10.500 10.500 0 0 1 0 14.800"/>'),
  studio: svg('<rect x="3" y="7" width="13" height="10" rx="2.500"/><path d="m16 11 5-3v8l-5-3"/>'),
  tv: svg('<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>'),
  phone: svg('<rect x="7" y="3" width="10" height="18" rx="2.500"/><path d="M11 18h2"/>'),
  cast: svg('<path d="M4 8V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M4 12a8 8 0 0 1 8 8M4 16a4 4 0 0 1 4 4M4 20h.01"/>'),
  vol: svg('<path d="M4 9.500v5h3.500L12 18.500v-13L7.500 9.500ZM15.500 9a4 4 0 0 1 0 6M18 6.500a8 8 0 0 1 0 11"/>'),
  full: svg('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),
  bolt: svg('<path d="M13 3 5 13.500h6L10 21l8-10.500h-6Z"/>'),
  heart: svg('<path d="M12 20s-7.500-4.500-7.500-10A4.300 4.300 0 0 1 12 7.500 4.300 4.300 0 0 1 19.500 10c0 5.500-7.500 10-7.500 10Z"/>')
};

/* ------------------------------------------------------------------ */
/*  State                                                              */
/* ------------------------------------------------------------------ */
const STORE_KEY = 'fame:mylist';
const readList = (): string[] => { try { return JSON.parse(localStorage.getItem(STORE_KEY) ?? '[]') as string[]; } catch { return []; } };
const myList = new Set<string>(readList().filter(id => byId(id)));
const saveList = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify([...myList])); } catch { /* storage unavailable */ } };
let activeFilter = 'all';
let lastFocused: HTMLElement | null = null;

const heroTitles = catalogue.filter(t => t.hero);
const featured = catalogue.find(t => t.featured) ?? catalogue[0];

/* ------------------------------------------------------------------ */
/*  Reusable markup                                                    */
/* ------------------------------------------------------------------ */
const listBtn = (item: Title, cls = 'list-toggle') => `<button class="${cls} ${myList.has(item.id) ? 'saved' : ''}" data-list="${esc(item.id)}" aria-pressed="${myList.has(item.id)}" aria-label="${myList.has(item.id) ? 'Remove' : 'Add'} ${esc(item.title)} ${myList.has(item.id) ? 'from' : 'to'} My List">${myList.has(item.id) ? ic.check : ic.plus}</button>`;
const badge = (item: Title) => item.badge ? `<span class="card-badge b-${item.badge.replace(' ', '-').toLowerCase()}">${esc(item.badge)}</span>` : '';

const posterCard = (item: Title, rank?: number) => `
  <article class="card card-poster ${rank ? 'ranked' : ''}" style="--accent:${item.accent}">
    ${rank ? `<span class="rank-num" aria-hidden="true">${rank}</span>` : ''}
    <div class="card-frame">
      <button class="card-open" data-title="${esc(item.id)}" aria-label="${rank ? `Number ${rank}: ` : ''}Open ${esc(item.title)}">
        <img src="${asset(item.artwork)}" alt="" loading="lazy" decoding="async" width="600" height="900">
        <span class="card-shade"></span>${badge(item)}
        <span class="card-copy"><strong>${esc(item.title)}</strong><small>${esc(item.kind)} · ${esc(item.genre)}</small></span>
        <span class="card-play">${ic.play}</span>
      </button>
      ${listBtn(item)}
    </div>
  </article>`;

const wideCard = (item: Title) => `
  <article class="card card-wide" style="--accent:${item.accent}">
    <div class="card-frame">
      <button class="card-open" data-title="${esc(item.id)}" aria-label="Open ${esc(item.title)}">
        <img src="${asset(item.backdrop)}" alt="" loading="lazy" decoding="async" width="1600" height="900">
        <span class="card-shade"></span>${badge(item)}
        <span class="card-copy"><strong>${esc(item.title)}</strong><small>${esc(item.duration)} · ${esc(item.rating)} · ${esc(item.genre)}</small></span>
        <span class="card-play">${ic.play}</span>
      </button>
      ${listBtn(item)}
    </div>
  </article>`;

const rail = (id: string, title: string, sub: string, items: string) => `
  <section class="rail reveal" aria-labelledby="${id}-h">
    <div class="rail-head"><div><h3 id="${id}-h">${esc(title)}</h3><p>${esc(sub)}</p></div>
      <div class="rail-nav"><button data-rail-prev="${id}" aria-label="Scroll ${esc(title)} left">${ic.left}</button><button data-rail-next="${id}" aria-label="Scroll ${esc(title)} right">${ic.right}</button></div></div>
    <div class="rail-track" id="${id}" tabindex="0" role="region" aria-label="${esc(title)}">${items}</div>
  </section>`;

const uniq = (items: Title[]) => [...new Map(items.map(t => [t.id, t])).values()];
const anticipated = ['city-of-dreams', 'street-kings', 'midnight-radio', 'roots-and-rhythm', 'future-africa', 'the-next-move', 'after-the-rain', 'voices-of-home', 'the-last-dance', 'little-legends'].map(id => byId(id)!);

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
const features = [
  { i: ic.phone, t: 'Mobile first', d: 'Designed for the phone in your hand first, then scaled up to tablets, laptops and the big screen.', tag: 'Core' },
  { i: ic.download, t: 'Download & go', d: 'Save episodes on Wi-Fi and watch on the commute, offline and without burning through data.', tag: 'Planned' },
  { i: ic.data, t: 'Data-smart playback', d: 'Adaptive quality and a data-saver mode so great stories play well on real-world connections.', tag: 'Planned' },
  { i: ic.wallet, t: 'Pay your way', d: 'We are exploring flexible, local payment options so subscribing is simple and affordable.', tag: 'Exploring' },
  { i: ic.globe, t: 'Local languages', d: 'Subtitles and audio options that reflect how our audiences actually speak and watch.', tag: 'Planned' },
  { i: ic.kids, t: 'Kids & family', d: 'Profiles with age-appropriate catalogues, so the whole household can share one account.', tag: 'Planned' },
  { i: ic.live, t: 'Premieres & live', d: 'Release-night events, cast conversations and live music sessions that make launches feel special.', tag: 'Exploring' },
  { i: ic.studio, t: 'Creator studio', d: 'A direct route for independent producers, filmmakers and musicians to reach a home audience.', tag: 'Planned' }
];

const compare = [
  ['Whose stories lead', 'Africa is often one category among many', 'African stories are the centre of the product'],
  ['Pricing', 'Set for global markets', 'Built around local affordability · target from R29.90/month'],
  ['Payments', 'Card-first sign-up', 'Flexible, local-friendly payment options in exploration'],
  ['Data & devices', 'Heavy streams, premium devices assumed', 'Mobile-first with data-smart playback planned'],
  ['Creators', 'Hard to reach for emerging talent', 'Direct creator partnerships and a studio pathway']
];

const roadmap = [
  { k: 'NOW', t: 'Showcase', d: 'Brand, product experience, concept slate and early audience.', on: true },
  { k: 'NEXT', t: 'Platform build', d: 'Accounts, profiles, catalogue, subscriptions, playback and analytics.' },
  { k: 'THEN', t: 'Content', d: 'Creator partnerships, licensing, the production slate and launch campaigns.' },
  { k: '2027', t: 'Launch', d: 'Web and mobile first, with Smart TV and creator tooling to follow.' }
];

const faqs = [
  ['Is F.A.M.E live yet?', 'Not yet. This website is the public showcase for the platform we are building. The production video-on-demand app is the next build, with a target launch of 2027.'],
  ['Can I watch these shows today?', 'No. The titles and artwork you see are concept content created to demonstrate the direction of the catalogue and the product experience.'],
  ['How much will it cost?', 'Pricing is not final. Our target is to make F.A.M.E genuinely affordable, with a starting point from R29.90 per month. Any figure shown today is a target, not a live offer.'],
  ['Which devices will it run on?', 'F.A.M.E is being designed mobile-first, with web, tablet and Smart TV experiences planned to share the same product language.'],
  ['I make films, series or music. Can I get involved?', 'Yes — creator partnerships are central to the plan. Join the early-access list and tick the creator box in your welcome email to hear first when formal opportunities open.']
];

app.innerHTML = `
<div class="site" id="top">
  <div class="scroll-progress" id="scrollProgress" aria-hidden="true"></div>
  <header class="site-header" id="siteHeader">
    <a class="wordmark" href="#top" aria-label="F.A.M.E home"><img src="${asset('assets/brand/fame-logo.webp')}" alt="F.A.M.E — Your Stage. Your Story." width="760" height="328"></a>
    <nav class="desktop-nav" aria-label="Primary navigation"><a href="#watch">Now showing</a><a href="#preview">The app</a><a href="#why">Why F.A.M.E</a><a href="#creators">Creators</a><a href="#roadmap">Roadmap</a></nav>
    <div class="header-actions">
      <button class="icon-btn" id="searchOpen" aria-label="Search the F.A.M.E slate">${ic.search}</button>
      <a class="header-cta" href="#waitlist">Get early access</a>
      <button class="menu-trigger icon-btn" id="menuOpen" aria-expanded="false" aria-controls="mobileNav" aria-label="Open menu">${ic.list}</button>
    </div>
  </header>
  <nav class="mobile-nav" id="mobileNav" aria-label="Mobile navigation"><a href="#watch">Now showing</a><a href="#preview">The app</a><a href="#why">Why F.A.M.E</a><a href="#creators">Creators</a><a href="#roadmap">Roadmap</a><a class="mobile-cta" href="#waitlist">Get early access</a></nav>

  <main id="main">
    <!-- HERO -->
    <section class="hero" id="hero" aria-roledescription="carousel" aria-label="Featured F.A.M.E titles">
      <div class="hero-slides">
        ${heroTitles.map((t, i) => `
        <div class="hero-slide ${i === 0 ? 'active' : ''}" data-slide="${i}" style="--accent:${t.accent}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${heroTitles.length}" ${i === 0 ? '' : 'aria-hidden="true"'}>
          <img class="hero-img" src="${asset(t.backdrop)}" alt="" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} width="1600" height="900">
          <div class="hero-shade" aria-hidden="true"></div>
          <div class="hero-copy">
            <div class="hero-eyebrow"><span class="pulse"></span> ${esc(t.badge === 'Original' ? 'F.A.M.E Original' : 'Only on F.A.M.E')} · Coming ${t.year}</div>
            ${i === 0 ? '<h1' : '<h2'} class="hero-title">${esc(t.title)}${i === 0 ? '</h1>' : '</h2>'}
            <p class="hero-tag">${esc(t.tagline)}</p>
            <p class="hero-meta"><b>${esc(t.rating)}</b><span>${esc(t.kind)}</span><span>${esc(t.genre)}</span><span>${esc(t.duration)}</span></p>
            <p class="hero-syn">${esc(t.synopsis)}</p>
            <div class="hero-actions">
              <button class="btn btn-light" data-play="${esc(t.id)}">${ic.play} Watch concept trailer</button>
              <button class="btn btn-glass" data-title="${esc(t.id)}">${ic.info} More info</button>
              ${listBtn(t, 'list-toggle round')}
            </div>
          </div>
        </div>`).join('')}
      </div>
      <div class="hero-grain" aria-hidden="true"></div>
      <div class="hero-controls">
        <div class="hero-thumbs" role="tablist" aria-label="Choose a featured title">
          ${heroTitles.map((t, i) => `<button class="hero-thumb ${i === 0 ? 'active' : ''}" role="tab" aria-selected="${i === 0}" data-thumb="${i}" aria-label="Show ${esc(t.title)}"><img src="${asset(t.artwork)}" alt="" loading="lazy" width="600" height="900"><i></i></button>`).join('')}
        </div>
      </div>
      <div class="hero-platforms" aria-label="Planned platforms">
        <span>COMING 2027</span><i></i><span>${ic.phone} Mobile</span><span>${ic.globe} Web</span><span>${ic.tv} Smart TV</span>
      </div>
    </section>

    <div class="launch-strip reveal"><span class="live-dot"></span><p><strong>The platform is in development.</strong> Everything you see here is a working preview of the F.A.M.E experience — the titles are concept content, not yet available to stream.</p><a href="#waitlist">Get early access ${ic.arrow}</a></div>

    <!-- NOW SHOWING -->
    <section class="section watch" id="watch">
      <div class="section-head reveal"><p class="eyebrow">THE CONCEPT SLATE</p><h2>Stories made <em>here</em>.<br>Made to travel.</h2><p>A first look at the kind of films, series, music and documentaries F.A.M.E is being built to showcase. Tap anything to explore.</p></div>
      ${rail('r-top', 'Most anticipated', 'The titles our audience will meet first', anticipated.map((t, i) => posterCard(t, i + 1)).join(''))}
      ${rail('r-originals', 'African Originals', 'Made for F.A.M.E, made close to home', byTag('originals').map(t => posterCard(t)).join(''))}
      ${rail('r-series', 'Binge-worthy series', 'Press play. Lose the evening.', uniq([...byTag('series'), ...byTag('reality')]).map(wideCard).join(''))}
      ${rail('r-films', 'Films & documentaries', 'Stories with room to breathe', uniq([...byTag('movies'), ...byTag('docs')]).map(t => posterCard(t)).join(''))}
      ${rail('r-family', 'Kids, family & learning', 'Something for everyone at home', uniq([...byTag('kids'), ...byTag('learning')]).map(wideCard).join(''))}
    </section>

    <!-- MARQUEE -->
    <section class="marquee" aria-label="African cities"><div class="marquee-row"><div class="marquee-track">${['JOHANNESBURG', 'LAGOS', 'NAIROBI', 'CAPE TOWN', 'ACCRA', 'KIGALI', 'HARARE', 'WINDHOEK', 'LUSAKA', 'DAR ES SALAAM'].concat(['JOHANNESBURG', 'LAGOS', 'NAIROBI', 'CAPE TOWN', 'ACCRA', 'KIGALI', 'HARARE', 'WINDHOEK', 'LUSAKA', 'DAR ES SALAAM']).map(c => `<span>${c}</span><i>✦</i>`).join('')}</div></div></section>

    <!-- APP EXPERIENCE -->
    <section class="section preview" id="preview">
      <div class="section-head center reveal"><p class="eyebrow">THE APP</p><h2>Open it on your phone.<br><em>Keep watching on the TV.</em></h2><p>This is a live, clickable preview of the F.A.M.E interface. Switch tabs, save titles to My List, hit play — and send your show from phone to screen.</p></div>
      <div class="devices reveal">
        <div class="tv" id="tv">
          <div class="tv-screen">
            <aside class="tv-side" role="tablist" aria-label="TV navigation">
              <span class="tv-logo">F</span>
              <button class="active" role="tab" aria-selected="true" data-tv-tab="home" aria-label="Home">${ic.home}<small>Home</small></button>
              <button role="tab" aria-selected="false" data-tv-tab="originals" aria-label="Originals">${ic.star}<small>Originals</small></button>
              <button role="tab" aria-selected="false" data-tv-tab="mylist" aria-label="My List">${ic.list}<small>My List</small></button>
              <button role="tab" aria-selected="false" data-tv-tab="profile" aria-label="Profiles">${ic.user}<small>Profiles</small></button>
            </aside>
            <div class="tv-main" id="tvMain" aria-live="polite"></div>
            <div class="tv-resume" id="tvResume" aria-live="polite">${ic.cast}<span><b>Resumed from your phone</b><small>City of Dreams · S1 E1 · 12:40</small></span></div>
          </div>
          <div class="tv-stand" aria-hidden="true"></div>
        </div>
        <div class="phone" id="phone">
          <div class="phone-notch" aria-hidden="true"></div>
          <div class="phone-screen">
            <div class="phone-status"><span>9:41</span><span class="chip-data">${ic.data} Data saver</span></div>
            <div class="phone-hero" style="--accent:${featured.accent}"><img src="${asset(featured.artwork)}" alt="" width="600" height="900"><div class="phone-hero-shade"></div>
              <div class="phone-hero-copy"><small>F.A.M.E ORIGINAL</small><strong>${esc(featured.title)}</strong><div><button class="btn btn-light sm" data-play="${esc(featured.id)}">${ic.play} Play</button><button class="btn btn-glass sm" id="castBtn">${ic.cast} Cast</button></div></div></div>
            <div class="phone-row"><h5>Continue watching</h5><div>${['street-kings', 'roots-and-rhythm', 'midnight-radio'].map((id, i) => { const t = byId(id)!; return `<button data-title="${t.id}" aria-label="Open ${esc(t.title)}"><img src="${asset(t.backdrop)}" alt="" loading="lazy" width="1600" height="900"><i style="--p:${[62, 28, 85][i]}%"></i><span>${esc(t.title)}</span></button>`; }).join('')}</div></div>
            <div class="phone-row"><h5>Because you like drama</h5><div class="posters">${['after-the-rain', 'the-last-dance', 'city-of-dreams'].map(id => { const t = byId(id)!; return `<button data-title="${t.id}" aria-label="Open ${esc(t.title)}"><img src="${asset(t.artwork)}" alt="" loading="lazy" width="600" height="900"></button>`; }).join('')}</div></div>
            <nav class="phone-nav" aria-hidden="true"><span class="on">${ic.home}</span><span>${ic.search}</span><span>${ic.download}</span><span>${ic.user}</span></nav>
          </div>
        </div>
      </div>
      <ul class="device-pills reveal" aria-label="Planned platforms"><li>${ic.phone} iOS &amp; Android</li><li>${ic.globe} Web</li><li>${ic.tv} Smart TV</li><li>${ic.cast} Cast &amp; resume anywhere</li></ul>
      <p class="fine">Concept interface · titles, artwork and progress are for demonstration only · production features may differ.</p>
    </section>

    <!-- FEATURES -->
    <section class="section features" id="features">
      <div class="section-head reveal"><p class="eyebrow">BUILT FOR HOW WE WATCH</p><h2>Everything a great streaming app needs.<br><em>Tuned for home.</em></h2><p>The F.A.M.E product roadmap, at a glance. Every feature below is planned or being explored for the production app — not live today.</p></div>
      <div class="bento">${features.map((f, i) => `<article class="bento-card reveal ${[0, 3, 6, 7].includes(i) ? 'wide' : ''}" style="--d:${i * 60}ms"><span class="bento-tag">${f.tag}</span><span class="bento-icon">${f.i}</span><h3>${f.t}</h3><p>${f.d}</p></article>`).join('')}</div>
    </section>

    <!-- WHY -->
    <section class="section why" id="why">
      <div class="why-grid">
        <div class="section-head reveal left"><p class="eyebrow">WHY F.A.M.E</p><h2>The world streams <em>to</em> us.<br>We stream <em>from</em> here.</h2><p>Global streamers have set the standard for polish and ease. F.A.M.E is being built to match that standard — while putting African audiences and creators at the centre, not the margins.</p><a class="btn btn-primary" href="#waitlist">Be part of it ${ic.arrow}</a></div>
        <div class="compare reveal" role="table" aria-label="How F.A.M.E is designed to differ from typical global streaming services">
          <div class="compare-head" role="row"><span role="columnheader"></span><span role="columnheader">Typical global streamers</span><span role="columnheader" class="us">F.A.M.E</span></div>
          ${compare.map(([k, a, b]) => `<div class="compare-row" role="row"><b role="rowheader">${k}</b><span role="cell">${a}</span><span role="cell" class="us">${ic.check}${b}</span></div>`).join('')}
          <p class="compare-note">Design principles and targets for the future platform · general comparison, not a claim about any specific service.</p>
        </div>
      </div>
    </section>

    <!-- BROWSE -->
    <section class="section browse" id="browse">
      <div class="section-head reveal"><p class="eyebrow">BROWSE THE SLATE</p><h2>Find your <em>next obsession.</em></h2></div>
      <div class="filter-bar reveal" id="filters" role="group" aria-label="Filter the catalogue">${categories.map(c => `<button class="${c.id === 'all' ? 'active' : ''}" data-filter="${c.id}" aria-pressed="${c.id === 'all'}">${esc(c.label)}</button>`).join('')}</div>
      <div class="catalogue-grid" id="catalogueGrid"></div>
    </section>

    <!-- CREATORS -->
    <section class="section creators" id="creators">
      <div class="creator-wrap">
        <div class="creator-copy reveal"><p class="eyebrow">FOR CREATORS</p><h2>Your story deserves a <em>bigger stage.</em></h2><p>F.A.M.E is for the filmmakers, producers, musicians and storytellers shaping the culture. We are designing a studio that makes it simple to get your work in front of a home audience — and to be seen for it.</p>
          <ul class="creator-points"><li><b>01</b><span><strong>Originals</strong>Develop stories made for F.A.M.E.</span></li><li><b>02</b><span><strong>Partnerships</strong>Work with studios, producers and independents.</span></li><li><b>03</b><span><strong>Discovery</strong>Give emerging voices a place to be found.</span></li></ul>
          <a class="btn btn-primary" href="#waitlist">Join as a creator ${ic.arrow}</a></div>
        <div class="studio reveal" aria-label="Creator Studio concept">
          <div class="studio-top"><span class="dots"><i></i><i></i><i></i></span><b>Creator Studio</b><small>CONCEPT</small></div>
          <div class="studio-body">
            <div class="studio-upload"><img src="${asset('assets/content/roots-and-rhythm-wide.svg')}" alt="" loading="lazy" width="1600" height="900"><div><strong>Roots &amp; Rhythm · Ep 1</strong><small>Final cut · 24 min</small><div class="bar"><i></i></div></div><span class="ok">${ic.check} Ready</span></div>
            <ul class="studio-steps"><li class="done">${ic.check} Upload &amp; quality check</li><li class="done">${ic.check} Subtitles &amp; audio tracks</li><li class="done">${ic.check} Artwork &amp; trailer</li><li class="now"><span class="spin"></span> Schedule premiere</li></ul>
            <div class="studio-chart" aria-hidden="true"><small>Audience momentum · sample data</small><div>${[28, 36, 33, 48, 52, 61, 58, 74, 88, 96].map(h => `<i style="--h:${h}%"></i>`).join('')}</div></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ROADMAP -->
    <section class="section roadmap" id="roadmap">
      <div class="section-head center reveal"><p class="eyebrow">THE JOURNEY</p><h2>Built properly.<br><em>Launching 2027.</em></h2></div>
      <div class="timeline">${roadmap.map((r, i) => `<article class="tl-item reveal ${r.on ? 'on' : ''}" style="--d:${i * 90}ms"><span class="tl-dot"></span><small>${r.k}</small><h3>${r.t}</h3><p>${r.d}</p></article>`).join('')}</div>
    </section>

    <!-- WAITLIST -->
    <section class="section waitlist" id="waitlist">
      <div class="waitlist-card reveal">
        <div class="waitlist-bg" aria-hidden="true"><img src="${asset('assets/content/city-of-dreams-wide.svg')}" alt="" loading="lazy" width="1600" height="900"></div>
        <div class="waitlist-copy"><p class="eyebrow">EARLY ACCESS</p><h2>Be first in line when the <em>lights go up.</em></h2><p>Join the early-access community for launch news, premiere invitations and behind-the-scenes updates as F.A.M.E comes to life.</p><ul><li>${ic.check} Launch &amp; premiere announcements</li><li>${ic.check} First look at new originals</li><li>${ic.check} Creator programme updates</li></ul></div>
        <form id="waitlistForm" class="waitlist-form" novalidate>
          <label for="email">Email address</label>
          <div class="email-row"><input id="email" name="email" type="email" placeholder="you@example.com" autocomplete="email" required><button class="btn btn-primary" type="submit">Notify me ${ic.arrow}</button></div>
          <label class="consent"><input id="consent" type="checkbox" required><span>I agree to receive F.A.M.E updates. No spam. Unsubscribe anytime.</span></label>
          <p id="formStatus" class="form-status" role="status"></p>
        </form>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section faq" id="faq">
      <div class="faq-layout"><div class="section-head left reveal"><p class="eyebrow">GOOD TO KNOW</p><h2>What’s real <em>right now?</em></h2><p>We would rather be honest about where we are than oversell it.</p></div>
        <div class="faq-list reveal">${faqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></div>
    </section>
  </main>

  <footer class="footer">
    <div class="footer-main">
      <div class="footer-brand"><img src="${asset('assets/brand/fame-logo.webp')}" alt="F.A.M.E" width="760" height="328"><p>Your Stage. Your Story.</p><small>Made for Africa. Built for the world.</small></div>
      <div><h4>Explore</h4><a href="#watch">Now showing</a><a href="#preview">The app</a><a href="#why">Why F.A.M.E</a><a href="#creators">Creators</a></div>
      <div><h4>Company</h4><a href="#roadmap">Roadmap</a><a href="./press.html">Press kit</a><a href="mailto:hello@streamingonfame.co.za">Contact</a></div>
      <div><h4>Stay close</h4><p>Follow the build as the showcase becomes the product.</p><a class="footer-email" href="#waitlist">Join early access ${ic.arrow}</a></div>
    </div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} Streaming on F.A.M.E</span><span>Concept showcase · Not yet the production VOD application</span><a href="#top">Back to top ↑</a></div>
  </footer>

  <div class="mobile-bar" id="mobileBar"><span><b>F.A.M.E</b> · Coming 2027</span><a class="btn btn-primary sm" href="#waitlist">Get early access</a></div>
  <div class="modal" id="modal" aria-hidden="true"></div>
  <div class="search-drawer" id="searchDrawer" aria-hidden="true"><div class="search-card" role="dialog" aria-modal="true" aria-label="Search"><button class="modal-close" id="searchClose" aria-label="Close search">${ic.close}</button><p class="eyebrow">SEARCH</p><h2>What do you feel like watching?</h2><div class="search-box">${ic.search}<input id="searchInput" type="search" placeholder="Try drama, music, thriller…" autocomplete="off" aria-label="Search titles"></div><div id="searchResults"></div></div></div>
  <div class="toast" id="toast" role="status"></div>
</div>`;

/* ------------------------------------------------------------------ */
/*  Elements & shared UI                                               */
/* ------------------------------------------------------------------ */
const modal = $<HTMLDivElement>('#modal')!;
const searchDrawer = $<HTMLDivElement>('#searchDrawer')!;
const searchInput = $<HTMLInputElement>('#searchInput')!;
const toast = $<HTMLElement>('#toast')!;
const catalogueGrid = $<HTMLElement>('#catalogueGrid')!;
let toastTimer = 0;

function showToast(message: string) { toast.textContent = message; toast.classList.add('show'); window.clearTimeout(toastTimer); toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2400); }
function syncBodyLock() { document.body.classList.toggle('modal-open', modal.classList.contains('open') || searchDrawer.classList.contains('open')); }

/* ------------------------------------------------------------------ */
/*  My List (single source of truth, synced everywhere)                */
/* ------------------------------------------------------------------ */
function paintListButtons() {
  $$('[data-list]').forEach(btn => {
    const id = btn.dataset.list!, item = byId(id);
    if (!item) return;
    const saved = myList.has(id);
    btn.classList.toggle('saved', saved);
    btn.setAttribute('aria-pressed', String(saved));
    btn.setAttribute('aria-label', `${saved ? 'Remove' : 'Add'} ${item.title} ${saved ? 'from' : 'to'} My List`);
    const label = btn.dataset.label;
    btn.innerHTML = saved ? `${ic.check}${label ? ' In My List' : ''}` : `${ic.plus}${label ? ' My List' : ''}`;
  });
}
function toggleList(id: string) {
  const item = byId(id); if (!item) return;
  const added = !myList.has(id);
  added ? myList.add(id) : myList.delete(id);
  saveList(); paintListButtons();
  if (tvTab === 'mylist') renderTV('mylist');
  showToast(added ? `Added “${item.title}” to My List` : `Removed “${item.title}” from My List`);
  track(added ? 'my_list_added' : 'my_list_removed', { title: id });
}

/* ------------------------------------------------------------------ */
/*  Delegated clicks: open title, play, list, rails                    */
/* ------------------------------------------------------------------ */
document.addEventListener('click', event => {
  const target = event.target as HTMLElement;
  const listEl = target.closest<HTMLElement>('[data-list]');
  if (listEl) { event.stopPropagation(); toggleList(listEl.dataset.list!); return; }
  const playEl = target.closest<HTMLElement>('[data-play]');
  if (playEl) { const item = byId(playEl.dataset.play!); if (item) openPlayer(item); return; }
  const titleEl = target.closest<HTMLElement>('[data-title]');
  if (titleEl) { const item = byId(titleEl.dataset.title!); if (item) openTitle(item); return; }
  const prev = target.closest<HTMLElement>('[data-rail-prev]'), next = target.closest<HTMLElement>('[data-rail-next]');
  if (prev || next) {
    const track = document.getElementById((prev ?? next)!.dataset[prev ? 'railPrev' : 'railNext']!);
    track?.scrollBy({ left: (prev ? -1 : 1) * track.clientWidth * .85, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
});

/* ------------------------------------------------------------------ */
/*  Modals: title detail + concept player                              */
/* ------------------------------------------------------------------ */
function openModal(html: string) {
  lastFocused = document.activeElement as HTMLElement | null;
  modal.innerHTML = html;
  modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); syncBodyLock();
  $('[data-close]', modal)?.addEventListener('click', closeModal);
  window.setTimeout(() => $<HTMLElement>('[data-close]', modal)?.focus(), 30);
}
function closeModal() { stopPlayback(); modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); syncBodyLock(); lastFocused?.focus(); }
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

function openTitle(item: Title) {
  const similar = catalogue.filter(t => t.id !== item.id && t.tags.some(tag => item.tags.includes(tag))).slice(0, 3);
  openModal(`
  <div class="modal-card detail" role="dialog" aria-modal="true" aria-labelledby="titleHeading" style="--accent:${item.accent}">
    <button class="modal-close" data-close aria-label="Close">${ic.close}</button>
    <div class="detail-hero"><img src="${asset(item.backdrop)}" alt=""><div class="detail-shade"></div>
      <div class="detail-head"><p class="eyebrow">${esc(item.kind)} · Coming ${item.year}</p><h2 id="titleHeading">${esc(item.title)}</h2><p class="hero-meta"><b>${esc(item.rating)}</b><span>${esc(item.genre)}</span><span>${esc(item.duration)}</span></p>
        <div class="hero-actions"><button class="btn btn-light" data-modal-play>${ic.play} Watch concept trailer</button><button class="list-toggle pill ${myList.has(item.id) ? 'saved' : ''}" data-list="${esc(item.id)}" data-label="1" aria-pressed="${myList.has(item.id)}">${myList.has(item.id) ? ic.check + ' In My List' : ic.plus + ' My List'}</button></div></div></div>
    <div class="detail-body"><div><p class="detail-tag">“${esc(item.tagline)}”</p><p>${esc(item.synopsis)}</p><small class="fine left">Concept title · not available to stream today.</small></div>
      <div class="detail-more"><h4>More like this</h4>${similar.map(s => `<button data-title="${s.id}" class="more-row"><img src="${asset(s.artwork)}" alt=""><span><b>${esc(s.title)}</b><small>${esc(s.kind)} · ${esc(s.genre)}</small></span></button>`).join('')}</div></div>
  </div>`);
  $('[data-modal-play]', modal)?.addEventListener('click', () => openPlayer(item));
  track('title_opened', { title: item.title, kind: item.kind });
}

/* Simulated concept player (no real stream is implied) */
const PREVIEW_SECONDS = 72;
let playTimer = 0;
function stopPlayback() { window.clearInterval(playTimer); playTimer = 0; }
const fmt = (s: number) => `${Math.floor(s / 60)}:${pad(Math.floor(s % 60))}`;

function openPlayer(item: Title) {
  const captions = [item.tagline, item.synopsis.split(' — ')[0].split('.')[0] + '.', 'Coming 2027 · Only on F.A.M.E'];
  openModal(`
  <div class="modal-card player-card" role="dialog" aria-modal="true" aria-labelledby="playerTitle" style="--accent:${item.accent}">
    <button class="modal-close" data-close aria-label="Close player">${ic.close}</button>
    <div class="player" id="player">
      <img class="player-img" src="${asset(item.backdrop)}" alt="">
      <div class="player-shade"></div>
      <div class="player-top"><span>CONCEPT PREVIEW · NOT A LIVE STREAM</span></div>
      <div class="player-center"><button class="play-large" id="playToggleLarge" aria-label="Play concept preview">${ic.play}</button></div>
      <div class="player-title"><small>${esc(item.kind)} · ${esc(item.genre)}</small><strong id="playerTitle">${esc(item.title)}</strong></div>
      <p class="player-caption" id="playerCaption" aria-live="off"></p>
      <div class="player-end" id="playerEnd"><p class="eyebrow">COMING 2027</p><h3>${esc(item.title)}</h3><p>Be first to watch when F.A.M.E launches.</p><a class="btn btn-primary" href="#waitlist" id="endCta">Get early access ${ic.arrow}</a><button class="btn btn-glass" id="replay">${ic.play} Replay</button></div>
      <div class="player-bar">
        <button class="pbtn" id="playToggle" aria-label="Play">${ic.play}</button>
        <span id="curTime">0:00</span>
        <input class="scrub" id="scrub" type="range" min="0" max="${PREVIEW_SECONDS}" step="0.1" value="0" aria-label="Seek">
        <span>${fmt(PREVIEW_SECONDS)}</span>
        <span class="pbtn static" aria-hidden="true">${ic.vol}</span><span class="pbtn static" aria-hidden="true">${ic.full}</span>
      </div>
    </div>
  </div>`);
  const player = $('#player', modal)!, scrub = $<HTMLInputElement>('#scrub', modal)!, cur = $('#curTime', modal)!, cap = $('#playerCaption', modal)!;
  const toggleBtns = [$('#playToggle', modal)!, $('#playToggleLarge', modal)!];
  let t = 0;
  const paint = () => {
    cur.textContent = fmt(t); scrub.value = String(t);
    scrub.style.setProperty('--p', `${(t / PREVIEW_SECONDS) * 100}%`);
    const i = t < 10 ? 0 : t < 24 ? 1 : t < 46 ? 2 : -1;
    cap.textContent = i >= 0 ? captions[i] : ''; cap.classList.toggle('on', i >= 0);
  };
  const setPlaying = (on: boolean) => {
    player.classList.toggle('playing', on);
    toggleBtns.forEach(b => { b.innerHTML = on ? ic.pause : ic.play; b.setAttribute('aria-label', on ? 'Pause' : 'Play'); });
    stopPlayback();
    if (on) {
      player.classList.remove('ended');
      if (t >= PREVIEW_SECONDS) t = 0;
      playTimer = window.setInterval(() => { t = Math.min(PREVIEW_SECONDS, t + .25); paint(); if (t >= PREVIEW_SECONDS) { setPlaying(false); player.classList.add('ended'); } }, 250);
    }
  };
  toggleBtns.forEach(b => b.addEventListener('click', () => { setPlaying(!player.classList.contains('playing')); track('concept_player_used', { title: item.title }); }));
  scrub.addEventListener('input', () => { t = Number(scrub.value); player.classList.remove('ended'); paint(); });
  $('#replay', modal)?.addEventListener('click', () => { t = 0; paint(); setPlaying(true); });
  $('#endCta', modal)?.addEventListener('click', () => closeModal());
  paint(); track('concept_preview_started', { title: item.title });
  window.setTimeout(() => setPlaying(true), 350);
}

/* ------------------------------------------------------------------ */
/*  Hero carousel                                                      */
/* ------------------------------------------------------------------ */
const hero = $('#hero')!;
const slides = $$('.hero-slide', hero);
const thumbs = $$('.hero-thumb', hero);
let slideIdx = 0;
function goTo(i: number) {
  slideIdx = (i + slides.length) % slides.length;
  slides.forEach((s, n) => { const on = n === slideIdx; s.classList.toggle('active', on); s.setAttribute('aria-hidden', String(!on)); });
  thumbs.forEach((b, n) => { const on = n === slideIdx; b.classList.toggle('active', on); b.setAttribute('aria-selected', String(on)); const bar = $('i', b); if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; } });
}
thumbs.forEach((b, i) => b.addEventListener('click', () => { goTo(i); track('hero_slide', { title: heroTitles[i].id }); }));
thumbs.forEach(b => $('i', b)?.addEventListener('animationend', () => goTo(slideIdx + 1)));
hero.addEventListener('pointerenter', () => hero.classList.add('paused'));
hero.addEventListener('pointerleave', () => hero.classList.remove('paused'));
hero.addEventListener('focusin', () => hero.classList.add('paused'));
hero.addEventListener('focusout', () => hero.classList.remove('paused'));
if (!reduceMotion) {
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--px', String(((e.clientX - r.left) / r.width - .5).toFixed(3)));
    hero.style.setProperty('--py', String(((e.clientY - r.top) / r.height - .5).toFixed(3)));
  });
} else { hero.classList.add('static'); }

/* ------------------------------------------------------------------ */
/*  Product preview: TV + phone                                        */
/* ------------------------------------------------------------------ */
let tvTab = 'home';
const tvCard = (t: Title, progress?: number) => `<button class="tv-card" data-title="${t.id}" aria-label="Open ${esc(t.title)}"><img src="${asset(t.backdrop)}" alt="" loading="lazy" width="1600" height="900">${progress ? `<i style="--p:${progress}%"></i>` : ''}<span>${esc(t.title)}</span></button>`;
function tvLayout(hero: Title, rows: { h: string; items: string }[]) {
  return `<div class="tv-hero" style="--accent:${hero.accent}"><img src="${asset(hero.backdrop)}" alt=""><div class="tv-hero-shade"></div><div class="tv-hero-copy"><small>${hero.badge === 'Original' ? 'F.A.M.E ORIGINAL' : 'ONLY ON F.A.M.E'}</small><strong>${esc(hero.title)}</strong><p>${esc(hero.tagline)}</p><div><button class="btn btn-light sm" data-play="${hero.id}">${ic.play} Play</button><button class="btn btn-glass sm list-toggle ${myList.has(hero.id) ? 'saved' : ''}" data-list="${hero.id}" data-label="1" aria-pressed="${myList.has(hero.id)}">${myList.has(hero.id) ? ic.check + ' In My List' : ic.plus + ' My List'}</button></div></div></div>${rows.map(r => `<div class="tv-row"><h5>${r.h}</h5><div>${r.items}</div></div>`).join('')}`;
}
function renderTV(tab: string) {
  tvTab = tab;
  const main = $('#tvMain')!;
  $$('[data-tv-tab]').forEach(b => { const on = b.dataset.tvTab === tab; b.classList.toggle('active', on); b.setAttribute('aria-selected', String(on)); });
  if (tab === 'home') main.innerHTML = tvLayout(byId('city-of-dreams')!, [{ h: 'Continue watching', items: [['street-kings', 62], ['midnight-radio', 85], ['roots-and-rhythm', 28]].map(([id, p]) => tvCard(byId(id as string)!, p as number)).join('') }, { h: 'Trending in Johannesburg', items: ['future-africa', 'the-next-move', 'after-the-rain'].map(id => tvCard(byId(id)!)).join('') }]);
  else if (tab === 'originals') main.innerHTML = tvLayout(byId('roots-and-rhythm')!, [{ h: 'African Originals', items: byTag('originals').filter(t => t.id !== 'roots-and-rhythm').slice(0, 4).map(t => tvCard(t)).join('') }]);
  else if (tab === 'mylist') {
    const saved = [...myList].map(id => byId(id)!).filter(Boolean);
    main.innerHTML = saved.length
      ? `<div class="tv-pad"><h4>My List</h4><p>${saved.length} saved · synced across your devices</p><div class="tv-grid">${saved.map(t => tvCard(t)).join('')}</div></div>`
      : `<div class="tv-pad tv-empty"><h4>My List</h4><p>Nothing saved yet. Tap <b>+</b> on any title on this page and it will appear here — instantly.</p><div class="tv-grid">${['the-last-dance', 'village-to-vision', 'little-legends'].map(id => tvCard(byId(id)!)).join('')}</div><small>Suggestions</small></div>`;
  } else main.innerHTML = `<div class="tv-pad tv-profiles"><h4>Who’s watching?</h4><div>${[['Naledi', '#e5007e'], ['Tendai', '#6e42ff'], ['Kids', '#ffc84a'], ['Guest', '#3de0ff']].map(([n, c]) => `<button class="avatar" style="--c:${c}" data-profile="${n}"><span>${n[0]}</span>${n}</button>`).join('')}</div><small>Profiles, parental controls and recommendations — one account, every screen.</small></div>`;
  paintListButtons();
}
$$('[data-tv-tab]').forEach(b => b.addEventListener('click', () => { renderTV(b.dataset.tvTab!); track('product_preview_tab', { tab: b.dataset.tvTab! }); }));
$('#tvMain')!.addEventListener('click', e => { const p = (e.target as HTMLElement).closest<HTMLElement>('[data-profile]'); if (p) { $$('[data-profile]').forEach(x => x.classList.toggle('picked', x === p)); showToast(`Profile: ${p.dataset.profile}`); } });
$('#castBtn')?.addEventListener('click', () => {
  const tv = $('#tv')!; const on = !tv.classList.contains('resumed');
  tv.classList.toggle('resumed', on);
  if (on) { renderTV('home'); showToast('Casting to Living Room TV'); } else showToast('Stopped casting');
  track('cast_demo', { on });
});

/* ------------------------------------------------------------------ */
/*  Browse grid, search                                                */
/* ------------------------------------------------------------------ */
function renderCatalogue() {
  const list = catalogue.filter(item => activeFilter === 'all' || item.tags.includes(activeFilter));
  catalogueGrid.innerHTML = list.map(t => posterCard(t)).join('');
  paintListButtons();
}
$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  $$('[data-filter]').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
  button.classList.add('active'); button.setAttribute('aria-pressed', 'true');
  activeFilter = button.dataset.filter ?? 'all'; renderCatalogue(); track('catalogue_filter', { filter: activeFilter });
}));

function renderSearchResults(query = '') {
  const target = $('#searchResults')!; const q = query.trim().toLowerCase();
  const results = catalogue.filter(item => !q || [item.title, item.kind, item.genre, item.tagline, ...item.tags].join(' ').toLowerCase().includes(q)).slice(0, 8);
  target.innerHTML = results.length
    ? `<div class="search-results">${results.map(item => `<button class="search-result" data-search-title="${item.id}"><img src="${asset(item.backdrop)}" alt=""><span><b>${esc(item.title)}</b><small>${esc(item.kind)} · ${esc(item.genre)} · ${esc(item.duration)}</small></span><em>View ${ic.arrow}</em></button>`).join('')}</div>`
    : `<p class="empty-search">Nothing found. Try a genre, a format or “originals”.</p>`;
  $$('[data-search-title]', target).forEach(el => el.addEventListener('click', () => { const item = byId(el.dataset.searchTitle!); if (item) { closeSearch(false); openTitle(item); } }));
}
function openSearch() { lastFocused = document.activeElement as HTMLElement; searchDrawer.classList.add('open'); searchDrawer.setAttribute('aria-hidden', 'false'); syncBodyLock(); searchInput.value = ''; renderSearchResults(); window.setTimeout(() => searchInput.focus(), 40); track('search_opened'); }
function closeSearch(restore = true) { searchDrawer.classList.remove('open'); searchDrawer.setAttribute('aria-hidden', 'true'); syncBodyLock(); if (restore) lastFocused?.focus(); }
$('#searchOpen')?.addEventListener('click', openSearch);
$('#searchClose')?.addEventListener('click', () => closeSearch());
searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));
searchDrawer.addEventListener('click', e => { if (e.target === searchDrawer) closeSearch(); });

/* ------------------------------------------------------------------ */
/*  Navigation, keyboard, scroll effects                               */
/* ------------------------------------------------------------------ */
const menu = $('#mobileNav')!; const menuBtn = $<HTMLButtonElement>('#menuOpen')!;
menuBtn.addEventListener('click', () => { const open = menu.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', String(open)); document.body.classList.toggle('menu-open', open); });
$$('a', menu).forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); }));

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { if (modal.classList.contains('open')) closeModal(); if (searchDrawer.classList.contains('open')) closeSearch(); }
  if (event.key === '/' && !(event.target instanceof HTMLInputElement) && !modal.classList.contains('open')) { event.preventDefault(); openSearch(); }
  if (event.key === 'Tab') {
    const layer = modal.classList.contains('open') ? modal : searchDrawer.classList.contains('open') ? searchDrawer : null; if (!layer) return;
    const f = $$<HTMLElement>('button,[href],input,[tabindex]:not([tabindex="-1"])', layer).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
    if (!f.length) return; const first = f[0], last = f[f.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
$$<HTMLAnchorElement>('a[href^="#"]').forEach(link => link.addEventListener('click', () => track('navigation_click', { target: link.getAttribute('href') ?? '' })));

const header = $('#siteHeader')!, progress = $('#scrollProgress')!, mobileBar = $('#mobileBar')!;
let ticking = false;
function onScroll() {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('scrolled', y > 24);
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    mobileBar.classList.toggle('show', y > window.innerHeight * .7 && !isInView('#waitlist'));
    if (!reduceMotion && y < window.innerHeight * 1.2) hero.style.setProperty('--sy', `${Math.round(y * .22)}px`);
    ticking = false;
  });
}
function isInView(sel: string) { const el = $(sel); if (!el) return false; const r = el.getBoundingClientRect(); return r.top < window.innerHeight * .8 && r.bottom > 0; }
window.addEventListener('scroll', onScroll, { passive: true });

/* Spotlight glow follows the pointer on feature cards */
$$('.bento-card').forEach(card => card.addEventListener('pointermove', e => { const r = card.getBoundingClientRect(); card.style.setProperty('--mx', `${e.clientX - r.left}px`); card.style.setProperty('--my', `${e.clientY - r.top}px`); }));

/* Reveal on scroll */
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
$$('.reveal').forEach(el => observer.observe(el));

/* ------------------------------------------------------------------ */
/*  Waitlist (unchanged contract: VITE_WAITLIST_ENDPOINT)              */
/* ------------------------------------------------------------------ */
const waitlist = $<HTMLFormElement>('#waitlistForm')!;
waitlist.addEventListener('submit', async event => {
  event.preventDefault();
  const email = $<HTMLInputElement>('#email')!, consent = $<HTMLInputElement>('#consent')!, status = $<HTMLParagraphElement>('#formStatus')!;
  if (!email.checkValidity() || !consent.checked) { status.textContent = 'Please enter a valid email address and confirm the update consent.'; status.className = 'form-status error'; return; }
  const endpoint = import.meta.env.VITE_WAITLIST_ENDPOINT as string | undefined;
  if (!endpoint) { status.textContent = 'Demo mode: no registration was sent. Connect VITE_WAITLIST_ENDPOINT to capture real sign-ups.'; status.className = 'form-status'; track('waitlist_demo_submit'); showToast('Demo mode — no email was sent'); return; }
  status.textContent = 'Sending…'; status.className = 'form-status';
  try {
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.value, source: 'fame-showcase', consent: true }) });
    if (!response.ok) throw new Error('Waitlist request failed');
    status.textContent = 'You’re on the list. We’ll keep you posted.'; status.className = 'form-status success'; waitlist.reset(); track('waitlist_signup', { source: 'website' });
  } catch { status.textContent = 'We couldn’t save that just now. Please try again in a moment.'; status.className = 'form-status error'; }
});

/* ------------------------------------------------------------------ */
renderTV('home'); renderCatalogue(); paintListButtons(); initAnalytics(); onScroll();
