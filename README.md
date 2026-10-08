# Streaming on F.A.M.E — V4 Showcase

**Your Stage. Your Story.**

V4 is a production-minded public showcase for the future F.A.M.E entertainment platform. It preserves the existing concept catalogue, brand assets, waitlist endpoint, Plausible analytics hooks and GitHub Pages deployment while upgrading the experience into a cinematic, interactive product story.

## What changed in V4

- Cinematic hero with featured content and product-led CTA.
- Interactive streaming product preview with Home, Originals, My List and Profile states.
- Catalogue filtering, title details, concept player and My List interactions retained.
- Search drawer retained and upgraded.
- Scroll reveal motion, marquee, ambient lighting and reduced-motion support.
- Stronger African brand narrative and city identity.
- Creator-focused section for future partnerships.
- Mobile-first product presentation with touch-friendly controls.
- Accessibility improvements: skip link, labelled controls, modal semantics, keyboard Escape handling and reduced motion.
- Honest product messaging: concept content is clearly separated from the future production VOD platform.
- Existing local assets and content model remain the source of truth.
- Existing waitlist endpoint and Plausible environment variables remain supported.
- Existing GitHub Actions deployment remains supported.

## Run locally

```bash
npm ci
npm run dev
```

Validate production:

```bash
npm run typecheck
npm run build
npm run preview
```

## Environment variables

Optional waitlist endpoint:

```text
VITE_WAITLIST_ENDPOINT=https://your-api.example/waitlist
```

Optional Plausible analytics:

```text
VITE_PLAUSIBLE_DOMAIN=streamingonfame.co.za
VITE_PLAUSIBLE_SCRIPT=https://plausible.io/js/script.js
```

Without the waitlist endpoint the form remains explicitly in demo mode and does not pretend to save an email.

## Architecture

```text
src/
├── data/catalogue.ts   # concept content model
├── analytics.ts        # privacy-friendly analytics hook
├── main.ts             # showcase application + interactions
└── styles/main.css     # V4 design system and responsive UI
public/assets/
├── brand/
└── content/
```

The future production application should remain separate and can own authentication, subscriptions, payments, playback, DRM, CDN, CMS, content ingestion, apps, Smart TV experiences and creator tooling.

## Product truth

This repository is a showcase. It does not claim that accounts, subscriptions, production streams or the displayed concept catalogue are live. Pricing and launch timing are targets only.
