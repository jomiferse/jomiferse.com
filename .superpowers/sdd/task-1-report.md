# Task 1 report: harden the public contact endpoint

## Status

DONE_WITH_CONCERNS

## Scope implemented

- Added a pure contact-input schema with server limits: name 2–100, email up
  to 254, message 20–5,000, explicit locales/scopes/source categories,
  service allow-listing, and bounded localized source paths.
- Rejects invalid or excessive `Content-Length` values before `formData()` and
  converts form parsing failures into controlled 303 validation redirects.
- Added a visually hidden, keyboard- and screen-reader-excluded honeypot. It
  remains a plain HTML field, so the form still submits without JavaScript.
- Enforces a 32 KiB streamed body cap even when `Content-Length` is absent,
  while leaving enough encoded headroom for the 5,000-character Unicode limit.
- Added a one-hour fixed-window limiter using only a HMAC digest of Vercel's
  protected `x-vercel-forwarded-for` header. Raw IP addresses are not retained.
- Added Resend idempotency using the same hourly client bucket as a
  cross-instance backstop for completed duplicate requests. Warm-instance
  concurrency is handled by the local reservation described below.
- Extracted `sendContactEmail(input, transport, ...)`, injected the transport
  into the handler, and kept all handler tests offline.
- Moved sender and recipient to validated `RESEND_API_KEY`, `CONTACT_FROM` and
  `CONTACT_TO` environment configuration.
- Fixed the subject and normalized control characters from all user-controlled
  email text. The endpoint does not log contact data.
- Mirrored all field limits in the HTML form and preserved locale, service and
  scope selections in success/error redirects.
- Added native service/scope selectors inside `noscript` and fragment-targeted
  result messages, so no-JavaScript submissions retain their chosen selection
  and receive success/error feedback.

## Design decisions

- A paid Vercel Firewall rule or new CAPTCHA/KV account was deliberately not
  introduced. The repository-contained warm-instance limiter is backed by the
  already-used Resend provider's 24-hour idempotency store, so serverless cold
  starts do not multiply sends for the same hourly HMAC client bucket.
- Client identity uses `x-vercel-forwarded-for`, which Vercel documents as the
  protected copy of the client address. `x-forwarded-for`, `x-client-ip`, form
  fields and query parameters are ignored.
- The Resend API key is also the HMAC secret. This avoids storing a reversible
  IP hash or adding another deployment secret. Only a truncated HMAC digest is
  retained in memory and included in the idempotency key.
- Honeypot and frequency failures redirect as apparent success. This prevents
  the response from revealing which anti-abuse control acted.
- Provider/configuration failures remain `error=send`; validation failures
  remain `error=missing`, preserving the existing no-JavaScript UX.

## TDD evidence

Tests were written before each production unit and observed failing for the
missing module/export or missing form contract. The main RED runs were:

```text
node --test tests/contact-input.test.ts
ERR_MODULE_NOT_FOUND: src/lib/contact-input.ts

node --test tests/contact-handler.test.ts
ERR_MODULE_NOT_FOUND: src/lib/contact-handler.ts

node --test tests/contact-handler.test.ts
SyntaxError: module does not provide readContactEnvironment

node --test tests/contact-form-contract.test.ts
2 tests, 0 pass, 2 fail (limits and honeypot absent)
```

Each unit was implemented minimally and rerun green before the next behavior
was added. A regression test for the global contact dialog's direct source path
was also observed failing, then fixed by accepting a bounded path while
normalizing direct attribution to no stored path.

## Files changed

- `.env.example`
- `.superpowers/sdd/task-1-report.md`
- `README.md`
- `src/components/forms/ContactForm.astro`
- `src/lib/contact-handler.ts`
- `src/lib/contact-input.ts`
- `src/lib/resend-contact-transport.ts`
- `src/pages/[locale]/contact.astro`
- `src/pages/api/contact.ts`
- `tests/contact-form-contract.test.ts`
- `tests/contact-handler.test.ts`
- `tests/contact-input.test.ts`
- `tests/contact-page-render.test.ts`
- `tests/resend-contact-transport.test.ts`

## Exact final verification

All commands used Node 24.15.0 through:

```bash
PATH="/Users/josemiguel.fernandezserrano/.nvm/versions/node/v24.15.0/bin:$PATH"
```

### Tests

```bash
pnpm test
```

Exit `0`: 52 tests, 52 passed, 0 failed, 0 skipped.

### Astro check

```bash
pnpm run check
```

Exit `0`: 117 files, 0 errors, 0 warnings, 0 hints.

### Lint

```bash
pnpm run lint
```

Exit `0`: ESLint completed with zero warnings.

### Formatting

```bash
pnpm run format:check
```

Exit `0`: all matched files use Prettier code style.

### Production build

```bash
pnpm run build
```

Exit `0`: Astro check reported 0 diagnostics, static routes were generated,
the Vercel server function was bundled, and the build completed successfully.

### Diff integrity

```bash
git diff --check
```

Exit `0`, no output.

## Self-review

- Re-read `plans/001-harden-contact-endpoint.md` line by line.
- Confirmed oversized bodies are rejected from declared length before parsing
  or by the streamed byte cap, and malformed `formData()` never escapes the
  handler.
- Confirmed every user field is bounded and every selector/source value is
  allow-listed before use or redirect preservation.
- Confirmed honeypot and limiter paths never call the transport.
- Confirmed provider/config failures do not record a successful warm limit.
- Confirmed only Vercel's protected forwarded address affects the HMAC identity;
  tests mutate common spoofable alternatives without changing the key.
- Confirmed the email subject contains no user data and line/control characters
  are removed from generated text.
- Confirmed there are no calls that log names, email addresses or messages.
- Confirmed HTML constraints match server limits and submission remains a
  normal `method="post"` form. Native fallback selectors and fragment-targeted
  messages cover selection and result feedback without JavaScript.
- Confirmed all changes stay inside the contact endpoint/form/testing/config
  scope from the brief.
- Independent review found no Critical issues. Its Important findings were
  resolved: streamed size enforcement, native no-JavaScript selection/status,
  and conservative concurrent-idempotency handling. The 32 KiB cap fixes the
  Unicode headroom concern, and the Resend adapter is extracted and tested.

## Concerns and deployment follow-up

- Production still requires externally setting `RESEND_API_KEY`, `CONTACT_FROM`
  and `CONTACT_TO`; `CONTACT_FROM` must use a domain verified in Resend. No real
  credentials or provider resources were created in this task.
- Live `/en/contact/` and `/es/contact/` delivery was not exercised because it
  would require those production credentials and emit real email. Handler,
  transport boundaries, redirects and anti-abuse paths are covered offline.
- Resend retains idempotency keys for 24 hours. The key contains only a
  truncated HMAC digest and hourly bucket, not the raw client address.
- The in-memory limiter is per warm serverless instance; Resend idempotency is
  the cross-instance enforcement layer. If the provider is replaced, equivalent
  shared idempotency/rate storage must be added before removing this backstop.

## Final-review follow-up

The final review identified three additional gaps, all resolved in a second
TDD pass:

- The localized contact page now validates `service` and `scope` from
  `Astro.url.searchParams` and server-renders the hidden values and selected
  native fallback options. It is an on-demand Vercel route so this state also
  works with JavaScript disabled. Redirect status messages receive their
  visible class server-side.
- The warm-instance limiter now reserves an identity before starting the email
  transport. A concurrent request receives the same neutral public success
  redirect, while a failed provider attempt is reduced to a 30-second cooldown
  before retry is allowed.
- `sourcePath` has an explicit 2,048-character limit, with exact-boundary tests.

The RED coverage added for this pass exercised unrendered query selections,
concurrent requests entering the transport twice, immediate retries after a
provider failure, and an over-limit source path. The page regression test uses
Astro's container with an in-process Vite server, so it verifies rendered HTML
without opening a network listener or contacting external services.

### Follow-up verification

All commands used Node 24.15.0. The exact final results were:

```text
pnpm test                 56 passed, 0 failed, 0 skipped
pnpm run check            118 files, 0 errors, 0 warnings, 0 hints
pnpm run lint             exit 0, zero warnings
pnpm run format:check     exit 0, all files matched Prettier style
pnpm run verify:ai-seo    exit 0, verification passed
pnpm run build            exit 0, Vercel server bundle and sitemap generated
git diff --check          exit 0, no output
```

The deployment concerns above remain unchanged: production mail settings and a
real delivery check require external Resend configuration, and the local
frequency reservation remains warm-instance scoped with provider idempotency as
the cross-instance duplicate backstop.

## Second-review follow-up

The second review found two remaining no-JavaScript/rate-limit edge cases and a
cache-maintenance issue. They were resolved in a third RED/GREEN pass:

- When native fallback selectors are submitted, their validated values now take
  precedence over the preselected hidden enhanced values. A no-JavaScript user
  can therefore change the service or scope without triggering a false conflict
  rejection.
- Provider failure cooldowns now use a fresh clock reading after the transport
  completes. The regression advances the clock while the first provider call is
  pending and confirms that retry remains blocked for 30 seconds from failure,
  rather than from reservation.
- Successful expired reservations are swept during `acquire`, not only while
  recording provider failures, preventing stale success entries from
  accumulating indefinitely in a warm instance.

The exact final verification for this pass was:

```text
focused contact tests      25 passed, 0 failed, 0 skipped
pnpm test                  57 passed, 0 failed, 0 skipped
pnpm run check             118 files, 0 errors, 0 warnings, 0 hints
pnpm run lint              exit 0, zero warnings
pnpm run format:check      exit 0, all files matched Prettier style
```
