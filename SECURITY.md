# Dependency security exceptions

Last reviewed: 2026-07-15  
Next review: 2026-08-15 or before production publication

`pnpm audit --prod` currently reports one high-severity advisory:

- `GHSA-9wv6-86v2-598j` in `path-to-regexp@6.1.0`.
- Dependency path: `@astrojs/vercel@11.0.3` → `@vercel/routing-utils@5.3.3` → `path-to-regexp@6.1.0`.
- The supported `@vercel/routing-utils` 5.x line pins this version. Resolving it currently requires an upstream adapter/routing-utils release or an unsupported override.
- In this repository, routing patterns come from source-controlled, literal redirects in `astro.config.mjs`; request data is not used to construct route patterns. The affected code participates in Vercel build/routing generation rather than the final contact function's request handling.
- Residual risk: a future source-controlled redirect with a pathological multi-parameter pattern could cause excessive regular-expression work during routing generation.

Do not silence this advisory with a package override. Update `@astrojs/vercel` and regenerate the lockfile when its supported dependency graph includes `path-to-regexp >=6.3.0`, then remove this exception after `pnpm audit --prod` is clean.
