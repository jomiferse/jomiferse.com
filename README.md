# 🌐 jomiferse.com — Personal Website

<p align="center">
  <img src="public/apple-touch-icon.png" width="80" />
</p>

<p align="center">
  <strong>My personal website built with Astro, TypeScript, and a modern, scalable architecture.</strong>
</p>

<p align="center">
  <a href="https://astro.build/">
    <img src="https://img.shields.io/badge/Astro-FF5D01?style=for-the-badge&logo=astro&logoColor=white" />
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  </a>
  <img src="https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge" />
</p>

---

## 🚀 Tech Stack

- **Astro** – Ultra-fast, server-first static site framework
- **TypeScript** – Type-safe components, utilities, and API routes
- **Astro Components (.astro)** – Component-driven UI architecture
- **TailwindCSS** – Utility-first styling system
- **JSON-Driven Content** – Fully localized CV data
- **Astro Islands Architecture** – Partial hydration only where needed

---

## 🌍 Internationalization (i18n)

- Locale-based routing:
  - `/en` – English
  - `/es` – Spanish
- Language switcher integrated into the header
- Translation dictionaries for UI text
- Localized metadata (`title`, `description`, `aria-labels`)
- Permanent redirect from `/` to the Spanish home page

---

## 📄 CV Localization

- CV data split into fully localized files:
  - `cv.en.json`
  - `cv.es.json`
- Each locale contains complete, self-contained CV content
- No shared base or deep-merge logic (avoids data inconsistency)
- CV data loaded dynamically based on the active locale
- Clear separation between:
  - **UI translations** (i18n dictionaries)
  - **Long-form content** (CV JSON)

---

## ✨ Features

- ⚡ **Fully responsive** layout for mobile and desktop
- 🧩 **Reusable UI components** (cards, header, footer, dialogs, forms)
- 🌐 **Multi-language support** with clean routing
- 📬 **Contact form** with localized handling and backend email delivery
- 🔍 **SEO optimized**
  - Canonical URLs
  - `hreflang` alternates
  - Automatic sitemap generation
  - Robots configuration
- 🗂️ **Clean project structure** designed for scalability and maintenance

---

## 🛠️ Running Locally

Use Node 24 or newer and pnpm 11. The package-manager version is pinned in
`package.json`.

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Run the complete pre-publication gate
pnpm run quality

# Preview the build
pnpm run preview
```

`pnpm run test:build` audits the generated production artifact and therefore
expects `pnpm run build` to have run first. It checks public routes, internal
links, canonical and language alternates, structured data, discovery files,
redirects, image delivery and HTML/CSS budgets. The full rationale and manual
visual checklist live in [`docs/quality-gate.md`](docs/quality-gate.md).

### Contact email configuration

The contact endpoint requires `RESEND_API_KEY`, `CONTACT_FROM` and `CONTACT_TO`.
Copy `.env.example` into the environment used locally or on Vercel. The
`CONTACT_FROM` address must belong to a domain verified in Resend before the
site is deployed; do not commit the real API key.

The endpoint rate-limits a salted hash of Vercel's protected client-address
header and uses Resend idempotency as a cross-instance backstop. It does not
store raw IP addresses or contact message content. Resend retains the opaque
idempotency key for 24 hours.

## 📬 Contact

If you'd like to reach out, here are my official channels:

- 🌍 **Website:** https://jomiferse.com
- 🐙 **GitHub:** https://github.com/jomiferse
- 💼 **LinkedIn:** https://www.linkedin.com/in/jomiferse
- ✉️ **Email:** jomiferse@gmail.com
