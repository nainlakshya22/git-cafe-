# Button and Interaction Test Report

**Test date:** 2026-11-14  
**Environment:** Local repository files opened in a Playwright-controlled browser. No checked-in test runner or package manifest exists.  
**Deployment:** Not changed. Local repairs have not been pushed or deployed.

## Totals

- **103 button/control click actions:** 103 passed, 0 failed.
- **2 Google Maps link actions:** 2 passed.
- **Repair groups completed:** 6.
- **Blocked feature/integration groups:** 9 (popularity ranking, gift-card issuance/redemption, subscriptions, checkout/payment, newsletter delivery, contact delivery, catering inquiries, event registration, and unconfirmed social links).
- **Product cards exercised:** 20.
- **Product detail IDs exercised:** 20.
- **Variant options exercised:** 43.
- **Internal links checked separately:** 474 runtime instances, 0 broken.

Counts are executed interactions, not unique source-code buttons. Shared header/footer controls were tested by behavior; the same repeated control was not clicked on every page. Feature-level statuses below distinguish a working preview/guard from an unavailable real-world integration.

## Interaction results

| Page / feature | Expected behavior | Actual behavior | Status | Issue / fix / retest |
|---|---|---|---|---|
| All pages — shared navigation and footer links | Navigate to valid local pages. | Runtime internal links resolved; 474 instances checked. | PASS | No broken internal targets found. |
| All pages — mobile menu | Open, close, and expose menu state. | Menu toggled and closed as expected; expanded state was exposed. | PASS | No repair required. |
| Site search | Open search, accept query, return matching results, and show empty state when unmatched. | Open/close and search interactions passed; result behavior was checked. | PASS | No repair required. |
| `shop.html` — category filters | Show the selected category and restore all products. | All filter states and reset behavior worked. | PASS | No repair required. |
| `coffee.html` — category filters | Show matching coffee items. | Filter controls worked; full collection restored before sort verification. | PASS | No repair required. |
| `shop.html`, `coffee.html` — alphabetical sort | Sort the visible results A to Z. | Both pages produced alphabetical results; the full six-item coffee collection was checked. | PASS | Alphabetical control added and retested. |
| Shop/Coffee — price sort | Order by low-to-high or high-to-low price. | Both directions worked on preview catalog values. | PASS | Values remain unverified preview prices. |
| Catalog — popularity sort | Order by trusted popularity data. | No popularity/ranking field or verified source exists. | BLOCKED | No synthetic ranking was added. Requires owner-approved data. |
| Catalog pages — all 20 Quick Add buttons | Add the selected product using its default variant. | 14 eligible preview products added with the correct variant; 6 gift/subscription concepts were safely blocked. | PASS (preview) | Fixed blank-variant mismatch and normalized legacy cart entries. Real purchase remains unavailable. |
| `product.html` — all 20 product details | Show the correct product and selectable options. | All catalog IDs opened; all 43 variant options were selected. | PASS | Fixed stale hardcoded option text; retest confirmed the label follows selection. |
| Product gallery thumbnails | Change the displayed product image and selected state. | Thumbnail changes and pressed state worked. | PASS | No image file or URL changes. |
| Product quantity controls | Increase/decrease quantity without going below the allowed minimum. | Controls updated quantity and respected bounds. | PASS | No repair required. |
| Product detail Add to Cart | Add the selected variant and quantity. | Eligible preview products entered cart with selected variant/quantity. | PASS (preview) | Cart addition does not create an order. |
| `cart.html` — quantity controls | Update the correct variant and recalculate subtotal. | Variant-specific updates and subtotal calculation worked. | PASS (preview) | Variant identity is preserved. Totals use preview values only. |
| `cart.html` — remove item | Remove only the selected variant and update the empty state. | Removal and empty-cart view worked. | PASS (preview) | No repair required. |
| `cart.html` — persistence | Retain preview cart after reload. | Cart survived reload in browser storage. | PASS (preview) | No server-side order or cross-device cart exists. |
| `cart.html` — malformed storage | Report invalid saved cart rather than silently pretending it is valid. | A visible warning was produced; legacy empty variants normalized. | PASS | Cart-read handling repaired and retested. |
| Gift-card purchase/delivery/redemption | Issue and deliver a real gift card and allow redemption. | Preview concept only; no provider, recipient email delivery, or redemption service exists. | BLOCKED | No real purchase is claimed or attempted. |
| Subscription billing/manage | Start recurring billing and support pause/cancel/manage. | Preview plans only; no billing or subscription backend exists. | BLOCKED | Requires an authorized payment/subscription integration. |
| `checkout.html` — payment/order | Validate customer/shipping details, process payment, and confirm a real order. | Page explicitly states no payment/order can be created; it collects no payment details. | BLOCKED (integration) | Safe disclosure passed; payment flow is intentionally unavailable. |
| `index.html` / sitewide — newsletter | Validate email and submit to a mailing list with success/error response. | Validation works; valid attempt explicitly says nothing was sent. | PASS (validation); BLOCKED (delivery) | Requires mailing-list endpoint and credentials. No fake success. |
| `contact.html` — contact form | Validate fields and deliver a message with success/error response. | Invalid input is rejected; valid attempt explicitly says nothing was sent. | PASS (validation); BLOCKED (delivery) | Requires verified recipient/endpoint and spam protection. |
| `catering.html` — catering inquiry | Collect inquiry details and notify the café. | No real form endpoint or notification integration is configured. | BLOCKED | Requires owner-approved service and delivery destination. |
| `events.html` — registration | Register a customer for a verified upcoming event. | No verified event schedule or registration integration is configured. | BLOCKED | No event or registration details were invented. |
| `faq.html` — FAQ search | Filter questions and show a useful no-results state. | Matching and no-match behavior worked. | PASS | Removed unsupported email instruction and retested. |
| `contact.html` — Get Directions / Open in Google Maps | Open directions/listing for the verified business. | Both links opened their intended Google Maps destinations. | PASS | Directions do not request customer GPS. Physical app handoff remains untested. |
| `contact.html` — click to call | Open the device’s phone handler. | Verified `tel:` destination is present; no call was placed. | PASS (link) | Device call handoff not tested. |
| Social links | Open confirmed official Instagram/Facebook profiles. | Official URLs remain unconfirmed, so no links are exposed. | BLOCKED | Requires owner confirmation; no placeholder destinations were used. |
| `story.html`, `menu.html`, `gallery.html`, `events.html`, `catering.html` — page CTAs and shared navigation | Navigate to the intended local page or section. | Internal targets resolved; no broken destinations found. | PASS | No registration or inquiry delivery is implied where no backend exists. |
| Back-to-top and other page controls | Perform the advertised local navigation action. | Present page controls and internal CTAs resolved to their intended targets. | PASS | No broken internal target found. |

## Retest notes

- Quick Add now matches the detail-page default variant. A legacy empty variant is normalized instead of creating a duplicate row.
- Selected-option labels update for coffee, drinks, merchandise, gift-card, and subscription concepts.
- Cart quantity/removal actions remain isolated by product and variant.
- The contact and newsletter forms do not show success-shaped messages when no backend exists.

## Not covered

Physical device handoff, real payment processing, order fulfillment, verified inventory, real email delivery, newsletter opt-in persistence, gift-card issuance/redemption, recurring billing, event registration, and catering notification require owner approval and external integrations. No production deployment was performed.
