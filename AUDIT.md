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
- Browser viewport checks at 320, 768, and 1440 CSS pixels found no horizontal overflow. Both map actions rendered at 48px high. Google Maps’ directions URL returned HTTP 200; the embed endpoint returned HTTP 200 on GET. The automated browser could not open the directions page directly, so handoff to the installed Google Maps app was not verified on physical Android/iPhone devices.

## Verification performed

| Check | Result |
|---|---|
| Static route render | All 17 pages loaded locally at 320, 768, and 1440 CSS pixels (51 route/viewport checks). No horizontal overflow, missing titles, or uncaught page errors were observed. |
| Navigation, metadata, internal links | All pages have the full primary navigation, a title, description, canonical, and valid local HTML links. |
| Catalog | Browser-tested search, category filtering, no-results feedback, and ascending/descending price sorting using preview values. |
| Preview cart | Tested adding two variants of one product, changing one variant’s quantity without affecting the other, removing one variant, persistence after reload, and the empty state. |
| Restricted commerce | Gift-card add action reports that the item is preview-only. Checkout has no payment inputs and clearly states no payment/order is collected. |
| Forms and FAQ | Tested empty contact-form validation, valid-but-unconnected contact and newsletter submissions (both report that nothing was sent), and FAQ no-match feedback. |
| Responsive/accessibility spot checks | Tested the mobile menu’s expanded state, search at 320px, and keyboard operation/pressed state of product gallery thumbnails. This is not a full WCAG audit. |
| Browser errors | No page errors or console errors were observed during the route and interaction checks. |
| Live deployment | The public homepage was opened; its 13 visible homepage images loaded in that check. Workspace changes were not deployed, and live routes were not re-tested after changes. |
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
