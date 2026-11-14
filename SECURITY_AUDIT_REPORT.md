# Security Audit Report

**Audit date:** 2026-11-14  
**Scope:** Static repository and browser behavior, client-side storage/forms, exposed credential scan, and the declared checkout/map flows. This is a limited review, not a penetration test or a guarantee of security.

## Executive summary

No exposed API key or credential was found in the inspected source. The site is a static preview with no payment processor, order API, inventory service, newsletter endpoint, or contact-form backend. It does not collect payment details or claim to submit forms. The preview cart is stored in the user's browser and is not an order.

No exploitable vulnerability was confirmed in the tested scope. The absence of a backend limits the current attack surface, but it also means real commerce and message delivery cannot be enabled until trusted server-side integrations are built and reviewed.

## Checks

| Area | Expected secure behavior | Observed behavior | Status | Remaining issue |
|---|---|---|---|---|
| Secrets/API keys | No private credentials in client files. | No credentials/API keys found in inspected repository source. Map embed uses the listing's share URL without an API key. | PASS (scope-limited) | Re-scan during any future integration and keep secrets server-side. |
| Checkout/payment | Do not accept or imply payment without a secure provider/backend. | Checkout states that no payment/order can be created and exposes no payment inputs. | PASS (safe disclosure) | Real checkout is blocked pending provider, server API, tax/shipping rules, and order fulfillment. |
| Cart storage | Do not treat client storage as authoritative order data; handle malformed data visibly. | Cart is preview-only browser storage; malformed content warns, and default variants normalize. | PASS (preview) | Server must recalculate price, availability, and totals for a future order. |
| Contact/newsletter forms | Validate input and give truthful delivery status. | Client validation works; valid attempts state that nothing was sent. | PASS (no fake success) | Backend, email/list provider, consent handling, and spam protection are not configured. |
| Customer location | Do not request or store GPS automatically. | Directions use a fixed verified café destination and leave origin unspecified. | PASS | Google Maps itself may use location only under its own user consent/settings. |
| Google Maps embed | Use the official share/embed URL; avoid exposed private API keys. | Verified listing embed loaded; no API key is present. | PASS | Google receives the standard third-party embed request. Review privacy disclosures before launch. |
| Input/accessibility basics | Use labels and browser validation. | Form labels and client-side required/email checks were spot-checked. | PASS (basic) | Not a server-side security control; revalidate on any future backend. |
| DOM/catalog data | Keep untrusted content out of unsafe rendering contexts. | Current catalog is static same-origin source data; no user-submitted content is sent or rendered. | PASS (current data model) | Reassess/escape and validate if product content becomes remotely managed. |
| External links | Do not expose guessed social/contact destinations. | Unconfirmed social profiles and email are not linked. | PASS | Owner confirmation required. |
| Deployment headers | Review CSP, HSTS, and other response headers. | Not assessed in this repository/browser pass. | NOT TESTED | Verify Vercel response headers and define an appropriate policy before launch. |

## Launch blockers and recommendations

1. Do not collect card data in this static frontend. Use a reputable hosted payment flow with server-side order verification and secret management.
2. Validate product IDs, prices, inventory, variants, taxes, and shipping on the server; never trust browser cart totals.
3. Add spam protection, rate limiting, privacy/consent handling, and server-side validation to contact, catering, event, and newsletter endpoints.
4. Define and verify Vercel security headers, including an appropriate Content Security Policy, after cataloging required image, font, and map origins.
5. Confirm the café's data-retention/privacy policy before collecting customer or recipient information.
6. Run dependency, deployment, and security scans whenever dependencies or integrations are added. No dependency manifest or automated security scanner is currently configured.

## Testing limitations

No penetration test, authenticated backend test, dependency audit, formal threat model, certificate configuration review, security-header check, or privacy-law assessment was performed. No production deployment was changed.
