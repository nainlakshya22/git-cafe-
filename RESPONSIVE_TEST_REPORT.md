# Responsive Test Report

**Test date:** 2026-11-14  
**Method:** Playwright-controlled browser viewport matrix. The browser device-pixel ratio was 1.25; test dimensions were adjusted to achieve the exact CSS viewport widths below.

## Result

**153/153 page/viewport combinations passed** the horizontal-overflow/layout check: all 17 pages at all 9 requested widths. No horizontal overflow was observed.

| CSS viewport width | Target class |
|---:|---|
| 1920px | Large desktop |
| 1440px | Desktop |
| 1366px | Laptop |
| 1024px | Small laptop / large tablet |
| 768px | Tablet |
| 430px | Large phone |
| 390px | iPhone-sized phone |
| 375px | Small phone |
| 320px | Narrow phone |

## Page coverage

Every page below passed at all nine widths listed above.

| Page | Result | Notes |
|---|---|---|
| `index.html` | PASS | No horizontal overflow. |
| `shop.html` | PASS | Catalog and filter layout fit. |
| `coffee.html` | PASS | Catalog and filter layout fit. |
| `drinks.html` | PASS | Product cards fit. |
| `merch.html` | PASS | Product cards fit. |
| `gift-cards.html` | PASS | Product cards fit. |
| `subscriptions.html` | PASS | Product cards fit. |
| `story.html` | PASS | No horizontal overflow. |
| `events.html` | PASS | No horizontal overflow. |
| `catering.html` | PASS | Form/content layout fits. |
| `faq.html` | PASS | Search and FAQ content fit. |
| `contact.html` | PASS | Address, actions, map, and contact form fit. |
| `menu.html` | PASS | No horizontal overflow. |
| `gallery.html` | PASS | Gallery images scale without overflow. |
| `product.html` | PASS | Product image, options, and controls fit. |
| `cart.html` | PASS | Cart rows and controls fit. |
| `checkout.html` | PASS | Safe checkout disclosure and summary fit. |

## Mobile interaction checks

| Check | Expected | Actual | Result |
|---|---|---|---|
| Mobile menu | Opens/closes and supports navigation without overflow. | Toggle and expanded state worked. | PASS |
| Map container at 390 CSS px | Remains within viewport. | Iframe right edge measured 361.6px. | PASS |
| Directions buttons at 390 CSS px | Readable, tappable controls. | Both links measured 48px tall. | PASS |
| Address | Full address remains readable. | Street, city, province, postal code, and country rendered. | PASS |
| Product/catalog cards | Maintain responsive layout. | No horizontal overflow at all tested widths. | PASS |
| Forms | Inputs and validation controls remain usable. | No overflow observed in the matrix. | PASS |

## Limitations

These are browser viewport simulations, not physical-device tests. Android/iPhone operating-system behavior, real touch ergonomics, installed Google Maps app handoff, browser zoom, and device-specific font rendering were not verified. Desktop and mobile screenshots were captured during the browser session; screenshots are not committed to the repository.
