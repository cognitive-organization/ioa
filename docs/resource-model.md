# IOA Resource Model v0.2 — "Runtime Architecture"

**Version:** v0.2.0
**Date:** 2026-02-25
**Status:** Current
**Spec Reference:** `_strategy/04-v0.2-spec.md`

---

## Overview

Every IOA resource follows the Kubernetes pattern: `apiVersion`, `kind`, `metadata`, `spec`, and `status`. The **spec** declares desired state — what humans or higher-level controllers intend. The **status** reflects observed reality — what controllers detect at runtime. The reconciliation loop continuously drives status toward spec, closing the gap between intent and actuality.

This document is the canonical reference for all 11 resource kinds defined in IOA v0.2. Seven schemas are implemented and validated today. Four are planned for v0.2.1 and v0.2.2.

---

## Universal Resource Structure

Every IOA resource (except Config) follows this template:

```yaml
apiVersion: ioa.dev/v0.2
kind: <ResourceKind>
metadata:
  name: string                        # kebab-case, unique within kind
  owner:                              # structured {name, role} — string also accepted for v0.1 compat
    name: string
    role: string
  labels:                             # arbitrary key-value pairs for filtering
    key: value
  annotations:                        # non-identifying metadata
    key: value
  version: string                     # resource version (optimistic concurrency)
  createdAt: datetime                 # ISO 8601
  updatedAt: datetime                 # ISO 8601
spec:
  # Desired state — declared by humans or higher-level controllers
  # Fields vary per resource kind
status:
  # Observed state — updated by controllers at runtime
  # Fields vary per resource kind
  conditions:                         # K8s-style condition array
    - type: string                    # condition name (e.g., "Ready", "BudgetHealthy")
      status: "True" | "False" | "Unknown"
      reason: string                  # machine-readable reason code
      message: string                 # human-readable explanation
      lastTransitionTime: datetime    # when this condition last changed
```

### Key Design Decisions

**Structured owner.** `metadata.owner` is a structured object with `name` and `role` fields, enabling accountability tracking. For backward compatibility with v0.1, a plain string is also accepted. The `ioa migrate` command converts strings to structured form.

**K8s-style conditions.** `status.conditions` is an array of typed boolean conditions following the Kubernetes convention. Each condition has a `type` (what is being evaluated), a tri-state `status` (True/False/Unknown), a machine-readable `reason`, an optional human-readable `message`, and a `lastTransitionTime`. This is more expressive than a single status enum because a resource can have multiple independent conditions evaluated simultaneously.

**Strict validation.** All implemented schemas set `additionalProperties: false` at the top level. Unknown fields cause validation failures. This prevents configuration drift from typos and enforces schema evolution through explicit versioning.

**Dual apiVersion.** Implemented schemas accept both `ioa.dev/v0.1` and `ioa.dev/v0.2` (except Workflow, which is v0.2-only). The `ioa validate` command handles both versions. The `ioa migrate` command transforms v0.1 resources to v0.2 format.

---

## Resource Catalog

### 1. Domain

| Property | Value |
|----------|-------|
| **Layer** | I — Domain Architecture |
| **Schema** | IMPLEMENTED (`domain.schema.json`) |
| **apiVersion** | `ioa.dev/v0.1`, `ioa.dev/v0.2` |

The top-level bounded context. Domains are the isolation boundary for agents, data, and events. Every agent, decision, and telemetry event belongs to exactly one domain. Cross-domain interaction happens exclusively through declared event contracts and workflows.

**Required fields:**
- `apiVersion`, `kind`, `metadata.name`, `spec.purpose`

**Key spec fields:**

| Field | Type | Description |
|-------|------|-------------|
| `purpose` | string | Domain's reason for existence |
| `kpis[]` | array | Structured targets with `{name, target: {operator, value, unit}, window}` |
| `dataOwnership[]` | array | Data assets with `{name, classification}` (public/internal/confidential/restricted) |
| `events` | object | `{produces: string[], consumes: string[]}` — event contracts |
| `boundaries` | object | `{includes: string[], excludes: string[]}` — scope definition |
| `budgetRef` | string | Reference to a Budget resource |
| `securityPolicyRef` | string | Reference to a SecurityPolicy resource |
| `agents[]` | array | Declared agent bindings (list of Agent names) |

**Key status fields:**

| Field | Type | Description |
|-------|------|-------------|
| `health` | enum | `healthy` / `degraded` / `critical` |
| `costToDate` | object | `{value, currency}` — accumulated spend |
| `decisionVelocity` | object | `{decisionsPerWeek, avgLeadTimeDays}` |
| `cognitiveLoadScore` | number | 0-1 score from Principle 6 (Cognitive Load) |
| `activeAgents` | number | Count of running agents |
| `activeIncidents` | number | Count of open incidents |
| `conditions[]` | array | K8s-style conditions |

**Cross-references:**
- `spec.agents[]` --> `Agent.metadata.name`
- `spec.budgetRef` --> `Budget.metadata.name` (when Budget schema exists)
- `spec.securityPolicyRef` --> `SecurityPolicy.metadata.name` (when SecurityPolicy schema exists)

---

### 2. Agent

| Property | Value |
|----------|-------|
| **Layer** | II — Agent Topology |
| **Schema** | IMPLEMENTED (`agent.schema.json`) |
| **apiVersion** | `ioa.dev/v0.1`, `ioa.dev/v0.2` |

A controller operating over a domain. Agents have two orthogonal taxonomic dimensions: **type** (autonomy level — how much human oversight) and **role** (functional purpose — what the agent does). These are independent axes: an agent can be `type: autonomous` + `role: analytical` or `type: supervised` + `role: analytical`.

**Required fields:**
- `apiVersion`, `kind`, `metadata.name`, `spec.domain`, `spec.type`, `spec.purpose`

**Key spec fields:**

| Field | Type | Description |
|-------|------|-------------|
| `domain` | string | Binding to a Domain resource |
| `type` | enum | `autonomous` / `supervised` / `advisory` / `reactive` — autonomy level |
| `role` | enum | `strategic` / `tactical` / `analytical` / `governance` / `observer` — function |
| `purpose` | string | What this agent does |
| `model` | object | `{provider, name, version}` — AI model specification |
| `capabilities[]` | array | Structured: `{name, type, description}` (types: analysis/generation/classification/monitoring/orchestration) |
| `inputs[]` | array | `{name, schema}` — formal input contracts |
| `outputs[]` | array | `{name, schema}` — formal output contracts |
| `constraints[]` | array | Operational constraints (strings) |
| `triggers[]` | array | `{event, action, condition}` — event-driven activation |
| `governance` | object | `{escalatesTo, requiresApproval, auditLevel}` |
| `memory` | object | `{type, retention, scope}` — memory configuration |
| `controller` | object | `{watches[], reconcileInterval, driftThreshold}` |
| `tokenBudget` | object | `{maxDaily, maxMonthly, alertAt}` |
| `schedule` | object | `{type, cron}` — scheduling mode (continuous/cron/event-driven) |

**Key status fields:**

| Field | Type | Description |
|-------|------|-------------|
| `state` | enum | `running` / `paused` / `degraded` / `failed` / `learning` / `idle` |
| `lastExecution` | datetime | Last execution timestamp |
| `avgLatency` | string | Average response latency |
| `costConsumed` | object | `{value, currency}` — accumulated cost |
| `overrideRate` | number | Fraction of decisions overridden by humans |
| `errorRate` | number | Error rate |
| `healthScore` | number | 0-100 health score |
| `conditions[]` | array | K8s-style conditions |

**Cross-references:**
- `spec.domain` --> `Domain.metadata.name`

---

### 3. Decision

| Property | Value |
|----------|-------|
| **Layer** | III — Decision Intelligence |
| **Schema** | IMPLEMENTED (`decision.schema.json`) |
| **apiVersion** | `ioa.dev/v0.1`, `ioa.dev/v0.2` |

Records architectural or organizational decisions with full lifecycle tracking. Decisions are first-class stateful resources: they are proposed, debated, accepted, monitored, and eventually deprecated or superseded.

**Required fields:**
- `apiVersion`, `kind`, `metadata.name`, `spec.id`, `spec.status`, `spec.domain`, `spec.context`

**Key spec fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Pattern: `DEC-NNN` — unique decision identifier |
| `status` | enum | `proposed` / `accepted` / `active` / `deprecated` / `superseded` / `reversed` — lifecycle phase |
| `domain` | string | Owning domain |
| `date` | date | Decision date |
| `deciders[]` | array | Structured: `{name, role}` or plain strings (v0.1 compat) |
| `initiatedBy` | object | `{type, name, model, confidence}` — who/what initiated |
| `reviewDate` | date | Scheduled review date |
| `context` | string | Decision context and background |
| `options[]` | array | `{name, description, pros[], cons[], estimatedCost}` |
| `chosen` | string | Selected option |
| `rationale` | string | Why this option was chosen |
| `assumptions[]` | array | `{id, statement, status, validatedAt}` — trackable assumptions |
| `kpiImpact[]` | array | `{kpi, expected}` — expected KPI impact |
| `reversibility` | enum | `easy` / `moderate` / `hard` / `irreversible` |
| `relatedWorkflow` | string | Reference to a Workflow resource |
| `supersededBy` | string/null | Reference to the superseding Decision |

**Key status fields:**

| Field | Type | Description |
|-------|------|-------------|
| `state` | enum | `proposed` / `active` / `reversed` / `archived` — runtime observation |
| `actualOutcome` | string | What actually happened |
| `kpiActualImpact[]` | array | `{kpi, expected, actual, variance}` — measured vs expected |
| `executionCost` | object | `{value, currency}` |
| `closedAt` | datetime | When the decision was closed |
| `conditions[]` | array | K8s-style conditions |

> **Important:** `spec.status` and `status.state` have DIFFERENT enum values. `spec.status` is the declared lifecycle phase (proposed/accepted/active/deprecated/superseded/reversed). `status.state` is the runtime observation (proposed/active/reversed/archived). This is intentional: spec declares intent, status reflects reality.

**Cross-references:**
- `spec.domain` --> `Domain.metadata.name`
- `spec.relatedWorkflow` --> `Workflow.metadata.name`

---

### 4. Telemetry

| Property | Value |
|----------|-------|
| **Layer** | IV — Signal Architecture |
| **Schema** | IMPLEMENTED (`telemetry.schema.json`) |
| **apiVersion** | `ioa.dev/v0.1`, `ioa.dev/v0.2` |

Defines event contracts with payload schema, metrics associations, and observability settings. In v0.2, Telemetry merges the v0.1 concepts of Event-Driven Telemetry (Principle 4) and Observability First (Principle 11) into a unified Signal Architecture layer.

**Required fields:**
- `apiVersion`, `kind`, `metadata.name`, `spec.event`, `spec.category`

**Key spec fields:**

| Field | Type | Description |
|-------|------|-------------|
| `event` | string | Namespaced event name, pattern: `domain.event_name` |
| `category` | enum | `metric` / `log` / `trace` / `alert` / `audit` |
| `severity` | enum | `info` / `warning` / `error` / `critical` |
| `description` | string | What this event represents |
| `payload` | object | JSON Schema fragment describing the event payload |
| `metricsImpacted[]` | array | KPI names affected by this event |
| `correlationId` | object | `{required, format}` — correlation tracking (uuid/ulid/custom) |
| `retention` | object | `{duration, archiveAfter}` — data lifecycle |
| `source` | object | `{domain, agent}` — event origin |
| `observability` | object | `{dashboard, alertThreshold, alertRule}` — monitoring configuration |

**Key status fields:**

| Field | Type | Description |
|-------|------|-------------|
| `eventRate` | number | Events per day |
| `lastEmitted` | datetime | Last emission timestamp |
| `errorRate` | number | Error rate |
| `avgPayloadSize` | number | Average payload size in bytes |
| `conditions[]` | array | K8s-style conditions |

**Cross-references:**
- `spec.source.domain` --> `Domain.metadata.name`
- `spec.source.agent` --> `Agent.metadata.name`

---

### 5. Governance

| Property | Value |
|----------|-------|
| **Layer** | VII — Governance |
| **Schema** | IMPLEMENTED (`governance.schema.json`) |
| **apiVersion** | `ioa.dev/v0.1`, `ioa.dev/v0.2` |

Defines governance policies including access control, audit trails, escalation paths, failure modes, and human override channels. In v0.2, security concerns moved to the dedicated SecurityPolicy resource, and Governance gained policy inheritance via `extends`.

**Required fields:**
- `apiVersion`, `kind`, `metadata.name`, `spec.domain`

**Key spec fields:**

| Field | Type | Description |
|-------|------|-------------|
| `domain` | string | Governed domain |
| `extends` | string | Policy inheritance — reference to parent Governance resource |
| `accessControl` | object | `{roles[]: {name, permissions[]}, defaultRole}` |
| `promptVersioning` | object | `{enabled, repository}` — prompt version control |
| `audit` | object | `{enabled, retention, level}` — audit trail configuration |
| `escalation` | object | `{paths[]: {level, role, channel, timeout}, defaultPath}` |
| `compliance` | object | `{standards[], requirements[]}` — regulatory compliance |
| `failureModes[]` | array | `{scenario, response, escalation}` — failure handling |
| `humanOverride` | object | `{enabled, channels[], maxResponseTime}` |

**Key status fields:**

| Field | Type | Description |
|-------|------|-------------|
| `activePolicies` | number | Count of active policies |
| `overrideFrequency` | number | Human overrides per week |
| `escalationRate` | number | Escalations per week |
| `complianceStatus` | enum | `compliant` / `non-compliant` / `under-review` |
| `conditions[]` | array | K8s-style conditions |

**Cross-references:**
- `spec.domain` --> `Domain.metadata.name`
- `spec.extends` --> `Governance.metadata.name`

---

### 6. Workflow

| Property | Value |
|----------|-------|
| **Layer** | V — Workflow Orchestration |
| **Schema** | IMPLEMENTED (`workflow.schema.json`) |
| **apiVersion** | `ioa.dev/v0.2` only (new in v0.2) |

Multi-agent, cross-domain orchestration modeled as a directed acyclic graph (DAG). Workflows coordinate steps across multiple agents and domains, with built-in compensation logic for failure handling. This is a v0.2-only resource.

**Required fields:**
- `apiVersion` (must be `ioa.dev/v0.2`), `kind`, `metadata.name`, `spec.description`, `spec.domainsInvolved`, `spec.steps`

**Key spec fields:**

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Workflow purpose |
| `domainsInvolved[]` | array | Domains participating in this workflow (min: 1) |
| `trigger` | object | `{event, condition, schedule}` — activation trigger |
| `steps[]` | array | DAG steps: `{name, agent, action, dependsOn[], timeout, retryPolicy, onFailure}` |
| `compensation[]` | array | `{step, action, agent}` — rollback actions |
| `timeout` | string | Global workflow timeout |
| `failurePolicy` | enum | `compensate` / `retry` / `abort` |

Step `retryPolicy`: `{maxRetries: integer, backoff: string}`
Step `onFailure`: `abort` / `skip` / `compensate`

**Key status fields:**

| Field | Type | Description |
|-------|------|-------------|
| `state` | enum | `idle` / `queued` / `executing` / `blocked` / `completed` / `failed` / `compensating` |
| `currentStep` | string | Currently executing step |
| `completedSteps[]` | array | Successfully completed steps |
| `failedSteps[]` | array | Failed steps |
| `startedAt` | datetime | Execution start time |
| `completedAt` | datetime/null | Execution end time |
| `retries` | integer | Retry count |
| `latency` | string | Total execution latency |
| `costAccumulated` | object | `{tokens, cost, currency}` |
| `conditions[]` | array | K8s-style conditions |

**Cross-references:**
- `spec.domainsInvolved[]` --> `Domain.metadata.name`
- `spec.steps[].agent` --> `Agent.metadata.name`

---

### 7. Config

| Property | Value |
|----------|-------|
| **Layer** | N/A — Project Configuration |
| **Schema** | IMPLEMENTED (`config.schema.json`) |
| **Pattern** | NOT a K8s-style resource (no apiVersion/kind/metadata) |

Project-level configuration living at `.ioa/config.json`. Config defines project metadata and directory paths for resource discovery. It does not follow the universal resource structure.

**Required fields:**
- `name`, `version`

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Project name |
| `version` | string | IOA doctrine version being used |
| `description` | string | Project description |
| `organization` | object | `{name, domain}` — organization metadata |
| `paths` | object | Directory paths for each resource kind |

**Paths defaults:**

| Path | Default |
|------|---------|
| `paths.domains` | `domains` |
| `paths.agents` | `agents` |
| `paths.decisions` | `decisions` |
| `paths.telemetry` | `telemetry` |
| `paths.governance` | `governance` |
| `paths.workflows` | `workflows` |

**Cross-references:** None. Config is a standalone project descriptor.

---

### 8. SecurityPolicy (PLANNED -- v0.2.1)

| Property | Value |
|----------|-------|
| **Layer** | VIII — Trust & Security |
| **Schema** | NOT YET IMPLEMENTED |
| **Target Release** | v0.2.1 |

Defines security boundaries for agents and data: agent identity, data access scopes, zero-trust rules, prompt security, and audit requirements. Extracted from Governance in v0.2 to give security first-class resource status.

**Planned required fields:**
- `apiVersion`, `kind`, `metadata.name`, `spec.domain`

**Planned spec fields:**

| Field | Type | Description |
|-------|------|-------------|
| `domain` | string | Secured domain (or `"*"` for org-wide) |
| `agentIdentity` | object | `{required, method}` — identity method (certificate/token/api-key) |
| `dataScopes[]` | array | `{resource, classification, allowedAgents[]}` — data access rules |
| `zeroTrust` | object | `{enabled, verifyOnEveryCall, maxSessionDuration}` |
| `auditTrail` | object | `{immutable, retention, events[]}` |
| `promptInjectionDefense` | object | `{enabled, sanitizeInputs, detectPatterns[]}` |
| `enforcementMode` | enum | `enforce` / `warn` / `advise` / `observe` |

**Planned status fields:**

| Field | Type | Description |
|-------|------|-------------|
| `activePolicies` | number | Active security policies |
| `violations` | number | Total violation count |
| `lastAudit` | datetime | Last audit timestamp |
| `threatLevel` | string | Current threat assessment |
| `conditions[]` | array | K8s-style conditions |

**Cross-references:**
- `spec.domain` --> `Domain.metadata.name`

---

### 9. Budget (PLANNED -- v0.2.1)

| Property | Value |
|----------|-------|
| **Layer** | IX — Cognitive Economics |
| **Schema** | NOT YET IMPLEMENTED |
| **Target Release** | v0.2.1 |

Defines token and cost budgets per domain or agent with configurable alerts and enforcement policies. Prevents unbounded AI spend and enables ROI tracking.

**Planned required fields:**
- `apiVersion`, `kind`, `metadata.name`, `spec.domain`, `spec.period`

**Planned spec fields:**

| Field | Type | Description |
|-------|------|-------------|
| `domain` | string | Budgeted domain |
| `period` | object | `{start, end}` — budget period |
| `limits` | object | `{tokens: {daily, monthly, quarterly}, cost: {daily, monthly, quarterly, currency}}` |
| `alerts[]` | array | `{threshold, channels[]}` — alert thresholds |
| `enforcement` | enum | `enforce` / `warn` / `observe` |
| `agents[]` | array | `{name, allocation}` — per-agent budget allocation |

**Planned status fields:**

| Field | Type | Description |
|-------|------|-------------|
| `consumed` | object | `{tokens, cost, currency}` — current consumption |
| `utilizationRate` | number | Percentage of budget used |
| `alertsTriggered` | number | Alerts fired |
| `projectedOverrun` | boolean | Whether an overrun is projected |
| `conditions[]` | array | K8s-style conditions |

**Cross-references:**
- `spec.domain` --> `Domain.metadata.name`

---

### 10. Memory (PLANNED -- v0.2.2)

| Property | Value |
|----------|-------|
| **Layer** | VI — Organizational Memory |
| **Schema** | NOT YET IMPLEMENTED |
| **Target Release** | v0.2.2 |

First-class organizational memory resource with retention policies and scoping. Storage-agnostic — the schema defines what to remember, not how to store it.

**Planned required fields:**
- `apiVersion`, `kind`, `metadata.name`, `spec.scope`

**Planned spec fields:**

| Field | Type | Description |
|-------|------|-------------|
| `scope` | enum | `agent` / `domain` / `organization` |
| `sourceAgent` | string | Agent that produced this memory |
| `sourceDomain` | string | Domain context |
| `entryType` | enum | `decision` / `observation` / `learning` / `context` / `pattern` |
| `content` | any | Memory content (structured or unstructured) |
| `tags[]` | array | Searchable tags |
| `retention` | object | `{duration, archiveAfter}` — lifecycle policy |
| `indexing` | object | `{searchable, embeddings}` — search configuration |
| `references[]` | array | `{kind, name}` — cross-references to other resources |

**Planned status fields:**

| Field | Type | Description |
|-------|------|-------------|
| `accessCount` | number | Total access count |
| `lastAccessed` | datetime | Last access timestamp |
| `relevanceScore` | number | Computed relevance |
| `compoundingValue` | number | Value that increases with use |
| `conditions[]` | array | K8s-style conditions |

**Cross-references:**
- `spec.sourceAgent` --> `Agent.metadata.name`
- `spec.sourceDomain` --> `Domain.metadata.name`

---

### 11. Controller (PLANNED -- v0.2.2)

| Property | Value |
|----------|-------|
| **Layer** | X — Runtime Reconciliation |
| **Schema** | NOT YET IMPLEMENTED |
| **Target Release** | v0.2.2 |

Vendor-neutral controller interface for the reconciliation loop. Controllers watch resources, detect drift between spec and status, and take corrective action. Any AI model, script, or human can implement a controller.

**Planned required fields:**
- `apiVersion`, `kind`, `metadata.name`, `spec.targetKind`

**Planned spec fields:**

| Field | Type | Description |
|-------|------|-------------|
| `targetKind` | string | Resource kind this controller manages |
| `targetSelector` | object | `{matchLabels}` — resource filtering |
| `reconcileInterval` | string | How often to reconcile |
| `driftThreshold` | number | Minimum drift to trigger action |
| `actions` | object | `{onDrift, onError, onHealthy}` — action mapping |
| `hooks` | object | `{preReconcile, postReconcile}` — lifecycle hooks |

**Planned status fields:**

| Field | Type | Description |
|-------|------|-------------|
| `lastReconcile` | datetime | Last reconciliation timestamp |
| `driftDetected` | boolean | Whether drift exists |
| `actionsPerformed` | number | Actions taken in last cycle |
| `healthyResources` | number | Resources in healthy state |
| `unhealthyResources` | number | Resources in unhealthy state |
| `conditions[]` | array | K8s-style conditions |

**Cross-references:**
- `spec.targetKind` references a resource kind (e.g., "Domain", "Agent")

---

## Cross-Reference Validation Rules

IOA validates cross-references between resources during `ioa validate`. A broken reference is a validation error.

### Implemented Validations

| # | Source Field | Target Resource | Direction |
|---|-------------|-----------------|-----------|
| 1 | `Agent.spec.domain` | `Domain.metadata.name` | Agent --> Domain |
| 2 | `Telemetry.spec.source.domain` | `Domain.metadata.name` | Telemetry --> Domain |
| 3 | `Telemetry.spec.source.agent` | `Agent.metadata.name` | Telemetry --> Agent |
| 4 | `Governance.spec.domain` | `Domain.metadata.name` | Governance --> Domain |
| 5 | `Workflow.spec.domainsInvolved[]` | `Domain.metadata.name` | Workflow --> Domain(s) |
| 6 | `Workflow.spec.steps[].agent` | `Agent.metadata.name` | Workflow --> Agent(s) |
| 7 | `Domain.spec.agents[]` | `Agent.metadata.name` | Domain --> Agent(s) |
| 8 | `Decision.spec.domain` | `Domain.metadata.name` | Decision --> Domain |

### Planned Validations

| # | Source Field | Target Resource | Available When |
|---|-------------|-----------------|----------------|
| 9 | `Domain.spec.budgetRef` | `Budget.metadata.name` | v0.2.1 (Budget schema) |
| 10 | `Domain.spec.securityPolicyRef` | `SecurityPolicy.metadata.name` | v0.2.1 (SecurityPolicy schema) |
| 11 | `Memory.spec.sourceAgent` | `Agent.metadata.name` | v0.2.2 (Memory schema) |
| 12 | `Memory.spec.sourceDomain` | `Domain.metadata.name` | v0.2.2 (Memory schema) |

---

## Reconciliation Pattern

The controller reconciliation loop is the core runtime mechanism in IOA. Every controller follows the same five-phase lifecycle:

```
Watch --> Diff --> Plan --> Act --> Report
  ^                                   |
  |___________________________________|
```

### Phase Details

**1. Watch** — Observe resources matching the controller's `targetKind` and `targetSelector`. Changes to watched resources trigger a reconciliation cycle.

**2. Diff** — Compare `spec` (desired state) against `status` (actual state). Compute drift magnitude. If drift is below `driftThreshold`, skip to Report.

**3. Plan** — Determine actions needed to converge status toward spec. The plan respects governance constraints and enforcement policies.

**4. Act** — Execute planned actions. The enforcement model determines how aggressively actions are applied:

| Level | Behavior | When Applied |
|-------|----------|--------------|
| **enforce** | Block non-compliant operations, require correction | SecurityPolicy violations, budget hard limits, schema validation failures |
| **warn** | Allow but log warning, increment violation counter, emit alert | Soft budget thresholds, missing recommended fields, suboptimal configurations |
| **advise** | Log recommendation in status/telemetry, no blocking | Missing optional best practices, potential optimizations |
| **observe** | Passive monitoring only, silent telemetry | Normal operations, baseline data collection |

**5. Report** — Update `status.conditions` on the reconciled resource. Emit telemetry events. Create memory entries if significant patterns are detected.

### Reconciliation Frequency

Controllers run at `spec.reconcileInterval` (e.g., `"5m"`). The controller only acts when drift exceeds `spec.driftThreshold`. Idle cycles (no drift detected) still update `status.conditions` to confirm the resource was evaluated.

### Drift Types

| Drift Type | Description | Default Response |
|------------|-------------|------------------|
| `performance` | KPI below target | Alert + plan |
| `cost` | Budget utilization above threshold | Alert + throttle |
| `compliance` | Security or governance violation | Block + escalate |
| `health` | Agent or domain degraded | Diagnose + recover |
| `staleness` | Decision or memory past review date | Warn |
| `orphan` | Agent references nonexistent domain | Warn + escalate |

---

## Release Plan

| Release | Resources | Theme | Status |
|---------|-----------|-------|--------|
| **v0.2.0** (current) | Domain, Agent, Decision, Telemetry, Governance, Workflow, Config | Core model evolution | Released |
| **v0.2.1** (next) | + SecurityPolicy, + Budget | Economics and Security | Planned |
| **v0.2.2** | + Memory, + Controller | Runtime foundation | Planned |
| **v0.3.0** | `@ioa/runtime` package | First runtime implementation | Planned |

### Release Details

**v0.2.0** — spec/status split on all existing resources. Decision schema gains `active` state, `assumptions[]`, and `actualOutcome`. Workflow resource (DAG-based). Structured KPIs and owners. `ioa migrate` command.

**v0.2.1** — Budget resource for cognitive economics. SecurityPolicy resource for trust and security. Data classification enforcement. `ioa budget` and `ioa security` CLI commands.

**v0.2.2** — Memory resource for organizational context. Controller interface for vendor-neutral reconciliation. Drift detection tooling. `ioa drift` and `ioa reconcile` CLI commands.

**v0.3.0** — Reference runtime implementation (`@ioa/runtime-claude`). Reconciliation engine. Agent-as-controller end-to-end demonstration.

Each release passes `ioa validate` on all examples, includes migration tooling from the previous version, ships updated doctrine content, and maintains backward compatibility.

---

*IOA v0.2 "Runtime Architecture" — from organizational documentation to organizational control plane.*
