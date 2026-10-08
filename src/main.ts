import '../styles.css';

// ============================================================================
// FULL PAGE MARKUP
// ============================================================================
const app = document.getElementById('app');
if (!app) throw new Error('No #app element found in index.html');

app.innerHTML = `
  <div class="site-shell">
    <header class="site-header">
      <a class="brand" href="#main">
        <span class="brand-mark"><span>S</span></span>
        <span class="brand-copy">
          <strong>STREAMING ON</strong>
          <b>F.A.M.E</b>
          <small>YOUR STAGE. YOUR STORY.</small>
        </span>
      </a>
      <nav class="desktop-nav">
        <a href="#platform">Platform</a>
        <a href="#experience">Experience</a>
        <a href="#content">Content</a>
        <a href="#pricing">Pricing</a>
        <a href="#roadmap">Roadmap</a>
      </nav>
      <div class="header-actions">
        <button class="icon-button" id="themeToggle" aria-label="Toggle theme">🌓</button>
        <button class="button button-small" id="notifyBtnTop">Get early access</button>
        <button class="menu-button" id="menuToggle" aria-label="Menu" aria-expanded="false">☰</button>
      </div>
      <nav class="mobile-nav" id="mobileNav">
        <a href="#platform">Platform</a>
        <a href="#experience">Experience</a>
        <a href="#content">Content</a>
        <a href="#pricing">Pricing</a>
        <a href="#roadmap">Roadmap</a>
      </nav>
    </header>

    <main id="main">
      <!-- HERO / PLATFORM -->
      <section class="hero" id="platform">
        <div class="hero-glow hero-glow-one"></div>
        <div class="hero-glow hero-glow-two"></div>
        <div class="hero-grid"></div>
        <div class="hero-content">
          <span class="eyebrow"><span class="pulse"></span> LAUNCHING 1 JUNE 2027</span>
          <h1>Your Stage.<br><span>Your Story.</span></h1>
          <p>Africa's home of local entertainment. A mobile-first streaming platform built for the stories, voices, and creators that define the continent.</p>
          <div class="hero-actions">
            <button class="button button-primary" id="notifyBtnHero">Get early access</button>
            <a class="button button-ghost" href="#experience">See the preview</a>
          </div>
          <div class="hero-facts">
            <span><b>R29.90</b><small>Per month</small></span>
            <span><b>Mobile-first</b><small>iOS &amp; Android</small></span>
            <span><b>No hidden fees</b><small>Cancel anytime</small></span>
          </div>
        </div>
        <div class="hero-device">
          <div class="device-frame">
            <div class="device-notch"></div>
            <div class="device-screen">
              <div class="screen-top"><span>F.A.M.E</span><span>•</span></div>
              <div class="screen-hero">
                <span class="screen-tag">FEATURED</span>
                <strong>Your Stage.<br>Your Story.</strong>
                <button class="play-mini">▶</button>
              </div>
              <div class="screen-row-title"><span>Trending now</span><span>See all</span></div>
              <div class="mini-row"><i></i><i></i><i></i></div>
            </div>
          </div>
        </div>
      </section>

      <!-- PLATFORM GRID -->
      <div class="notice-strip">
        <div>
          <span class="notice-icon">!</span>
          <p><b>Showcase only.</b> This site is a product preview. The production VOD platform launches in 2027.</p>
        </div>
      </div>

      <section class="section">
        <div class="section-heading">
          <div>
            <span class="kicker">The Platform</span>
            <h2>Built for how Africa <span>watches.</span></h2>
          </div>
          <p>A mobile-first experience designed for the way audiences actually consume content — on phones, on the move, on their terms.</p>
        </div>
        <div class="platform-grid">
          <article class="feature-card feature-card-large">
            <span class="feature-icon">▶</span>
            <span class="card-label">STREAMING</span>
            <h3>Cinematic playback</h3>
            <p>Adaptive streaming that looks great on any connection, with DRM protection for every title.</p>
            <span class="gradient-line"></span>
          </article>
          <article class="feature-card">
            <span class="feature-icon">◎</span>
            <span class="card-label">DISCOVERY</span>
            <h3>Curated for you</h3>
            <p>Editorial collections, trending rows, and personalised recommendations.</p>
          </article>
          <article class="feature-card">
            <span class="feature-icon">↓</span>
            <span class="card-label">OFFLINE</span>
            <h3>Watch anywhere</h3>
            <p>Download and watch on the go without eating your data.</p>
          </article>
          <article class="feature-card">
            <span class="feature-icon">R</span>
            <span class="card-label">PRICING</span>
            <h3>Fair and simple</h3>
            <p>One low monthly price. No hidden fees. Cancel anytime.</p>
          </article>
          <article class="feature-card">
            <span class="feature-icon">★</span>
            <span class="card-label">CREATORS</span>
            <h3>Made for local</h3>
            <p>A platform built around African stories and the people who tell them.</p>
          </article>
        </div>
      </section>

      <!-- EXPERIENCE -->
      <section class="section experience-section" id="experience">
        <div class="section-heading">
          <div>
            <span class="kicker">The Experience</span>
            <h2>A preview of <span>what's coming.</span></h2>
          </div>
          <p>A first look at the interface, the feel, and the way F.A.M.E will bring African entertainment to life.</p>
        </div>
        <div class="experience-grid">
          <div class="mock-browser">
            <div class="browser-bar"><span></span><span></span><span></span><small>streamingonfame.co.za</small></div>
            <div class="mock-home">
              <div class="mock-nav">
                <b>F.A.M.E</b>
                <span>Home</span><span>Series</span><span>Films</span><span>Music</span>
                <button>Sign up</button>
              </div>
              <div class="mock-hero">
                <small>FEATURED ORIGINAL</small>
                <h3>Your Stage.<br>Your Story.</h3>
                <p>A new wave of African storytelling.</p>
                <button>▶ Play trailer</button>
              </div>
              <div class="mock-heading">Trending now <small>See all</small></div>
              <div class="mock-posters"><i></i><i></i><i></i><i></i></div>
            </div>
          </div>
          <div class="experience-copy">
            <div class="experience-point">
              <span>01</span>
              <div><h3>Find your next favourite</h3><p>Curated rows, smart search, and recommendations that actually get you.</p></div>
            </div>
            <div class="experience-point">
              <span>02</span>
              <div><h3>Built around mobile</h3><p>Thumb-friendly navigation, fast playback, and offline viewing.</p></div>
            </div>
            <div class="experience-point">
              <span>03</span>
              <div><h3>Fair, transparent pricing</h3><p>From R29.90 per month. Cancel anytime. No hidden fees.</p></div>
            </div>
          </div>
        </div>
      </section>

      <!-- CONTENT -->
      <section class="section content-section" id="content">
        <div class="section-heading">
          <div>
            <span class="kicker">The Catalogue</span>
            <h2>Stories that <span>move you.</span></h2>
          </div>
          <p>A growing catalogue of original and licensed content across film, series, documentary, and music.</p>
        </div>
        <div class="category-tabs">
          <button class="active" data-filter="all">All</button>
          <button data-filter="film">Film</button>
          <button data-filter="series">Series</button>
          <button data-filter="music">Music</button>
        </div>
        <div class="content-grid">
          <article class="content-card" data-category="film"><div class="poster poster-one"><span>ORIGINAL</span><strong>RISE</strong></div><div><b>Rise</b><small>Feature film · 2027</small></div></article>
          <article class="content-card" data-category="series"><div class="poster poster-two"><span>SERIES</span><strong>THE BLOCK</strong></div><div><b>The Block</b><small>Drama series · 2027</small></div></article>
          <article class="content-card" data-category="music"><div class="poster poster-three"><span>MUSIC</span><strong>THE COME UP</strong></div><div><b>The Come Up</b><small>Music documentary · 2027</small></div></article>
          <article class="content-card" data-category="film"><div class="poster poster-four"><span>DOCUMENTARY</span><strong>ROOTS</strong></div><div><b>Roots</b><small>Documentary · 2027</small></div></article>
          <article class="content-card" data-category="series"><div class="poster poster-five"><span>SERIES</span><strong>CITY LIGHTS</strong></div><div><b>City Lights</b><small>Drama series · 2027</small></div></article>
          <article class="content-card" data-category="music"><div class="poster poster-six"><span>LIVE</span><strong>STAGE ONE</strong></div><div><b>Stage One</b><small>Live music · 2027</small></div></article>
        </div>
      </section>

      <!-- FEATURES -->
      <section class="section features-section">
        <div class="section-heading centered">
          <span class="kicker">Features</span>
          <h2>Everything you need. <span>Nothing you don't.</span></h2>
          <p>The essentials, done properly.</p>
        </div>
        <div class="feature-list">
          <div><span>01</span><h3>Watch on any device</h3><p>Phone, tablet, laptop or TV.</p></div>
          <div><span>02</span><h3>Download and go</h3><p>Save titles for offline viewing.</p></div>
          <div><span>03</span><h3>No hidden fees</h3><p>One monthly price. Cancel anytime.</p></div>
          <div><span>04</span><h3>Local first</h3><p>African stories, told by Africans.</p></div>
          <div><span>05</span><h3>New every week</h3><p>Fresh titles added regularly.</p></div>
          <div><span>06</span><h3>Safe for the family</h3><p>Profiles and parental controls.</p></div>
        </div>
      </section>

      <!-- PRICING -->
      <section class="section" id="pricing">
        <div class="section-heading centered">
          <span class="kicker">Pricing</span>
          <h2>Simple, honest, <span>affordable.</span></h2>
          <p>No contracts. No hidden costs. Just great African entertainment.</p>
        </div>
        <div class="plans-grid">
          <article class="plan">
            <span class="plan-badge">STANDARD</span>
            <h3>Mobile</h3>
            <div class="price"><sup>R</sup>29<span>.90</span><small>/month</small></div>
            <p>Everything you need to start watching.</p>
            <ul>
              <li>1 screen at a time</li>
              <li>SD streaming</li>
              <li>Mobile and tablet</li>
              <li>Cancel anytime</li>
            </ul>
            <button class="button button-ghost" id="notifyBtnPlan1">Get early access</button>
          </article>
          <article class="plan plan-featured">
            <span class="plan-badge">PREMIUM</span>
            <h3>Family</h3>
            <div class="price"><sup>R</sup>59<span>.90</span><small>/month</small></div>
            <p>For everyone in the house.</p>
            <ul>
              <li>4 screens at a time</li>
              <li>HD streaming</li>
              <li>Phone, tablet, laptop, TV</li>
              <li>Downloads</li>
              <li>Cancel anytime</li>
            </ul>
            <button class="button button-primary" id="notifyBtnPlan2">Get early access</button>
          </article>
        </div>
      </section>

      <!-- ROADMAP -->
      <section class="section roadmap-section" id="roadmap">
        <div class="section-heading centered">
          <span class="kicker">Roadmap</span>
          <h2>Where we're <span>heading.</span></h2>
        </div>
        <div class="timeline">
          <div class="timeline-item active"><span>01</span><div><small>2026</small><h3>Foundation</h3><p>Platform architecture, partnerships, and content pipeline.</p></div></div>
          <div class="timeline-item"><span>02</span><div><small>2027</small><h3>Launch</h3><p>Mobile web, Android, and iOS launch on 1 June 2027.</p></div></div>
          <div class="timeline-item"><span>03</span><div><small>2027–2028</small><h3>Expand</h3><p>Smart TV, desktop, and new content verticals.</p></div></div>
          <div class="timeline-item"><span>04</span><div><small>2028+</small><h3>Grow</h3><p>Original productions and creator tools.</p></div></div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="section" id="faq">
        <div class="section-heading centered">
          <span class="kicker">FAQ</span>
          <h2>Questions, <span>answered.</span></h2>
        </div>
        <div class="faq-list">
          <details><summary>When does F.A.M.E launch?</summary><p>We're targeting 1 June 2027 for the public launch.</p></details>
          <details><summary>How much will it cost?</summary><p>From R29.90 per month. No hidden fees. Cancel anytime.</p></details>
          <details><summary>What devices will be supported?</summary><p>Mobile web, Android and iOS at launch. Smart TV and desktop will follow.</p></details>
          <details><summary>How can I get early access?</summary><p>Sign up on our waitlist and we'll let you know when we're ready.</p></details>
        </div>
      </section>

      <!-- NOTIFY -->
      <section class="section" id="notify">
        <div class="notify-card">
          <div>
            <span class="kicker">Early access</span>
            <h2>Be first <span>on stage.</span></h2>
            <p>Join the waitlist and we'll let you know the moment F.A.M.E is ready.</p>
          </div>
          <form class="notify-form" id="notifyForm" novalidate>
            <label><span>Your email</span><input type="email" id="email" required placeholder="you@example.com" /></label>
            <button class="button button-primary" type="submit">Notify me</button>
            <small id="formMessage">We'll never share your email.</small>
          </form>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-main">
        <div class="footer-brand">
          <a class="brand" href="#main">
            <span class="brand-mark"><span>S</span></span>
            <span class="brand-copy">
              <strong>STREAMING ON</strong>
              <b>F.A.M.E</b>
              <small>YOUR STAGE. YOUR STORY.</small>
            </span>
          </a>
          <p style="margin-top:14px;color:var(--muted);font-size:11px;line-height:1.7;">Africa's home of local entertainment. A product showcase.</p>
        </div>
        <div><h4>Product</h4><a href="#platform">Platform</a><a href="#experience">Experience</a><a href="#content">Content</a></div>
        <div><h4>Company</h4><a href="#roadmap">Roadmap</a><a href="#faq">FAQ</a><a href="/press.html">Press</a></div>
        <div><h4>Contact</h4><a href="mailto:hello@streamingonfame.co.za">hello@streamingonfame.co.za</a></div>
      </div>
      <div class="footer-bottom">
        <span>© <span id="year"></span> Streaming on F.A.M.E</span>
        <span>www.streamingonfame.co.za</span>
      </div>
    </footer>

    <div class="toast" id="toast"></div>
  </div>
`;

// ============================================================================
// INTERACTIVITY (adapted from your original app.js)
// ============================================================================

// Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Theme toggle
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('fame-theme');
if (savedTheme === 'light') body.classList.add('light');
themeToggle?.addEventListener('click', () => {
  body.classList.toggle('light');
  localStorage.setItem('fame-theme', body.classList.contains('light') ? 'light' : 'dark');
});

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
menuToggle?.addEventListener('click', () => {
  const open = mobileNav?.classList.toggle('open') ?? false;
  menuToggle.setAttribute('aria-expanded', String(open));
});
mobileNav?.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  })
);

// Category tab filtering
document.querySelectorAll('.category-tabs button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.category-tabs button').forEach((b) => b.classList.remove('active'));
    button.classList.add('active');
    const filter = (button as HTMLElement).dataset.filter;
    document.querySelectorAll('.content-card').forEach((card) => {
      const cat = (card as HTMLElement).dataset.category;
      card.classList.toggle('hidden', filter !== 'all' && cat !== filter);
    });
  });
});

// Notify form
const form = document.getElementById('notifyForm') as HTMLFormElement | null;
const message = document.getElementById('formMessage');
const toast = document.getElementById('toast');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.getElementById('email') as HTMLInputElement | null;
  if (!input || !input.value || !input.checkValidity()) {
    if (message) {
      message.textContent = 'Please enter a valid email address.';
      (message as HTMLElement).style.color = '#ff6b91';
    }
    input?.focus();
    return;
  }
  if (message) {
    message.textContent = 'Thanks — your interest has been captured for this demo.';
    (message as HTMLElement).style.color = '#f06ab0';
  }
  if (toast) {
    toast.textContent = 'F.A.M.E showcase signup complete';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2600);
  }
  input.value = '';
});

// Scroll-jump links (nav + notify buttons)
const notifyIds = ['notifyBtnTop', 'notifyBtnHero', 'notifyBtnPlan1', 'notifyBtnPlan2'];
notifyIds.forEach((id) => {
  document.getElementById(id)?.addEventListener('click', () => {
    document.getElementById('notify')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => (document.getElementById('email') as HTMLInputElement | null)?.focus(), 500);
  });
});

// Active nav highlighting
const sections = Array.from(document.querySelectorAll('main section[id]'));
const navLinks = Array.from(document.querySelectorAll('.desktop-nav a'));
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) =>
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id)
      );
    });
  },
  { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
);
sections.forEach((section) => observer.observe(section));
