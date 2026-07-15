# Pre-publication quality gate

`pnpm run quality` is the only automated gate required before publishing. It
runs formatting, lint, behavior tests, Astro validation, the production build,
and a semantic audit of the generated site.

## Replacement for the former validation scripts

The deleted `verify-*.mjs` files asserted exact source fragments and CSS class
names. Those checks duplicated the compiler or failed after harmless refactors.
Their useful responsibilities now have the following owners:

| Deleted validation                  | Maintained destination                                             |
| ----------------------------------- | ------------------------------------------------------------------ |
| `verify-about-merge`                | Astro build, lint, and the manual route review                     |
| `verify-ai-seo`                     | `tests/seo.test.ts` and `tests/build/site-artifact.test.ts`        |
| `verify-blog-commercial`            | `tests/blog-commercial.test.ts` and the build artifact audit       |
| `verify-blog-redesign`              | Build artifact audit and manual visual review                      |
| `verify-brand-assets`               | `tests/brand-mark.test.ts`; the asset generator remains available  |
| `verify-contact-redesign`           | Contact contract/handler tests and manual form review              |
| `verify-conversion-cta`             | Blog commercial tests, internal-link crawl, and manual CTA review  |
| `verify-footer-redesign`            | Astro build, internal-link crawl, and manual visual review         |
| `verify-global-background`          | Astro build and manual light/dark review                           |
| `verify-header-redesign`            | `tests/header-controller.test.ts` and manual keyboard review       |
| `verify-home-conversion`            | Build artifact audit and manual CTA review                         |
| `verify-popup-system`               | `tests/exit-intent.test.ts` and `tests/cookie-consent.test.ts`     |
| `verify-privacy-education-redesign` | Build artifact audit and manual route review                       |
| `verify-project-data`               | Astro type/build validation and the generated-route crawl          |
| `verify-project-pages`              | Build artifact audit and manual route review                       |
| `verify-project-redesign`           | Build artifact audit and manual visual review                      |
| `verify-service-redesign`           | Service alias tests, build artifact audit, and manual route review |
| `verify-theme-default`              | Consent tests and manual light/dark review                         |

Historical assertions about exact class names, element order, implementation
comments, and literal marketing copy were intentionally discarded. They are
not public behavior and should not be recreated under another filename.

## What the generated-site audit covers

After `pnpm run build`, `pnpm run test:build` crawls `dist/client` and the
generated Vercel routing manifest. It checks:

- public pages, internal links, localized alternates, canonical URLs, and one H1;
- valid JSON-LD with stable site/person entities and real article cover images;
- redirect-only service aliases, permanent redirect status, sitemap coverage,
  `robots.txt`, `llms.txt`, and the default social image;
- referenced images/assets, image delivery attributes, extracted CSS, and
  conservative HTML and inline-CSS budgets.

Draft exclusion is implemented at the publication helper and covered by
`tests/blog-publication.test.ts`; the artifact crawl then confirms only the
resulting public route set.

## Manual visual checklist

Run `pnpm run preview` after the automated gate and inspect representative home,
service, landing, blog, project, contact, privacy, and 404 pages.

- Review `/en` and `/es` at 390px and 1440px with no horizontal overflow.
- Review light and dark mode, including contrast and visible focus indicators.
- Navigate the header, dialogs, consent controls, forms, accordions, and language
  switcher using only the keyboard.
- Check the layout and reading order at 200% browser zoom.
- Confirm one clear primary CTA and correct localized destinations on commercial
  pages.
- Submit the contact form with JavaScript enabled and disabled when delivery or
  form code changes. A live delivery check requires configured Resend variables.

Visual changes should be reviewed intentionally. Add screenshot automation only
with stable baselines and an explicit human approval workflow.
