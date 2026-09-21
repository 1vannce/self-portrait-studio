# Feature Implementation Prompt

```md
## Goal
[Describe the user outcome and why it matters.]

## Scope
- Owning subsystem or module: [name]
- In scope: [pages, routes, components, tables, or integrations]
- Out of scope: [explicit exclusions]
- Acceptance criteria: [observable result, failure behavior, authorization rule]

## Required project context
Read `docs/AGENT_INSTRUCTIONS.md` and `docs/ARCHITECTURE.md`. Inspect related
routes, components, schema, integrations, and tests before editing. Follow the
installed Next.js guidance for any Next.js behavior you change.

## Architecture and security
- Use existing App Router and Tailwind/shadcn patterns.
- Browser code may use only `NEXT_PUBLIC_*` values.
- Authenticate and authorize on the server; do not trust browser-supplied IDs,
  roles, prices, quantities, statuses, or Storage paths.
- Use Drizzle for database queries and Zod at external input boundaries.
- Define transaction, retry, audit, and reversal behavior for financial,
  inventory, reservation, or cross-subsystem changes.

## Data, UI, and verification
- Tables/fields, RLS/Storage policies, input limits: [describe or state none]
- Screens and loading, empty, error, success, and accessibility states: [describe]
- Tests: [list]. Run `npm run lint`, `npm run build`, [additional command].

## Deliverable
Report changed files, behavior, validation results, and follow-up or migration steps.
```
