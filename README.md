# IOA — Applied Organizational Intelligence

**An open standard for designing AI-native organizations.**

Doctrine + Executability: intellectual principles backed by schemas, validators, and CLI tooling.

```
ioa init → ioa validate → ioa status
```

---

## Why IOA?

Organizations are increasingly augmented by AI agents — but there's no standard for how to design, govern, and evolve these hybrid human-AI systems. IOA fills that gap.

**IOA is not:**
- A SaaS product
- A Notion template pack
- A consulting framework

**IOA is:**
- A versioned **doctrine** (12 principles for AI-native organizations)
- A **resource model** (Kubernetes-style YAML declarations)
- **JSON Schemas** for validation
- A **CLI** for scaffolding, validation, and status reporting

Think Kubernetes for organizational architecture.

## Quick Start

```bash
# Install the CLI
npx @ioa/cli init --name my-org --org "My Company" --domain myco.com

# Validate your configuration
npx @ioa/cli validate

# View your organization dashboard
npx @ioa/cli status
```

## The 12 Principles

| # | Principle | Core Idea |
|---|-----------|-----------|
| 1 | **Domain-First Architecture** | Organization design starts with domain boundaries, not team hierarchies |
| 2 | **Agent Topology** | Every agent has an explicit type, bounded purpose, and domain binding |
| 3 | **Decision Architecture** | Decisions are tracked as first-class resources with lifecycle |
| 4 | **Event-Driven Telemetry** | All signals flow as structured, namespaced events |
| 5 | **Governance by Design** | Access control, audit trails, and failure modes are designed upfront |
| 6 | **Cognitive Load Distribution** | AI handles routine; humans handle novel |
| 7 | **Memory and Context** | Organizational knowledge is explicit, versioned, and queryable |
| 8 | **Feedback Loops** | Every process has built-in measurement and improvement mechanisms |
| 9 | **Human Override Principle** | Humans can override any AI decision at any time |
| 10 | **Composability** | Complex behaviors emerge from simple, well-defined primitives |
| 11 | **Observability First** | If you can't observe it, you can't manage it |
| 12 | **Evolutionary Architecture** | The architecture supports gradual, versioned change |

Full doctrine: [`packages/doctrine/content/v0.1/`](packages/doctrine/content/v0.1/INDEX.md)

## Resource Model

IOA uses a Kubernetes-inspired declarative resource model. All resources follow the same structure:

```yaml
apiVersion: ioa.dev/v0.1
kind: Domain          # Domain | Agent | Decision | Telemetry | Governance
metadata:
  name: product
  owner: "Paulo Lima"
spec:
  purpose: "Core product development"
  kpis:
    - name: feature-velocity
      target: "12 features/quarter"
  events:
    produces: [product.feature-released]
    consumes: [analytics.user-behavior]
```

### Resource Types

| Kind | Purpose | Key Fields |
|------|---------|------------|
| **Domain** | Organizational boundary | purpose, KPIs, data ownership, events |
| **Agent** | AI agent definition | type (autonomous/supervised/advisory/reactive), capabilities, constraints |
| **Decision** | Tracked decision record | status, options, rationale, KPI impact, reversibility |
| **Telemetry** | Event contract | event name, category, payload schema, observability |
| **Governance** | Policy definition | access control, audit, failure modes, human override |

## CLI Commands

| Command | Description |
|---------|-------------|
| `ioa init` | Scaffold a `.ioa/` directory with templates and examples |
| `ioa validate` | Validate YAML resources against schemas + cross-references |
| `ioa status` | Display an organizational compliance dashboard |

## Packages

| Package | Description |
|---------|-------------|
| [`@ioa/doctrine`](packages/doctrine) | The 12 principles as versioned markdown |
| [`@ioa/schemas`](packages/schemas) | JSON Schemas + TypeScript types + validators |
| [`@ioa/templates`](packages/templates) | Handlebars templates for scaffolding |
| [`@ioa/cli`](packages/cli) | CLI tool (`ioa` binary) |

## Example

See [`examples/ai-native-startup/`](examples/ai-native-startup/) for a complete reference implementation with:
- 3 domains (product, growth, analytics)
- 4 agents (product-analyst, growth-optimizer, data-pipeline, insight-reporter)
- 2 decisions
- 2 telemetry events
- 1 governance policy

All passing `ioa validate` at 100%.

## Development

```bash
# Clone and install
git clone https://github.com/paribali/ioa.git
cd ioa
pnpm install

# Build all packages
pnpm build

# Run validation on example
cd examples/ai-native-startup
node ../../packages/cli/dist/bin/ioa.js validate
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines, including the doctrine amendment process.

## License

MIT — see [LICENSE](LICENSE).

---

**IOA is independent and open.** Built by [Paulo Lima](https://paribali.com.br). Contributions welcome.
