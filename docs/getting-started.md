# Getting Started with IOA

A step-by-step guide to your first IOA-validated organization.

**Time required:** ~5 minutes

## Prerequisites

- Node.js >= 20
- npm or pnpm

## Step 1: Initialize Your Project

```bash
mkdir my-org && cd my-org
npx @ioa/cli init --name my-org --org "My Company" --domain myco.com
```

**Expected output:**
```
🏗  IOA Init

  Project:      my-org
  Organization: My Company
  Domain:       myco.com

  ✓ .ioa/config.json
  ✓ .ioa/domains/
  ✓ .ioa/agents/
  ✓ .ioa/decisions/
  ✓ .ioa/telemetry/
  ✓ .ioa/governance/
  ✓ .ioa/workflows/

✅ Initialized IOA project with N files.
```

This creates a `.ioa/` directory with the standard IOA structure.

## Step 2: Create Your First Domain

Create `.ioa/domains/engineering.yaml`:

```yaml
apiVersion: ioa.dev/v0.2
kind: Domain
metadata:
  name: engineering
  owner:
    name: "Jane Smith"
    role: engineering-lead
spec:
  purpose: "Software engineering — build, ship, and maintain the product"
  kpis:
    - name: deployment-frequency
      target:
        operator: gte
        value: 10
        unit: deploys/week
    - name: lead-time
      target:
        operator: lte
        value: 2
        unit: days
  dataOwnership:
    - name: source-code
      classification: internal
    - name: deployment-configs
      classification: confidential
  events:
    produces:
      - engineering.deployed
      - engineering.incident-detected
    consumes:
      - product.feature-prioritized
  agents:
    - code-reviewer
```

## Step 3: Create Your First Agent

Create `.ioa/agents/code-reviewer.yaml`:

```yaml
apiVersion: ioa.dev/v0.2
kind: Agent
metadata:
  name: code-reviewer
  owner:
    name: "Jane Smith"
    role: engineering-lead
spec:
  domain: engineering
  type: advisory
  role: analytical
  purpose: "Review pull requests for code quality, security issues, and best practices"
  model:
    provider: anthropic
    name: claude-sonnet-4
    version: "2025-05-14"
  capabilities:
    - name: code-analysis
      type: analysis
      description: "Analyze code for bugs, style issues, and security vulnerabilities"
    - name: review-generation
      type: generation
      description: "Generate review comments with suggestions"
  governance:
    escalatesTo: engineering-lead
    requiresApproval: false
    auditLevel: summary
  tokenBudget:
    maxDaily: 200000
    maxMonthly: 4000000
    alertAt: 0.8
```

## Step 4: Validate

```bash
npx @ioa/cli validate
```

**Expected output:**
```
🔍 IOA Validate

  Validating .ioa/ ...

  ✓ config.json — Config — valid
  ✓ domains/engineering.yaml — Domain — valid
  ✓ agents/code-reviewer.yaml — Agent — valid

  Cross-references:
  ✓ Agent "code-reviewer" references domain "engineering" — found

✅ All 3 resources valid. 0 errors.
```

If you see errors, check:
- YAML syntax (indentation matters)
- Required fields (each resource kind has different requirements)
- Cross-references (agent's domain must match a domain name)

## Step 5: Check Status

```bash
npx @ioa/cli status
```

**Expected output:**
```
📊 IOA Status

  Project: my-org (v0.2)

  Resources:
    Domains:    1
    Agents:     1
    Decisions:  0
    Telemetry:  0
    Governance: 0
    Workflows:  0

  Health: ✓ All resources valid
```

## Step 6: Record a Decision

Create `.ioa/decisions/dec-001-code-review-agent.yaml`:

```yaml
apiVersion: ioa.dev/v0.2
kind: Decision
metadata:
  name: dec-001-code-review-agent
  owner:
    name: "Jane Smith"
    role: engineering-lead
spec:
  id: "DEC-001"
  status: accepted
  domain: engineering
  date: "2026-02-25"
  reviewDate: "2026-05-25"
  initiatedBy:
    type: human
    name: "Jane Smith"
  context: "Manual code reviews are bottlenecking deployment frequency. We need to decide whether to add an AI code review agent."
  deciders:
    - name: "Jane Smith"
      role: engineering-lead
    - name: "CTO"
      role: executive
  options:
    - name: "Manual only"
      description: "Keep current manual review process"
      pros: ["Full human control", "No AI costs"]
      cons: ["Slow", "Bottleneck at scale"]
    - name: "AI-assisted review"
      description: "Add advisory AI agent for first-pass review"
      pros: ["Faster reviews", "Consistent quality checks", "Catches security issues"]
      cons: ["AI costs", "May miss context"]
      estimatedCost: "$200/month"
  chosen: "AI-assisted review"
  rationale: "AI advisory agent handles routine checks (style, security, bugs). Humans focus on architecture and design decisions. Expected 40% reduction in review time."
  assumptions:
    - id: A1
      statement: "AI can reliably catch common security issues"
      status: untested
    - id: A2
      statement: "Engineering team will trust and use AI reviews"
      status: untested
  kpiImpact:
    - kpi: deployment-frequency
      expected: "+40% through faster reviews"
    - kpi: lead-time
      expected: "-30% for routine PRs"
  reversibility: easy
```

Run validate again:
```bash
npx @ioa/cli validate
```

All 4 resources should pass validation.

## What's Next?

1. **Add governance:** Create a governance policy for your domain
2. **Add telemetry:** Define event contracts for key actions
3. **Add workflows:** Model multi-agent orchestration as DAGs
4. **Add security:** Create a SecurityPolicy for data classification
5. **Add budgets:** Set token budgets and cost alerts

### Learn More

| Topic | Document |
|-------|----------|
| All resource kinds | [Resource Model](resource-model.md) |
| Security best practices | [Threat Model](security/threat-model.md) |
| Workflow patterns | [Pattern Catalog](workflows/pattern-catalog.md) |
| Budget management | [Token Accounting](economics/token-accounting.md) |
| Anti-patterns to avoid | [Anti-Patterns](anti-patterns.md) |
| The IOA vision | [Manifesto](manifesto.md) |
| Complete terminology | [Glossary](glossary.md) |
