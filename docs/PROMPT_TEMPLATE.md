# Implementation Prompt Template

Use this template when assigning a feature, fix, or integration task to an
agent. Replace bracketed text and remove sections that do not apply.

```md
## Goal

[Describe the user outcome and why it matters.]

## Scope

- In scope: [pages, routes, components, tables, or integrations]
- Out of scope: [explicit exclusions]
- Acceptance criteria:
  - [observable result]
  - [validation or failure behavior]
  - [authorization requirement]

## Architecture constraints

- Use Next.js App Router and existing Tailwind/shadcn patterns.
- Browser code may use only `NEXT_PUBLIC_*` environment variables.
- Use the Supabase server client to identify the current user.
- Use Drizzle for database access and Zod for all external inputs.
- Keep the feature within Booking & Reservation, POS & Billing, or Inventory &
  Supply Management; explicitly define any cross-subsystem operation.
- Use integer minor units or fixed-precision values for money and record an
  audit trail for financial or stock changes.
- Store private operational documents as Supabase Storage paths and use signed
  URLs where applicable.
- Follow `docs/AGENT_INSTRUCTIONS.md` and `docs/ARCHITECTURE.md`.

## Data and security

- New or changed tables/fields: [describe or state none]
- Required RLS/Storage policies: [describe or state none]
- Input schemas and limits: [describe]
- Webhook provider/signature/idempotency plan: [describe or state none]
- Sensitive values and their environment variable names: [list; never include
  actual secret values]

## UI and behavior

- Routes or screens: [list]
- Loading, empty, error, and success states: [describe]
- Accessibility requirements: [describe]

## Verification

- Tests to add or update: [list]
- Commands to run: `npm run lint`, `npm run build`, [additional command]
- Manual checks: [list]

## Deliverable

Provide a concise summary of changed files, behavior, validation results, and
any follow-up or migration steps.
```

## Example

```md
## Goal

Let an authorized staff member create a reservation without allowing an
availability conflict.

## Acceptance criteria

- The reservation input is validated server-side.
- Availability is checked and reserved transactionally.
- The reservation status transition is recorded with the acting user and time.
- A user without the required role cannot create or view the reservation.
- No POS or inventory record is changed unless the cross-subsystem behavior is
  explicitly part of the request.

## Verification

- Add tests for conflicting availability and unauthorized requests.
- Run `npm run lint` and `npm run build`.
```
