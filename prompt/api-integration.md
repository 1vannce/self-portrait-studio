# API Integration Prompt

```md
## Goal
[Provider and domain operation, such as sending a reservation notification.]

## Investigation
Read `docs/AGENT_INSTRUCTIONS.md` and `docs/ARCHITECTURE.md`. Inspect
`src/lib/integrations/contracts.ts`, existing handlers, and current official
provider documentation before implementation.

## Integration contract
- Provider and server-side operation: [describe]
- Application inputs and expected output: [describe]
- Environment variable names only: [list; never values]
- Timeout, retry rules, error mapping, and data shared: [describe]
- Webhook endpoint, raw-body signature verification, and idempotency: [describe]

## Requirements
- Put provider clients in `src/lib/integrations/` with narrow operations.
- Call providers only from server-side code.
- Validate provider requests and responses with Zod.
- Never log secrets, raw sensitive payloads, payment details, or signed URLs.
- Never use `NEXT_PUBLIC_*` for provider credentials.

## Deliverable
Add focused tests or mocks where possible. Run `npm run lint` and
`npm run build`; report environment names, failure/retry behavior, webhook plan,
changed files, and setup steps.
```
