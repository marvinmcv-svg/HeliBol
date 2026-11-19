# kinetik site audit — November 2026

How kinetik compares with **21st.dev, Mobbin, MotionSites, React Bits** and **unlumen UI**, what was wrong, and what shipped in 2.3 to fix it.

**Method.** A Playwright audit script against a production build (`next build && next start`) at 1440 px and 390 px measured transfer size, JS weight, request count, horizontal overflow, console errors, unlabelled buttons and OG tags on 17 pages and took screenshots. The competitors were read with Firecrawl (home, gallery and item pages). The library was checked against 21st.dev's ~80 categories by component id/name.

## Scorecard

| | 21st.dev | Mobbin | MotionSites | React Bits | **kinetik before** | **kinetik 2.3** |
|---|---|---|---|---|---|---|
| Catalogue | 12k community components, 412 templates, themes, apps | 600k screens, flows, UI elements | 400+ site prompts, 3D sites | 217 free + 255 Pro, 18 templates | 334 items, 0 templates | **349 items, 3 templates** |
| Live preview on hover | ✅ | — (screens) | video | ✅ | ✅ | ✅ |
| Reduced-motion fallback for every item | ❌ | — | ❌ | ❌ | ✅ | ✅ (still unique) |
| Copy prompt for agents | ✅ (2/day free) | — | ✅ (paid) | ✅ | ✅ free, unlimited | ✅ |
| MCP / agent install | ✅ own MCP | ✅ (Pro) | ✅ | shadcn MCP | ❌ undocumented | ✅ shadcn MCP + namespace |
| llms.txt | — | — | — | ✅ | ❌ | ✅ llms.txt + llms-full.txt |
| Sort (trending/new) | ✅ | ✅ | Featured/Popular/Recent | — | ❌ | ✅ Featured/Newest/A–Z |
| "New" badges / changelog | ✅ | ✅ changelog | — | — | ❌ | ✅ badges + /changelog |
| Facet counts | ✅ on chips | ✅ | — | — | ❌ | ✅ live counts per chip |
| Shareable filtered URLs | ✅ `/s/<tag>` | ✅ | — | — | partial (`?engine`) | ✅ q/cat/engine/page/sort |
| Save / collections | ✅ favourites | ✅ collections | — | — | ❌ | ✅ Saved (+ bulk install) |
| Package-manager preference | ✅ | — | — | ✅ (+JS/TS flavours) | ❌ | ✅ npm/pnpm/yarn/bun, remembered |
| Open in v0 | ✅ | — | — | — | ❌ | ✅ |
| OG image per item | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ (thumbnail) |
| sitemap / robots | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Mobile flows → native (Expo) prompts | ❌ | reference only | ❌ | ❌ | ✅ | ✅ (unique) |
| Shared motion tokens web ↔ native | ❌ | — | ❌ | ❌ | ✅ | ✅ (unique) |
| Visual editors / prop playground | — | — | — | ✅ Background Studio etc. | easing playground | easing playground (gap) |
| Accounts, authors, community publishing | ✅ | ✅ | — | — | ❌ | ❌ (out of scope) |

## Strengths (keep and market them)

1. **Accessibility is real, not claimed.** Every item has a tested reduced-motion fallback (the contract suite renders every demo in both modes — 1,822 tests). No competitor does this systematically.
2. **Free, unlimited AI prompts** with full source, motion spec and constraints. 21st.dev caps free prompt copies at two a day; MotionSites sells them.
3. **Web + native in one motion language.** Shared spring/easing tokens across CSS, Motion, GSAP and Reanimated, plus Mobbin-style mobile flows whose prompts rebuild them in Expo. Nobody else covers mobile.
4. **Engine breadth with taste:** a 40-piece GSAP collection, 13 three.js scenes, canvas/WebGL backgrounds, View Transitions and CSS-only pieces. Each is labelled by engine, so teams can stay within their bundle budget.
5. **One-command installs** through the shadcn registry, with dependencies resolved.

## Weaknesses found (and status)

| # | Finding | Severity | Status |
|---|---|---|---|
| 1 | **4.9 MB of JavaScript on every page** (even the 404): server pages imported the registry, whose `import()` map turned all ~334 demos and three.js into client references in each page's initial JS. | Critical | ✅ Fixed: loaders moved to a client-only module. **1.45 MB per page (−70%)**; three.js only on pages that use it. |
| 2 | `/components` rendered all ~300 cards at once: 12.8 MB, 29,727 px tall. | High | ✅ 36 at a time with infinite load: **4.6 MB, 4,073 px**. |
| 3 | Home page scrolled sideways on phones (decorative layers past the viewport). | High | ✅ `overflow-x: clip` at the root. |
| 4 | Three switches in flows had no accessible name. | Medium | ✅ Labelled. |
| 5 | No OG images, sitemap, robots or canonical URLs, so links shared poorly and indexing was weak. | High | ✅ All added. |
| 6 | No sorting, no "new", no counts; discovery = scrolling. | High | ✅ Sort, New badges (from git history), facet counts, URL-synced filters. |
| 7 | Sidebar was one flat list of 300+ links (30 heroes in a row). | Medium | ✅ Collapsible groups with counts, open where you are. |
| 8 | Mobile filters took a full screen before the first card. | Medium | ✅ Filters collapse behind a button on phones. |
| 9 | No way to collect items (Mobbin's core loop). | Medium | ✅ Saved collection + "copy install for all". |
| 10 | No templates. 21st.dev has 412 and MotionSites is built around whole sites. | High | ✅ 3 to start: SaaS launch, AI startup, portfolio. |
| 11 | Missing 21st.dev categories: alert, announcement, badge, dropdown, textarea, kanban, colour picker, cookie consent, waitlist, comments, scroll area, comparison. | Medium | ✅ 12 components added. |
| 12 | Agents couldn't discover the library. | Medium | ✅ llms.txt, llms-full.txt, shadcn MCP + namespaced registry docs. |
| 13 | No live prop editor / presets (React Bits' strongest feature). | Medium | ⬜ Next. |
| 14 | No search across *page types × industries* like MotionSites (fintech, fashion, agency…). | Low | ⬜ Next: add an `industry` facet. |
| 15 | Next.js 16.4.3 flagged by `next build` as affected by a known security vulnerability. | High | ⬜ Upgrade recommended (not done in this pass). |

## Before → after (production build)

| Page | JS before | JS after | Transfer before | Transfer after |
|---|---:|---:|---:|---:|
| Home | 4,946 KB | 1,454 KB | 10.2 MB | 7.3 MB |
| /components | 4,946 KB | 1,454 KB | 12.8 MB | 4.6 MB |
| Component (button) | 4,953 KB | 1,460 KB | 11.0 MB | 5.0 MB |
| Component (three.js coin) | 4,951 KB | 2,427 KB | 11.1 MB | 4.1 MB |
| 404 | 4,029 KB | 1,392 KB | 5.1 MB | 2.5 MB |

JS sizes are uncompressed; the gzip baseline is ~280 KB (React, Next, Motion, the GSAP core used by the shell).

## Next 10× moves (roadmap)

1. **Prop playground on every component page**: auto-generated controls from `meta.props` with presets and "copy with these props", plus a Background Studio-style editor for the 40+ backgrounds that exports code, PNG and video.
2. **Template library to 20+**, organised by industry (fintech, fashion, agency, AI, devtools, e-commerce) — MotionSites' axis.
3. **Industry facet + "used by page type" pages** (`/for/fintech`, `/for/portfolio`) for SEO and browsing.
4. **Collections v2**: named, shareable collections (URL-encoded, no accounts) and "install collection" as one registry item.
5. **Trending from real usage**: privacy-friendly copy/install counters to power a Popular sort.
6. **Video thumbnails** (short WebM loops recorded by the existing capture script) for cards on touch devices, where hover doesn't exist.
7. **Upgrade Next.js** past the flagged vulnerability.

Reproduce the audit: `node scripts/audit-site.mjs http://localhost:3100 ./audit-out` against `next start`. Thumbnails: `THUMB_ENGINE=cdp node scripts/capture-thumbs.mjs http://localhost:3100 --missing`.
