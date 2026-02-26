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
- Kubernetes-style resource model: apiVersion/kind/metadata/spec/status
- YAML for user files, JSON Schema for validation
- tsup for building TypeScript packages
- Handlebars for scaffolding templates
- Doctrine is versioned independently under content/v{major}.{minor}/
- v0.2 "Runtime Architecture": spec (desired state) + status (runtime state)
- Backward compatible: schemas accept both v0.1 and v0.2 apiVersion

## Conventions
- All YAML resources use `apiVersion: ioa.dev/v0.2` (v0.1 still accepted)
- Schema IDs follow pattern: `https://ioa.dev/schemas/v0.2/{kind}.json`
- CLI binary is `ioa` (from @ioa/cli)
- Cross-reference validation: agents→domains, telemetry→agents, workflows→agents+domains
- 11 resource kinds: Domain, Agent, Decision, Telemetry, Governance, Workflow, SecurityPolicy, Budget, Controller, Memory, Config

## CLI Commands
- `ioa init` — scaffold .ioa/ with v0.2 templates
- `ioa validate` — validate YAML against schemas + cross-references
- `ioa status` — dashboard of resources in terminal
- `ioa migrate` — migrate v0.1 resources to v0.2 format (supports --dry-run)
- `ioa generate <type> <name>` — scaffold a new resource YAML (7 types: domain, agent, workflow, decision, security-policy, budget, memory)

## Ops
- Project Board: https://github.com/orgs/cognitive-organization/projects/1
- Board Fields: Status (Roadmap/Backlog/Tonight/Running/Review/Done/Blocked), Priority (P0-P3), Agent (Builder/Architect/Research/Docs)
- Nightly Agent: `.github/workflows/nightly-agent.yml` (22:00 BRT, processes Tonight queue via Claude Code Action)
- Daily Digest: `.github/workflows/daily-digest.yml` (06:00 BRT weekdays, posts to issue #1 + Slack)
- Secrets: ANTHROPIC_API_KEY, GH_PAT, SLACK_WEBHOOK_URL (optional)
