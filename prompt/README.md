# AI Development Prompt Library

Reusable prompts for asking an AI coding assistant to work on this repository.
Replace bracketed text, remove inapplicable sections, and never include secrets,
connection strings, signed URLs, or private customer data.

Before using a template, state the user outcome, scope, acceptance criteria,
and owning subsystem or supporting module. Require the AI to read
`docs/AGENT_INSTRUCTIONS.md` and `docs/ARCHITECTURE.md` before making changes.

| Template | Use when |
| --- | --- |
| [feature.md](./feature.md) | Adding a user-facing workflow or capability |
| [bug-fix.md](./bug-fix.md) | Diagnosing and fixing an existing behavior |
| [database-migration.md](./database-migration.md) | Changing Drizzle tables, constraints, or migrations |
| [supabase-rls.md](./supabase-rls.md) | Adding or reviewing Supabase authorization policies |
| [api-integration.md](./api-integration.md) | Connecting a server-side external provider |
| [ui-component.md](./ui-component.md) | Building or revising a UI component or screen |
| [code-review.md](./code-review.md) | Reviewing a proposed or completed change |

All implementation prompts should require `npm run lint` and `npm run build`
unless the AI reports why either command cannot run.
