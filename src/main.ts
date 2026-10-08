import './styles/main.css';
import { catalogue, categories, type Title } from './data/catalogue';
import { initAnalytics, track } from './analytics';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('F.A.M.E app mount not found');

const esc = (value: string) => value.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[c] ?? c));
const asset = (path: string) => path.replace(/^\//, './');
const featured = catalogue.find(item => item.featured) ?? catalogue[0];
const art = (item: Title) => item.artwork;
let activeFilter = 'all';
let myList = new Set<string>();
let lastFocused: HTMLElement | null = null;

const icon = {
  arrow: '↗',
  close: '×',
  search: '⌕',
  play: '▶',
  plus: '+',
  check: '✓',
  pause: 'Ⅱ',
  gear: '⚙',
  home: '⌂',
  user: '◉',
};

const card = (item: Title) => `
  <article class="title-card reveal">
    <button class="title-poster" data-title="${esc(item.id)}" aria-label="Open ${esc(item.title)}">
      <img src="${asset(art(item))}" alt="${esc(item.title)} concept artwork" loading="lazy" decoding="async">
      <span class="poster-gradient"></span>
      <span class="poster-kind">${esc(item.kind)}</span>
      <span class="poster-action">${icon.play}</span>
      <span class="poster-number">${String(catalogue.indexOf(item) + 1).padStart(2,'0')}</span>
    </button>
    <div class="title-meta">
      <div><h3>${esc(item.title)}</h3><p>${item.year} · ${esc(item.rating)} · ${esc(item.duration)}</p></div>
      <button class="list-toggle ${myList.has(item.id) ? 'saved' : ''}" data-list="${esc(item.id)}" aria-label="${myList.has(item.id) ? 'Remove' : 'Add'} ${esc(item.title)} ${myList.has(item.id) ? 'from' : 'to'} My List">${myList.has(item.id) ? icon.check : icon.plus}</button>
    </div>
  </article>`;

app.innerHTML = `
<div class="site" id="top">
  <div class="ambient ambient-one" aria-hidden="true"></div><div class="ambient ambient-two" aria-hidden="true"></div>
  <header class="site-header" id="siteHeader">
    <a class="wordmark" href="#top" aria-label="F.A.M.E home"><img src="${asset('assets/brand/fame-logo.webp')}" alt="F.A.M.E"></a>
    <nav class="desktop-nav" aria-label="Primary navigation">
      <a href="#why">The idea</a><a href="#preview">Experience</a><a href="#catalogue">Stories</a><a href="#creators">Creators</a>
    </nav>
    <div class="header-actions"><button class="search-trigger" id="searchOpen" aria-label="Search F.A.M.E">${icon.search}<span>Search</span></button><a class="header-cta" href="#waitlist">Join F.A.M.E</a><button class="menu-trigger" id="menuOpen" aria-expanded="false" aria-controls="mobileNav" aria-label="Open menu">☰</button></div>
  </header>
  <nav class="mobile-nav" id="mobileNav" aria-label="Mobile navigation"><a href="#why">The idea</a><a href="#preview">Experience</a><a href="#catalogue">Stories</a><a href="#creators">Creators</a><a href="#roadmap">Roadmap</a><a class="mobile-cta" href="#waitlist">Join F.A.M.E</a></nav>

  <main id="main">
    <section class="hero" aria-labelledby="heroTitle">
      <div class="hero-backdrop"><img src="${asset(art(featured))}" alt="" fetchpriority="high"><div class="hero-vignette"></div><div class="hero-noise"></div></div>
      <div class="hero-grid">
        <div class="hero-copy reveal active">
          <div class="hero-badge"><span class="live-pulse"></span> Building for Africa · Target launch 2027</div>
          <p class="hero-kicker">YOUR STAGE. YOUR STORY.</p>
          <h1 id="heroTitle">Stories from <em>here.</em><br>Made to travel.</h1>
          <p class="hero-lead">F.A.M.E is a new entertainment platform being shaped around African audiences, creators and the stories we want to see more of.</p>
          <div class="hero-actions"><a class="btn btn-primary" href="#preview">Step inside F.A.M.E <span>${icon.arrow}</span></a><a class="hero-text-link" href="#waitlist">Get launch updates <span>${icon.arrow}</span></a></div>
          <div class="hero-facts"><span><b>01</b> Local stories</span><span><b>02</b> Mobile first</span><span><b>03</b> Built to grow</span></div>
        </div>
        <div class="hero-feature reveal active" aria-label="Featured F.A.M.E title">
          <div class="feature-orbit"></div>
          <div class="feature-frame">
            <div class="feature-top"><span>F.A.M.E ORIGINAL</span><span>01 / ${String(catalogue.length).padStart(2,'0')}</span></div>
            <div class="feature-art" style="background-image:linear-gradient(180deg,transparent 34%,rgba(5,5,5,.96)),url('${asset(art(featured))}')"></div>
            <div class="feature-copy"><span class="overline">Featured story · ${featured.year}</span><h2>${esc(featured.title)}</h2><p>${esc(featured.synopsis)}</p><div class="feature-actions"><button class="round-play" data-play="${featured.id}" aria-label="Play ${esc(featured.title)} concept preview">${icon.play}</button><button class="feature-open" data-title="${featured.id}">View story ${icon.arrow}</button></div></div>
          </div>
        </div>
      </div>
      <div class="hero-scroll" aria-hidden="true"><span>Scroll to explore</span><i></i></div>
    </section>

    <section class="ticker" aria-label="F.A.M.E themes"><div class="ticker-track"><span>AFRICAN ORIGINALS</span><i>✦</i><span>FILMS</span><i>✦</i><span>SERIES</span><i>✦</i><span>MUSIC</span><i>✦</i><span>DOCUMENTARIES</span><i>✦</i><span>CREATORS</span><i>✦</i><span>AFRICAN ORIGINALS</span><i>✦</i><span>FILMS</span><i>✦</i></div></section>

    <div class="launch-note reveal"><span class="note-dot"></span><p><strong>This is the vision.</strong> You are exploring a product showcase today. Accounts, subscriptions, production playback, apps and the live catalogue belong to the next build.</p><a href="#roadmap">See the journey ${icon.arrow}</a></div>

    <section class="section editorial" id="why">
      <div class="section-kicker">01 · The idea</div>
      <div class="editorial-grid"><div><p class="display-label">BUILT FROM HERE.</p><h2>A place for stories that already <em>belong</em> to us.</h2></div><div class="editorial-copy"><p>F.A.M.E is being imagined as more than a catalogue. It is a home for the films, series, music, documentaries, ideas and creators shaping a modern African audience.</p><p>The experience is intentionally simple: discover something quickly, understand why it matters, press play and come back for the next story.</p><a class="inline-link" href="#catalogue">Explore the concept catalogue ${icon.arrow}</a></div></div>
      <div class="principles"><article><span>01</span><h3>Local by design</h3><p>African stories should feel central to the experience, not like a category hidden in a menu.</p></article><article><span>02</span><h3>Easy to love</h3><p>Less hunting. Better discovery. A product that feels natural from the first tap.</p></article><article><span>03</span><h3>Built for return visits</h3><p>Fresh releases, smart collections and enough personality to become a habit.</p></article></div>
    </section>

    <section class="section identity-section"><div class="section-kicker">02 · A new entertainment identity</div><div class="identity-grid"><div><h2>Made for <em>our cities.</em></h2><p>Johannesburg to Lagos. Cape Town to Nairobi. Accra to Kigali. The audience is connected, curious and already global.</p></div><div class="city-cloud" aria-label="African cities"><span>JOHANNESBURG</span><span>CAPE TOWN</span><span>LAGOS</span><span>NAIROBI</span><span>ACCRA</span><span>KIGALI</span><span>HARARE</span><span>WINDHOEK</span></div></div></section>

    <section class="section preview-section" id="preview">
      <div class="section-kicker">03 · Step inside F.A.M.E</div>
      <div class="section-heading"><div><h2>Don’t just read about it.<br><em>Use the product.</em></h2></div><p>This interactive concept is deliberately closer to a product demo than a marketing mock-up. Switch sections, save titles, open stories and preview the player.</p></div>
      <div class="product-demo" id="productDemo">
        <div class="demo-chrome"><div class="demo-brand"><span>F</span><strong>F.A.M.E</strong><small>PRODUCT PREVIEW</small></div><div class="demo-profile"><span class="live-dot"></span> Preview mode <button id="demoSearch" aria-label="Search product preview">${icon.search}</button></div></div>
        <div class="demo-hero"><div class="demo-hero-bg" style="background-image:url('${asset(art(featured))}')"></div><div class="demo-hero-content"><span class="demo-label">F.A.M.E ORIGINAL · ${featured.year}</span><h3>${esc(featured.title)}</h3><p>${esc(featured.synopsis)}</p><div class="demo-actions"><button class="btn btn-light" id="demoPlay">${icon.play} Play preview</button><button class="btn btn-dark" id="demoList">${myList.has(featured.id) ? icon.check : icon.plus} My List</button></div></div></div>
        <div class="demo-tabs" role="tablist" aria-label="Preview sections"><button class="active" data-demo-tab="home" role="tab" aria-selected="true">Home</button><button data-demo-tab="originals" role="tab" aria-selected="false">Originals</button><button data-demo-tab="mylist" role="tab" aria-selected="false">My List</button><button data-demo-tab="profile" role="tab" aria-selected="false">Profile</button></div>
        <div class="demo-body"><div class="demo-heading"><div><span id="demoEyebrow">Continue watching</span><h4 id="demoRowTitle">Pick up where you left off.</h4></div><button id="demoSeeAll">View catalogue ${icon.arrow}</button></div><div class="demo-row" id="demoRow"></div></div>
        <div class="demo-footer"><span>${icon.home} Home</span><span>${icon.search} Search</span><span>${icon.plus} My List</span><span>${icon.user} Profile</span></div>
      </div>
      <p class="demo-disclaimer">Concept interface · imagery and titles are for demonstration purposes · production availability may differ.</p>
    </section>

    <section class="section catalogue-section" id="catalogue"><div class="section-kicker">04 · The stories</div><div class="section-heading split"><div><p class="display-label">CONCEPT SLATE</p><h2>Stories with a <em>place of their own.</em></h2></div><p>Every title below is concept content created to demonstrate the direction of the future catalogue. It is not currently available to stream.</p></div><div class="filter-bar" id="filters">${categories.map(c => `<button class="${c.id==='all'?'active':''}" data-filter="${c.id}">${esc(c.label)}</button>`).join('')}</div><div class="catalogue-grid" id="catalogueGrid"></div></section>

    <section class="section experience-section"><div class="section-kicker">05 · The experience</div><div class="experience-grid"><div class="device-stage"><div class="device-glow"></div><div class="device-stack"><div class="device-card device-back"></div><div class="device-card device-mid"></div><div class="device-card device-front"><div class="device-notch"></div><div class="device-screen"><img src="${asset(art(featured))}" alt="F.A.M.E mobile interface concept"><div class="device-screen-shade"></div><div class="device-ui"><span>F.A.M.E</span><b>Continue watching</b><i>City of Dreams</i></div></div></div></div></div><div class="experience-copy"><div><p class="overline">Made for real life</p><h2>Open it on a phone.<br><em>Keep watching on the TV.</em></h2><p>F.A.M.E is planned mobile-first, with a wider-screen experience growing from the same product language. The goal is continuity: one account, one list, one place to pick up your story.</p></div><div class="experience-points"><article><span>01</span><div><h3>Mobile first</h3><p>Fast navigation, thumb-friendly controls and an interface designed for smaller screens first.</p></div></article><article><span>02</span><div><h3>Big-screen ready</h3><p>A premium viewing layer designed to translate naturally to desktop, TV and future apps.</p></div></article><article><span>03</span><div><h3>One growing ecosystem</h3><p>Profiles, My List, recommendations and creator-led discovery can expand as the platform matures.</p></div></article></div></div></div></section>

    <section class="section creators-section" id="creators"><div class="section-kicker">06 · For creators</div><div class="creator-banner"><div class="creator-art" style="background-image:url('${asset('assets/content/rise.jpg')}')"></div><div class="creator-overlay"></div><div class="creator-copy"><p class="overline">Your story deserves a bigger stage.</p><h2>F.A.M.E is for the people <em>making</em> the culture.</h2><p>Future creator partnerships could bring original series, films, documentaries, music sessions and ideas directly into the platform.</p><a class="btn btn-primary" href="#waitlist">Join the journey ${icon.arrow}</a></div></div><div class="creator-grid"><div><span>01</span><b>Originals</b><p>Develop stories made specifically for F.A.M.E.</p></div><div><span>02</span><b>Partnerships</b><p>Work with producers, studios and independent teams.</p></div><div><span>03</span><b>Discovery</b><p>Give emerging voices a place to be found.</p></div><div><span>04</span><b>Community</b><p>Build an audience around the work, not just the release.</p></div></div></section>

    <section class="section roadmap-section" id="roadmap"><div class="section-kicker">07 · The journey</div><div class="section-heading split"><div><p class="display-label">FROM VISION TO PRODUCT</p><h2>Build it properly.<br><em>Then launch it.</em></h2></div><p>The showcase is the first chapter. The production platform should be built with the same attention to product, infrastructure, content operations and trust.</p></div><div class="roadmap"><article class="roadmap-item active"><span>01</span><div><small>NOW · SHOWCASE</small><h3>Make the vision tangible</h3><p>Brand, product language, concept catalogue, interaction model and early audience capture.</p></div></article><article class="roadmap-item"><span>02</span><div><small>NEXT · PLATFORM</small><h3>Build the VOD foundation</h3><p>Accounts, profiles, catalogue management, subscriptions, playback, recommendations and analytics.</p></div></article><article class="roadmap-item"><span>03</span><div><small>THEN · CONTENT</small><h3>Bring the stories</h3><p>Creator partnerships, production slate, licensing, content operations and launch campaigns.</p></div></article><article class="roadmap-item"><span>04</span><div><small>LAUNCH · ECOSYSTEM</small><h3>Grow beyond the browser</h3><p>Mobile apps, TV experiences, creator tooling and a platform that can scale with its audience.</p></div></article></div></section>

    <section class="section waitlist-section" id="waitlist"><div class="waitlist-card"><div><p class="overline">Be first in line.</p><h2>F.A.M.E is being built <em>now.</em></h2><p>Join the early-access community for launch news, original announcements and behind-the-scenes updates.</p><div class="waitlist-meta"><span>✓ Early access updates</span><span>✓ Product previews</span><span>✓ Creator announcements</span></div></div><form id="waitlistForm" class="waitlist-form" novalidate><label for="email">Email address</label><div class="email-row"><input id="email" name="email" type="email" placeholder="you@example.com" autocomplete="email" required><button class="btn btn-primary" type="submit">Join F.A.M.E ${icon.arrow}</button></div><label class="consent"><input id="consent" type="checkbox" required><span>I agree to receive F.A.M.E updates. No spam. Unsubscribe anytime.</span></label><p id="formStatus" class="form-status" role="status"></p></form></div></section>

    <section class="section faq-section"><div class="section-kicker">08 · Good to know</div><div class="faq-layout"><div><p class="display-label">NO SMOKE AND MIRRORS</p><h2>What is real <em>right now?</em></h2></div><div class="faq-list"><details><summary>Is F.A.M.E live yet?</summary><p>No. This site is the public showcase for the vision. The production VOD platform is a separate future build.</p></details><details><summary>Are these shows available to watch?</summary><p>No. The titles and artwork are concept content used to demonstrate the catalogue and product experience.</p></details><details><summary>Is the R29.90 pricing final?</summary><p>No. Any pricing shown in this showcase is a target or product concept, not a live commercial offer.</p></details><details><summary>Can creators get involved?</summary><p>The creator ecosystem is planned. Join the early-access list to hear when formal partnership opportunities open.</p></details></div></div></section>
  </main>

  <footer class="footer"><div class="footer-main"><div class="footer-brand"><img src="${asset('assets/brand/fame-logo.webp')}" alt="F.A.M.E"><p>Your Stage. Your Story.</p><small>Made for Africa. Built for the world.</small></div><div><h4>Explore</h4><a href="#why">The idea</a><a href="#preview">Experience</a><a href="#catalogue">Stories</a><a href="#creators">Creators</a></div><div><h4>Build</h4><a href="#roadmap">Roadmap</a><a href="./press.html">Press</a><a href="mailto:hello@streamingonfame.co.za">Contact</a></div><div><h4>Stay close</h4><p>Follow the build as the showcase becomes the product.</p><a class="footer-email" href="#waitlist">Join early access ${icon.arrow}</a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Streaming on F.A.M.E</span><span>Concept showcase · Not the production VOD application</span><a href="#top">Back to top ↑</a></div></footer>

  <div class="modal" id="modal" aria-hidden="true"></div>
  <div class="search-drawer" id="searchDrawer" aria-hidden="true"><div class="search-card"><button class="modal-close" id="searchClose" aria-label="Close search">${icon.close}</button><p class="overline">F.A.M.E catalogue</p><h2>What do you feel like watching?</h2><div class="search-box"><span>${icon.search}</span><input id="searchInput" type="search" placeholder="Try drama, music, originals…" autocomplete="off"></div><div id="searchResults"></div></div></div>
  <div class="toast" id="toast" role="status"></div>
</div>`;

const catalogueGrid = document.querySelector<HTMLElement>('#catalogueGrid')!;
const toast = document.querySelector<HTMLElement>('#toast')!;
const modal = document.querySelector<HTMLDivElement>('#modal')!;
const searchDrawer = document.querySelector<HTMLDivElement>('#searchDrawer')!;
const searchInput = document.querySelector<HTMLInputElement>('#searchInput')!;

function showToast(message: string) { toast.textContent = message; toast.classList.add('show'); window.setTimeout(() => toast.classList.remove('show'), 2300); }
function syncBodyLock() { document.body.classList.toggle('modal-open', modal.classList.contains('open') || searchDrawer.classList.contains('open')); }
function renderCatalogue() { catalogueGrid.innerHTML = catalogue.filter(item => activeFilter === 'all' || item.tags.includes(activeFilter)).map(card).join(''); bindTitleActions(catalogueGrid); revealElements(catalogueGrid); }
function bindTitleActions(scope: ParentNode = document) {
  scope.querySelectorAll<HTMLElement>('[data-title]').forEach(button => button.addEventListener('click', () => { const item = catalogue.find(x => x.id === button.dataset.title); if (item) openTitle(item); }));
  scope.querySelectorAll<HTMLElement>('[data-list]').forEach(button => button.addEventListener('click', event => { event.stopPropagation(); const id = button.dataset.list!; if (myList.has(id)) { myList.delete(id); } else { myList.add(id); } renderCatalogue(); track(myList.has(id) ? 'my_list_added' : 'my_list_removed', { title: id }); }));
}
function openTitle(item: Title) {
  lastFocused = document.activeElement as HTMLElement;
  modal.innerHTML = `<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="titleHeading"><button class="modal-close" data-close aria-label="Close">${icon.close}</button><div class="detail-grid"><div class="detail-art-wrap"><img class="detail-art" src="${asset(art(item))}" alt="${esc(item.title)} concept artwork"><span>${esc(item.kind)}</span></div><div class="detail-copy"><p class="overline">${esc(item.kind)} · ${item.year}</p><h2 id="titleHeading">${esc(item.title)}</h2><p class="detail-meta">${esc(item.rating)} · ${esc(item.duration)} · ${esc(item.genre)}</p><p>${esc(item.synopsis)}</p><div class="detail-actions"><button class="btn btn-primary" data-modal-play>${icon.play} Play concept preview</button><button class="btn btn-outline" data-modal-list>${myList.has(item.id) ? icon.check+' In My List' : icon.plus+' My List'}</button></div><small>Concept title · not available to stream today.</small></div></div></div>`;
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); syncBodyLock(); track('title_opened', { title: item.title, kind: item.kind });
  modal.querySelector<HTMLElement>('[data-close]')?.addEventListener('click', closeModal); modal.addEventListener('click', e => { if (e.target === modal) closeModal(); }, { once:true });
  modal.querySelector('[data-modal-play]')?.addEventListener('click', () => openPlayer(item)); modal.querySelector('[data-modal-list]')?.addEventListener('click', () => { myList.has(item.id) ? myList.delete(item.id) : myList.add(item.id); openTitle(item); showToast(myList.has(item.id) ? 'Added to My List' : 'Removed from My List'); });
  window.setTimeout(() => modal.querySelector<HTMLElement>('[data-close]')?.focus(), 20);
}
function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); syncBodyLock(); lastFocused?.focus(); }
function openPlayer(item: Title) {
  modal.innerHTML = `<div class="player-card" role="dialog" aria-modal="true" aria-labelledby="playerTitle"><button class="modal-close" data-close aria-label="Close">${icon.close}</button><div class="player"><img src="${asset(art(item))}" alt=""><div class="player-shade"></div><div class="player-message"><button class="play-large" id="playerToggle" aria-label="Play concept preview">${icon.play}</button><span>CONCEPT PLAYER</span><strong id="playerTitle">${esc(item.title)}</strong><small>There is no production stream here yet. This is the experience we are building towards.</small></div><div class="fake-controls"><span>0:00</span><i><b></b></i><span>1:12</span><button aria-label="Settings">${icon.gear}</button><button aria-label="Fullscreen">⛶</button></div></div></div>`;
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); syncBodyLock(); track('concept_preview_started', { title:item.title }); modal.querySelector('[data-close]')?.addEventListener('click', closeModal);
  modal.querySelector('#playerToggle')?.addEventListener('click', e => { const btn = e.currentTarget as HTMLButtonElement; btn.textContent = btn.textContent === icon.play ? icon.pause : icon.play; track('concept_player_used', { title:item.title }); });
  window.setTimeout(() => modal.querySelector<HTMLElement>('[data-close]')?.focus(), 20);
}

const demoRows: Record<string,string[]> = { home:['city-of-dreams','after-the-rain','roots-and-rhythm','future-africa'], originals:['roots-and-rhythm','voices-of-home','makers-of-tomorrow','future-africa'], mylist:['the-next-move','village-to-vision','midnight-radio'], profile:['little-legends','makers-of-tomorrow','voices-of-home'] };
const demoLabels: Record<string,[string,string]> = { home:['Continue watching','Pick up where you left off.'], originals:['African Originals','Stories made close to home.'], mylist:['My List','The things you said you wanted to watch.'], profile:['Family Profiles','A space for everyone.'] };
function renderDemo(tab='home') { const row = document.querySelector<HTMLElement>('#demoRow')!; const ids = demoRows[tab] ?? demoRows.home; row.innerHTML = ids.map(id => { const item=catalogue.find(x=>x.id===id)!; return `<button class="demo-card" data-demo-title="${item.id}"><img src="${asset(art(item))}" alt="${esc(item.title)}"><span>${esc(item.title)}</span><small>${esc(item.kind)} · ${item.year}</small></button>`; }).join(''); const [eyebrow,title] = demoLabels[tab] ?? demoLabels.home; document.querySelector('#demoEyebrow')!.textContent=eyebrow; document.querySelector('#demoRowTitle')!.textContent=title; row.querySelectorAll<HTMLElement>('[data-demo-title]').forEach(el=>el.addEventListener('click',()=>{const item=catalogue.find(x=>x.id===el.dataset.demoTitle); if(item) openTitle(item);})); }

document.querySelectorAll<HTMLButtonElement>('[data-demo-tab]').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('[data-demo-tab]').forEach(b=>{b.classList.remove('active'); b.setAttribute('aria-selected','false');}); button.classList.add('active'); button.setAttribute('aria-selected','true'); renderDemo(button.dataset.demoTab!); track('product_preview_tab',{tab:button.dataset.demoTab!}); }));
document.querySelector('#demoPlay')?.addEventListener('click',()=>openPlayer(featured));
document.querySelector('[data-play]')?.addEventListener('click',()=>openPlayer(featured));
document.querySelector('[data-title="city-of-dreams"]')?.addEventListener('click',()=>openTitle(featured));
document.querySelector('#demoList')?.addEventListener('click',()=>{ myList.has(featured.id)?myList.delete(featured.id):myList.add(featured.id); const button=document.querySelector<HTMLButtonElement>('#demoList'); if(button) button.textContent=myList.has(featured.id)?icon.check+' In My List':icon.plus+' My List'; showToast(myList.has(featured.id)?'Added to My List':'Removed from My List'); track('product_preview_list',{title:featured.title,saved:myList.has(featured.id)}); });
document.querySelector('#demoSeeAll')?.addEventListener('click',()=>document.querySelector('#catalogue')?.scrollIntoView({behavior:'smooth'}));

document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));button.classList.add('active');activeFilter=button.dataset.filter??'all';renderCatalogue();track('catalogue_filter',{filter:activeFilter});}));

function renderSearchResults(query='') { const target=document.querySelector<HTMLDivElement>('#searchResults')!; const q=query.trim().toLowerCase(); const results=catalogue.filter(item=>!q||[item.title,item.kind,item.genre,...item.tags].join(' ').toLowerCase().includes(q)).slice(0,8); target.innerHTML=results.length?`<div class="search-results">${results.map(item=>`<button class="search-result" data-search-title="${item.id}"><img src="${asset(art(item))}" alt=""><span><b>${esc(item.title)}</b><small>${esc(item.kind)} · ${esc(item.genre)}</small></span><em>View ${icon.arrow}</em></button>`).join('')}</div>`:`<p class="empty-search">Nothing found. Try a genre, format or “originals”.</p>`; target.querySelectorAll<HTMLElement>('[data-search-title]').forEach(el=>el.addEventListener('click',()=>{const item=catalogue.find(x=>x.id===el.dataset.searchTitle); if(item){searchDrawer.classList.remove('open');searchDrawer.setAttribute('aria-hidden','true');syncBodyLock();openTitle(item);}})); }
function openSearch(){lastFocused=document.activeElement as HTMLElement;searchDrawer.classList.add('open');searchDrawer.setAttribute('aria-hidden','false');syncBodyLock();searchInput.value='';renderSearchResults();window.setTimeout(()=>searchInput.focus(),30);track('search_opened');}
document.querySelector('#searchOpen')?.addEventListener('click',openSearch);document.querySelector('#demoSearch')?.addEventListener('click',openSearch);document.querySelector('#searchClose')?.addEventListener('click',()=>{searchDrawer.classList.remove('open');searchDrawer.setAttribute('aria-hidden','true');syncBodyLock();lastFocused?.focus();});searchInput.addEventListener('input',()=>renderSearchResults(searchInput.value));searchDrawer.addEventListener('click',e=>{if(e.target===searchDrawer){searchDrawer.classList.remove('open');searchDrawer.setAttribute('aria-hidden','true');syncBodyLock();}});

const menu=document.querySelector('#mobileNav')!;document.querySelector('#menuOpen')?.addEventListener('click',()=>{const button=document.querySelector<HTMLButtonElement>('#menuOpen')!;const open=menu.classList.toggle('open');button.setAttribute('aria-expanded',String(open));});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');document.querySelector('#menuOpen')?.setAttribute('aria-expanded','false');}));

const waitlist=document.querySelector<HTMLFormElement>('#waitlistForm')!;waitlist.addEventListener('submit',async event=>{event.preventDefault();const email=document.querySelector<HTMLInputElement>('#email')!;const consent=document.querySelector<HTMLInputElement>('#consent')!;const status=document.querySelector<HTMLParagraphElement>('#formStatus')!;if(!email.checkValidity()||!consent.checked){status.textContent='Please enter a valid email address and confirm the update consent.';status.className='form-status error';return;}const endpoint=import.meta.env.VITE_WAITLIST_ENDPOINT as string|undefined;if(!endpoint){status.textContent='Demo mode: no registration was sent. Connect VITE_WAITLIST_ENDPOINT to capture real sign-ups.';status.className='form-status';track('waitlist_demo_submit');showToast('Demo mode — no email was sent');return;}status.textContent='Sending…';status.className='form-status';try{const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.value,source:'fame-showcase',consent:true})});if(!response.ok)throw new Error('Waitlist request failed');status.textContent='You’re on the list. We’ll keep you posted.';status.className='form-status success';waitlist.reset();track('waitlist_signup',{source:'website'});}catch{status.textContent='We couldn’t save that just now. Please try again in a moment.';status.className='form-status error';}});

document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(link=>link.addEventListener('click',()=>track('navigation_click',{target:link.getAttribute('href')??''})));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeModal();searchDrawer.classList.remove('open');searchDrawer.setAttribute('aria-hidden','true');syncBodyLock();}});

function revealElements(scope: ParentNode=document){scope.querySelectorAll<HTMLElement>('.reveal:not(.observed)').forEach(el=>{el.classList.add('observed');observer.observe(el);});}
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12});
window.addEventListener('scroll',()=>document.querySelector('#siteHeader')?.classList.toggle('scrolled',window.scrollY>24),{passive:true});

renderCatalogue();renderDemo();revealElements();initAnalytics();
