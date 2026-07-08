---
title: "CV Studio: building a clearer developer CV"
description: "Notes from building CV Studio, a CV builder for developers with live preview, structured data and PDF export."
date: 2025-12-25
translationSlug: "creando-cv-studio"
tags:
  - cv
  - developer-tools
  - portfolio
  - pdf
  - web-development
author: "José Miguel Fernández"
readingTime: "5 min"
---

I started CV Studio because writing a developer CV still feels harder than it should.

Most CV builders give you rigid templates, too much visual noise or PDFs that look different once you download them. I wanted something cleaner: structured data, a live preview and an output I could trust.

That gap became **CV Studio**.

The same idea applies to a professional website: the goal is not more sections, but clearer positioning and an easier next step. I cover that in [what a professional website needs to get clients](/en/blog/what-a-professional-website-needs-to-get-clients/).

**Project repository:**  
[https://github.com/jomiferse/cv-studio](https://github.com/jomiferse/cv-studio)

---

## Why I built it

CV Studio is a personal project with a simple goal: help developers write a clear CV without losing control over the structure or the final PDF.

I wanted the editing experience to feel straightforward, but still be built on a solid data model. The CV should be easy to change, easy to validate and reliable when exported.

CV Studio treats the CV first as **structured data**, and then as a polished document.

![CV Studio - live CV editor with real-time preview](/images/blog/cv-studio-editor.avif)

---

## Principles I kept

From the beginning, I kept a few principles in mind:

- **Structured data first**. Every CV is backed by a clear JSON schema.
- **Real-time feedback**. Changes appear instantly in the preview.
- **Reliable output**. PDFs are optimized for A4, printing and ATS parsing.
- **Maintainable architecture**. Strong typing, validation and reusable templates matter.

## Main features

### Live CV editor with real-time preview

CV Studio lets users edit their CV while seeing the final result instantly. The preview is not a mockup. It represents what will be exported to PDF.

That removes guesswork and makes each edit easier to trust.

### Reliable PDF export

The generated PDFs are designed to stay consistent across platforms, printers and devices. The layout follows common expectations for technical hiring processes.

The point is boring in the best way: no broken margins, no unexpected font shifts and no surprises after export.

![CV Studio - professional PDF export](/images/blog/cv-studio-pdf.avif)

### Clean, minimal UI

The interface is intentionally minimal. The focus is on writing, editing and checking the final result without distractions.

### Strong validation

Schema validation and strong typing keep the CV data consistent. That makes it easier to add sections, templates or export formats later without making the app fragile.

## Who CV Studio is for

- Software engineers and technical professionals
- Developers who value control over their data
- People looking for ATS-friendly, print-ready CVs
- Anyone who prefers clean structure over flashy templates

## What comes next

CV Studio is still evolving. Planned improvements include:

- Multiple professional CV templates
- More customization while preserving structure
- Improved export capabilities
- Internationalization and multi-language support

## Closing note

CV Studio is a small product, but it reflects how I like to build: a simple interface, clear data, reliable output and room to improve.

You can explore the project here:  
**[CV Studio on GitHub](https://github.com/jomiferse/cv-studio)**

More notes will follow as the project evolves.

## FAQ

**Does CV Studio replace a portfolio?**  
No. A CV and a portfolio solve different moments. The CV summarizes experience; the portfolio gives context, judgment and depth.

**Why use structured data for a CV?**  
Because it separates content from presentation. You can change design, export or language without rewriting everything.

**What should a developer CV prioritize?**  
Clarity, real impact, relevant technologies and projects explained with context. Not just a long list of tools.
