# Contributing to IOA

Thank you for your interest in contributing to IOA. This document covers the guidelines for contributing code, schemas, and doctrine amendments.

## Development Setup

```bash
git clone https://github.com/paribali/ioa.git
cd ioa
pnpm install
pnpm build
```

## Package Structure

```
packages/
├── doctrine/    # @ioa/doctrine — 12 principles (zero deps)
├── schemas/     # @ioa/schemas — JSON Schemas + validators (depends on doctrine)
├── templates/   # @ioa/templates — Handlebars scaffolds (depends on schemas)
└── cli/         # @ioa/cli — CLI tool (depends on schemas + templates)
```

Build order follows the dependency chain: doctrine → schemas → templates → cli.

## Types of Contributions

### Bug Fixes & Features

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Ensure `pnpm build` and `pnpm typecheck` pass
4. Ensure the example project validates: `cd examples/ai-native-startup && node ../../packages/cli/dist/bin/ioa.js validate`
5. Submit a PR

### Schema Changes

Schema changes affect validation for all users. When modifying schemas:

1. Update the JSON Schema in `packages/schemas/src/`
2. Update the corresponding TypeScript types in `packages/schemas/src/types/`
3. Update templates in `packages/templates/scaffolds/` if needed
4. Update the example project to remain valid
5. Document the change in your PR

### Doctrine Amendments

The doctrine is the intellectual foundation of IOA. Amendments follow a structured process:

1. **Open an issue** using the "Doctrine Amendment" template
2. **Specify** which principle(s) are affected
3. **Provide evidence** — real-world examples, research, or implementation experience
4. **Discussion period** — minimum 7 days for community input
5. **Decision** — maintainers review and decide
6. **Implementation** — if accepted, create a PR with the changes

Doctrine amendments are versioned. Breaking changes to principles increment the minor version (e.g., v0.1 → v0.2).

## Code Style

- TypeScript with strict mode
- ESM modules
- No default exports (except where required by tooling)
- Meaningful variable names over comments

## Commit Messages

Use conventional commits:

```
feat(cli): add --format flag to status command
fix(schemas): allow optional KPIs in domain spec
docs(doctrine): clarify agent topology boundaries
```

## Questions?

Open an issue or start a discussion.
