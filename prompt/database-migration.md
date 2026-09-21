# Database Migration Prompt

```md
## Goal
[Required data-model change and its business rule.]

## Investigation
Read `docs/AGENT_INSTRUCTIONS.md`, `docs/ARCHITECTURE.md`, and applicable
Postgres/Supabase guidance. Inspect `src/db/schema.ts`, migrations, and callers.

## Data design
- Owning subsystem: [name]
- Tables, columns, relations, constraints, defaults, indexes: [describe]
- Existing-data/backfill handling and RLS/Storage implications: [describe]
- Audit, transaction, retry, and reversal behavior: [describe where relevant]

## Requirements
- Keep Drizzle and drizzle-zod definitions aligned.
- Generate with `npm run db:generate`; do not hand-edit generated metadata.
- Review SQL. Do not run `npm run db:migrate` against a shared/production
  database without explicit approval.
- Do not use floating-point money or silently overwrite inventory.

## Deliverable
Run focused checks, `npm run lint`, and `npm run build`. Report schema and
migration changes, RLS requirements, safety notes, and commands run.
```
