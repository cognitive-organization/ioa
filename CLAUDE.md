# IOA — Applied Organizational Intelligence

## Project Structure
- Monorepo with pnpm workspaces + Turborepo
- 4 packages: `doctrine`, `schemas`, `templates`, `cli`
- Dependency chain: doctrine → schemas → templates → cli

## Commands
- `pnpm install` — install all dependencies
- `pnpm build` — build all packages (respects dependency order)
- `pnpm test` — run all tests
- `pnpm --filter @ioa/cli dev` — dev mode for CLI

## Architecture Decisions
- Kubernetes-style resource model: apiVersion/kind/metadata/spec
- YAML for user files, JSON Schema for validation
- tsup for building TypeScript packages
- Handlebars for scaffolding templates
- Doctrine is versioned independently under content/v{major}.{minor}/

## Conventions
- All YAML resources use `apiVersion: ioa.dev/v0.1`
- Schema IDs follow pattern: `https://ioa.dev/schemas/v0.1/{kind}.json`
- CLI binary is `ioa` (from @ioa/cli)
- Cross-reference validation: agents reference domains, telemetry references agents
