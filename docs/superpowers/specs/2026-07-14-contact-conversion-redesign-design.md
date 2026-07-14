# Contact Conversion Redesign

## Objective

Redesign `/contact` as a high-priority conversion page that makes starting a useful conversation feel quick and low-friction. The page must match the commercial visual language of the home, about, projects, and services pages while reducing the visible form to three fields.

The design takes directional inspiration from the direct contact choices on `consultoriainformatica.net/contacto/`, especially its prominent WhatsApp route and short form, without copying its wording or visual treatment.

## Audience and conversion goal

The primary audience is small businesses, independent professionals, founders, recruiters, and technical clients. The primary conversion is a qualified form enquiry. WhatsApp is the strongest alternative for users who prefer an immediate conversation; email and LinkedIn remain available as quieter alternatives.

## Page composition

### Hero and contact shell

Use a wide commercial page shell consistent with the rest of the site. The top contact area is a responsive two-column composition:

- Left column: eyebrow, short headline, concise explanation, three trust signals, and direct contact methods.
- Right column: the shared contact form inside the only large card-like surface in the section.

Approved Spanish hero copy:

- Eyebrow: `Primera valoración gratuita`
- Title: `Cuéntame qué quieres resolver.`
- Intro: `Explícame brevemente qué tienes ahora y qué te gustaría mejorar. Te responderé personalmente con el siguiente paso que considero más razonable.`
- Signals: `Sin compromiso`, `Trato directo`, `Respuesta personal`

English copy must preserve the same intent rather than translate literally.

On mobile, the order is hero copy, direct contact methods, and form. The form remains visible without requiring a secondary click or modal.

### Direct contact methods

Remove GitHub from the contact page. Present the remaining routes as restrained editorial rows rather than large stacked cards:

1. WhatsApp, visually prominent but secondary to the form submit action.
2. Email, showing the existing contact address.
3. LinkedIn, as a quieter professional route.

The form submit button remains the single red primary CTA. WhatsApp uses the normal secondary commercial button treatment with a small brand-green icon or signal; it must not introduce a competing full green button or a new page palette.

The WhatsApp link uses the existing number and a localized prefilled message that asks the visitor to describe what they want to improve.

## Simplified shared form

The visible form contains only:

- Name, required.
- Email, required and validated as email.
- Message, required.
- Submit button: `Enviar consulta` in Spanish with equivalent English intent.

Remove the project type selector and PDF attachment from both the UI and server-side email processing. Do not retain unused translation strings or attachment handling.

The existing hidden context remains intact:

- Locale.
- Selected service.
- Selected pricing scope.
- Source category.
- Source path.

When service and scope are present, show the existing compact enquiry summary above the three visible fields. This behavior must continue to work when the shared form is rendered in service-page contact modals.

Below the submit action, show a short data-use note with a localized link to the privacy page. The note explains that submitted details are used to answer the enquiry; it does not make broader legal-compliance claims.

## Submission and error states

Keep progressive enhancement: the form must submit through the native `POST /api/contact` flow without requiring client-side JavaScript.

The endpoint validates name, email, and message. Project type and attachment are no longer required, read, stored, or included in the email body. Selected service, scope, locale, and source context remain validated and included when present.

After processing, redirect to the localized contact page with a query status:

- `sent=1`: localized success banner.
- `error=missing`: localized incomplete-fields banner.
- `error=send`: localized temporary-error banner with WhatsApp and email alternatives.

The server should catch email-provider failures and avoid exposing provider or credential details. The form continues to rely on native browser validation for the common missing-field path, while the server remains authoritative.

## Technology platform marquee

Add a full-width section below the contact shell titled:

- Spanish: `Tecnologías y plataformas con las que trabajo`
- English: equivalent intent.

It is explicitly a technology/platform list, not a partner, collaborator, client, certification, or endorsement claim.

Approved set:

1. Java
2. Spring Boot
3. Docker
4. Kubernetes
5. React
6. Astro
7. PostgreSQL
8. Redis
9. Apache Kafka
10. WordPress

Use locally stored, optimized SVG brand marks. Each item displays a recognizable mark and readable name. The presentation is restrained and mostly monochrome so the commercial red and navy hierarchy remains dominant. Brand marks are not links.

The marquee moves continuously from right to left at a slow, even speed. Duplicate visual content used to create the seamless loop is hidden from assistive technology. Its labelled viewport is focusable specifically so keyboard users can pause the animation by focusing it; hover pauses it for pointer users. Under `prefers-reduced-motion: reduce`, disable the animation and show one static wrapping grid. The track must never create page-level horizontal overflow.

## Components and boundaries

- `src/pages/[locale]/contact.astro`: page composition, contact methods, status banners, WhatsApp URL, and marquee placement.
- `src/components/forms/ContactForm.astro`: shared three-field form, hidden selection context, enquiry summary, and privacy note.
- `src/components/contact/ContactTechnologyMarquee.astro`: technology list rendering, duplicated visual track, animation, and reduced-motion behavior.
- `src/pages/api/contact.ts`: three-field validation, email delivery, safe error redirects, and retained source/service context.
- `src/i18n/es.json` and `src/i18n/en.json`: equivalent public copy, form labels, statuses, privacy note, and marquee label.
- `src/icons/`: local brand SVGs needed by the approved technology set.

No unrelated header, footer, service, SEO, or global palette redesign is included.

## Responsive and visual requirements

- Use the established wide commercial shell and current header/footer.
- Use `var(--home-navy)` for headings and `var(--action)` for the primary form CTA and small conversion cues.
- Use existing surface and border variables in both themes.
- Avoid additional decorative card stacks.
- Verify at 1440x900 and 390x844.
- No horizontal overflow at either width.
- Main actions remain at least 44px high.
- Fields, labels, statuses, and privacy text remain readable in light and dark mode.

## Accessibility

- Preserve semantic labels, autocomplete attributes, required state, and visible keyboard focus.
- Status banners use an appropriate live-region treatment without announcing hidden content on initial load.
- WhatsApp and external LinkedIn links have clear accessible names and safe external-link attributes.
- Decorative duplicate marquee items are `aria-hidden`.
- The marquee viewport has a descriptive accessible label explaining that focus pauses movement; it does not add focus stops to every brand item.
- Reduced-motion users receive a static technology grid.
- The layout and form remain usable by keyboard at desktop and mobile widths.

## Verification

Add or extend a contact redesign verification script that protects:

- Removal of GitHub, project type, and attachment from the contact flow.
- Presence of WhatsApp, three visible form fields, hidden commercial context, privacy note, and localized statuses.
- The approved technology list and non-partner wording.
- Marquee pause, reduced-motion, and accessibility markers.
- Safe API validation and redirect states.

Run formatting, Astro check, lint, contact verification, conversion CTA verification, AI/SEO verification, and a production build. Manually inspect Spanish and English in light and dark themes at required desktop and mobile sizes, including a service-origin enquiry and both success and error status states.
