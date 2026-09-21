# Code Review Prompt

```md
## Review target
[Branch, diff, files, or description to review.]

## Instructions
Read `docs/AGENT_INSTRUCTIONS.md` and `docs/ARCHITECTURE.md`, then inspect the
implementation and surrounding code. Do not assume claimed behavior exists.

Review for:
- Correct subsystem ownership or an explicit supporting module.
- Server/client boundary; no exposed secrets or browser database access.
- Server-side authentication and record/object authorization.
- Zod validation at input, route, webhook, and provider boundaries.
- RLS, including `USING` and `WITH CHECK` for updates, when access changes.
- Safe transaction, audit, retry, idempotency, reversal, money, and stock behavior.
- Private Storage paths, App Router conventions, UI reuse, migrations, tests,
  documentation, `npm run lint`, and `npm run build`.

## Deliverable
List findings first, ordered by severity with file references. State explicitly
when no material issues are found, then note verification gaps or assumptions.
Do not modify files unless asked.
```
