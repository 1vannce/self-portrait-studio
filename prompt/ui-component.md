# UI Component Prompt

```md
## Goal
[Screen/component, users, and supported task.]

## Investigation
Read `docs/AGENT_INSTRUCTIONS.md` and `docs/ARCHITECTURE.md`. Inspect related
routes, components, data contracts, and shadcn/ui primitives before editing.

## Scope
- Route or placement: [describe]
- Data source and server/client boundary: [describe]
- Loading, empty, error, success, and unauthorized states: [describe]
- Inputs, validation feedback, labels, keyboard/focus behavior: [describe]

## Requirements
- Reuse existing Tailwind/shadcn patterns; put shared primitives in
  `src/components/ui/`.
- Do not put secrets, database access, or authorization in browser code.
- Define a validated route/action contract before wiring mutations.
- Do not join independent domain workflows with client-side state.

## Deliverable
Run `npm run lint` and `npm run build`. Report responsive/accessibility
behavior, changed files, and manual states verified.
```
