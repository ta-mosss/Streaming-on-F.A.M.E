# Streaming on F.A.M.E — Showcase

**Your Stage. Your Story.**

This repository is the **public-facing website for the F.A.M.E vision**. It is intentionally separate from the future production VOD application.

The job of this site is to make a visitor think:

> **“Damn. I want to use this platform.”**

Then the future `fame-vod-platform` project makes that statement true.

## What this iteration focuses on

- Human, editorial product design rather than a generic AI landing-page aesthetic.
- Real-looking local catalogue imagery using the site's existing visual assets.
- Interactive product concept: tabs, catalogue, search, title details, My List and concept player.
- Mobile-first UX with a compact navigation and app-like product preview.
- Clear separation between the showcase and the future production VOD system.
- Honest launch/pricing language: targets are presented as targets, not facts.
- SEO-ready metadata, canonical URL, Open Graph/Twitter cards, sitemap and structured data.
- Privacy-friendly analytics hooks with Plausible support.
- Production build with TypeScript checking and Vite.
- GitHub Actions CI/CD: pull requests and `develop` validate the build; `main` deploys to GitHub Pages.
- Content-driven catalogue data so new concept titles do not require rewriting page markup.

## Repository architecture

```text
Streaming-on-F.A.M.E/
├── public/
│   ├── assets/
│   │   ├── brand/
│   │   └── content/
│   ├── manifest.webmanifest
│   ├── robots.txt
│   ├── sitemap.xml
│   └── CNAME
├── src/
│   ├── data/
│   │   └── catalogue.ts
│   ├── styles/
│   │   └── main.css
│   ├── analytics.ts
│   ├── env.d.ts
│   └── main.ts
├── design-source/
├── .github/workflows/
│   └── deploy.yml
├── index.html
├── press.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

### Boundaries

This repo should **not** become the VOD backend.

The future production application can live in a separate repository, for example:

```text
fame-vod-platform/
```

That application can own:

- customer authentication and profiles
- subscriptions and payments
- production video playback
- CDN and adaptive streaming
- DRM
- catalogue/CMS
- content ingestion and transcoding
- mobile applications
- Smart TV applications
- admin/operations
- creator tooling
- production observability and infrastructure

## Local development

```bash
npm ci
npm run dev
```

Production validation:

```bash
npm run typecheck
npm run build
npm run preview
```

## Waitlist

The waitlist is deliberately honest.

Without `VITE_WAITLIST_ENDPOINT`, the form stays in **demo mode** and does not pretend to have saved an email.

For a real endpoint:

```bash
VITE_WAITLIST_ENDPOINT=https://your-api.example/waitlist
```

The endpoint receives:

```json
{
  "email": "person@example.com",
  "source": "fame-showcase",
  "consent": true
}
```

For GitHub Actions, store the endpoint as the repository secret `VITE_WAITLIST_ENDPOINT`.

## Analytics

Set:

```text
VITE_PLAUSIBLE_DOMAIN=streamingonfame.co.za
```

Optionally set:

```text
VITE_PLAUSIBLE_SCRIPT=https://plausible.io/js/script.js
```

The application also emits `fame:analytics` browser events, keeping analytics concerns decoupled from the product UI.

Important product events include:

- `search_opened`
- `product_preview_tab`
- `title_opened`
- `concept_preview_started`
- `concept_player_used`
- `my_list_added`
- `my_list_removed`
- `catalogue_filter`
- `waitlist_signup`

## GitHub flow

```text
feature/* → develop → main
              ↓        ↓
           CI/build   CI/build + production deploy
```

Pull requests into `main` must pass typecheck and production build.

`develop` validates the staging/integration branch without publishing production.

`main` deploys the build artifact to GitHub Pages.

## Content

Concept titles are defined in:

```text
src/data/catalogue.ts
```

The website uses local assets from:

```text
public/assets/content/
```

This keeps content changes separate from the presentation layer.

## Product truth

This website is a **showcase**.

It does not claim that:

- accounts already exist
- subscriptions are live
- the shown catalogue is available to stream
- the concept player is delivering production video
- the target launch date is guaranteed
- the displayed pricing is final

That distinction matters because the website is selling the **vision**, while the future VOD application will deliver the product.
