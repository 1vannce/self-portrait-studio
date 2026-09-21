# Self Portrait Studio

A Next.js operations application with three connected business subsystems:
Booking & Reservation, Point of Sale (POS) & Billing, and Inventory & Supply
Management.

> **Project background:** OH MEDIA Studio is a self-portrait photography studio that
> provides customers with studio sessions and related photography services. The studio
> manages customer bookings, schedules, studio resources, and inventory as part of
> its daily operations.
> The proposed Self-Portrait Studio System aims to organize the studio's booking and
> inventory processes in one system to reduce manual work, improve information
> tracking, and support better business workflow.

> **Project status:** foundation stage. The application shell, Supabase clients,
> Drizzle bootstrap schema, validation helpers, and provider configuration
> contracts are in place. The domain data model and workflows for the three
> subsystems are still to be implemented.

## Table of contents

- [Technology](#technology)
- [Architecture and documentation](#architecture-and-documentation)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Daily development](#daily-development)
- [Database workflow](#database-workflow)
- [Repository layout](#repository-layout)
- [Security and data handling](#security-and-data-handling)
- [External integrations](#external-integrations)
- [Team workflow](#team-workflow)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Technology

| Area           | Technology                        | Role                                                               |
| -------------- | --------------------------------- | ------------------------------------------------------------------ |
| Application    | Next.js 16, React 19, TypeScript  | App Router UI, route handlers, and server-side application layer   |
| Styling        | Tailwind CSS 4, shadcn/ui         | Design tokens, utility styling, and reusable UI primitives         |
| Authentication | Supabase Auth                     | User identity and session management                               |
| Database       | Supabase PostgreSQL               | Persistent application data and access control                     |
| Data access    | Drizzle ORM, postgres.js          | Typed schema, queries, and migrations                              |
| Validation     | Zod, drizzle-zod                  | Runtime validation for external input and database-derived schemas |
| File storage   | Supabase Storage                  | Restricted operational documents and assets                        |
| Providers      | Botcake, payment service, Contavo | Future messaging, payments, and operational workflows              |
| Deployment     | AWS (planned)                     | Runtime hosting and operations                                     |

## Business subsystems

### 1. Booking & Reservation

Owns availability, reservations, customer or guest details, reservation status,
and reservation history. Availability checks and reservation creation must be
transactional so concurrent requests cannot create an overbooking.

### 2. Point of Sale (POS) & Billing

Owns orders, line items, bills, payments, receipts, and payment lifecycle.
Monetary values must be stored as integer minor units or fixed-precision
numerics; never use floating-point values. Finalized financial records are
reversed or corrected, not deleted.

### 3. Inventory & Supply Management

Owns items, suppliers, stock levels, receiving, adjustments, replenishment, and
stock movement history. Every stock change needs an audit trail with its actor,
reason, source operation, and resulting quantity.

### Working across subsystems

Explicitly design any flow that crosses these boundaries — for example,
reservation fulfilment, payment completion, cancellation, or stock deduction.
Define the transaction boundary, retry behavior, and compensating action before
implementation. Do not join independent pages with client-side state or allow a
browser to decide prices, inventory quantities, payment status, or reservation
status.

## Architecture and documentation

The detailed documentation is maintained in [`docs/`](./docs):

- [Architecture](./docs/ARCHITECTURE.md) — application boundaries, data flow,
  directory map, current data model, and integration strategy.
- [Agent instructions](./docs/AGENT_INSTRUCTIONS.md) — coding, security,
  validation, and completion rules for contributors and coding agents.
- [AI prompt library](./prompt/README.md) — reusable briefs for features, bug
  fixes, migrations, Supabase RLS, integrations, UI work, and code reviews.
- [Documentation index](./docs/README.md) — an index of the documents above.

Read the architecture document before changing application behavior. Update the
relevant documentation in the same pull request when changing a data boundary,
security policy, external integration, or team workflow.

## Getting started

### Prerequisites

- Node.js **20.9+**
- npm
- Access to the team's Supabase project
- A Supabase PostgreSQL connection string when generating or applying database
  migrations

### First-time setup

1. Clone the repository and install dependencies:

   ```bash
   git clone <repository-url>
   cd self-portrait-studio
   npm install
   ```

2. Create your local environment file from the tracked template:

   ```bash
   cp .env.example .env.local
   ```

   On Windows PowerShell, use:

   ```powershell
   Copy-Item .env.example .env.local
   ```

3. Get the Supabase URL and publishable key from the team’s approved secret
   manager or Supabase project settings, then populate `.env.local`.

4. If you need database access, set `DATABASE_URL` to the approved development
   database connection string. Do not point local migration commands at a
   shared or production database without explicit team approval.

5. Generate and apply the database migration only when the schema or migration
   history requires it:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

7. Before opening a pull request, run:

   ```bash
   npm run lint
   npm run build
   ```

## Environment variables

`.env.local` is private and ignored by Git. `.env.example` documents the full
set of variable names without secrets.

| Variable                               | Used by                | Required                      | Notes                                                                     |
| -------------------------------------- | ---------------------- | ----------------------------- | ------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Browser and server     | Yes                           | Supabase project URL; safe to expose to the browser                       |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser and server     | Yes                           | Supabase publishable key; safe to expose when RLS is correctly configured |
| `DATABASE_URL`                         | Server and Drizzle Kit | For database commands/queries | PostgreSQL connection string; never expose to the browser                 |
| `BOTCAKE_BASE_URL`                     | Server                 | When Botcake is enabled       | Provider endpoint                                                         |
| `BOTCAKE_API_KEY`                      | Server                 | When Botcake is enabled       | Provider secret                                                           |
| `PAYMENT_SERVICE_BASE_URL`             | Server                 | When payments are enabled     | Payment provider endpoint                                                 |
| `PAYMENT_SERVICE_API_KEY`              | Server                 | When payments are enabled     | Payment provider secret                                                   |
| `CONTAVO_BASE_URL`                     | Server                 | When Contavo is enabled       | Provider endpoint                                                         |
| `CONTAVO_API_KEY`                      | Server                 | When Contavo is enabled       | Provider secret                                                           |

### Secret-handling rules

- Never commit `.env.local`, credentials, private keys, webhook secrets, or
  connection strings.
- Never use the `NEXT_PUBLIC_` prefix for `DATABASE_URL`, a service-role key,
  or any provider secret.
- Rotate a secret through the approved secret-management process if it is
  exposed in a commit, issue, log, or chat.
- Do not paste production credentials into test fixtures or screenshots.

## Daily development

| Command               | Purpose                                                  |
| --------------------- | -------------------------------------------------------- |
| `npm run dev`         | Start the local Next.js development server               |
| `npm run lint`        | Run ESLint across the project                            |
| `npm run build`       | Produce a production build and run TypeScript validation |
| `npm run db:generate` | Generate Drizzle migrations from `src/db/schema.ts`      |
| `npm run db:migrate`  | Apply Drizzle migrations using `DATABASE_URL`            |
| `npm run db:studio`   | Open Drizzle Studio using `DATABASE_URL`                 |

### UI development

Use the existing Tailwind and shadcn/ui conventions. The project is initialized
with the Supabase shadcn registry, so components can be added through the
shadcn CLI rather than copied manually. Keep shared UI primitives in
`src/components/ui/`; compose feature-specific components outside that folder.

### Supabase client usage

The Supabase shadcn block provides:

- `src/lib/client.ts` for browser components
- `src/lib/server.ts` for server components, route handlers, and server actions
- `src/lib/middleware.ts` for session-refresh behavior

Existing equivalent helpers also live in `src/lib/supabase/`. Do not mix the
two helper patterns within a feature. Consolidate callers onto one convention
before removing the unused helper set.

## Database workflow

The Drizzle schema lives in [`src/db/schema.ts`](./src/db/schema.ts). The
current `profiles` and portrait-oriented tables are bootstrap placeholders, not
the target model. Replace them with reviewed models for the three subsystems;
do not reuse the `portraits` table for reservation, billing, or inventory data.

The target data model must cover:

| Subsystem                     | Core domain records                                                          |
| ----------------------------- | ---------------------------------------------------------------------------- |
| Booking & Reservation         | Availability, reservations, status transitions, and customer/guest records   |
| POS & Billing                 | Orders, line items, bills, payments, receipts, and payment events            |
| Inventory & Supply Management | Items, suppliers, stock movements, adjustments, receiving, and replenishment |

### Making a schema change

1. Confirm the change belongs in the relational database and determine its
   authorization model before editing the schema.
2. Update `src/db/schema.ts`, including any `drizzle-zod` schema that callers
   use.
3. Generate a migration with `npm run db:generate`.
4. Review the generated SQL carefully, including destructive operations,
   defaults, indexes, foreign keys, and RLS implications.
5. Apply it only to the intended environment with `npm run db:migrate`.
6. Update the architecture documentation if the data model or data flow changes.

Generated migrations are source-controlled. Do not edit migration metadata by
hand. Do not apply unreviewed or destructive changes to shared databases.

> `updated_at` currently receives an insert default only. Add an update trigger
> or update it explicitly in the write path before treating it as a reliable
> last-modified timestamp.

## Repository layout

```text
src/
├── app/                     # App Router pages, layouts, and route handlers
│   └── api/health/           # Liveness endpoint
├── components/ui/            # shadcn/ui primitives
├── db/
│   ├── index.ts              # Server-only Drizzle client
│   └── schema.ts             # Tables, enums, and drizzle-zod schemas
└── lib/
    ├── client.ts             # Supabase browser client
    ├── server.ts             # Supabase server client
    ├── middleware.ts         # Supabase session refresh helper
    ├── integrations/         # Server-only provider configuration contracts
    └── supabase/             # Existing Supabase helpers from the initial scaffold

docs/                        # Team architecture, agent guidance, and templates
prompt/                      # Reusable prompts for AI-assisted development work
drizzle.config.ts             # Drizzle Kit configuration
components.json               # shadcn/ui configuration and Supabase registry
```

## Security and data handling

### Authentication and authorization

- Identify the current user on the server with the Supabase server client.
- Do not trust user IDs, role flags, Storage paths, prices, or provider status
  values sent by the browser.
- Do not make authorization decisions from editable Supabase `user_metadata`.
- Every `public`-schema table exposed to Supabase must have Row Level Security
  enabled and policies that enforce ownership.
- `TO authenticated` confirms a role but does **not** limit access to the
  caller’s records. Combine it with an ownership predicate.
- Updates require both `USING` and `WITH CHECK` ownership conditions.

### Storage

- Treat operational documents and other uploaded files as private business data.
- Store object paths in the owning domain record; never persist long-lived
  public URLs.
- Generate short-lived signed URLs only after confirming the requesting user is
  authorized to access the object.
- Storage policies must enforce the same role, tenant, or ownership boundary as
  the database.

### Validation and provider calls

- Validate every route parameter, mutation payload, webhook payload, and
  provider response with Zod.
- Validate money, quantities, reservation dates, status transitions, and
  permitted Storage paths before persistence or provider calls.
- Verify payment and provider webhook signatures against the raw request body.
- Make webhook handlers idempotent: providers may retry the same event.
- Do not log credentials, complete payment details, signed URLs, or raw
  sensitive provider payloads.

See [`docs/AGENT_INSTRUCTIONS.md`](./docs/AGENT_INSTRUCTIONS.md) for the full
implementation checklist.

## External integrations

The configuration boundary is
[`src/lib/integrations/contracts.ts`](./src/lib/integrations/contracts.ts).
It currently reads typed, server-only configuration for Botcake, the payment
service, and Contavo; it does not yet make provider requests.

When introducing a provider client:

1. Keep it in `src/lib/integrations/` and expose a narrow domain operation.
2. Call it only from server-side code.
3. Define request/response Zod schemas and map provider errors to safe
   application errors.
4. Set timeouts and retry only idempotent operations.
5. Verify webhook signatures and store idempotency keys before side effects.
6. Document the required environment variables, data shared with the provider,
   and any operational runbook.

## Team workflow

### Before starting work

- Read the architecture and agent instructions for the affected area.
- Search for existing routes, components, schemas, and integration contracts.
- Write down the owning subsystem, user outcome, authorization rule, data
  impact, cross-subsystem behavior, and validation plan. Use the
  [AI prompt library](./prompt/README.md) for scoped work.

### Pull requests

Keep pull requests focused and include:

- a clear description of the user-visible behavior and owning subsystem;
- database migrations and RLS/Storage changes when data access changes;
- transaction, audit, reversal, and retry behavior for financial, stock, or
  cross-subsystem changes;
- test coverage where test infrastructure exists;
- documentation updates when boundaries or workflows change; and
- confirmation that `npm run lint` and `npm run build` passed.

Request review before applying migrations to a shared environment. Flag changes
that can affect existing users, data retention, payment flows, or provider
costs.

### Definition of done

A change is complete when it satisfies its acceptance criteria, enforces the
correct user/object authorization, validates external input, preserves secret
boundaries, updates needed documentation, and passes the relevant validation
commands.

## Deployment

AWS is the intended deployment target but deployment infrastructure has not yet
been committed. Before the first deployment, the team must define:

- environment-specific secret storage and rotation;
- an AWS runtime, network boundary, domain, TLS, and logging strategy;
- CI/CD checks for linting, builds, migrations, and rollback;
- a reviewed migration and backup/restore process; and
- production Supabase Auth, RLS, Storage, and webhook configuration.

Do not treat a successful local build as proof that a production configuration
is ready.

## Troubleshooting

| Problem                                       | What to check                                                                                                                        |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Supabase client reports missing configuration | Confirm both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` exist in `.env.local`, then restart `npm run dev` |
| Drizzle command fails before connecting       | Confirm `DATABASE_URL` is set and is reachable from your machine                                                                     |
| A query or update returns no rows             | Check RLS policies, ownership predicates, and the required `SELECT` policy for updates                                               |
| An uploaded file cannot be read               | Check the Storage object path, bucket privacy, signed URL generation, and Storage policies                                           |
| A production build fails locally              | Run `npm run lint`, inspect the first TypeScript error, and verify local environment requirements without exposing secrets           |
| Provider webhook fails or repeats             | Verify the raw-body signature check and idempotency handling before retrying events                                                  |

## Need help?

Start with the documentation in [`docs/`](./docs). For repository-specific
implementation questions, include the route or component, expected behavior,
affected user role, relevant error output with secrets removed, and the
validation already attempted.
