# Project service sidebar card redesign

## Objective

Redesign the sticky card on localized project detail pages so its primary purpose is to lead visitors toward the service related to the case study. Technologies remain visible as evidence of technical capability, but they no longer compete with the commercial action.

## Scope

The change applies to the sidebar used by every `/es/projects/[project]/` and `/en/projects/[project]/` page. It covers the service presentation, technology treatment, related-service button, optional external-project link, responsive behavior, light and dark themes, and project redesign verification.

It does not alter project routes, project content, the final full-width assessment CTA, shared header or footer, archive cards, or structured data.

## Component boundary

Extract the sidebar into a focused `ProjectServiceCard.astro` component instead of adding more presentation logic to the dynamic project page. The component receives:

- The complete technology list.
- The related service URL and localized action label when available.
- The optional external project URL.
- Localized labels for the service eyebrow, supporting sentence, technology heading, and external link.

The project detail page remains responsible for reading project data. The component is responsible only for presentation and technology-icon selection.

If a project has no related service, the service introduction and primary action are omitted and the card presents the technology evidence without leaving empty space. If a project has no external URL, the secondary external action is omitted.

## Visual hierarchy

The card uses a restrained commercial treatment consistent with the home, About, and project CTA sections:

1. A compact action-colored icon tile and the localized eyebrow “Related service” or “Servicio relacionado”.
2. A short localized sentence explaining that the demonstrated capability is available as a service.
3. The existing project-specific service label rendered as a full-width `button-action` with an `arrow-right` icon.
4. A subtle divider.
5. A localized technology heading followed by compact icon labels.
6. The external project link, when present, as a quieter text action with `move-up-right`.

The surface uses a subtle action-color radial gradient, a warm-tinted border, the existing card radius, and a restrained shadow. It must remain visually quieter than the final page CTA.

## Technology icons

Every technology label includes a small icon so the list feels intentional rather than like an unstructured cloud of pills. Existing brand icons are used where the repository already provides them, including Spring Boot, Docker, Kubernetes, PostgreSQL, RabbitMQ, Kafka, and Liquibase.

Other technologies use a small set of semantic fallbacks:

- `code` for languages, frameworks, build tools, and general development tools.
- `globe` for HTTP and WebSocket technologies.
- `git-branch` for messaging, RPC, and distributed communication.
- `cloud` for cloud and deployment tooling.
- `layers` for storage, data, and platform components.

Icon selection is deterministic and case-insensitive. Unknown technologies fall back to `code`; they never render a missing icon or an empty placeholder.

## Responsive behavior

On desktop, the card remains sticky within the existing 19rem sidebar. Technology labels wrap naturally without horizontal overflow, and long labels may span the available width rather than being truncated.

On mobile and tablet, the card returns to normal document flow, uses the available width, and keeps the primary action full width. Touch targets remain at least 44px high.

## Accessibility and interaction

- Decorative icons use `aria-hidden="true"`.
- The related service and external project remain semantic links.
- The primary action uses the existing accessible `button-action` focus and hover treatment.
- Text and borders use the existing theme variables for accessible light and dark mode contrast.
- No JavaScript, hover-only content, or animation is required.

## Localization

Add equivalent Spanish and English copy under `projects.detail.serviceCard` for the service eyebrow and supporting sentence. Reuse the existing project-specific `caseStudy.serviceLabel`, `projects.detail.technologies`, and `projects.detail.externalLink` values instead of duplicating action labels.

## Verification

- Extend `scripts/verify-project-redesign.mjs` to require the extracted component, service-first ordering, `button-action`, action arrow, technology icon mapping, fallback icon, and localized copy.
- Verify behavior for a project with both related-service and external links, a client project without an external link, and both locales.
- Run `pnpm run format`, `pnpm run check`, `pnpm run lint`, `pnpm run format:check`, `pnpm run verify:project-pages`, the project redesign verifier, and `pnpm run build`.
- Manually inspect representative Spanish and English project detail pages at 390 × 844 and 1440 × 900 in light and dark themes, confirming there is no horizontal overflow.
