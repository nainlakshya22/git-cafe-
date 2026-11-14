# Website Audit Report

**Project:** Glitter Bean Café  
**Audit date:** 2026-11-14  
**Scope:** Repository source, all 17 HTML pages, static assets, route/link integrity, browser interactions, responsive layout, basic SEO/accessibility, and a limited security review.  
**Deployment status:** Repairs are local, uncommitted, and not deployed.

## Executive summary

The site is a static HTML/CSS/JavaScript preview with 17 HTML pages, shared `styles.css`, `script.js`, and `catalog.js`. It has no package manifest, checked-in browser test runner, backend, payment provider, inventory service, contact-form endpoint, or newsletter integration. Product and price data are explicitly marked as preview content.

The confirmed browser-facing defects found in this pass were repaired. All 17 local pages rendered, no broken internal links or image requests were observed, and no horizontal overflow was found in the responsive matrix. The site must not be presented as accepting real online orders, payments, contact submissions, newsletter signups, gift-card delivery, or recurring subscriptions.

## Severity summary

| Severity | Result |
|---|---|
| Critical defects | None observed in the tested static preview. |
| High / launch blockers | Real checkout, order fulfillment, stock/pricing verification, and form integrations are not configured. |
| Medium | Quick Add/default-variant mismatch, stale product option label, and missing alphabetical sort were fixed. Popularity sorting remains blocked pending trustworthy data. |
| Low | Unsupported FAQ email instruction and indexable preview-only routes were fixed. |

## Page and route inventory

Each local page was opened after the repairs. All 17 corresponding public routes returned HTTP 200 in the pre-repair production baseline; that baseline does not include the local changes.

| Page | Local render | Notes |
|---|---|---|
| `index.html` | PASS | Homepage and shared navigation/footer. |
| `shop.html` | PASS | Catalog search, category filters, sort, and Quick Add. |
| `coffee.html` | PASS | Coffee filters and sort. |
| `drinks.html` | PASS | Signature drinks catalog. |
| `merch.html` | PASS | Merchandise catalog. |
| `gift-cards.html` | PASS | Preview-only gift-card concepts; real issuance is unavailable. |
| `subscriptions.html` | PASS | Preview-only subscription concepts; recurring billing is unavailable. |
| `story.html` | PASS | Story page and shared navigation/footer. |
| `events.html` | PASS | No verified event-registration integration. |
| `catering.html` | PASS | No inquiry endpoint or email notification integration. |
| `faq.html` | PASS | FAQ search and no-results state. |
| `contact.html` | PASS | Contact preview form and Google Maps location section. |
| `menu.html` | PASS | Informational page; online ordering is not available. |
| `gallery.html` | PASS | Gallery page and image rendering. |
| `product.html` | PASS | Shared detail template tested against all 20 catalog products. |
| `cart.html` | PASS | Browser-local preview cart; no order is created. |
| `checkout.html` | PASS | Explains that payment/order functionality is not configured. |

## Findings and repairs

| Finding | Severity | Result |
|---|---|---|
| Quick Add used an empty variant while detail-page additions used the default variant, splitting one product into duplicate rows. | Medium | Fixed: Quick Add and legacy entries now use the default variant. |
| Product detail option text could remain hardcoded as “250g” after selecting non-coffee options. | Medium | Fixed: the label reflects the currently selected variant. |
| Shop and Coffee Collection did not offer alphabetical sorting. | Medium | Fixed: A-to-Z sort added and tested. |
| Popularity sorting has no verified popularity/ranking data. | Medium | Blocked: no ranking was invented. |
| Malformed saved cart data could fail without a clear user-facing message. | Medium | Fixed: the preview cart displays a warning. |
| FAQ suggested emailing the café although no email address is confirmed. | Low | Fixed: unsupported email instruction removed. |
| Product, cart, and checkout preview routes were indexable and included in the sitemap. | Low | Fixed: routes are `noindex,follow` and excluded from the sitemap. |
| Real payments, inventory, order fulfillment, and form delivery are not configured. | High launch blocker | Not implemented: the site clearly states that these functions are unavailable. |

## Verification summary

| Area | Result |
|---|---|
| Routes and links | 17 local pages rendered. 474 runtime internal-link instances and 289 source-level internal links resolved; no broken internal targets or fragments were found. |
| Responsive layout | 153 page/viewport combinations (17 pages at 9 exact CSS widths) showed no horizontal overflow. See [RESPONSIVE_TEST_REPORT.md](./RESPONSIVE_TEST_REPORT.md). |
| Catalog | Search, empty results, categories, price ordering, and alphabetical ordering passed. All 20 Quick Add targets and all 20 product-detail IDs were exercised. |
| Variants and cart | All 43 available variant options were checked. Preview cart quantity changes, variant separation, subtotal, removal, persistence, empty state, legacy normalization, and invalid-data warning passed. |
| Forms and FAQ | Client-side validation, explicit “nothing was sent” feedback, FAQ matching, and FAQ no-results state passed. Real submissions remain blocked. |
| Images | All 69 rendered image instances loaded. No image files or image URLs were modified. |
| Maps | Directions, listing, and embed resolved successfully (HTTP 200). At a 390 CSS-pixel viewport, both location links measured 48px high and the map stayed within the viewport. |
| Browser errors | No uncaught page errors or JavaScript console errors were observed in the final local interaction run. A map request can be aborted if the page is navigated away before its embed finishes; a dedicated stay-on-page probe completed successfully. |
| SEO/accessibility | Preview-only routes are excluded from indexing/sitemap. Alt attributes and form labels were spot-checked. This was not a full WCAG, contrast, structured-data, or SEO scoring audit. |
| Performance | Lighthouse, Core Web Vitals, and production build analysis were not run. |

## Remaining owner and integration work

1. Confirm real products, prices, variants, stock, and popularity/ranking data.
2. Select and configure a secure backend/payment provider before enabling orders, gift cards, or recurring subscriptions.
3. Configure real contact, catering, event, and newsletter services, including spam protection and notification routing.
4. Confirm the café email address and official social-profile URLs before publishing them.
5. Obtain owner approval for all business details and customer-facing claims.
6. Test Google Maps app handoff on physical Android and iPhone devices.
7. Run Lighthouse/Core Web Vitals and a full accessibility audit before production launch.

## Related reports

- [Button and interaction test report](./BUTTON_TEST_REPORT.md)
- [Broken-links report](./BROKEN_LINKS_REPORT.md)
- [Responsive test report](./RESPONSIVE_TEST_REPORT.md)
- [Security audit report](./SECURITY_AUDIT_REPORT.md)
- [Fixes implemented](./FIXES_IMPLEMENTED.md)
- [Existing source and business-information audit](./AUDIT.md)
