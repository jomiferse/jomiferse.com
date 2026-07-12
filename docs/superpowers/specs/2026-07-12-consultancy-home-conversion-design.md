# Consultancy Home Conversion — Design Specification

**Date:** 2026-07-12  
**Status:** Approved  
**Routes:** `/es/` and `/en/`

## Objective

Reorient the localized home page around the conversion model used by specialist IT consultancy websites. The primary goal is to generate qualified enquiries from small businesses, professionals, and founders by helping visitors identify the business area they want to improve and offering a free initial assessment.

The page must present José Miguel as an independent technology consultant with direct involvement in every project. It must never imply that he operates an agency or employs a team.

## Reference Boundary

`consultoriainformatica.net` is a reference for information architecture and conversion strategy only. The implementation uses original copy, visual identity, components, imagery, colors, and code.

The reusable conversion patterns are:

- an explicit consultancy category at the top;
- a two-column first viewport combining positioning and service discovery;
- a strong free-assessment offer;
- buyer-friendly areas of improvement;
- case evidence and credibility near the primary CTA;
- repeated contact access across the page.

## Primary Offer

The main CTA is a **free initial assessment**.

The assessment includes:

1. A brief review of the visitor's current situation and desired result.
2. A determination of whether José Miguel can help.
3. A practical recommendation for the next step.

It does not include a full audit, detailed technical report, implementation plan, or free consulting engagement. The page and contact form must communicate this boundary clearly.

Primary Spanish CTA: `Solicitar valoración gratuita`  
Primary English CTA: `Request a free assessment`

## Hero Architecture

The first desktop viewport uses a consultancy-style two-column layout below a concise centered page title.

### Left column

- Direct positioning statement focused on useful technology for real business problems.
- Short explanation of websites, automation, integrations, custom software, and backend support.
- Verified experience signal.
- Prominent free-assessment CTA.
- Secondary link to a real project or case study.
- One project visual or portrait-based trust asset.

### Right column

- Prompt asking the visitor which area they want to improve.
- A six-item service-discovery grid.
- Each item names a recognizable need, gives a one-sentence outcome, and links to an existing localized destination.

The six areas are:

1. Professional website and redesign.
2. Process automation.
3. Internal tools and dashboards.
4. API and business-tool integrations.
5. Custom web applications.
6. Spring Boot backend and maintenance.

On mobile, the left column appears first, followed immediately by the service selector. The primary CTA remains visible before the selector.

## Remaining Page Structure

### Assessment Explanation

A short section explains what the free assessment includes, what information the visitor should send, and what response to expect. It reduces uncertainty without presenting the assessment as a full unpaid audit.

### Case Evidence

Show one strong featured project plus links to additional work. Cases are described through context, work delivered, and verified outcomes or capabilities. No invented metrics, logos, testimonials, or client claims are allowed.

### Services by Business Result

Present the main services as business results rather than a technology catalogue:

- attract and reassure potential clients;
- reduce repetitive operational work;
- connect fragmented systems;
- build software that fits a specific workflow;
- improve or maintain an existing backend.

### Direct Working Model

Explain the three-step collaboration model: understand the situation, recommend the smallest suitable scope, and build or improve the solution. Reinforce that clients communicate directly with José Miguel.

### Final CTA

Repeat the free-assessment CTA with concise qualification language. Visitors should know that sending context is enough to start and that the response will be honest about fit.

## Navigation and CTA Behavior

- The header contact action uses the free-assessment language on the home route.
- The primary CTA appears in the hero and final section.
- A restrained persistent mobile contact action is allowed if it does not obscure content or the cookie interface.
- WhatsApp-style floating actions and aggressive popups are out of scope.
- All CTAs lead to the localized contact page and preserve the existing source-tracking behavior.

## Contact Qualification

The contact journey should capture:

- the area the visitor wants to improve;
- the current situation or problem;
- the desired result;
- an approximate timeline.

Existing fields and source-tracking data should be reused where possible. The redesign must not increase form friction with unnecessary required fields.

## Visual Direction

The page should feel like a modern independent consultancy:

- wide, structured desktop composition;
- strong typographic hierarchy;
- clear white or light surfaces with a restrained dark-mode equivalent;
- one confident action color;
- service selector tiles that prioritize scanning over decoration;
- minimal motion and no visual effects that compete with the offer;
- original imagery and project assets already available in the repository.

The design should look professional and conversion-led, not like a generic SaaS landing page or a copy of the reference site.

## Content and Localization

Spanish and English versions express equivalent intent without literal translation. Copy must be concrete, natural, and free of agency language such as `we are a team`, `our specialists`, or `our agency`.

SEO-visible copy should naturally retain:

- consultor informático / IT consultant;
- desarrollo web / web development;
- automatización de procesos / workflow automation;
- integraciones API / API integrations;
- software a medida / custom software;
- backend Spring Boot / Spring Boot backend.

## Technical Design

The page remains statically rendered in Astro. The localized route prepares content and typed service/project data, then passes explicit props to focused home components.

Existing home components may be rewritten or replaced when their responsibility changes. Locale selection, project selection, and URL construction remain at the page or shared-data layer rather than being duplicated across presentation components.

No new client-side framework or runtime dependency is introduced.

## Accessibility and Responsive Behavior

- One descriptive `h1` and a logical heading hierarchy.
- Native links for every service and CTA.
- Keyboard-visible focus and WCAG AA color contrast.
- Service tiles remain understandable without icons or color.
- Mobile targets meet WCAG 2.2 minimum target sizing.
- Images use explicit dimensions and appropriate alt text.
- Motion respects `prefers-reduced-motion`.
- Core navigation and conversion content work without JavaScript.

## Failure and Fallback Behavior

- Missing project imagery falls back to a stable branded visual surface.
- Missing project metrics use verified qualitative outcomes.
- If a service item lacks an optional icon, its text and link remain complete.
- The home remains usable when JavaScript or animation is unavailable.
- The contact CTA remains functional even if source-tracking parameters cannot be processed.

## Validation

Implementation is complete after:

- Astro check, lint, targeted format verification, and production build pass;
- the bilingual home-conversion verification covers the six service areas and free-assessment CTA;
- `/es/` and `/en/` are visually checked at desktop and mobile widths;
- light and dark themes are checked;
- all six service destinations and contact CTAs are verified;
- the page has no horizontal overflow and the header aligns with the home container;
- the free-assessment boundary is visible and does not promise a full audit.

## Out of Scope

- Claiming to be an agency or team.
- Copying reference-site branding, media, layout code, or wording.
- Offering a full technical audit for free.
- Adding live chat, WhatsApp widgets, aggressive popups, or lead-purchase integrations.
- Redesigning every service or project detail page.

## Success Criteria

A first-time visitor should be able to answer within seconds:

1. What kind of consultant José Miguel is.
2. Which business problem or service area matches their need.
3. Why direct collaboration with him is credible.
4. What the free assessment includes.
5. How to request it.
