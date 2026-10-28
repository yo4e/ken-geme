# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

# Game requirements

This is a production mobile-friendly browser game deployed to GitHub Pages, not a framed phone simulation. The user's explicit browser-game scope overrides the mobile prototype shell. Preserve the approved question/correct/incorrect layout, including the single 答えを見る primary action after an incorrect answer. Do not collect personal information or add services, authentication, or paid dependencies.

Keep all 47 strict answers and original vector map paths valid. Tokyo asks for the ward containing the metropolitan government: 新宿区, with the explanatory note. Never remove a card from the unsolved queue after revealing its answer. Only self-solved answers count toward 47. Time confirmation states consistently as paused. Keep normal and reverse records separate.

Run npm test, npm run test:e2e, npm run build for game changes. Browser tests use Chromium and WebKit. Design evidence and iteration notes are in design-qa.md. Work screenshots are private QA artifacts and are not published as part of the site.

# Approved improvements (2026-10-28)

Preserve the game design and rules while adding user-initiated result sharing, Enter to advance confirmed answers on PC, and favicon/home-screen icons. Never auto-post. Prefer the OS share sheet, then clipboard/manual copying. IME confirmation, held Enter and the answer's own key event must not advance a second screen. Keep icons self-hosted and avoid new services or credentials.

The user also approved migration to `4roz.com/games/ken/` with the existing game design preserved. Keep links to よろずコム / よろずミニゲーム inside the small hamburger menu only. Do not add the host site's large header or redesign the game to match it. Keep relative asset and manifest paths; the GitHub repository/site remain available.
