# Popup System Redesign

## Objective

Redesign every popup-like surface as one coherent, accessible system that matches the commercial visual language used by the home, services, contact, projects, header, and footer. The system must feel editorial and professional rather than like a generic SaaS overlay or an aggressive sales funnel.

The redesign covers:

1. The initial cookie consent banner.
2. The cookie settings dialog.
3. The exit-intent dialog.
4. The contact dialog.
5. The project detail dialog opened from project cards.

The normal mobile navigation overlay is not part of this redesign.

## Approved Visual Direction

Use the approved **A · Editorial professional** direction:

- `var(--home-navy)` for headings in light mode and the existing theme equivalents in dark mode.
- `var(--action)` for the top signal line, eyebrow labels, icons, active states, and the single primary conversion action.
- Restrained surfaces using the existing surface and border variables.
- Thin dividers, compact spacing, strong typography, and minimal decoration.
- No cyan commercial accent, glassmorphism-heavy treatment, proof-chip clutter, or oversized sales copy.
- A blurred dark backdrop for modal dialogs and a restrained shadow that works in both themes.

Every dialog uses a common visual shell: a narrow action-coloured top edge, rounded surface, clear header, circular close control, optional body scrolling, and a predictable action area. The cookie banner uses the same tokens but remains a non-modal floating region.

## Shared Architecture

Introduce a small reusable dialog shell and shared popup styles instead of maintaining five unrelated treatments. The shell owns:

- Native `<dialog>` markup.
- Width variants for compact, standard, form, and detail dialogs.
- Backdrop, surface, border, shadow, and opening motion.
- Header and close-control placement.
- Maximum viewport height and internal scrolling.
- Shared focus-visible and reduced-motion states.

Individual components keep responsibility for their own content and behavior. The shared shell must not contain cookie logic, contact submission logic, exit-intent detection, or project data.

The global contact dialog and global exit-intent dialog are mounted from `BaseLayout.astro` so they are available consistently across localized public pages. Existing service-only copies of those dialogs are removed after their triggers are migrated.

## Cookie Consent Banner

The initial consent prompt remains a non-modal region because users must still be able to inspect the page and privacy policy.

### Desktop

- Horizontal floating banner with a readable text column and a compact action group.
- Maximum width aligned with the editorial page rhythm rather than spanning the entire viewport.
- Reject and accept actions have equal target size and are equally easy to reach.
- Configure is visually secondary but remains a full button, not a hidden text link.

### Mobile

- Compact stacked surface with 12–16 px viewport margins.
- Text reduced to the essential explanation and privacy link.
- Full-width actions with comfortable touch targets.
- It must not cover the entire viewport at 390 × 844.

The consent storage format, Google Consent Mode behavior, analytics loading rules, and privacy link behavior remain unchanged.

## Cookie Settings Dialog

- Standard dialog width: `min(38rem, calc(100vw - 2rem))`.
- Short header with privacy eyebrow, title, description, and close control.
- Two editorial rows: required cookies and analytics.
- Required cookies show a clear always-active status.
- Analytics uses an accessible native checkbox styled as a switch while preserving keyboard and screen-reader behavior.
- The footer keeps Close and Save actions visible and distinct.
- Opening the dialog synchronizes the control with stored preferences.
- Saving updates consent, hides the initial banner when appropriate, closes the dialog, and restores focus.

This dialog is functional rather than commercial: it does not use conversion language or sales signals.

## Global Exit-Intent Dialog

Rename and generalize the existing service-only exit-intent component.

### Coverage

The dialog is available on all localized public pages except:

- `/contact`, because the visitor is already completing the desired action.
- `/privacy`, because a legal or consent task must not be interrupted.

It appears at most once per browser session across the entire site, not once per route.

### Activation

- Desktop/fine pointer: mouse leaves through the top of the viewport after at least 15 seconds of engagement or after the visitor has scrolled at least 25% of the page.
- Mobile/coarse pointer: at least 25 seconds on the page and at least 50% scroll depth.
- Do not show while another `<dialog>` is open.
- Do not show while the unresolved cookie banner is visible.
- Do not show when the document is hidden.
- Mark the prompt as shown when it opens so route changes cannot immediately display it again.

### Contextual Copy

- Service detail: reference the current service.
- Project detail or project hub: “Do you have a similar challenge?” intent.
- Blog article or blog hub: help applying or clarifying the topic.
- Home, about, and other pages: generic improve, build, or automate intent.

The context may be derived from the localized route family, with an optional title supplied by detail pages when useful.

### Content and Actions

- Short eyebrow and title.
- One concise explanatory paragraph.
- Two restrained trust signals: no commitment and a clear reply.
- One red primary action that closes the exit dialog and opens the contact dialog.
- WhatsApp as the secondary action.
- “Keep browsing” as a quiet dismiss action.
- Initial focus must not land on the primary CTA.

## Global Contact Dialog

The global contact dialog is available to explicit popup triggers and the exit-intent dialog. Normal page CTAs continue to navigate to `/contact`; the website must keep a stable, linkable contact page and must not turn all navigation into modal interactions.

### Content

- Form fields: name, email, and message only.
- Hidden source category and source path.
- Optional service and pricing-scope context.
- When context exists, show it in one compact editorial summary row above the fields.
- Primary red submit button.
- WhatsApp as a secondary alternative.
- Privacy note and link remain visible.

### Submission States

Progressively enhance modal submissions:

- `idle`: editable form.
- `submitting`: disabled submit action with a clear live status.
- `success`: inline confirmation inside the dialog; no page navigation.
- `validation error`: keep entered values and focus the first invalid field.
- `delivery/network error`: inline message with WhatsApp and email fallbacks.

Without JavaScript, the existing form POST and redirect to `/contact` remain the fallback. The API contract remains compatible with the current contact page.

Opening the dialog records and restores the triggering element. When opened from exit intent, close the exit dialog before opening contact so two modal dialogs are never stacked.

## Project Detail Dialog

- Use the shared editorial shell with the wider detail variant: `min(47.5rem, calc(100vw - 2rem))`.
- Preserve a clear title, optional status, context, summary, highlights, technologies, and external project action when those values exist.
- Replace decorative nested cards with editorial rows and dividers.
- Keep body scrolling inside the dialog when content exceeds the safe viewport height.
- Convert the card opener from a `div` with `role="button"` and inline handlers to a semantic `button type="button"` with delegated behavior.
- Clicking the backdrop and pressing Escape close the dialog.
- Focus returns to the originating project card.

This redesign changes presentation and interaction semantics, not project data or project routes.

## Accessibility Requirements

- Use native `<dialog>` for modal surfaces.
- Provide `aria-labelledby` and `aria-describedby` where descriptions exist.
- Close controls have localized accessible names and at least 44 × 44 px targets.
- Escape closes every modal unless a blocking operation makes closure unsafe; no current flow requires blocking closure.
- Backdrop clicks close exit, contact, cookie settings, and project dialogs.
- Focus is restored to the exact opener.
- Contact opens with focus on the name field; cookie settings opens with an appropriate safe control; exit intent does not autofocus its primary CTA.
- Visible focus meets contrast requirements in light and dark themes.
- No dialog can open while another is open.
- `prefers-reduced-motion` disables dialog and decorative signal animations.
- Mobile layouts at 390 × 844 keep the close button, title, and at least one safe action reachable without horizontal scrolling.

## Theme and Responsive Behavior

- Required checks: 1440 px desktop and 390 px mobile.
- All surfaces use the existing light/dark theme variables; no hard-coded light-only panel.
- Modal widths are capped with viewport-safe margins.
- Modal height uses dynamic viewport units and internal body scrolling.
- Fixed action areas must not hide focused controls.
- The cookie banner and exit-intent system coordinate so they never compete for the same viewport.

## Testing and Verification

Add a dedicated popup-system verifier and focused behavior tests. Verification must cover:

- All five popup surfaces use the shared visual contract.
- The global exit and contact components are mounted through `BaseLayout`.
- Service pages no longer mount duplicate dialog instances.
- Exit intent is once per session, respects desktop/mobile thresholds, and excludes contact/privacy.
- Cookie banner suppresses exit intent until a preference is stored.
- Dialog stacking is prevented.
- Focus is restored after close and primary CTA is not autofocus in exit intent.
- Contact form state transitions and no-JavaScript fallback.
- Cookie preference persistence and analytics consent behavior.
- Project card semantic triggers and dialog closing behavior.
- Spanish and English copy.
- Light mode, dark mode, keyboard operation, 1440 px, and 390 px without overflow.
- `pnpm run check`, `pnpm run lint`, `pnpm run format:check`, `pnpm run verify:ai-seo`, and `pnpm run build` remain green.

## Out of Scope

- Rewriting the contact delivery provider or changing Resend configuration.
- Changing analytics vendors or cookie categories beyond required and analytics.
- Replacing the mobile navigation overlay.
- Making every standard CTA open a modal.
- Changing project content, service pricing, or page-level conversion sections.
