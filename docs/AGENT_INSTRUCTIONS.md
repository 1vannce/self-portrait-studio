# Agent Instructions

Read [Architecture](./ARCHITECTURE.md) before changing application behavior.
This project uses Next.js 16, Supabase, Drizzle, Zod, and shadcn/ui.

## Working rules

1. **Inspect before editing.** Find the existing feature, route, schema, and
   tests before proposing a change. Keep changes focused on the request.
2. **Use current framework guidance.** Before changing Next.js or Supabase
   behavior, inspect the installed package guidance or current upstream docs.
   Next.js 16 conventions may differ from older versions.
3. **Preserve boundaries.** Browser code may use only `NEXT_PUBLIC_*` values.
   Database access, provider clients, signature verification, and secret keys
   belong in server-only code.
4. **Validate at boundaries.** Parse mutation input, route parameters, webhook
   payloads, and provider responses with Zod. Use the schemas in
   `src/db/schema.ts` as a starting point, then add operation-specific limits
   and business rules.
5. **Authenticate and authorize separately.** Fetch the current user on the
   server. Never accept an ownership ID from the client without checking it
   against that user. Do not use editable Supabase `user_metadata` for access
   control.
6. **Protect data at the database layer.** Every `public`-schema table exposed
   through Supabase requires RLS and ownership-aware policies. `TO
authenticated` alone is not authorization. Updates require `USING` and
   `WITH CHECK` predicates.
7. **Keep assets private.** Store Storage paths in the database, not permanent
   public URLs. Issue signed URLs only after authorization. Do not upload or
   serve a file based solely on a client-provided path.
8. **Respect subsystem ownership.** Keep Booking & Reservation, POS & Billing,
   and Inventory & Supply Management as explicit domain modules. Define a
   transaction, retry, and audit strategy before a change crosses subsystem
   boundaries.
9. **Protect financial and stock records.** Use integer minor units or fixed
   precision for money, never floating point. Record inventory movements rather
   than silently overwriting counts. Do not delete finalized bills, payments,
   or stock movements; use reversals or corrections.
10. **Use Drizzle for application queries.** Put table changes in
    `src/db/schema.ts`, generate a reviewed migration, and keep `drizzle-zod`
    schemas aligned. Do not hand-edit generated migration metadata.
11. **Treat payments and webhooks as hostile input.** Verify each provider
    signature with the raw request body, record idempotency keys, and make event
    handlers safe to retry.
12. **Do not leak secrets.** Never commit `.env.local`, log tokens or raw
    credentials, or prefix server credentials with `NEXT_PUBLIC_`.
13. **Reuse the UI system.** Add shadcn components through its CLI and compose
    components in `src/components`. Avoid adding another styling system without
    a clear need.
14. **Document meaningful changes.** Update architecture, setup instructions,
    or the prompt template whenever a data boundary, integration, or workflow
    changes.

## Implementation checklist

- [ ] Identify the server/client boundary and required environment values.
- [ ] Define or reuse a Zod schema for every external input.
- [ ] Confirm authentication and record/object authorization.
- [ ] Add or revise RLS and Storage policies when data-access behavior changes.
- [ ] Add an idempotency and signature-verification plan for any webhook.
- [ ] Define audit and reversal behavior for financial or inventory changes.
- [ ] Confirm availability and transactional behavior for reservation changes.
- [ ] Update Drizzle schema, migration, and validation together for data-model
      changes.
- [ ] Add focused tests where the project has test coverage for the area.
- [ ] Run `npm run lint` and `npm run build` before completing the task.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run db:generate
npm run db:migrate
npm run db:studio
```

`db:*` commands require `DATABASE_URL`. Do not run migrations against a shared
or production database without explicit confirmation and a reviewed migration.
