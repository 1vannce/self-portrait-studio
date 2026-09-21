# Bug-Fix Prompt

```md
## Problem
[Observed behavior, expected behavior, affected route/feature, reproduction,
and sanitized error output.]

## Investigation
Read `docs/AGENT_INSTRUCTIONS.md` and `docs/ARCHITECTURE.md`. Inspect affected
code, related schema, authorization path, and tests before editing. Diagnose the
root cause and avoid unrelated refactors.

## Constraints
- Preserve subsystem and server/client boundaries.
- Validate external input with Zod; preserve server-only secrets and providers.
- Confirm server-side authentication and object authorization.
- Define migration and RLS implications before database changes.

## Verification and deliverable
Specify regression coverage, run `npm run lint` and `npm run build`, and report
the root cause, changed files, checks, remaining risk, and follow-up.
```
