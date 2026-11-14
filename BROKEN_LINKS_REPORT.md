# Broken Links Report

**Test date:** 2026-11-14  
**Scope:** Local page paths, runtime internal-link targets, fragments, sitemap entries, and known external map links.

## Summary

- **17 HTML routes** rendered locally.
- **17/17 public routes** returned HTTP 200 on the production baseline before local repairs.
- **474 runtime internal-link instances** and **289 source-level internal links** checked.
- **Broken internal links/fragments:** 0.
- **Failed image requests:** 0 of 69 rendered image instances.
- **Google Maps directions, business listing, and embed:** HTTP 200.
- No confirmed official Instagram/Facebook URL or café email was available; these were not replaced with guessed links.

## Route checks

| Page | Route result | Internal links |
|---|---|---|
| `index.html` | PASS | PASS |
| `shop.html` | PASS | PASS |
| `coffee.html` | PASS | PASS |
| `drinks.html` | PASS | PASS |
| `merch.html` | PASS | PASS |
| `gift-cards.html` | PASS | PASS |
| `subscriptions.html` | PASS | PASS |
| `story.html` | PASS | PASS |
| `events.html` | PASS | PASS |
| `catering.html` | PASS | PASS |
| `faq.html` | PASS | PASS |
| `contact.html` | PASS | PASS |
| `menu.html` | PASS | PASS |
| `gallery.html` | PASS | PASS |
| `product.html` | PASS | PASS |
| `cart.html` | PASS | PASS |
| `checkout.html` | PASS | PASS |

“Route result” reflects the local render and, for the 17 public production routes, the pre-repair HTTP 200 check. It does not imply that a real checkout or form integration exists.

## External and special links

| Link | Expected behavior | Actual behavior | Status | Issue / fix / retest |
|---|---|---|---|---|
| Google Maps directions | Open directions to Glitter Bean Cafe Co-op using the fixed verified destination; leave origin to Google Maps/customer. | Correct destination URL opened; HTTP 200. No GPS request is made by the site. | PASS | No coordinates are supplied by the browser. Physical app handoff not tested. |
| Google Maps business listing | Open the verified café listing. | Listing URL opened; HTTP 200. | PASS | No repair required. |
| Google Maps embed | Show the business location in the page. | Embed loaded; HTTP 200 on a stay-on-page probe. | PASS | Rapid navigation can abort the outstanding iframe request; this was not a persistent broken embed. |
| Phone link | Invoke the phone handler using the verified listing number. | `tel:+19024075715` is present. No call was placed. | PASS (destination) | Device handler not tested. |
| Instagram/Facebook | Open official business profiles. | Not linked because official profile URLs were not owner-confirmed. | BLOCKED | Requires owner confirmation; no placeholder links added. |
| Café email | Open a verified contact address. | Not linked because no email is confirmed. FAQ copy was corrected. | BLOCKED | Requires owner confirmation. |

## Sitemap and metadata

The sitemap contains the 14 public content routes. `product.html`, `cart.html`, and `checkout.html` are preview/transactional routes and are now marked `noindex,follow` and omitted from the sitemap. The robots file points to the sitemap. No missing local fragments or duplicate IDs were found in the source audit.

## Fixes and remaining work

- Removed the unsupported FAQ email instruction.
- Excluded product preview, cart, and checkout routes from indexing.
- No broken internal URL required a target rewrite during this pass.
- Confirm official email and social URLs with the café before adding them.
- Retest production links after the local changes are approved and deployed.
