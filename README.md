# IOA — Applied Organizational Intelligence

> The open standard for designing, governing, and evolving AI-native organizations.

[![CI](https://github.com/cognitive-organization/ioa/actions/workflows/ci.yml/badge.svg)](https://github.com/cognitive-organization/ioa/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## What is IOA?

IOA is **Kubernetes for organizational architecture**. It provides:

- **12 principles** (doctrine) for designing AI-native organizations
- **A resource model** where domains, agents, decisions, workflows, and policies are declared as YAML
- **JSON Schemas** for validation and type safety
- **A CLI** for scaffolding, validation, and compliance dashboards
- **Spec/Status pattern** — declare desired state, observe actual state, reconcile the gap

IOA is NOT a SaaS product, a framework, or a consulting methodology.
IOA IS a versioned, open standard backed by executable tooling.

## Quick Start

```bash
# Scaffold a new IOA project
npx @ioa/cli init --name my-org --org "My Company" --domain myco.com

# Validate your resources
npx @ioa/cli validate

# View your organization dashboard
npx @ioa/cli status

# Migrate v0.1 resources to v0.2
npx @ioa/cli migrate --dry-run
```

**5 minutes to your first validated organization.**

## The Resource Model

Every IOA resource follows the Kubernetes pattern:

```yaml
apiVersion: ioa.dev/v0.2
kind: Domain
metadata:
  name: product
  owner:
    name: "Acme AI"
    role: domain-owner
  labels:
    tier: core
spec:
  purpose: "Core product development — features, roadmap, and user experience"
  kpis:
    - name: feature-velocity
      target:
        operator: gte
        value: 12
        unit: features/quarter
      window: "1q"
  events:
    produces: [product.feature-released, product.feedback-analyzed]
    consumes: [analytics.user-behavior, growth.churn-signal]
  budgetRef: product-q1-budget
  securityPolicyRef: default-security
  agents: [product-analyst, product-copilot]
status:
  health: healthy
  costToDate:
    value: 12500
    currency: USD
  cognitiveLoadScore: 0.65
```

**`spec`** = desired state (what you want)
**`status`** = actual state (what controllers observe)

### Resource Kinds

| Kind | Layer | Purpose | Status |
|------|-------|---------|--------|
| **Domain** | Domain Architecture | Bounded context with KPIs, events, data ownership | Implemented |
| **Agent** | Agent Topology | AI agent with type, role, capabilities, budget | Implemented |
| **Decision** | Decision Intelligence | Tracked decision with lifecycle and assumptions | Implemented |
| **Telemetry** | Signal Architecture | Event contract with payload, metrics, alerts | Implemented |
| **Governance** | Governance | Policies, access control, escalation, human override | Implemented |
| **Workflow** | Workflow Orchestration | Multi-agent DAG with compensation logic | Implemented |
| **SecurityPolicy** | Trust & Security | Agent identity, data scopes, zero-trust, prompt injection defense | Implemented |
| **Budget** | Cognitive Economics | Token/cost limits, alerts, enforcement | Implemented |
| **Controller** | Reconciliation | Vendor-neutral controller interface for the reconciliation loop | Implemented |
| **Config** | Project | Project-level configuration | Implemented |

## The 12 Principles

| # | Principle | Core Idea |
|---|-----------|-----------|
| 1 | **Domain-First Architecture** | Start with domain boundaries, not team hierarchies |
| 2 | **Agent Topology** | Every agent has explicit type, role, and domain binding |
| 3 | **Decision Architecture** | Decisions are first-class resources with lifecycle |
| 4 | **Event-Driven Telemetry** | All signals flow as structured, namespaced events |
| 5 | **Governance by Design** | Access control and audit trails designed upfront |
| 6 | **Cognitive Load Distribution** | AI handles routine; humans handle novel |
| 7 | **Memory and Context** | Organizational knowledge is explicit and versioned |
| 8 | **Feedback Loops** | Built-in measurement and improvement mechanisms |
| 9 | **Human Override Principle** | Humans can override any AI decision, always |
| 10 | **Composability** | Complex behaviors from simple, well-defined primitives |
| 11 | **Observability First** | If you can't observe it, you can't manage it |
| 12 | **Evolutionary Architecture** | Gradual, versioned change — no big-bang rewrites |

Full doctrine: [`packages/doctrine/content/v0.1/`](packages/doctrine/content/v0.1/INDEX.md)

## v0.2 "Runtime Architecture"

The key evolution from v0.1:

| Aspect | v0.1 | v0.2 |
|--------|------|------|
| State model | spec only | **spec + status** |
| Resources | 6 kinds | **10 kinds** (+Workflow, SecurityPolicy, Budget, Controller) |
| Agent taxonomy | type only | **type + role** (orthogonal) |
| KPI targets | Free-text | **Structured** (operator, value, unit) |
| Security | Part of Governance | **First-class SecurityPolicy** |
| Economics | Absent | **First-class Budget** with alerts |
| Orchestration | Absent | **Workflow** (DAG with compensation) |
| Enforcement | Binary | **Four levels** (enforce/warn/advise/observe) |

### Controller Pattern

Controllers reconcile spec (desired) with status (actual):

```
WATCH → DIFF → PLAN → ACT → REPORT
  ↑                              │
  └──────── reconcileInterval ───┘
```

A controller can be a human, an AI agent, a cron job, or any process that implements the loop.

## Packages

| Package | Description |
|---------|-------------|
| [`@ioa/doctrine`](packages/doctrine) | 12 principles as versioned markdown |
| [`@ioa/schemas`](packages/schemas) | JSON Schemas + TypeScript types + validators |
| [`@ioa/templates`](packages/templates) | Handlebars templates for scaffolding |
| [`@ioa/cli`](packages/cli) | CLI tool (`ioa` binary) |

## CLI Commands

| Command | Description |
|---------|-------------|
| `ioa init` | Scaffold a `.ioa/` directory with v0.2 templates |
| `ioa validate` | Validate YAML against schemas + cross-references |
| `ioa status` | Display compliance dashboard in terminal |
| `ioa migrate` | Convert v0.1 resources to v0.2 format (`--dry-run` supported) |

## Example

See [`examples/ai-native-startup/`](examples/ai-native-startup/) for a complete reference implementation:

- 3 domains (product, growth, analytics)
- 4 agents (product-analyst, growth-optimizer, data-pipeline, insight-reporter)
- 2 decisions with assumptions tracking
- 2 telemetry events with retention policies
- 1 governance policy with escalation paths
- 1 workflow (churn-response with compensation)
- 1 security policy (zero-trust, prompt injection defense)
- 1 budget (quarterly with alerts)

All passing `ioa validate`.

## Documentation

| Document | Description |
|----------|-------------|
| [Resource Model](docs/resource-model.md) | Complete reference for all resource kinds |
| [Resource Dependencies](docs/diagrams/resource-dependencies.md) | Dependency graphs and layer mapping |
| [Controller Spec](docs/controller-spec.md) | Reconciliation loop specification |
| [Threat Model](docs/security/threat-model.md) | Security analysis per resource kind |
| [Schema Consistency](docs/schemas/consistency-report.md) | Enum registry and cross-reference map |

## Development

```bash
git clone https://github.com/cognitive-organization/ioa.git
cd ioa
pnpm install
pnpm build

# Validate the example
cd examples/ai-native-startup
node ../../packages/cli/dist/bin/ioa.js validate
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and the doctrine amendment process.

## License

MIT — see [LICENSE](LICENSE).

---

**IOA is independent and open.** Built by [Paulo Lima](https://paribali.com.br). Contributions welcome.
