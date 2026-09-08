# Domain Docs

Engineering skills should consume this repo’s domain documentation as follows.

## Before exploring

- Read `CONTEXT.md` at the repo root.
- Read ADRs in `docs/adr/` that touch the area being explored.

If these files do not exist, proceed silently. Create them lazily when domain terms or architectural decisions are resolved.

## File structure

This is a single-context repo:

```text
/
├── CONTEXT.md
├── docs/adr/
└── src/
```

## Use the glossary vocabulary

When output names a domain concept, use the term defined in `CONTEXT.md`. If the needed concept is not defined, note the gap for domain modeling.

## Flag ADR conflicts

If output contradicts an existing ADR, surface the conflict explicitly instead of silently overriding it.
