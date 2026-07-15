# Expand the Technology Marquee Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add PHP, Laravel, ChatGPT, Claude, Python, GitHub, and GitLab with recognizable brand icons to the technology marquee used on the home and contact pages.

**Architecture:** Keep `TechnologyMarquee.astro` as the single source of truth for the shared list. Store each new brand mark as a local SVG in `src/icons/`, which lets `astro-icon` resolve it using the same interface and monochrome styling as the existing entries.

**Tech Stack:** Astro 6, TypeScript, `astro-icon`, local SVG assets, Tailwind CSS 4, pnpm.

## Global Constraints

- Preserve all ten existing marquee entries.
- Append the new entries in this exact order: PHP, Laravel, ChatGPT, Claude, Python, GitHub, GitLab.
- Reuse `src/icons/github.svg`; add no duplicate GitHub asset.
- Keep brand labels identical in Spanish and English.
- Do not change project technology lists, CV stacks, translations, page layout, or marquee behavior.
- New SVGs must inherit the existing `currentColor` presentation and remain decorative.

---

### Task 1: Add brand assets and extend the shared marquee

**Files:**

- Create: `src/icons/php.svg`
- Create: `src/icons/laravel.svg`
- Create: `src/icons/chatgpt.svg`
- Create: `src/icons/claude.svg`
- Create: `src/icons/python.svg`
- Create: `src/icons/gitlab.svg`
- Modify: `src/components/common/TechnologyMarquee.astro:14-25`
- Verify: `src/icons/github.svg`

**Interfaces:**

- Consumes: `Icon` from `astro-icon/components`, which resolves a local icon through `<Icon name="icon-name" />`.
- Produces: six local icon names (`php`, `laravel`, `chatgpt`, `claude`, `python`, `gitlab`) and seven additional `{ label: string, icon: string }` entries in the shared marquee.

- [ ] **Step 1: Run a structural assertion that demonstrates the entries are missing**

```bash
node -e 'const fs=require("node:fs");const s=fs.readFileSync("src/components/common/TechnologyMarquee.astro","utf8");for(const label of ["PHP","Laravel","ChatGPT","Claude","Python","GitHub","GitLab"]){if(!s.includes(`label: "${label}"`))throw new Error(`Missing ${label}`)}'
```

Expected: FAIL with `Error: Missing PHP`.

- [ ] **Step 2: Add the six brand SVG files**

Create standalone SVGs containing `role="img"`, `viewBox="0 0 24 24"`, the SVG namespace, a brand-specific `<title>`, and the source path data. Use these exact Simple Icons SVG sources:

```text
php.svg      https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/php.svg
laravel.svg  https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/laravel.svg
chatgpt.svg  https://cdn.jsdelivr.net/npm/simple-icons@15.0.0/icons/openai.svg
claude.svg   https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/claude.svg
python.svg   https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/python.svg
gitlab.svg   https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/gitlab.svg
```

For `chatgpt.svg`, retain the OpenAI mark but change `<title>OpenAI</title>` to `<title>ChatGPT</title>`. Do not include hard-coded `fill` or `stroke` colors; the existing component applies `fill: currentColor`.

- [ ] **Step 3: Append the seven technologies to the component collection**

Add these objects immediately after WordPress:

```ts
	{ label: "PHP", icon: "php" },
	{ label: "Laravel", icon: "laravel" },
	{ label: "ChatGPT", icon: "chatgpt" },
	{ label: "Claude", icon: "claude" },
	{ label: "Python", icon: "python" },
	{ label: "GitHub", icon: "github" },
	{ label: "GitLab", icon: "gitlab" },
```

- [ ] **Step 4: Run the structural assertion again**

```bash
node -e 'const fs=require("node:fs");const s=fs.readFileSync("src/components/common/TechnologyMarquee.astro","utf8");for(const label of ["PHP","Laravel","ChatGPT","Claude","Python","GitHub","GitLab"]){if(!s.includes(`label: "${label}"`))throw new Error(`Missing ${label}`)}'
```

Expected: exit code 0 with no output.

- [ ] **Step 5: Confirm every icon reference resolves to a local file**

```bash
node -e 'const fs=require("node:fs");const s=fs.readFileSync("src/components/common/TechnologyMarquee.astro","utf8");for(const icon of [...s.matchAll(/icon: "([^"]+)"/g)].map(m=>m[1])){if(!fs.existsSync(`src/icons/${icon}.svg`))throw new Error(`Missing icon ${icon}`)}'
```

Expected: exit code 0 with no output.

- [ ] **Step 6: Format only the task files**

```bash
pnpm exec prettier --write src/components/common/TechnologyMarquee.astro src/icons/php.svg src/icons/laravel.svg src/icons/chatgpt.svg src/icons/claude.svg src/icons/python.svg src/icons/gitlab.svg
```

Expected: Prettier reports all seven paths without an error.

- [ ] **Step 7: Run repository validation**

```bash
pnpm run check
pnpm run lint
pnpm run build
```

Expected: each command exits with code 0. Existing failures unrelated to these seven files must be reported separately and must not be modified as part of this task.

- [ ] **Step 8: Review the final task diff**

```bash
git diff --check -- src/components/common/TechnologyMarquee.astro src/icons/php.svg src/icons/laravel.svg src/icons/chatgpt.svg src/icons/claude.svg src/icons/python.svg src/icons/gitlab.svg
git diff -- src/components/common/TechnologyMarquee.astro src/icons/php.svg src/icons/laravel.svg src/icons/chatgpt.svg src/icons/claude.svg src/icons/python.svg src/icons/gitlab.svg
```

Expected: no whitespace errors; the diff contains only the six SVG assets and seven new marquee entries.
