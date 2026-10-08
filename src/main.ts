import './styles/main.css';
import { catalogue, categories, type Title } from './data/catalogue';
import { initAnalytics, track } from './analytics';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('F.A.M.E app mount not found');

const esc = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[c] ?? c));

const featured = catalogue.find((item) => item.featured) ?? catalogue[0];

const artworkMap: Record<string, string> = {
  'city-of-dreams': 'assets/content/mock-2.jpg',
  'roots-and-rhythm': 'assets/content/the-come-up.jpg',
  'the-next-move': 'assets/content/stage-one.jpg',
  'after-the-rain': 'assets/content/roots.jpg',
  'future-africa': 'assets/content/mock-4.jpg',
  'street-kings': 'assets/content/the-block.jpg',
  'little-legends': 'assets/content/mini-1.jpg',
  'voices-of-home': 'assets/content/mini-3.jpg',
  'makers-of-tomorrow': 'assets/content/rise.jpg',
  'the-last-dance': 'assets/content/mini-2.jpg',
  'village-to-vision': 'assets/content/mock-1.jpg',
  'midnight-radio': 'assets/content/city-lights.jpg',
};

const art = (item: Title) => artworkMap[item.id] ?? item.artwork;

const card = (item: Title) => `
  <article class="title-card">
    <button class="title-poster" data-title="${esc(item.id)}" aria-label="Open ${esc(item.title)}">
      <img src="${art(item)}" alt="${esc(item.title)} concept artwork" loading="lazy" decoding="async">
      <span class="poster-kind">${esc(item.kind)}</span>
      <span class="poster-action">View</span>
    </button>
    <div class="title-meta">
      <div>
        <h3>${esc(item.title)}</h3>
        <p>${item.year} Â· ${esc(item.rating)} Â· ${esc(item.duration)}</p>
      </div>
      <button class="list-toggle" data-list="${esc(item.id)}" aria-label="Add ${esc(item.title)} to My List">+</button>
    </div>
  </article>`;

app.innerHTML = `
  <div class="site">
    <header class="site-header" id="top">
      <a class="wordmark" href="#top" aria-label="Streaming on F.A.M.E home">
        <img src="assets/brand/fame-logo.webp" alt="Streaming on F.A.M.E">
      </a>
      <nav class="desktop-nav" aria-label="Primary navigation">
        <a href="#why">Why F.A.M.E</a>
        <a href="#preview">Product</a>
        <a href="#catalogue">Catalogue</a>
        <a href="#roadmap">Roadmap</a>
      </nav>
      <div class="header-actions">
        <button class="search-trigger" id="searchOpen" aria-label="Search the showcase">âŒ• <span>Search</span></button>
        <a class="header-cta" href="#waitlist">Get early access</a>
        <button class="menu-trigger" id="menuOpen" aria-expanded="false" aria-controls="mobileNav" aria-label="Open menu">â˜°</button>
      </div>
    </header>

    <nav class="mobile-nav" id="mobileNav" aria-label="Mobile navigation">
      <a href="#why">Why F.A.M.E</a>
      <a href="#preview">Product preview</a>
      <a href="#catalogue">Catalogue</a>
      <a href="#roadmap">Roadmap</a>
      <a class="mobile-cta" href="#waitlist">Get early access</a>
    </nav>

    <main>
      <section class="hero">
        <div class="hero-image" aria-hidden="true">
          <img src="assets/content/the-come-up.jpg" alt="">
        </div>
        <div class="hero-scrim" aria-hidden="true"></div>
        <div class="hero-inner">
          <div class="hero-copy">
            <p class="eyebrow"><span></span> A new African streaming platform Â· Target launch 2027</p>
            <h1>There are stories<br><em>we know</em> youâ€™ll want to watch.</h1>
            <p class="hero-lead">F.A.M.E is being built for African audiences and the people making the stories. Films, series, music, documentaries and more â€” brought together in one place.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="#preview">Explore the product <span>â†—</span></a>
              <a class="text-link" href="#waitlist">Join the early-access list</a>
            </div>
            <div class="hero-note"><strong>From R29.90/month*</strong><span>Mobile-first Â· simple pricing Â· built to grow</span></div>
          </div>
          <div class="hero-feature">
            <div class="feature-frame">
              <div class="feature-top"><span>F.A.M.E ORIGINAL</span><span>01 / 06</span></div>
              <div class="feature-art" style="background-image:linear-gradient(180deg,transparent 42%,rgba(5,5,5,.94)),url('${art(featured)}')"></div>
              <div class="feature-copy">
                <span>Featured story</span>
                <h2>${esc(featured.title)}</h2>
                <p>${esc(featured.synopsis)}</p>
                <button class="round-play" data-play="${featured.id}" aria-label="Play preview of ${esc(featured.title)}">â–¶</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="launch-note">
        <span class="note-dot"></span>
        <p><strong>What youâ€™re seeing is the vision.</strong> This website is the showcase. The full VOD product â€” accounts, playback, subscriptions, apps and the production catalogue â€” comes next.</p>
        <a href="#roadmap">See the roadmap â†’</a>
      </div>

      <section class="section editorial" id="why">
        <div class="section-kicker">01 Â· The idea</div>
        <div class="editorial-grid">
          <div>
            <h2>A streaming service should feel like somewhere you <em>want</em> to spend time.</h2>
          </div>
          <div class="editorial-copy">
            <p>Weâ€™re not trying to build another generic catalogue with a logo on top. F.A.M.E is being shaped around discovery, local stories and the small details that make a streaming product feel personal.</p>
            <p>Fast to open. Easy to browse. Good enough to recommend to someone else. That is the standard for the product we intend to build.</p>
          </div>
        </div>
        <div class="principles">
          <article><span>01</span><h3>Local by design</h3><p>African stories should not feel like an afterthought in the catalogue.</p></article>
          <article><span>02</span><h3>Simple to use</h3><p>Less hunting. Better discovery. A mobile experience that respects your thumb.</p></article>
          <article><span>03</span><h3>Worth coming back to</h3><p>Fresh releases, smart collections and a product that grows with its audience.</p></article>
        </div>
      </section>

      <section class="section preview-section" id="preview">
        <div class="section-kicker">02 Â· Product preview</div>
        <div class="section-heading">
          <h2>Donâ€™t just read about it.<br><em>Have a look around.</em></h2>
          <p>This is an interactive concept of the future F.A.M.E experience. Tap around, open a title, switch sections and see how the product is intended to feel.</p>
        </div>
        <div class="product-demo" id="productDemo">
          <div class="demo-chrome">
            <div class="demo-brand"><span>F</span><strong>F.A.M.E</strong><small>PRODUCT CONCEPT</small></div>
            <div class="demo-profile"><span class="live-dot"></span> Preview mode <button id="demoSearch">âŒ•</button></div>
          </div>
          <div class="demo-hero" id="demoHero">
            <div class="demo-hero-bg"></div>
            <div class="demo-hero-content">
              <span class="demo-label">F.A.M.E ORIGINAL Â· ${featured.year}</span>
              <h3 id="demoHeroTitle">${esc(featured.title)}</h3>
              <p id="demoHeroSynopsis">${esc(featured.synopsis)}</p>
              <div class="demo-actions">
                <button class="btn btn-light" id="demoPlay">â–¶ Play preview</button>
                <button class="btn btn-dark" id="demoList">ï¼‹ My List</button>
              </div>
            </div>
          </div>
          <div class="demo-tabs" role="tablist">
            <button class="active" data-demo-tab="home" role="tab">Home</button>
            <button data-demo-tab="originals" role="tab">Originals</button>
            <button data-demo-tab="mylist" role="tab">My List</button>
            <button data-demo-tab="profile" role="tab">Profile</button>
          </div>
          <div class="demo-body">
            <div class="demo-heading"><div><span id="demoEyebrow">Continue watching</span><h4 id="demoRowTitle">Pick up where you left off.</h4></div><button id="demoSeeAll">See all</button></div>
            <div class="demo-row" id="demoRow"></div>
          </div>
          <div class="demo-footer"><span>âŒ‚ Home</span><span>âŒ• Search</span><span>ï¼‹ My List</span><span>â—‰ Profile</span></div>
        </div>
        <p class="demo-disclaimer">Concept interface Â· imagery and titles shown for demonstration purposes Â· production availability may differ.</p>
      </section>

      <section class="section catalogue-section" id="catalogue">
        <div class="section-kicker">03 Â· The catalogue</div>
        <div class="section-heading split">
          <div><h2>Stories with a<br><em>place of their own.</em></h2></div>
          <p>These are concept titles created to show the direction of the catalogue. The real production slate will be announced as the platform develops.</p>
        </div>
        <div class="filter-bar" id="filters">
          ${categories.map((c) => `<button class="${c.id === 'all' ? 'active' : ''}" data-filter="${c.id}">${esc(c.label)}</button>`).join('')}
        </div>
        <div class="catalogue-grid" id="catalogueGrid"></div>
      </section>

      <section class="section feature-section">
        <div class="section-kicker">04 Â· The experience</div>
        <div class="feature-story">
          <div class="feature-story-copy">
            <p class="overline">Made for real life</p>
            <h2>Open it on a phone.<br><em>Keep watching on the TV.</em></h2>
            <p>F.A.M.E is planned as a mobile-first product, with the wider screen experience growing from there. The goal is simple: your account, your list and your viewing should follow you.</p>
            <div class="mini-stats"><div><strong>01</strong><span>Mobile-first</span></div><div><strong>02</strong><span>Offline viewing planned</span></div><div><strong>03</strong><span>Family profiles planned</span></div></div>
          </div>
          <div class="device-stack" aria-label="Concept views of the F.A.M.E product">
            <div class="stack-card stack-back"><img src="assets/content/city-lights.jpg" alt="" loading="lazy"></div>
            <div class="stack-card stack-mid"><img src="assets/content/rise.jpg" alt="" loading="lazy"></div>
            <div class="stack-card stack-front">
              <div class="stack-screen">
                <div class="stack-nav"><b>F.A.M.E</b><span>âŒ•</span></div>
                <img src="${art(featured)}" alt="${esc(featured.title)} concept screen" loading="lazy">
                <div><small>CONTINUE WATCHING</small><strong>${esc(featured.title)}</strong><span>Episode 3 Â· 34 min left</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section roadmap" id="roadmap">
        <div class="section-kicker">05 Â· The road ahead</div>
        <div class="section-heading split">
          <div><h2>This website is <em>chapter one.</em></h2></div>
          <p>The showcase exists to make the idea tangible. The application that powers it is a separate build and will be developed after this vision has been validated.</p>
        </div>
        <div class="roadmap-list">
          <article class="roadmap-item current"><span>NOW</span><div><small>Showcase</small><h3>Make the vision real enough to touch</h3><p>Brand, product story, interactive concept, audience interest and early feedback.</p></div></article>
          <article class="roadmap-item"><span>NEXT</span><div><small>Product build</small><h3>Build the actual F.A.M.E VOD platform</h3><p>Accounts, catalogue management, playback, subscriptions, payments, apps and the operational platform behind them.</p></div></article>
          <article class="roadmap-item"><span>THEN</span><div><small>Launch</small><h3>Put great local stories in peopleâ€™s hands</h3><p>Launch with a focused catalogue, measure what audiences love and keep improving the experience.</p></div></article>
        </div>
      </section>

      <section class="section faq-section">
        <div class="section-kicker">06 Â· Questions</div>
        <div class="faq-layout">
          <div><h2>Good questions.<br><em>We expect them.</em></h2><p>Weâ€™re deliberately clear about what exists today and what is planned.</p></div>
          <div class="faq-list">
            <details open><summary>Is this the actual streaming platform?</summary><p>No. This is the public showcase and product concept. The production VOD application will be a separate project.</p></details>
            <details><summary>When is F.A.M.E expected to launch?</summary><p>The current target is 1 June 2027. That date is a target, not a promise, and will be updated as development progresses.</p></details>
            <details><summary>What will the subscription cost?</summary><p>The current product direction starts from R29.90/month. Final plans and pricing will be confirmed closer to launch.</p></details>
            <details><summary>What can I do today?</summary><p>Explore the concept, tell us youâ€™re interested and join the early-access list so you can follow the journey.</p></details>
          </div>
        </div>
      </section>

      <section class="section waitlist-section" id="waitlist">
        <div class="waitlist-card">
          <div>
            <p class="overline">Get in early</p>
            <h2>When F.A.M.E is ready,<br><em>youâ€™ll know first.</em></h2>
            <p>Leave your email and weâ€™ll keep you close to the launch. No spam, no fake countdowns â€” just meaningful updates.</p>
          </div>
          <form id="waitlistForm">
            <label for="email">Email address</label>
            <div class="form-row"><input id="email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required><button class="btn btn-primary" type="submit">Keep me posted</button></div>
            <label class="consent"><input type="checkbox" id="consent" required><span>I agree to receive F.A.M.E product and launch updates.</span></label>
            <p class="form-status" id="formStatus" role="status">* Pricing and launch timing are current targets and may change.</p>
          </form>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-main">
        <div class="footer-brand"><img src="assets/brand/fame-logo.webp" alt="Streaming on F.A.M.E"><p>Your Stage. Your Story.</p><small>A product showcase for the future F.A.M.E VOD platform.</small></div>
        <div><h4>Explore</h4><a href="#why">Why F.A.M.E</a><a href="#preview">Product preview</a><a href="#catalogue">Catalogue</a></div>
        <div><h4>Company</h4><a href="#roadmap">Roadmap</a><a href="/press.html">Press</a><a href="mailto:hello@streamingonfame.co.za">Contact</a></div>
        <div><h4>Stay close</h4><p>Follow the build as the showcase becomes the product.</p><a class="footer-email" href="#waitlist">Join early access â†’</a></div>
      </div>
      <div class="footer-bottom"><span>Â© ${new Date().getFullYear()} Streaming on F.A.M.E</span><span>Concept showcase Â· Not the production VOD application</span><a href="#top">Back to top â†‘</a></div>
    </footer>

    <div class="modal" id="modal" aria-hidden="true"></div>
    <div class="search-drawer" id="searchDrawer" aria-hidden="true">
      <div class="search-card">
        <button class="modal-close" id="searchClose" aria-label="Close search">Ã—</button>
        <p class="overline">F.A.M.E catalogue</p>
        <h2>What do you feel like watching?</h2>
        <div class="search-box"><span>âŒ•</span><input id="searchInput" type="search" placeholder="Try â€œdramaâ€, â€œmusicâ€, â€œoriginalsâ€â€¦" autocomplete="off"></div>
        <div id="searchResults"></div>
      </div>
    </div>
    <div class="toast" id="toast" role="status"></div>
  </div>`;

const catalogueGrid = document.querySelector('#catalogueGrid')!;
let activeFilter = 'all';
let myList = new Set<string>();

function renderCatalogue() {
  const items = catalogue.filter((item) => activeFilter === 'all' || item.tags.includes(activeFilter));
  catalogueGrid.innerHTML = items.map(card).join('');
  bindTitleActions(catalogueGrid);
}

function bindTitleActions(scope: ParentNode = document) {
  scope.querySelectorAll<HTMLElement>('[data-title]').forEach((button) => {
    button.addEventListener('click', () => {
      const item = catalogue.find((x) => x.id === button.dataset.title);
      if (item) openTitle(item);
    });
  });
  scope.querySelectorAll<HTMLElement>('[data-list]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const id = button.dataset.list!;
      if (myList.has(id)) {
        myList.delete(id);
        button.textContent = '+';
        button.classList.remove('saved');
        track('my_list_removed', { title: id });
      } else {
        myList.add(id);
        button.textContent = 'âœ“';
        button.classList.add('saved');
        track('my_list_added', { title: id });
      }
    });
  });
}

function openTitle(item: Title) {
  const modal = document.querySelector<HTMLDivElement>('#modal')!;
  modal.innerHTML = `
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="titleHeading">
      <button class="modal-close" data-close aria-label="Close">Ã—</button>
      <div class="detail-grid">
        <img class="detail-art" src="${art(item)}" alt="${esc(item.title)} concept artwork">
        <div class="detail-copy">
          <p class="overline">${esc(item.kind)} Â· ${item.year}</p>
          <h2 id="titleHeading">${esc(item.title)}</h2>
          <p class="detail-meta">${esc(item.rating)} Â· ${esc(item.duration)} Â· ${esc(item.genre)}</p>
          <p>${esc(item.synopsis)}</p>
          <div class="detail-actions"><button class="btn btn-primary" data-modal-play>â–¶ Play concept preview</button><button class="btn btn-outline" data-modal-list>${myList.has(item.id) ? 'âœ“ In My List' : 'ï¼‹ My List'}</button></div>
          <small>Concept title Â· not available to stream today.</small>
        </div>
      </div>
    </div>`;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  track('title_opened', { title: item.title, kind: item.kind });
  modal.querySelector('[data-close]')?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); }, { once: true });
  modal.querySelector('[data-modal-play]')?.addEventListener('click', () => openPlayer(item));
  modal.querySelector('[data-modal-list]')?.addEventListener('click', () => {
    myList.has(item.id) ? myList.delete(item.id) : myList.add(item.id);
    openTitle(item);
  });
}

function closeModal() {
  const modal = document.querySelector<HTMLDivElement>('#modal')!;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function openPlayer(item: Title) {
  const modal = document.querySelector<HTMLDivElement>('#modal')!;
  modal.innerHTML = `
    <div class="player-card" role="dialog" aria-modal="true">
      <button class="modal-close" data-close aria-label="Close">Ã—</button>
      <div class="player">
        <img src="${art(item)}" alt="">
        <div class="player-shade"></div>
        <div class="player-message"><button class="play-large">â–¶</button><span>Concept preview</span><strong>${esc(item.title)}</strong><small>There is no production stream here yet. This is the experience weâ€™re building towards.</small></div>
        <div class="fake-controls"><span>0:00</span><i><b></b></i><span>1:12</span><span>âš™</span><span>â›¶</span></div>
      </div>
    </div>`;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  modal.querySelector('[data-close]')?.addEventListener('click', closeModal);
  modal.querySelector('.play-large')?.addEventListener('click', (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    btn.textContent = btn.textContent === 'â–¶' ? 'âšâš' : 'â–¶';
    track('concept_player_used', { title: item.title });
  });
  track('concept_preview_started', { title: item.title });
}

const demoRows: Record<string, string[]> = {
  home: ['city-of-dreams','after-the-rain','roots-and-rhythm','future-africa'],
  originals: ['roots-and-rhythm','voices-of-home','makers-of-tomorrow','future-africa'],
  mylist: ['the-next-move','village-to-vision','midnight-radio'],
  profile: ['little-legends','makers-of-tomorrow','voices-of-home'],
};

function renderDemo(tab = 'home') {
  const row = document.querySelector('#demoRow')!;
  const ids = demoRows[tab] ?? demoRows.home;
  row.innerHTML = ids.map((id) => {
    const item = catalogue.find((x) => x.id === id)!;
    return `<button class="demo-card" data-demo-title="${id}"><img src="${art(item)}" alt="${esc(item.title)}"><span>${esc(item.title)}</span><small>${item.kind} Â· ${item.year}</small></button>`;
  }).join('');
  const eyebrow = document.querySelector('#demoEyebrow')!;
  const title = document.querySelector('#demoRowTitle')!;
  const labels: Record<string,[string,string]> = {
    home: ['Continue watching','Pick up where you left off.'],
    originals: ['African Originals','Stories made close to home.'],
    mylist: ['My List','The things you said you wanted to watch.'],
    profile: ['Family Profiles','A space for everyone.'],
  };
  eyebrow.textContent = labels[tab]?.[0] ?? labels.home[0];
  title.textContent = labels[tab]?.[1] ?? labels.home[1];
  row.querySelectorAll<HTMLElement>('[data-demo-title]').forEach((el) => el.addEventListener('click', () => {
    const item = catalogue.find((x) => x.id === el.dataset.demoTitle);
    if (item) openTitle(item);
  }));
}

document.querySelectorAll<HTMLElement>('[data-demo-tab]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-demo-tab]').forEach((b) => b.classList.remove('active'));
    button.classList.add('active');
    renderDemo(button.dataset.demoTab!);
    track('product_preview_tab', { tab: button.dataset.demoTab! });
  });
});

document.querySelector('#demoPlay')?.addEventListener('click', () => openPlayer(featured));
document.querySelector('[data-play]')?.addEventListener('click', () => openPlayer(featured));
document.querySelector('#demoList')?.addEventListener('click', () => {
  myList.has(featured.id) ? myList.delete(featured.id) : myList.add(featured.id);
  const button = document.querySelector<HTMLButtonElement>('#demoList');
  if (button) button.textContent = myList.has(featured.id) ? 'âœ“ In My List' : 'ï¼‹ My List';
  track('product_preview_list', { title: featured.title, saved: myList.has(featured.id) });
});

document.querySelector('#demoSeeAll')?.addEventListener('click', () => {
  document.querySelector('#catalogue')?.scrollIntoView({ behavior: 'smooth' });
  track('catalogue_cta', { source: 'product_preview' });
});

document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach((b) => b.classList.remove('active'));
    button.classList.add('active');
    activeFilter = button.dataset.filter ?? 'all';
    renderCatalogue();
    track('catalogue_filter', { filter: activeFilter });
  });
});

const searchDrawer = document.querySelector<HTMLDivElement>('#searchDrawer')!;
const searchInput = document.querySelector<HTMLInputElement>('#searchInput')!;
function renderSearchResults(query = '') {
  const target = document.querySelector<HTMLDivElement>('#searchResults')!;
  const q = query.trim().toLowerCase();
  const results = catalogue.filter((item) => !q || [item.title,item.kind,item.genre,...item.tags].join(' ').toLowerCase().includes(q)).slice(0,7);
  target.innerHTML = results.length ? `<div class="search-results">${results.map((item) => `<button class="search-result" data-search-title="${item.id}"><img src="${art(item)}" alt=""><span><b>${esc(item.title)}</b><small>${esc(item.kind)} Â· ${esc(item.genre)}</small></span><em>View</em></button>`).join('')}</div>` : `<p class="empty-search">Nothing found. Try a genre, format or â€œoriginalsâ€.</p>`;
  target.querySelectorAll<HTMLElement>('[data-search-title]').forEach((el) => el.addEventListener('click', () => {
    const item = catalogue.find((x) => x.id === el.dataset.searchTitle);
    if (item) { searchDrawer.classList.remove('open'); searchDrawer.setAttribute('aria-hidden','true'); openTitle(item); }
  }));
}
function openSearch() {
  searchDrawer.classList.add('open'); searchDrawer.setAttribute('aria-hidden','false'); searchInput.value=''; renderSearchResults(); setTimeout(()=>searchInput.focus(),50);
  track('search_opened');
}
document.querySelector('#searchOpen')?.addEventListener('click', openSearch);
document.querySelector('#demoSearch')?.addEventListener('click', openSearch);
document.querySelector('#searchClose')?.addEventListener('click', () => { searchDrawer.classList.remove('open'); searchDrawer.setAttribute('aria-hidden','true'); });
searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));
searchDrawer.addEventListener('click', (e) => { if (e.target === searchDrawer) { searchDrawer.classList.remove('open'); searchDrawer.setAttribute('aria-hidden','true'); } });

const menu = document.querySelector('#mobileNav')!;
document.querySelector('#menuOpen')?.addEventListener('click', () => {
  const button = document.querySelector<HTMLButtonElement>('#menuOpen')!;
  const open = menu.classList.toggle('open');
  button.setAttribute('aria-expanded', String(open));
});
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
  menu.classList.remove('open');
  document.querySelector('#menuOpen')?.setAttribute('aria-expanded','false');
}));

const waitlist = document.querySelector<HTMLFormElement>('#waitlistForm')!;
waitlist.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.querySelector<HTMLInputElement>('#email')!;
  const consent = document.querySelector<HTMLInputElement>('#consent')!;
  const status = document.querySelector<HTMLParagraphElement>('#formStatus')!;
  if (!email.checkValidity() || !consent.checked) {
    status.textContent = 'Please enter a valid email address and confirm the update consent.';
    status.className = 'form-status error';
    return;
  }
  const endpoint = import.meta.env.VITE_WAITLIST_ENDPOINT as string | undefined;
  if (!endpoint) {
    status.textContent = 'Demo mode: no registration was sent. Connect VITE_WAITLIST_ENDPOINT to capture real sign-ups.';
    status.className = 'form-status';
    track('waitlist_demo_submit');
    return;
  }
  status.textContent = 'Sendingâ€¦';
  status.className = 'form-status';
  try {
    const response = await fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email:email.value, source:'fame-showcase', consent:true}) });
    if (!response.ok) throw new Error('Waitlist request failed');
    status.textContent = 'Youâ€™re on the list. Weâ€™ll keep you posted.';
    status.className = 'form-status success';
    waitlist.reset();
    track('waitlist_signup', { source:'website' });
  } catch {
    status.textContent = 'We couldnâ€™t save that just now. Please try again in a moment.';
    status.className = 'form-status error';
  }
});

document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => track('navigation_click', { target: link.getAttribute('href') ?? '' }));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') { closeModal(); searchDrawer.classList.remove('open'); searchDrawer.setAttribute('aria-hidden','true'); }
});

renderCatalogue();
renderDemo();
initAnalytics();
