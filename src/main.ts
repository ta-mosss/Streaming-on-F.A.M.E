import './styles/main.css';
import { catalogue, categories, Title } from './data/catalogue';
import { initAnalytics, track } from './analytics';
import { ContentCard, ContentRow, ProductPreview, renderCategoryButtons } from './components';

customElements.define('content-card', ContentCard);
customElements.define('content-row', ContentRow);
customElements.define('product-preview', ProductPreview);

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
<header class="site-header" id="top">
  <a class="brand" href="#home" aria-label="Streaming on F.A.M.E home"><img src="/assets/brand/fame-logo.webp" alt="Streaming on F.A.M.E" width="380" height="195"><span class="brand-note">PRODUCT SHOWCASE</span></a>
  <nav class="desktop-nav" aria-label="Primary navigation">
    <a href="#home">Home</a><a href="#experience">Experience</a><a href="#content">Content</a><a href="#vision">Vision</a><a href="#pricing">Plans</a><a href="#faq">FAQ</a>
  </nav>
  <div class="header-actions"><button class="icon-btn" id="searchBtn" aria-label="Search">⌕</button><button class="icon-btn" id="themeBtn" aria-label="Toggle theme">☼</button><a class="primary-btn compact" href="#waitlist">Get early access</a><button class="menu-btn" id="menuBtn" aria-label="Open menu">☰</button></div>
</header>
<div class="mobile-menu" id="mobileMenu"><a href="#home">Home</a><a href="#experience">Experience</a><a href="#content">Content</a><a href="#vision">Vision</a><a href="#pricing">Plans</a><a href="#faq">FAQ</a><a class="primary-btn" href="#waitlist">Get early access</a></div>
<main id="main">
<section class="hero" id="home">
  <div class="hero-media"><div class="hero-orb orb-one"></div><div class="hero-orb orb-two"></div><div class="hero-grid"></div></div>
  <div class="hero-inner"><div class="hero-copy"><span class="eyebrow"><i></i> PRODUCT SHOWCASE · BUILDING TOWARD 2027</span><h1>Your Stage.<br><span class="gradient-text">Your Story.</span><br><small>Your F.A.M.E.</small></h1><p>We’re building a bold, affordable African entertainment platform designed around local stories, creators and audiences. This website showcases the product vision — the VOD platform itself will be built as a separate project.</p><div class="hero-actions"><a class="primary-btn" href="#experience" data-track="hero_experience">Explore the experience</a><a class="secondary-btn" href="#vision" data-track="hero_vision">See the vision</a></div><div class="hero-proof"><span><b>Mobile first</b> PWA + Android</span><span><b>African first</b> Local stories</span><span><b>More for less</b> Built for access</span></div></div><div class="hero-art"><div class="floating-poster poster-a"><img src="/assets/content/city-of-dreams.svg" alt="City of Dreams concept artwork"></div><div class="floating-poster poster-b"><img src="/assets/content/roots-and-rhythm.svg" alt="Roots and Rhythm concept artwork"></div><div class="hero-device"><div class="device-notch"></div><div class="device-screen"><img src="/assets/content/after-the-rain.svg" alt="F.A.M.E product preview artwork"><div class="device-overlay"><span>F.A.M.E ORIGINAL</span><b>After the Rain</b><button data-play-hero>▶</button></div></div></div></div></div>
</section>
<section class="trust-strip"><div><b>R29.90</b><span>Showcase pricing direction</span></div><div><b>2 profiles</b><span>Family-first concept</span></div><div><b>Mobile first</b><span>Designed for real-world access</span></div><div><b>Southern Africa</b><span>Pan-African ambition</span></div></section>
<section class="section intro" id="vision"><div class="section-heading"><span class="kicker">THE WHY</span><h2>Entertainment that feels <span class="gradient-text">like home.</span></h2><p>F.A.M.E is built around one simple mission: <strong>to entertain and empower Africa.</strong> The experience should feel premium, intuitive and proudly local — while staying accessible to a mobile-centric audience.</p></div><div class="vision-grid"><article><span>01</span><h3>African stories first</h3><p>Originals, movies, series, documentaries, kids content and creator-led stories that put local voices at the centre.</p></article><article><span>02</span><h3>Premium without the premium barrier</h3><p>A clean, cinematic experience built around the idea of more for less — simple plans, clear cancellation and no unnecessary friction.</p></article><article><span>03</span><h3>Empowerment through entertainment</h3><p>The long-term vision connects audiences, creators, jobs and the wider film and television production value chain.</p></article></div></section>
<section class="section experience" id="experience"><div class="section-heading split"><div><span class="kicker">INTERACTIVE PRODUCT PREVIEW</span><h2>See the <span class="gradient-text">future F.A.M.E experience.</span></h2></div><p>This is a front-end concept — not the production VOD application. Explore the interaction model, browse concept artwork and open title details.</p></div><product-preview></product-preview></section>
<section class="section content-section" id="content"><div class="section-heading split"><div><span class="kicker">CONTENT UNIVERSE</span><h2>Stories worth <span class="gradient-text">discovering.</span></h2></div><p>These are showcase concept titles created for the website experience. They are not claims about an existing catalogue.</p></div><div class="filters" id="filters">${renderCategoryButtons()}</div><div class="catalogue-grid" id="catalogueGrid"></div></section>
<section class="section features" id="features"><div class="section-heading centered"><span class="kicker">PRODUCT PRINCIPLES</span><h2>Designed around <span class="gradient-text">how Africa watches.</span></h2></div><div class="feature-grid"><article><div class="feature-icon">⌁</div><h3>Mobile-first by default</h3><p>Fast, thumb-friendly interfaces, adaptive media and a native-app feel across mobile web and future apps.</p></article><article><div class="feature-icon">▶</div><h3>Cinematic discovery</h3><p>Hero storytelling, swipeable rows, clear metadata and a path from discovery to playback in as few taps as possible.</p></article><article><div class="feature-icon">◎</div><h3>Profiles & Kids</h3><p>Personal watchlists, viewing history and a dedicated PIN-protected kids experience.</p></article><article><div class="feature-icon">⌁</div><h3>Adaptive streaming</h3><p>A future-ready media architecture designed to scale from everyday mobile networks toward higher-quality playback.</p></article><article><div class="feature-icon">↗</div><h3>Creator ecosystem</h3><p>The long-term platform vision connects content, creators, audiences and opportunities across the continent.</p></article><article><div class="feature-icon">☏</div><h3>Human support</h3><p>A direct support experience is part of the brand promise — simple, visible and designed around real people.</p></article></div></section>
<section class="section roadmap"><div class="section-heading centered"><span class="kicker">ROADMAP</span><h2>From <span class="gradient-text">showcase</span> to platform.</h2><p>The website is the first public-facing layer. The production streaming platform comes next as a separate engineering programme.</p></div><div class="roadmap-track"><article class="current"><span>NOW</span><h3>Showcase website</h3><p>Brand, product story, interactive preview, content concepts and early-access capture.</p></article><article><span>01</span><h3>MVP discovery & build</h3><p>Mobile web/PWA, Android, accounts, profiles, catalogue, player, subscriptions and payments.</p></article><article><span>02</span><h3>Platform expansion</h3><p>iOS, desktop, Smart TV, deeper personalisation and additional interactive experiences.</p></article><article><span>03</span><h3>Growth</h3><p>4K, territories, advanced segmentation, marketing automation and future live experiences.</p></article></div></section>
<section class="section pricing" id="pricing"><div class="section-heading centered"><span class="kicker">SHOWCASE PRICING DIRECTION</span><h2>Simple. Clear. <span class="gradient-text">Accessible.</span></h2><p>These are product-vision price points from the supplied brief and are presented here as directional, not live purchase options.</p></div><div class="plans"><article class="plan"><span>AD-SUPPORTED</span><strong>R29.90</strong><small>/ month · showcase direction</small><ul><li>Full catalogue concept</li><li>Mobile-first viewing</li><li>Kids & Family concept</li><li>Up to 2 profiles</li></ul><a class="secondary-btn" href="#waitlist">Join the waitlist</a></article><article class="plan featured"><span>MOST POPULAR CONCEPT</span><strong>R39.90</strong><small>/ month · showcase direction</small><ul><li>Everything in Ad-Supported</li><li>Ad-less viewing concept</li><li>HD adaptive streaming concept</li><li>Offline viewing roadmap</li></ul><a class="primary-btn" href="#waitlist">Join the waitlist</a></article></div></section>
<section class="section waitlist" id="waitlist"><div class="waitlist-card"><div><span class="kicker">EARLY ACCESS</span><h2>Be part of the story.</h2><p>Tell us where to reach you when the real F.A.M.E product moves closer to launch. The form only confirms success when a real endpoint is configured.</p></div><form id="waitlistForm"><label for="email">Email address</label><div class="form-row"><input id="email" name="email" type="email" placeholder="you@example.com" autocomplete="email" required><input id="company" name="company" class="honeypot" tabindex="-1" autocomplete="off"><button class="primary-btn" type="submit" id="waitlistBtn">Notify me</button></div><p class="form-note" id="waitlistNote">No marketing spam. Unsubscribe anytime.</p></form></div></section>
<section class="section faq" id="faq"><div class="section-heading centered"><span class="kicker">FAQ</span><h2>Questions, answered.</h2></div><div class="faq-list"><details open><summary>Is this the actual F.A.M.E streaming platform?</summary><p>No. This repository is the public showcase website. The production VOD application will be designed and built as a separate project.</p></details><details><summary>Can I watch full content here?</summary><p>No. The interactive experience uses concept artwork and simulated product interactions. It does not provide production streaming, DRM or paid playback.</p></details><details><summary>What is being built first?</summary><p>The supplied brief prioritises mobile web/PWA and Android for the MVP, followed by iOS, desktop/Smart TV and later growth capabilities.</p></details><details><summary>Are the prices live?</summary><p>No. R29.90 and R39.90 are presented as showcase pricing direction from the supplied brief, not as an active checkout.</p></details><details><summary>How will the waitlist work?</summary><p>The form is endpoint-driven. Until a real waitlist API is configured, the site will not falsely claim that a registration was submitted.</p></details></div></section>
</main>
<footer class="footer"><div class="footer-brand"><img src="/assets/brand/fame-logo.webp" alt="Streaming on F.A.M.E" width="300" height="154"><p>Your Stage. Your Story.</p></div><div class="footer-links"><a href="#experience">Experience</a><a href="#content">Content</a><a href="#vision">Vision</a><a href="#pricing">Plans</a><a href="#faq">FAQ</a><a href="press.html">Press kit</a></div><div class="footer-bottom"><span>© <span id="year"></span> Streaming on F.A.M.E</span><span>Showcase website · Production VOD platform to follow</span></div></footer>
<nav class="mobile-tabs" aria-label="Mobile navigation"><a href="#home">⌂<small>Home</small></a><a href="#experience">✦<small>Experience</small></a><a href="#content">▦<small>Content</small></a><a href="#pricing">R<small>Plans</small></a><a href="#waitlist">✉<small>Notify</small></a></nav>
<div class="modal" id="modal" aria-hidden="true"><div class="modal-card" id="modalCard"><button class="modal-close" id="modalClose" aria-label="Close">×</button><div id="modalBody"></div></div></div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<div class="search-drawer" id="searchDrawer" aria-hidden="true"><div class="search-panel"><button class="modal-close" id="searchClose" aria-label="Close search">×</button><span class="kicker">DISCOVER</span><h2>Find your next story.</h2><div class="search-input"><span>⌕</span><input id="searchInput" type="search" placeholder="Search titles, genres or categories..."></div><div class="search-results" id="searchResults"></div></div></div>
`;

const $ = <T extends Element = HTMLElement>(selector: string) => document.querySelector<T>(selector);

function renderCatalogue(filter = 'all') {
  const host = $('#catalogueGrid');
  if (!host) return;
  const filtered = filter === 'all' ? catalogue : catalogue.filter(item => item.tags.includes(filter) || item.kind.toLowerCase() === filter);
  host.innerHTML = filtered.map(item => `<content-card data-id="${item.id}"></content-card>`).join('');
  document.querySelectorAll<HTMLElement>('.filter-chip').forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter));
}

function openTitle(item: Title) {
  const modal = $('#modal')!;
  const body = $('#modalBody')!;
  body.innerHTML = `<div class="detail-layout"><img class="detail-art" src="${item.artwork}" alt="${item.title} concept artwork"><div class="detail-copy"><span class="kicker">${item.kind.toUpperCase()} · PRODUCT PREVIEW</span><h2>${item.title}</h2><div class="detail-meta">${item.year} · ${item.rating} · ${item.genre} · ${item.duration}</div><p>${item.synopsis}</p><div class="detail-actions"><button class="primary-btn" id="detailPlay">▶ Play preview</button><button class="secondary-btn" id="detailList">＋ My List</button></div><p class="disclaimer">Conceptual showcase artwork. This demo does not stream production content.</p></div></div>`;
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open');
  $('#detailPlay')?.addEventListener('click', () => { track('trailer_started',{title:item.title}); openPlayer(item); });
  $('#detailList')?.addEventListener('click', () => { track('my_list_demo',{title:item.title}); showToast(`${item.title} added to the demo My List.`); });
}

function openPlayer(item: Title) {
  const modal = $('#modal')!; const body = $('#modalBody')!;
  body.innerHTML = `<div class="player-demo"><div class="player-screen"><img src="${item.artwork}" alt=""><div class="player-vignette"></div><div class="player-center"><button class="play-circle" id="fakePlay">▶</button><span>TRAILER PREVIEW</span></div><div class="player-controls"><span>0:00</span><div class="progress"><i></i></div><span>${item.duration.includes('h')?'1:48':'0:45'}</span></div></div><div class="player-copy"><span class="kicker">${item.kind}</span><h2>${item.title}</h2><p>${item.synopsis}</p><p class="disclaimer">Simulated player for the showcase website — no production media is being delivered.</p></div></div>`;
  $('#fakePlay')?.addEventListener('click', () => { track('preview_play_button',{title:item.title}); showToast('This is a product preview — production playback comes later.'); });
}

function showToast(message: string) { const toast=$('#toast')!; toast.textContent=message; toast.classList.add('show'); window.setTimeout(()=>toast.classList.remove('show'),3200); }

function closeModal() { const modal=$('#modal')!; modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open'); }

$('#modalClose')?.addEventListener('click', closeModal); $('#modal')?.addEventListener('click', e => { if(e.target === $('#modal')) closeModal(); });
$('#searchBtn')?.addEventListener('click', () => { const d=$('#searchDrawer')!; d.classList.add('open'); d.setAttribute('aria-hidden','false'); setTimeout(()=>$('#searchInput')?.focus(),50); });
$('#searchClose')?.addEventListener('click', () => { const d=$('#searchDrawer')!; d.classList.remove('open'); d.setAttribute('aria-hidden','true'); });
$('#themeBtn')?.addEventListener('click', () => { document.documentElement.classList.toggle('light'); localStorage.setItem('fame-theme', document.documentElement.classList.contains('light')?'light':'dark'); track('theme_changed',{theme:document.documentElement.classList.contains('light')?'light':'dark'}); });
if(localStorage.getItem('fame-theme') === 'light') document.documentElement.classList.add('light');
$('#menuBtn')?.addEventListener('click', () => $('#mobileMenu')?.classList.toggle('open'));
document.querySelectorAll<HTMLAnchorElement>('#mobileMenu a').forEach(a => a.addEventListener('click',()=>$('#mobileMenu')?.classList.remove('open')));
document.querySelectorAll<HTMLElement>('[data-track]').forEach(el=>el.addEventListener('click',()=>track(el.dataset.track || 'cta_click')));
document.querySelectorAll<HTMLButtonElement>('.filter-chip').forEach(btn=>btn.addEventListener('click',()=>renderCatalogue(btn.dataset.filter || 'all')));
document.addEventListener('fame:open-title', e => openTitle((e as CustomEvent<Title>).detail));
document.addEventListener('fame:play-preview', e => openPlayer((e as CustomEvent<Title>).detail));
document.querySelector('[data-play-hero]')?.addEventListener('click',()=>openPlayer(catalogue[3]));

$('#searchInput')?.addEventListener('input', e => {
  const q=(e.target as HTMLInputElement).value.trim().toLowerCase();
  const results=$('#searchResults')!;
  const found=q ? catalogue.filter(x=>[x.title,x.genre,x.kind,...x.tags].join(' ').toLowerCase().includes(q)).slice(0,8) : catalogue.slice(0,6);
  results.innerHTML=found.length ? found.map(x=>`<button class="search-result" data-id="${x.id}"><img src="${x.artwork}" alt=""><span><b>${x.title}</b><small>${x.kind} · ${x.genre}</small></span><em>›</em></button>`).join('') : '<p class="empty">No concept titles match that search yet.</p>';
  results.querySelectorAll<HTMLButtonElement>('[data-id]').forEach(btn=>btn.addEventListener('click',()=>{const item=catalogue.find(x=>x.id===btn.dataset.id); if(item){ $('#searchDrawer')?.classList.remove('open'); openTitle(item); }}));
});

$('#waitlistForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const form=e.currentTarget as HTMLFormElement; const email=($('#email') as HTMLInputElement).value.trim(); const honeypot=($('#company') as HTMLInputElement).value;
  const note=$('#waitlistNote')!; const btn=$('#waitlistBtn') as HTMLButtonElement; const endpoint=import.meta.env.VITE_WAITLIST_ENDPOINT as string | undefined;
  if(honeypot) return;
  if(!email || !email.includes('@')) { note.textContent='Please enter a valid email address.'; note.className='form-note error'; return; }
  if(!endpoint) { note.textContent='Early access is not connected yet. No registration was submitted. Configure VITE_WAITLIST_ENDPOINT when the waitlist backend is ready.'; note.className='form-note'; track('waitlist_endpoint_missing'); return; }
  btn.disabled=true; btn.textContent='Sending...'; note.textContent='';
  try {
    const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,source:'website',consent:true})});
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    note.textContent='You’re on the list. We’ll contact you with F.A.M.E updates.'; note.className='form-note success'; form.reset(); track('waitlist_submitted');
  } catch { note.textContent='We could not submit your request right now. Please try again later.'; note.className='form-note error'; track('waitlist_submission_failed'); }
  finally { btn.disabled=false; btn.textContent='Notify me'; }
});

document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>track('navigation_click',{target:(a as HTMLAnchorElement).getAttribute('href') || ''})));

renderCatalogue();
initAnalytics();
$('#year')!.textContent = String(new Date().getFullYear());
track('page_view');
