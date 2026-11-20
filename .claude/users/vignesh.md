# Vignesh's preferences

## Scope
- Work only in `client-react/` (Vite + React 19 + Supabase). `client/` (Vue) and `server/` (Express) are legacy.
- This is another developer's product: make the smallest change that does the job. No unrelated refactors.

## Commands (run from `client-react/`)
- Install: `npm ci`
- Tests: `npx vitest run`
- Dev: `npm run dev` (port 3000)

## Testing
- Tests exist to speed up development and cut manual testing, not to chase a coverage number.
- Write behavior-focused tests first (Vitest + Testing Library). Assert on what the user sees and what persists, not on implementation details such as storage key names.
- Mock jQuery/Trumbowyg inside the test file. Don't edit the shared `src/test/setup.js`.
- After a change, say what the tests cannot cover (real Trumbowyg, real browser refresh, mobile) so I can check it manually.

## Commits
- End every commit message with exactly one trailer: `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`
- Add no other labels or attribution lines (no "Generated with Claude Code", no emoji tags) to commits or PR descriptions.

## Working style
- Walk me through the plan in a few high-level points before coding, and keep answers concise.
- Don't add dependencies or change `package.json`/lockfiles without asking.
