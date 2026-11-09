# prsnn mobile — notes for Claude

React Native (Expo 58, expo-router, TypeScript) app for prsnn: book verified
companions in Hyderabad. Backend: Supabase project `prsnn` (Postgres
functions + RLS, Auth phone OTP, Storage, Realtime); its SQL and edge functions live in
`qwink-dinein/prsnn-backend/supabase`. Web: `qwink-dinein/prsnn-frontend` (Next.js). Read in this order
when you need context: `PRD.md` → `design.md` → `Architecture.md` →
`API.md` → `Tasks.md`.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected.

## Rules

- **Keep the theme.** Colours only from `src/theme/tokens.ts` (copied from the web `globals.css`). Moss is the one accent. Lora for display, DM Sans for everything else.
- Screens call `svc.*` through React Query using `qk` keys. Never call `fetch` in a screen.
- Business rules go in `src/domain` with a test in `__tests__/`. Prices must match the backend's `amountDueInPaise`.
- Every data screen has loading, error and empty states. Icon-only buttons need `accessibilityLabel`.
- Don't fake data the backend doesn't have (ratings, age, wallet). Leave it out and add it to Tasks.md.
- Backend changes are SQL migrations / edge functions in `prsnn-backend/supabase`, applied to the project and covered by `scripts/e2e-supabase.mjs`. Document them in `API.md`.
- Secrets never go in the repo or in `EXPO_PUBLIC_*` (those ship inside the app).

## Commands

```
npm start                 # Expo dev server (Expo Go: scan QR)
npm run typecheck && npm run lint && npm test
EXPO_PUBLIC_DEMO=1 npm run web    # sample data, no backend
npx expo export --platform web    # static web build in dist/
graphify update .                 # refresh the knowledge graph
```
