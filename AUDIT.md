# Glitter Bean Café — Repository Audit & Handoff

Audit date: 2026-11-14

## Executive summary

The repository is a small, static, multi-page website (17 HTML pages, one shared stylesheet, and two browser scripts). It has no application server, database, inventory source, order API, payment processor, subscription provider, email service, or deployment configuration in the tracked project.

The site is therefore a **website preview, not a production e-commerce system**. The cart is browser-local and uses unverified concept data. Checkout, recurring billing, gift card redemption, customer messages, newsletter enrollment, event registration, and catering inquiries must not be presented as completed transactions.

## Repository and current implementation

- Pages: home, shop, coffee, drinks, merchandise, gift cards, subscriptions, product detail, cart, checkout, menu, story, events, gallery, catering, FAQ, and contact.
- Shared catalog and interactions: `catalog.js` and `script.js`.
- Shared presentation: `styles.css`.
- Search-engine files: `sitemap.xml` and `robots.txt`.
- No package manifest or test/build runner is included.

## Findings and changes

| Priority | Finding | Status |
|---|---|---|
| Critical for launch | No verified backend or payment integration exists. Cart totals are client-side preview values; orders cannot be placed. | Clearly disclosed; checkout remains locked. |
| High | Address, phone, email, and social profile details were displayed without owner verification, with working-looking links. | The address and phone are now from the Google Maps business listing, and hours from the official Instagram profile; email and social links remain pending confirmation. |
| High | Product, menu, price, flavor, availability, event, and story content was not authoritative. Menu prices and unsupported story claims/quotes could be mistaken for real facts. | Menu prices and unsupported claims removed; product data/price are labeled as concepts, stock photography is identified, and approval needs are disclosed. |
| Medium | Cart update/remove controls matched only by product ID, so different variants of one product could affect each other. | Cart actions now match product and variant. |
| Medium | Quick Add stored an empty variant while product details stored the default variant, splitting the same product into duplicate cart rows. | Quick Add now uses the catalog's first variant; legacy empty-variant entries normalize to that default. |
| Medium | Product details showed a hardcoded “250g” label for non-coffee options and did not update it after selection. | The selected-option label now follows the product's available variants. |
| Medium | Shop and Coffee Collection did not offer alphabetical sorting. | Added tested A-to-Z sorting; popularity sorting remains unavailable until verified popularity data exists. |
| Low | FAQ instructed customers to email despite no confirmed email address being published. | Reworded the answer to avoid suggesting an unavailable contact method. |
| Low | Product preview, cart, and checkout routes were indexable and listed in the sitemap despite being non-production/concept pages. | Added `noindex,follow` and removed those routes from the sitemap. |
| Medium | Shop’s no-results notice lived inside the product grid and was removed when results rendered. | Moved the notice outside the grid; empty search results are visible. |
| Medium | Events and Contact navigation omitted Catering and FAQ. | Navigation is consistent across all 17 pages. |
| Medium | Gallery thumbnails used non-keyboard-operable `div` elements. | Replaced with buttons and added pressed-state updates for keyboard users. |
| Medium | Visual palette used saturated plum/teal gradients rather than the requested understated café palette. | Updated background colors to the requested cream, beige, plum, teal, and gold palette without changing image assets or layout. |
| Low | Shipping and tax summaries implied calculation despite having no rules or service. | Explicitly shown as “Not calculated.” |
| Informational | Static markup is duplicated across pages and can drift over time. | Kept the existing architecture; shared layout extraction would require a build/framework change and was not introduced. |

### Changes made

- Updated website backgrounds to the requested premium palette while preserving existing images, image URLs, and image sizing/positioning.
- Replaced unsupported contact/social links and unverified café details with explicit owner-confirmation placeholders.
- Labeled stock imagery as representative photography and removed claims that it depicts the café or team.
- Removed unsupported menu prices and story claims. Added owner-approval notices for missing business, product, and photo details.
- Marked catalog descriptions and prices as concept previews; product pages now update title and description metadata for the selected item.
- Fixed cart quantity/removal behavior for distinct variants and surfaced browser storage errors rather than silently reporting successful cart changes.
- Normalized Quick Add and legacy cart items to the product's default variant; malformed saved cart data now produces a visible warning.
- Updated the product detail selected-option label for all product variants.
- Added alphabetical sorting to Shop All and Coffee Collection. Popularity sorting remains blocked without verified ranking data.
- Removed an unsupported email instruction from the FAQ and excluded product-preview, cart, and checkout pages from search indexing.
- Added a visible no-results state for empty catalog searches.
- Made product gallery thumbnails keyboard-operable and exposed their selected state.
- Kept search available in the compact navigation at 320px without causing horizontal overflow.
- Kept gift cards and subscriptions out of the preview cart; no payment fields, order success state, or fake submission success was added.
- Updated shipping and tax labels to state that those values are not calculated.
- Added a responsive Contact & Visit location section with the verified address, an official Google Maps embed, directions, and a business-listing link.
- Added the phone number from the Maps listing and hours from the official Instagram bio; kept the email as an owner-confirmation placeholder.

## Location verification

- The [Google Maps business listing](https://www.google.com/maps/place/Glitter+Bean+Cafe+Co-op/@44.6407013,-63.5846952,17z/data=!3m1!4b1!4m6!3m5!1s0x4b5a236d028f7435:0x6ccb327aa04ea219!8m2!3d44.6407013!4d-63.5846952!16s%2Fg%2F11f6yxyrc7) identifies Glitter Bean Cafe Co-op at **5896 Spring Garden Rd, Halifax, NS B3H 0A6, Canada**, at 44.6407013, -63.5846952.
- The [official Instagram profile](https://www.instagram.com/glitterbeancafe/) identifies a Halifax café co-op, lists Mon–Fri 8am–5pm, Saturday 10am–5pm, and Sunday 11am–5pm, and an official post is tagged to the Glitter Bean Café Instagram location. The Maps listing shows phone **+1 902-407-5715**. A [DalOut event post](https://www.instagram.com/outdal/p/Dc9Nu6rT6W-/) independently displays the same street address. The provided Vercel preview previously had no address to corroborate or conflict with these sources.
- The map iframe uses the HTML copied from the business listing’s Google Maps **Embed a map** share dialog; no API key is required. Directions use the verified destination address without specifying an origin, so the site does not request or collect customer location.
- Both map actions opened their intended Google Maps destinations in browser tests; directions, listing, and embed returned HTTP 200. No physical Android/iPhone device was available to verify handoff to an installed Maps app.

## Verification performed

| Check | Result |
|---|---|
| Routes and navigation | All 17 routes returned HTTP 200 on the public baseline. The final local source rendered all 17 pages; 474 runtime internal-link instances and 289 source links resolved, with no broken targets or fragments. |
| Responsive | Tested all 17 pages at 9 exact CSS widths (1920, 1440, 1366, 1024, 768, 430, 390, 375, and 320): 153 combinations, no horizontal overflow. |
| Catalog and product details | Tested search and empty results, category filters, alphabetical/ascending/descending sort, all 20 Quick Add targets, all 20 product-detail routes, and all 43 variant options. Fourteen purchasable preview concepts entered the cart; six gift/subscription concepts remained blocked. Popularity sorting is blocked pending trusted data. |
| Preview cart | Tested Quick Add/default-variant consistency, legacy variant normalization, variant-specific quantities, subtotal updates, increment/decrement bounds, removal, persistence after reload, empty state, and warnings for malformed saved data. |
| Restricted commerce | Gift-card and subscription actions remain preview-only; checkout has no payment fields and states that no payment/order is collected. |
| Forms and FAQ | Tested invalid and valid contact/newsletter form attempts; both explicitly report that nothing was sent. FAQ matching and no-results states passed. |
| Images | All 69 rendered image instances loaded; no failed image requests were observed. No image assets or image URLs were modified. |
| Accessibility spot checks | All images have alt attributes; runtime inputs have accessible labels; mobile navigation exposes its expanded state; gallery buttons expose pressed state. This is not a full WCAG/contrast audit. |
| Google Maps | Directions and listing links opened the intended Google Maps pages (HTTP 200); the embed completed with HTTP 200. The map request can show `ERR_ABORTED` when navigation leaves the contact page before the embed finishes; a dedicated stay-on-page probe completed successfully. |
| Browser errors | No uncaught page errors or browser console errors were observed in the final local interaction run. |
| Live deployment | A fresh cache-busted public check matched the repository preview and all 17 live routes returned HTTP 200 before the current local repairs. These repairs have not been pushed or deployed. |
| Build, Lighthouse, Core Web Vitals | Not run. No project build/test setup is present; Node.js is unavailable in the environment. |

## Owner approval required before launch

Confirm the Maps listing phone number and Instagram hours remain current, provide a verified email and official social URLs, and approve café/team photography and usage rights; the café story and sourcing claims; real products, menu items, ingredients, sizes, prices, availability, and inventory; current events and registration details; whether catering or venue rental is offered and its terms; and all pickup/shipping, tax, and fulfillment rules.

Do not restore contact/social links or publish LocalBusiness/product/review structured data until the corresponding facts are confirmed. No customer testimonials or review markup are present.

## Integrations required for real transactions

- A server-side order/catalog/inventory source and secure payment provider (for example, an owner-selected commerce platform); server-side price, stock, tax, fulfillment, and payment-status validation.
- A recurring-billing provider and customer subscription management for subscriptions.
- A gift-card issuance, delivery, and redemption provider for digital gift cards.
- A protected contact/catering/event submission endpoint and owner-approved notification destination.
- A consent-compliant mailing-list provider and API credentials for newsletter enrollment.

No API keys or secrets were found or added. Keep credentials server-side; never put payment secrets in browser JavaScript.

## Deployment and release checklist

1. Obtain owner approvals listed above and replace concept copy/prices and stock photos with verified content.
2. Select and configure the required commerce, email, and payment providers; add credentials only as Vercel server-side environment variables.
3. Implement and test server-side validation, privacy/consent notices, fulfillment rules, and order confirmation against provider sandboxes.
4. Deploy the static preview/site through the repository’s Vercel project, then verify every live route, external integration, metadata URL, and image request.
5. Run Lighthouse and a complete keyboard/screen-reader/accessibility review on the deployed production build before enabling payments or public launch.

The current local changes are not a deployment and do not enable real ordering.
