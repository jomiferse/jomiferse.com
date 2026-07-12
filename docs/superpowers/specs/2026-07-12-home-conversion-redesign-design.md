# Home Conversion Redesign — Design Specification

**Date:** 2026-07-12  
**Status:** Approved  
**Routes:** `/es/` and `/en/`

## Objective

Redesign the localized home page to generate more qualified enquiries from small businesses, independent professionals, and founders. The page should feel like a credible technology consultancy while making it clear that clients work directly with José Miguel.

The redesign should reduce the current text-heavy, card-heavy portfolio feel. It should present business outcomes first, make the service offer understandable without technical knowledge, and establish trust before asking visitors to contact.

## Positioning

The approved positioning is **an independent specialist with the presence of a professional consultancy**.

This direction combines:

- the clarity and confidence of a consultancy website;
- the accountability and direct communication of an independent professional;
- enough technical depth to reassure founders and technical buyers;
- language focused on business needs instead of a technology inventory.

The page must not imply that José Miguel leads a larger agency or team. First-person copy and the direct-contact message should preserve this distinction.

## Audience and Conversion Goal

Primary audiences:

1. Small businesses that need a professional website or redesign.
2. Professionals who need a credible digital presence or want to reduce repetitive work.
3. Founders who need a web application, integration, automation, or maintainable backend.

The primary conversion is a visit to the localized contact page. The primary CTA should invite the visitor to explain what they need, using clear, low-pressure language. The secondary conversion is exploration of the most relevant service category or a project case study.

## Visual Direction

The visual language should feel established, practical, and human:

- predominantly light surfaces with deep navy for authority and a warm accent for actions;
- large, compact headlines with restrained body copy;
- spacious editorial sections instead of repeated floating cards;
- asymmetric layouts and full-width bands to create pace;
- one substantial visual in the hero and project section rather than decorative imagery throughout;
- imagery associated with real work, collaboration, products, or business operations;
- subtle entrance and hover motion that respects `prefers-reduced-motion`;
- a complete dark-mode treatment rather than a mechanically inverted light design.

The design takes structural inspiration from established consultancy websites, including Solusoft, while using original layouts, copy, colors, and assets.

## Information Architecture

### 1. Hero

The hero should communicate the business outcome before listing technologies.

Content hierarchy:

- short service-category eyebrow;
- outcome-led headline;
- one concise supporting paragraph naming the three target audiences;
- primary contact CTA;
- secondary services CTA;
- prominent visual;
- short direct-contact trust message attached to or adjacent to the visual.

The hero must fit its essential message and primary action within the first desktop viewport and remain legible without awkward line breaks on small mobile screens.

### 2. Trust Strip

A compact horizontal section should establish confidence immediately after the hero. It uses the verified years of experience already present in the CV plus three concise signals: full-stack coverage, direct communication, and remote availability.

No invented client counts, recommendations, percentages, or commercial outcomes are allowed.

### 3. Needs-Based Services

The seven existing services should be grouped into three buyer needs:

1. **Build trust online** — business websites and website redesigns.
2. **Reduce manual work** — internal tools, workflow automation, and API integrations.
3. **Build custom software** — custom web applications and Spring Boot backend work.

Each group should include a short problem-oriented description and link to the most relevant service destination. Visitors must be able to understand the distinction without knowing the implementation technology.

### 4. Featured Project

Replace the current row of similarly weighted project cards with one strong featured case study. Its narrative should follow:

- initial problem or operational context;
- solution built;
- verified result or concrete capability delivered;
- link to the full project detail when available.

If no verified numeric result exists, use a specific qualitative result rather than fabricating a metric.

### 5. Working Process

Use a concise three-step process:

1. Understand the situation and desired outcome.
2. Propose the smallest appropriate solution and scope.
3. Build, communicate progress, and deliver a maintainable result.

This section should reduce perceived buying risk and reinforce direct collaboration.

### 6. Evidence-Based Trust

No verified testimonial is currently stored in the repository. This section therefore uses factual trust signals based on existing public experience and project evidence. It must not contain placeholder quotation marks, anonymous praise, or invented company logos.

### 7. Final CTA

End with a visually distinct invitation to describe the project. The copy should set an honest expectation: José Miguel will review the context and say clearly whether he can help.

## Content Strategy

Spanish and English copy should express equivalent intent without literal translation. Both versions should:

- use short, concrete sentences;
- lead with recognizable business problems and outcomes;
- avoid exaggerated promises and generic transformation language;
- retain relevant SEO language naturally, including freelance full-stack development, websites, automation, integrations, custom applications, and Spring Boot backends;
- link internally to localized service and project routes;
- keep technical stack details as supporting evidence rather than a main section.

The existing standalone about and technology sections should be removed from the home or compressed into contextual proof within other sections. Their useful content remains available on dedicated pages.

## Component and Data Design

The localized page remains an Astro static route. The implementation should split the home into focused presentation components when doing so improves readability, with likely boundaries around:

- hero and trust strip;
- needs-based service groups;
- featured project;
- process;
- social proof or factual trust fallback;
- final CTA.

Public copy remains in `src/i18n/en.json` and `src/i18n/es.json`. Services continue to come from the typed service definitions. Project evidence should use the existing CV/project data or the shared project utilities already present in the repository.

Components should receive prepared content through explicit props and should not independently repeat locale or data-selection logic. The route selects locale data and featured content, then passes it to the presentation components.

## Responsive and Interaction Behavior

- Mobile layouts use a single, deliberate content flow with the primary CTA visible early.
- Desktop uses split layouts in the hero and featured project, plus one controlled overlap for the direct-contact trust message. Content order remains logical in the DOM.
- Repeated visual elements must have stable dimensions to avoid layout shift.
- Hover behavior must have keyboard-visible equivalents where the element is interactive.
- Motion is enhancement only; no meaning or access to content may depend on animation.
- Images use responsive sources, explicit dimensions, and localized meaningful alt text when informative. Decorative images use empty alt text.

## Accessibility and SEO

- Preserve one descriptive `h1` and a logical heading hierarchy.
- Maintain semantic landmarks and visible keyboard focus.
- Meet WCAG AA contrast for text and controls in light and dark themes.
- Keep the current localized canonical, alternate, breadcrumb, and profile structured-data behavior.
- Preserve indexable service terminology in visible copy rather than hiding it in metadata.
- Avoid client-side rendering for core content and links.

## Failure and Fallback Behavior

- If a hero or project image fails to load, the composition retains a branded background and stable dimensions.
- If a featured project lacks a numeric metric, it renders a verified qualitative outcome.
- The factual trust section renders without depending on testimonial data.
- If optional project highlights are absent, the page uses an existing status or capability without exposing empty UI.
- The home remains fully usable with JavaScript disabled.

## Validation

Implementation is complete only after:

- checking `/es/` and `/en/` on mobile and desktop widths;
- checking light and dark modes;
- checking keyboard navigation and reduced-motion behavior;
- checking all localized CTAs and internal links;
- checking that no unsupported metric, testimonial, or logo is shown;
- running formatting, Astro checks, lint, AI/SEO verification, and the production build;
- visually reviewing the generated page for layout shift, awkward wrapping, and image cropping.

## Out of Scope

- Redesigning service, project, blog, or contact page layouts.
- Rebranding the entire site or replacing the global design system.
- Adding a CMS, animation framework, or client-side application layer.
- Publishing fabricated testimonials, metrics, client logos, or case-study outcomes.
- Copying Solusoft assets, copy, or proprietary layout details.

## Success Criteria

The redesigned home succeeds when a first-time visitor can understand within a few seconds:

1. what José Miguel can improve or build;
2. who the service is for;
3. why working directly with him is credible;
4. which service or example is relevant;
5. how to start a conversation.

The page should feel visibly more professional and engaging than the current version while remaining fast, accessible, technically credible, and honest about the independent working model.
