// src/main.ts
import '../styles.css';

const app = document.getElementById('app');
if (app) {
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
          <button class="button button-small" id="notifyBtn">Get early access</button>
        </div>
      </header>

      <main id="main">
        <section class="hero" id="platform">
          <div class="hero-glow hero-glow-one"></div>
          <div class="hero-glow hero-glow-two"></div>
          <div class="hero-grid"></div>
          <div class="hero-content">
            <span class="eyebrow"><span class="pulse"></span> LAUNCHING 1 JUNE 2027</span>
            <h1>Your Stage.<br><span>Your Story.</span></h1>
            <p>Africa's home of local entertainment. A mobile-first streaming platform built for the stories, voices, and creators that define the continent.</p>
            <div class="hero-actions">
              <button class="button button-primary" id="notifyBtn2">Get early access</button>
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
          </div>
        </div>
        <div class="footer-bottom">
          <span>© <span id="year"></span> Streaming on F.A.M.E</span>
          <span>www.streamingonfame.co.za</span>
        </div>
      </footer>
    </div>
  `;
}

// Year
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());

// Early-access buttons → press.html for now, or wire to a form later
['notifyBtn', 'notifyBtn2'].forEach((id) => {
  document.getElementById(id)?.addEventListener('click', () => {
    window.location.href = '/press.html';
  });
});