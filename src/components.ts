import { catalogue, categories, Title } from './data/catalogue';
import { track } from './analytics';

const esc = (value: string) => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c] || c));

export class ContentCard extends HTMLElement {
  titleData?: Title;
  connectedCallback() {
    const id = this.getAttribute('data-id') || '';
    const item = catalogue.find(x => x.id === id);
    if (!item) return;
    this.titleData = item;
    this.className = 'content-card';
    this.innerHTML = `
      <button class="poster" aria-label="Open ${esc(item.title)} details">
        <img src="${item.artwork}" alt="${esc(item.title)} concept artwork" loading="lazy" decoding="async">
        <span class="poster-badge">${esc(item.kind)}</span>
        <span class="poster-play" aria-hidden="true">▶</span>
      </button>
      <div class="card-copy"><h3>${esc(item.title)}</h3><p>${item.year} · ${esc(item.rating)} · ${esc(item.genre)}</p></div>`;
    this.querySelector('button')?.addEventListener('click', () => {
      track('content_opened', { title: item.title, kind: item.kind });
      document.dispatchEvent(new CustomEvent('fame:open-title', { detail: item }));
    });
  }
}

export class ContentRow extends HTMLElement {
  connectedCallback() {
    const ids = (this.getAttribute('data-ids') || '').split(',').filter(Boolean);
    const title = this.getAttribute('data-title') || '';
    this.className = 'content-row';
    this.innerHTML = `<div class="row-heading"><h3>${esc(title)}</h3><button class="row-more" type="button">View all</button></div><div class="row-track">${ids.map(id => `<content-card data-id="${esc(id)}"></content-card>`).join('')}</div>`;
    this.querySelector('.row-more')?.addEventListener('click', () => document.dispatchEvent(new CustomEvent('fame:open-catalogue')));
  }
}

export class ProductPreview extends HTMLElement {
  private active = 'home';
  connectedCallback() {
    this.className = 'product-preview';
    this.render();
  }
  private render() {
    const featured = catalogue[0];
    const rows = {
      home: ['city-of-dreams','after-the-rain','roots-and-rhythm','future-africa'],
      originals: ['roots-and-rhythm','voices-of-home','city-of-dreams','makers-of-tomorrow'],
      mylist: ['the-next-move','village-to-vision','midnight-radio'],
      profile: ['little-legends','makers-of-tomorrow']
    } as Record<string,string[]>;
    const ids = rows[this.active] || rows.home;
    this.innerHTML = `
      <div class="preview-shell">
        <div class="preview-topbar"><div class="preview-brand"><span class="mini-mark">F</span><b>F.A.M.E</b><span class="preview-label">PRODUCT PREVIEW</span></div><span class="preview-status"><i></i> Concept</span></div>
        <div class="preview-hero" style="--preview-art:url('${featured.artwork}')">
          <div class="preview-hero-copy"><span class="eyebrow">F.A.M.E ORIGINAL</span><h3>${esc(featured.title)}</h3><p>${esc(featured.synopsis)}</p><div class="preview-actions"><button class="primary-btn" data-preview-play>▶ Play preview</button><button class="ghost-btn" data-preview-info>＋ My List</button></div></div>
        </div>
        <div class="preview-nav" role="tablist" aria-label="Product preview navigation">
          ${[['home','Home'],['originals','Originals'],['mylist','My List'],['profile','Profile']].map(([id,label]) => `<button role="tab" aria-selected="${this.active===id}" class="${this.active===id?'active':''}" data-tab="${id}">${label}</button>`).join('')}
        </div>
        <div class="preview-content"><div class="preview-row-label">${this.active==='home'?'Continue Watching':this.active==='originals'?'African Originals':this.active==='mylist'?'My List':'Family Profiles'}</div><div class="preview-posters">${ids.map(id => { const item=catalogue.find(x=>x.id===id)!; return `<button class="preview-card" data-id="${item.id}"><img src="${item.artwork}" alt="${esc(item.title)}"><span>${esc(item.title)}</span></button>`; }).join('')}</div></div>
        <div class="preview-bottom"><span>⌂ Home</span><span>⌕ Search</span><span>＋ My List</span><span>◉ Profile</span></div>
      </div>`;
    this.querySelectorAll<HTMLElement>('[data-tab]').forEach(btn => btn.addEventListener('click', () => { this.active = btn.dataset.tab || 'home'; track('preview_tab_used',{tab:this.active}); this.render(); }));
    this.querySelectorAll<HTMLElement>('.preview-card').forEach(btn => btn.addEventListener('click', () => { const item=catalogue.find(x=>x.id===btn.dataset.id); if(item) document.dispatchEvent(new CustomEvent('fame:open-title',{detail:item})); }));
    this.querySelector('[data-preview-play]')?.addEventListener('click', () => document.dispatchEvent(new CustomEvent('fame:play-preview',{detail:featured})));
    this.querySelector('[data-preview-info]')?.addEventListener('click', () => document.dispatchEvent(new CustomEvent('fame:open-title',{detail:featured})));
  }
}

export function renderCards(selector: string, ids: string[]) {
  const host = document.querySelector<HTMLElement>(selector);
  if (host) host.innerHTML = ids.map(id => `<content-card data-id="${id}"></content-card>`).join('');
}

export function renderCategoryButtons() {
  return categories.map(c => `<button class="filter-chip ${c.id==='all'?'active':''}" data-filter="${c.id}">${c.label}</button>`).join('');
}
