# Glitter Bean Café — Baseline Audit

Audit date: 2026-11-13

## Scope and evidence

- Inspected all tracked project files and the deployed homepage at `https://git-cafe-nine.vercel.app/`.
- The existing deployment returned HTTP 200 for all 17 required page URLs during direct-route checks.
- Browser inspection of the deployed homepage found two failed Unsplash image requests (`net::ERR_BLOCKED_BY_ORB`) and no console errors.
- The project is a set of standalone HTML pages with one CSS file and one small JavaScript file. No package manifest, server/API routes, database, payment provider, environment configuration, or Vercel configuration is present in the workspace.
- The live homepage renders, but a full 12-route, multi-viewport browser and deployment audit has not been completed.

## Baseline findings

| Priority | Status | Finding |
|---|---|---|
| Critical | FAIL | Checkout contained prefilled card number, expiry, and CVV fields and displayed a successful-order confirmation without a payment provider or backend. |
| High | FAIL | Product quick-add buttons, catalog filters/search/sorting, and most cart controls did not update shared product/cart state. |
| High | FAIL | Static cart and checkout showed hardcoded products, quantities, totals, and an initial non-empty cart badge. |
| High | FAIL | Homepage displayed unverified ratings, testimonials, product availability, event schedules, opening hours, and other business claims as facts. |
| Medium | FAIL | Navigation included literal `\\r\\n` text in several pages after the prior link edit. |
| Medium | FAIL | Pages lacked consistent unique SEO metadata, semantic form labels, and functioning mobile navigation. |
| Medium | NOT TESTED | No automated test runner, accessibility test, Lighthouse report, or cross-viewport regression suite exists in this static project. |
| Info | PARTIALLY PASSED | The live homepage is reachable and renders. Deployment source/configuration and other live routes have not been independently verified. |

## Architecture and integrations

- Frontend: plain HTML/CSS/JavaScript.
- Backend/database/authentication: none found.
- Payment/recurring billing: none found.
- Email/newsletter/contact submission: none found.
- Product and event data: duplicated static markup; no authoritative source or verified inventory feed.

## Changes and verification

### Implemented

- Added a shared preview catalog and made the collection/category pages render from it. Search, category filtering, price sorting, product details, variants, and quantity selection now respond to user input.
- Added a local-browser preview cart with validated product IDs/variants, quantity limits, remove/update controls, persistence, and consistent preview totals. Local prices are not authoritative and no order is submitted.
- Replaced the previous card form and false order confirmation with an explicit notice that checkout/payment is unavailable. No payment details are collected.
- Removed unverified testimonials, ratings, hours, event schedules, event registration claims, and venue capacity. Marked preview catalog/menu information as requiring café confirmation.
- Added responsive mobile navigation, visible keyboard focus styles, reduced-motion handling, searchable FAQ, page titles/descriptions/canonicals/Open Graph metadata, `sitemap.xml`, and `robots.txt`.
- Corrected malformed navigation markup, initialized the cart count to zero, made phone/email links actionable, and corrected the observed broken Unsplash image URL.
- Replaced the two image URLs observed failing in the live homepage within the local project.

### Verification

| Check | Status | Result |
|---|---|---|
| Local direct page requests | PASS | All 17 HTML pages returned HTTP 200 on the local preview server. |
| HTML/local references/metadata | PASS | 17 pages checked for missing local files, duplicate attributes/IDs, titles, descriptions, and canonicals; no issues found. Sitemap XML parsed successfully. |
| Product search/filter/sort | PASS | Browser verified product search, category filtering, and ascending price order. |
| Product details and quantity | PASS | Browser verified a query-selected product and quantity control. |
| Preview cart | PASS | Browser verified add, persistence on reload, quantity/total update, removal, and empty state. |
| Checkout safety | PASS | Browser verified no payment fields and no success claim are present. |
| FAQ/contact behavior | PASS | Browser verified FAQ filtering and that the contact form reports its unavailable backend rather than claiming submission. |
| Responsive horizontal overflow | PASS | All 17 pages checked at 320, 768, and 1280 CSS px, plus the shop page at 360, 375, 390, 430, 1024, 1440, and 1920 CSS px; none detected. |
| Browser JavaScript errors | PASS | No page errors found during 17-route local render passes at 320, 768, and 1280 CSS px. |
| Local page images | PASS | All page images were forced to load across 17 local routes; no broken images were found. |
| Lighthouse/Core Web Vitals | NOT TESTED | Lighthouse tooling and a production-like deployment build are not configured. |
| Full accessibility/keyboard/screen-reader audit | NOT TESTED | Only basic labels, focus styles, semantic controls, and responsive menu behavior were checked. |
| Backend, payment, subscriptions, event/catering submission | BLOCKED | No backend, provider, credentials, or confirmed business data are present. |
| Live deployment after changes | NOT DEPLOYED | Workspace changes were not deployed; the Vercel site remains unchanged. |
| Existing live homepage images | FAIL | Two Unsplash requests failed in the browser; the local source now uses replacement URLs, pending deployment verification. |

A browser-rendered page is not evidence that payment, contact submission, inventory, subscriptions, or deployment behavior is production-ready.

## Security and production notes

- The local cart uses browser `localStorage`, which users can edit. It is for preview behavior only; its prices and totals are not suitable for real orders.
- No server, customer accounts, admin area, database, payment credentials, or API integrations were found. No secrets were added.
- External Unsplash photos and Google Fonts make third-party requests. Replace preview/stock imagery with café-approved assets before production.
- Do not enable transaction-related buttons or advertise subscriptions/gift-card redemption until a backend and payment provider validate server-side prices, stock, tax, shipping, and payment status.
- LocalBusiness structured data, verified business hours, product schema, and review schema were not added because the underlying facts and reviews were not verified.

## Remaining audit limitations

- Business information, product prices, inventory, events, and reviews require verification by the café owner.
- No payment, commerce, email, database, or admin credentials were provided; production transactions cannot be enabled or validated.
- A new Vercel deployment cannot be claimed unless a deployment is made and checked separately.
