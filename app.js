(() => {
  const body = document.body;
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('fame-theme');
  if (savedTheme === 'light') body.classList.add('light');
  themeToggle?.addEventListener('click', () => {
    body.classList.toggle('light');
    localStorage.setItem('fame-theme', body.classList.contains('light') ? 'light' : 'dark');
  });

  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  menuToggle?.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  document.querySelectorAll('.category-tabs button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.category-tabs button').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      document.querySelectorAll('.content-card').forEach(card => {
        card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
      });
    });
  });

  const form = document.getElementById('notifyForm');
  const message = document.getElementById('formMessage');
  const toast = document.getElementById('toast');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('email');
    if (!input.value || !input.checkValidity()) {
      message.textContent = 'Please enter a valid email address.';
      message.style.color = '#ff6b91';
      input.focus();
      return;
    }
    // Showcase only: no backend submission is performed here.
    message.textContent = 'Thanks — your interest has been captured for this demo.';
    message.style.color = '#f06ab0';
    toast.textContent = 'F.A.M.E showcase signup complete';
    toast.classList.add('show');
    input.value = '';
    setTimeout(() => toast.classList.remove('show'), 2600);
  });

  // Smoothly mark the active desktop section without pretending this is the VOD app.
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  sections.forEach(section => observer.observe(section));
})();
