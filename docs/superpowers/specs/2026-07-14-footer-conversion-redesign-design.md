# Footer Conversion Redesign

## Objective

Redesign the shared site footer as a conversion-first editorial surface that matches the commercial visual language established by the home page and the redesigned header. The footer must help visitors take the next step, understand the main services, and find direct contact routes without becoming an oversized directory.

The structure takes directional inspiration from the information hierarchy of the [Euroinnova footer](https://www.euroinnova.com/): a clear conversion or trust area, grouped navigation, direct contact routes, and a separate legal close. It must not copy Euroinnova's scale, content density, branding, or education-specific navigation.

## Audience and conversion goal

The footer serves small businesses, independent professionals, founders, recruiters, and technical clients across every public page.

Its primary conversion is a click to the localized contact page with the existing free-assessment context:

- Spanish: `/es/contact?service=assessment`
- English: `/en/contact?service=assessment`

WhatsApp, email, and LinkedIn remain direct alternatives, but they must not compete visually with the primary assessment CTA.

## Overall composition

The footer is a full-width, dark editorial surface with an inner maximum width of `88rem`, aligned with the redesigned header and wide commercial pages. It contains three horizontal zones:

1. A prominent conversion band.
2. A grouped identity, navigation, services, and contact area.
3. A compact legal and utility close.

The zones use spacing and restrained dividers rather than stacked cards. The footer must feel like a deliberate final chapter of each page, not a separate generic component pasted underneath it.

## Conversion band

The first zone is the visual priority.

Approved Spanish copy:

- Eyebrow: `Primera valoración gratuita`
- Title: `¿Tienes algo que mejorar, construir o automatizar?`
- Description: `Cuéntame qué necesitas y te propondré el siguiente paso más razonable.`
- CTA: `Solicitar valoración gratuita`

English copy must preserve the same direct, practical intent rather than translate it literally.

On desktop, the message occupies the wider left side and the CTA aligns to the right. On mobile, eyebrow, title, description, and full-width CTA stack in that order. There is no surrounding card and no secondary button in this zone.

## Identity, services, exploration, and contact

The middle zone is a four-block desktop grid.

### Identity

Show:

- `José Miguel Fernández`
- Spanish descriptor: `Desarrollo web, software a medida y automatización con trato directo.`
- English equivalent with the same commercial meaning.
- Availability signal: `Disponible para nuevos proyectos · Trabajo remoto` with an English equivalent.

The availability signal uses a small action-colour dot. It is a current positioning statement, not a promise about response time or capacity.

### Priority services

Show six localized service links:

1. Business websites.
2. Website redesign.
3. Custom software.
4. Internal tools.
5. Process automation.
6. Spring Boot backend.

The group ends with a distinct `View all services` link to the localized services hub. The implementation must reuse known localized service routes rather than invent new slugs.

### Explore

Show links to:

- Projects.
- About.
- Blog.
- Contact.

### Direct contact

Show:

- WhatsApp.
- Email.
- LinkedIn.

Each route has a restrained icon and a directional cue. External links use safe external-link attributes and clear accessible names. GitHub is removed from the footer because the approved goal is commercial contact rather than repository discovery.

## Mobile disclosure behavior

On narrow screens, the identity and direct-contact blocks remain visible. The Services and Explore groups use native, accessible disclosure controls so the footer does not become excessively tall.

The disclosures must:

- Work without client-side JavaScript.
- Expose a visible expanded/collapsed indicator.
- Preserve keyboard operation and focus visibility.
- Keep link targets at a comfortable touch size.

The component renders both variants from the same service and exploration data arrays: ordinary expanded navigation groups for desktop and native disclosure groups for mobile. Responsive `display` rules ensure only one variant is rendered visually or exposed to assistive technology at each breakpoint. This avoids JavaScript-driven viewport state and keeps desktop navigation permanently visible while mobile navigation remains collapsible.

## Legal and utility close

The final zone contains:

- Dynamic current-year copyright and José Miguel's name.
- Privacy link.
- Cookie-settings action using the existing cookie-consent event flow.
- Back-to-top link.

On desktop, copyright aligns left and utility links align right. On mobile, the content wraps into two readable rows without reducing the text to an overly small size.

## Visual direction

The footer uses the established commercial palette:

- A deep navy footer background in light mode.
- A subtly separated dark surface in dark mode.
- Light primary typography and blue-grey secondary copy.
- `var(--action)` for the eyebrow, availability cue, interaction states, and primary CTA.

Add only restrained atmosphere: a very subtle grid and a low-opacity action-colour glow in one corner. Do not introduce cyan as a competing commercial accent.

The CTA uses the same pill treatment and interaction language as other primary buttons. Link groups use editorial text rows with clear hover and focus states rather than small decorative cards. Dividers remain low contrast but visible in both themes.

## Components and boundaries

- `src/components/common/Footer.astro`: owns the complete semantic footer composition, localized route definitions and shared link arrays, responsive navigation variants, CV-backed contact values, year, and cookie-settings trigger.
- `src/i18n/es.json` and `src/i18n/en.json`: own all new public footer copy and equivalent link labels.
- `src/styles/global.css`: owns reusable footer layout, colour, interaction, responsive, and disclosure styling.
- `src/layouts/BaseLayout.astro`: continues to render a single shared footer for every page. No route-specific footer variants are introduced.

No separate client controller is required. Native links and disclosure elements cover the interaction model, and the existing cookie-consent listener handles the settings action.

## Accessibility

- Keep a semantic `footer` landmark and localized navigation labels.
- Use heading hierarchy that does not conflict with page content; group titles may use visually styled paragraphs where a heading would create an incorrect outline.
- Maintain at least 44px effective touch targets for primary actions and mobile disclosure controls.
- Preserve visible focus states against the dark surface.
- Do not rely on colour alone for availability, active, or expanded state.
- Decorative grid, glow, and icons are hidden from assistive technology.
- External contact routes announce their destination clearly.
- Respect `prefers-reduced-motion` for any small arrow or underline transition.

## Responsive requirements

- Required desktop check: `1440 × 900`.
- Required mobile check: `390 × 844`.
- No horizontal overflow at either size.
- Desktop uses the full `88rem` inner shell where available.
- The conversion band changes from split layout to a single column before the CTA becomes cramped.
- Service and Explore disclosures only become collapsible on mobile; desktop groups remain visibly expanded.
- Long English labels must wrap naturally without changing column widths or pushing utilities outside the viewport.

## Verification

Add a focused footer-redesign verification script or extend an existing shared-layout verifier to protect:

- Presence of the localized assessment CTA and correct query context.
- The approved identity, availability, six priority services, Explore group, and direct-contact routes.
- Removal of GitHub from the footer.
- Native mobile disclosure markers.
- Cookie-settings integration and back-to-top utility.
- Required responsive and dark-mode CSS markers.

Run:

- `pnpm run format`.
- `pnpm run check`.
- `pnpm run lint`.
- `pnpm run format:check`.
- The footer-specific verifier.
- `pnpm run verify:ai-seo`.
- `pnpm run build`.

Manually inspect Spanish and English versions at the required desktop and mobile sizes, in light and dark themes. Confirm CTA priority, disclosure behavior, contact links, visible focus, cookie-settings behavior, and absence of horizontal overflow.

## Out of scope

- Newsletter subscription.
- Technology or partner logos already represented elsewhere.
- GitHub promotion.
- Route-specific footer variants.
- New analytics events.
- Changes to the contact form or service-page content.
- Changes to the header.
