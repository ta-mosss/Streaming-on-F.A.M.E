# Streaming on F.A.M.E — Showcase Website

**Your Stage. Your Story.**

This repository is the **public-facing marketing and product showcase website** for Streaming on F.A.M.E.

> **Important boundary:** this is NOT the production VOD platform. Authentication, subscriptions, payments, DRM, video delivery, CMS, customer accounts and production playback belong to the future F.A.M.E VOD project and should not be implemented in this repository.

## Product direction

The supplied F.A.M.E design brief defines a mobile-first African entertainment vision, with mobile web/PWA and Android prioritised for the MVP, followed by iOS, desktop/Smart TV and later growth capabilities.

This website communicates that vision through:

- premium cinematic brand experience
- interactive VOD product preview
- concept content catalogue and artwork system
- title detail and simulated trailer interactions
- showcase pricing direction
- early-access/waitlist capture
- SEO and social metadata
- accessibility and reduced-motion support
- privacy-friendly analytics hooks
- GitHub Actions CI/CD
- production and staging build workflows

## Stack

- Vite
- TypeScript
- Native Web Components (no framework lock-in)
- CSS design system
- SVG/WebP/PNG local artwork
- GitHub Actions

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Waitlist integration

The form is intentionally **not fake**. If `VITE_WAITLIST_ENDPOINT` is not configured, the site tells the user that no registration was submitted.

Copy `.env.example` to `.env.local` and configure a real endpoint:

```text
VITE_WAITLIST_ENDPOINT=https://your-api.example/waitlist
```

The endpoint should accept JSON like:

```json
{
  "email": "person@example.com",
  "source": "website",
  "consent": true
}
```

For production, store the endpoint as a GitHub Actions secret named `VITE_WAITLIST_ENDPOINT`.

## Analytics

Analytics are opt-in and designed around privacy-friendly, cookieless providers. Configure:

```text
VITE_PLAUSIBLE_DOMAIN=streamingonfame.co.za
```

The app also emits `fame:analytics` browser events so a future analytics adapter can be added without changing product components.

## Git workflow

Recommended:

```text
main       → production
   ↑
develop    → staging / integration
   ↑
feature/*  → individual changes
```

Pull requests should pass the CI build before merging.

### Production

Push to `main` to run the production build/deploy workflow. The workflow is configured for GitHub Pages and includes `public/CNAME` for `www.streamingonfame.co.za`. If the repository is hosted elsewhere, keep the CI workflow and replace only the deployment job.

### Staging

Push to `develop` to create a staging build artifact. This intentionally avoids silently publishing to production.

## Content system

Concept titles live in:

```text
src/data/catalogue.ts
```

Artwork lives in:

```text
public/assets/content/
```

Adding a title is therefore a data/content change rather than an HTML rewrite.

## Brand assets

```text
public/assets/brand/fame-logo.png
public/assets/brand/fame-logo.webp
design-source/fame-logo-original.png
public/og-image.svg
```

The optimised WebP is used by the site. The PNG is retained for press/download use.

## Repository boundary

When the production VOD project begins, create a separate repository, for example:

```text
fame-vod-platform
```

That project can then own:

- customer authentication
- profiles
- catalogue CMS
- video ingestion/transcoding
- CDN
- DRM
- subscriptions/payments
- production player
- mobile apps
- admin/operations
- infrastructure-as-code
- observability

Do not couple those production concerns into this showcase repository.
