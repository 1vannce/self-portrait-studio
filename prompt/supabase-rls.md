# Supabase RLS Prompt

```md
## Goal
[Which actors can access which records or Storage objects.]

## Investigation
Read `docs/AGENT_INSTRUCTIONS.md` and `docs/ARCHITECTURE.md`. Inspect the
schema, policies, authorization checks, and Storage buckets before changes.

## Authorization model
- Resource/table/bucket: [name]
- Roles and ownership/tenant relationship: [describe]
- Allowed SELECT, INSERT, UPDATE, DELETE actions: [describe]
- Sensitive paths/fields and server-only operations: [describe]

## Requirements
- Enforce authorization in database/Storage, not only the UI.
- Never use editable `user_metadata` for access control.
- UPDATE needs ownership-aware `USING` and `WITH CHECK` predicates.
- `TO authenticated` alone is not authorization.
- Keep assets private; save paths, not permanent public URLs.

## Deliverable
Cover authorized, unauthorized, and cross-user access. Run `npm run lint` and
`npm run build`; report policies, threat cases, and deployment/migration steps.
```
