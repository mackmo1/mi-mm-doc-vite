# Project notes

## Unit tests

- Unit tests exist to speed up development, not to chase a coverage number. The goal is to spend less time on manual testing.
- Cover state, functionality and behavior well enough that manual testing is only needed for what tests can't reach.
- Write behavior-focused tests (Vitest + Testing Library): assert on what the user sees and what persists, not on implementation details.
- Run them from `client-react/` with `npx vitest run`.
