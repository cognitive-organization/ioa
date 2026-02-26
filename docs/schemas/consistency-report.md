# IOA Schema Consistency Report

Date: 2026-02-25
Schemas Audited: 7 (domain, agent, decision, telemetry, governance, workflow, config)
TypeScript Types: `packages/schemas/src/types/resources.ts`

## Summary

| Category | Issues Found | Fixed | Remaining |
|----------|-------------|-------|-----------|
| Enum mismatches | 1 | 1 | 0 |
| Type mismatches | 3 | 3 | 0 |
| Missing fields | 2 | 2 | 0 |
| Structural inconsistencies | 1 | 1 | 0 |
| **Total** | **7** | **7** | **0** |

---

## Enum Registry

Complete table of ALL enums across ALL 7 schema files:

### Domain Schema (`domain.schema.json`)

| Path | Enum Values | Notes |
|------|-------------|-------|
| `apiVersion` | `ioa.dev/v0.1`, `ioa.dev/v0.2` | Backward compatible |
| `kind` | `Domain` (const) | |
| `spec.kpis[].target.operator` | `gt`, `lt`, `eq`, `gte`, `lte` | Structured KPI target |
| `spec.dataOwnership[].classification` | `public`, `internal`, `confidential`, `restricted` | Structured data ownership |
| `status.health` | `healthy`, `degraded`, `critical` | |
| `status.conditions[].status` | `True`, `False`, `Unknown` | K8s-style condition |

### Agent Schema (`agent.schema.json`)

| Path | Enum Values | Notes |
|------|-------------|-------|
| `apiVersion` | `ioa.dev/v0.1`, `ioa.dev/v0.2` | Backward compatible |
| `kind` | `Agent` (const) | |
| `spec.type` | `autonomous`, `supervised`, `advisory`, `reactive` | Agent autonomy type |
| `spec.role` | `strategic`, `tactical`, `analytical`, `governance`, `observer` | Agent role taxonomy (v0.2) |
| `spec.capabilities[].type` | `analysis`, `generation`, `classification`, `monitoring`, `orchestration` | Structured capability |
| `spec.governance.auditLevel` | `full`, `summary`, `none` | |
| `spec.memory.type` | `session`, `persistent`, `shared` | |
| `spec.memory.scope` | `agent-private`, `domain`, `organization` | |
| `spec.schedule.type` | `continuous`, `cron`, `event-driven` | |
| `status.state` | `running`, `paused`, `degraded`, `failed`, `learning`, `idle` | Runtime state |
| `status.conditions[].status` | `True`, `False`, `Unknown` | K8s-style condition |

### Decision Schema (`decision.schema.json`)

| Path | Enum Values | Notes |
|------|-------------|-------|
| `apiVersion` | `ioa.dev/v0.1`, `ioa.dev/v0.2` | Backward compatible |
| `kind` | `Decision` (const) | |
| `spec.status` | `proposed`, `accepted`, `active`, `deprecated`, `superseded`, `reversed` | Lifecycle phase (see Design Decisions) |
| `spec.initiatedBy.type` | `human`, `agent` | |
| `spec.assumptions[].status` | `valid`, `invalidated`, `untested` | |
| `spec.reversibility` | `easy`, `moderate`, `hard`, `irreversible` | |
| `status.state` | `proposed`, `active`, `reversed`, `archived` | Runtime observation (see Design Decisions) |
| `status.conditions[].status` | `True`, `False`, `Unknown` | K8s-style condition |

### Telemetry Schema (`telemetry.schema.json`)

| Path | Enum Values | Notes |
|------|-------------|-------|
| `apiVersion` | `ioa.dev/v0.1`, `ioa.dev/v0.2` | Backward compatible |
| `kind` | `Telemetry` (const) | |
| `spec.category` | `metric`, `log`, `trace`, `alert`, `audit` | |
| `spec.severity` | `info`, `warning`, `error`, `critical` | Top-level severity |
| `spec.correlationId.format` | `uuid`, `ulid`, `custom` | |
| `spec.observability.alertRule.condition.operator` | `gt`, `lt`, `eq`, `gte`, `lte` | Same as KPI operator |
| `spec.observability.alertRule.severity` | `info`, `warning`, `error`, `critical` | Same as spec.severity |
| `status.conditions[].status` | `True`, `False`, `Unknown` | K8s-style condition |

### Governance Schema (`governance.schema.json`)

| Path | Enum Values | Notes |
|------|-------------|-------|
| `apiVersion` | `ioa.dev/v0.1`, `ioa.dev/v0.2` | Backward compatible |
| `kind` | `Governance` (const) | |
| `spec.audit.level` | `full`, `summary`, `none` | Same as agent.spec.governance.auditLevel |
| `status.complianceStatus` | `compliant`, `non-compliant`, `under-review` | |
| `status.conditions[].status` | `True`, `False`, `Unknown` | K8s-style condition |

### Workflow Schema (`workflow.schema.json`)

| Path | Enum Values | Notes |
|------|-------------|-------|
| `apiVersion` | `ioa.dev/v0.2` | v0.2 only (new resource kind) |
| `kind` | `Workflow` (const) | |
| `spec.steps[].onFailure` | `abort`, `skip`, `compensate` | |
| `spec.failurePolicy` | `compensate`, `retry`, `abort` | |
| `status.state` | `idle`, `queued`, `executing`, `blocked`, `completed`, `failed`, `compensating` | |
| `status.conditions[].status` | `True`, `False`, `Unknown` | K8s-style condition |

### Config Schema (`config.schema.json`)

| Path | Enum Values | Notes |
|------|-------------|-------|
| (none) | — | Config has no enums; it is a project-level config, not a K8s-style resource |

### Shared Enum Patterns

| Enum | Used In | Values |
|------|---------|--------|
| `conditions[].status` | All 6 K8s-style resources | `True`, `False`, `Unknown` |
| `apiVersion` | Domain, Agent, Decision, Telemetry, Governance | `ioa.dev/v0.1`, `ioa.dev/v0.2` |
| `apiVersion` | Workflow | `ioa.dev/v0.2` only |
| `auditLevel` | Agent (spec.governance), Governance (spec.audit.level) | `full`, `summary`, `none` |
| `severity` | Telemetry (spec, alertRule) | `info`, `warning`, `error`, `critical` |
| `operator` | Domain (KPI target), Telemetry (alertRule condition) | `gt`, `lt`, `eq`, `gte`, `lte` |

---

## Cross-Reference Registry

| Source Resource | Field | Target Resource | Target Field | Notes |
|----------------|-------|-----------------|--------------|-------|
| Agent | `spec.domain` | Domain | `metadata.name` | Agent belongs to a domain |
| Agent | `spec.governance.escalatesTo` | Agent / Human | `metadata.name` | Escalation target |
| Domain | `spec.agents[]` | Agent | `metadata.name` | Domain lists its agents |
| Domain | `spec.budgetRef` | Budget (future) | `metadata.name` | Forward reference to Budget resource |
| Domain | `spec.securityPolicyRef` | SecurityPolicy (future) | `metadata.name` | Forward reference to Security resource |
| Decision | `spec.domain` | Domain | `metadata.name` | Decision belongs to a domain |
| Decision | `spec.relatedWorkflow` | Workflow | `metadata.name` | Links decision to workflow |
| Decision | `spec.supersededBy` | Decision | `metadata.name` | Links to superseding decision |
| Telemetry | `spec.source.domain` | Domain | `metadata.name` | Event source domain |
| Telemetry | `spec.source.agent` | Agent | `metadata.name` | Event source agent |
| Governance | `spec.domain` | Domain | `metadata.name` | Governance applies to a domain |
| Governance | `spec.extends` | Governance | `metadata.name` | Policy inheritance |
| Workflow | `spec.domainsInvolved[]` | Domain | `metadata.name` | Domains participating in workflow |
| Workflow | `spec.steps[].agent` | Agent | `metadata.name` | Agent executing step |
| Workflow | `spec.compensation[].agent` | Agent | `metadata.name` | Agent executing compensation |

---

## Metadata Consistency

All 6 K8s-style resources (Domain, Agent, Decision, Telemetry, Governance, Workflow) share an **identical** metadata block structure:

```json
{
  "type": "object",
  "required": ["name"],
  "properties": {
    "name": { "type": "string", "pattern": "^[a-z][a-z0-9-]*$" },
    "owner": {
      "oneOf": [
        { "type": "string" },
        { "type": "object", "required": ["name"], "properties": { "name": { "type": "string" }, "role": { "type": "string" } } }
      ]
    },
    "labels": { "type": "object", "additionalProperties": { "type": "string" } },
    "annotations": { "type": "object", "additionalProperties": { "type": "string" } },
    "version": { "type": "string" },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" }
  }
}
```

**Verified**: All 6 schemas have byte-identical metadata blocks. CONSISTENT.

The Config schema does NOT have metadata (it is a project-level config, not a K8s-style resource).

TypeScript `IoaMetadata` interface matches the schema exactly.

---

## Status/Conditions Consistency

All 6 K8s-style resources include a `status.conditions` array with **identical** structure:

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "required": ["type", "status"],
    "properties": {
      "type": { "type": "string" },
      "status": { "enum": ["True", "False", "Unknown"] },
      "reason": { "type": "string" },
      "message": { "type": "string" },
      "lastTransitionTime": { "type": "string", "format": "date-time" }
    }
  }
}
```

**Verified**: All 6 schemas have byte-identical conditions blocks. CONSISTENT.

TypeScript `IoaCondition` interface matches the schema exactly.

---

## Design Decisions Documented

### `spec.status` vs `status.state` in Decision

The Decision resource has TWO different status-related fields with DIFFERENT enum values. **This is intentional by design.**

#### `spec.status` (Lifecycle Phase)
- **Enum**: `proposed`, `accepted`, `active`, `deprecated`, `superseded`, `reversed`
- **Set by**: Humans / decision-makers
- **Purpose**: Tracks the lifecycle phase of the decision itself
- **Semantics**: A decision progresses through lifecycle stages. "accepted" means stakeholders have agreed. "deprecated" means it is being phased out. "superseded" means a newer decision replaces it.

#### `status.state` (Runtime Observation)
- **Enum**: `proposed`, `active`, `reversed`, `archived`
- **Set by**: Controllers / runtime systems
- **Purpose**: Tracks the runtime observation of the decision's effect
- **Semantics**: Reflects what is actually happening in the system. A decision can be "accepted" in spec (agreed upon) but not yet "active" in status (implementation hasn't started). "archived" is a terminal state for decisions whose effects have been fully absorbed.

#### Why They Differ
The spec/status split follows the Kubernetes desired-state vs observed-state pattern:
- `spec.status` = "What stage is this decision in its lifecycle?" (desired/declared)
- `status.state` = "What is the actual runtime state of this decision?" (observed)

The extra values in `spec.status` (`accepted`, `deprecated`, `superseded`) represent human-driven lifecycle transitions that don't map directly to runtime observations. The extra value in `status.state` (`archived`) represents a controller-driven terminal state.

---

## Issues Fixed

### Issue 1: Telemetry alertRule.severity enum mismatch

**File**: `packages/schemas/src/types/resources.ts`
**Location**: `IoaTelemetryAlertRule.severity`

**Before**:
```typescript
severity?: "warning" | "critical";
```

**After**:
```typescript
severity?: "info" | "warning" | "error" | "critical";
```

**Reason**: The schema (`telemetry.schema.json` line 100) defines `alertRule.severity` as `["info", "warning", "error", "critical"]`. The TypeScript type was missing `"info"` and `"error"`.

---

### Issue 2: Agent.spec.schedule type mismatch

**File**: `packages/schemas/src/types/resources.ts`
**Location**: `IoaAgentSpec.schedule`

**Before**:
```typescript
schedule?: IoaAgentSchedule | string;
```

**After**:
```typescript
schedule?: IoaAgentSchedule;
```

**Reason**: The schema defines `spec.schedule` as a plain object with `{type, cron}`. The `| string` union had no basis in the schema and could allow invalid values.

---

### Issue 3: Agent status costConsumed mismatch

**File**: `packages/schemas/src/agent.schema.json` (schema updated to match richer TS type)
**Location**: `status.costConsumed`

**Before (schema)**:
```json
"costConsumed": {
  "type": "object",
  "properties": {
    "value": { "type": "number" },
    "currency": { "type": "string" }
  }
}
```

**After (schema)**:
```json
"costConsumed": {
  "type": "object",
  "properties": {
    "tokens": { "type": "number" },
    "cost": { "type": "number" },
    "currency": { "type": "string" },
    "period": { "type": "string" }
  }
}
```

**Reason**: The TypeScript type `IoaAgentStatus.costConsumed` had a richer structure with `tokens`, `cost`, `currency`, and `period`. The schema's `value` field was renamed to `cost` for clarity (cost in monetary terms), and `tokens` and `period` were added to support token tracking and time-bounded cost reporting. The TS type was already correct; the schema was updated to match.

---

### Issue 4: Domain status.costToDate missing period

**File**: `packages/schemas/src/domain.schema.json` (schema)
**File**: `packages/schemas/src/types/resources.ts` (TypeScript)
**Location**: `status.costToDate`

**Before (schema)**:
```json
"costToDate": {
  "type": "object",
  "properties": {
    "value": { "type": "number" },
    "currency": { "type": "string" }
  }
}
```

**After (schema)**:
```json
"costToDate": {
  "type": "object",
  "properties": {
    "value": { "type": "number" },
    "currency": { "type": "string" },
    "period": { "type": "string" }
  }
}
```

**Before (TypeScript)**:
```typescript
costToDate?: { value?: number; currency?: string };
```

**After (TypeScript)**:
```typescript
costToDate?: { value?: number; currency?: string; period?: string };
```

**Reason**: The v0.2 spec requires `period` to indicate the time range for cost accumulation (e.g., "monthly", "quarterly"). Both schema and TypeScript type were updated.

---

### Issue 5: Config schema missing paths for new resource types

**File**: `packages/schemas/src/config.schema.json` (schema)
**File**: `packages/schemas/src/types/resources.ts` (TypeScript)
**Location**: `paths`

**Before**:
```json
"paths": {
  "type": "object",
  "properties": {
    "domains": { "type": "string", "default": "domains" },
    "agents": { "type": "string", "default": "agents" },
    "decisions": { "type": "string", "default": "decisions" },
    "telemetry": { "type": "string", "default": "telemetry" },
    "governance": { "type": "string", "default": "governance" },
    "workflows": { "type": "string", "default": "workflows" }
  }
}
```

**After**:
```json
"paths": {
  "type": "object",
  "properties": {
    "domains": { "type": "string", "default": "domains" },
    "agents": { "type": "string", "default": "agents" },
    "decisions": { "type": "string", "default": "decisions" },
    "telemetry": { "type": "string", "default": "telemetry" },
    "governance": { "type": "string", "default": "governance" },
    "workflows": { "type": "string", "default": "workflows" },
    "security": { "type": "string", "default": "security" },
    "budgets": { "type": "string", "default": "budgets" },
    "memory": { "type": "string", "default": "memory" }
  }
}
```

**Reason**: The Domain resource already has `budgetRef` and `securityPolicyRef` cross-references, and Agent has `memory` configuration. The config paths need to support the directories for these future resource types. Both schema and TypeScript `IoaConfigPaths` interface were updated.

---

### Issue 6: Governance escalation.paths[].channel should be optional

**File**: `packages/schemas/src/types/resources.ts`
**Location**: `IoaGovernanceEscalationPath`

**Before**:
```typescript
export interface IoaGovernanceEscalationPath {
  level: number;
  role: string;
  channel: string;
  timeout?: string;
}
```

**After**:
```typescript
export interface IoaGovernanceEscalationPath {
  level: number;
  role: string;
  channel?: string;
  timeout?: string;
}
```

**Reason**: The schema (`governance.schema.json`) only requires `["level", "role"]` for escalation path items. The `channel` property is defined but not required. The TypeScript type had `channel` as required (non-optional), creating a stricter contract than the schema. Fixed to make `channel` optional with `?`.

---

### Issue 7: CLAUDE.md says "6 resource kinds" but there are 7

**File**: `CLAUDE.md`

**Before**:
```
- 6 resource kinds: Domain, Agent, Decision, Telemetry, Governance, Workflow
```

**After**:
```
- 7 resource kinds: Domain, Agent, Decision, Telemetry, Governance, Workflow, Config
```

**Reason**: Config is the 7th schema/resource kind. While Config is not a K8s-style resource (it lacks apiVersion/kind/metadata/spec/status), it is still a schema-validated resource kind in the IOA system.

---

## Recommendations for Future

### New Resource Types
When `SecurityPolicy`, `Budget`, and `Memory` schemas are created, they **MUST** follow the same patterns:
- K8s-style structure: `apiVersion` / `kind` / `metadata` / `spec` / `status`
- Identical metadata block (copy from any existing resource schema)
- Identical `status.conditions` array structure
- `apiVersion` should include `"ioa.dev/v0.2"` (and potentially `"ioa.dev/v0.3"` if introduced in a later version)
- `additionalProperties: false` at root level

### Enum Registration
All new enums should be registered in this report. When adding a new enum:
1. Add to the JSON Schema
2. Add matching type to `resources.ts`
3. Update this report's Enum Registry section

### Cross-Reference Validation
The CLI `ioa validate` command should be expanded to validate cross-references for new resource types:
- SecurityPolicy referenced by `domain.spec.securityPolicyRef`
- Budget referenced by `domain.spec.budgetRef`
- Memory configuration referenced by `agent.spec.memory`

### Shared Enum Extraction
Consider extracting shared enums (operator, severity, auditLevel, conditions.status) into a shared definitions file or `$ref` references to reduce duplication across schemas.

### Cost Object Standardization
There are currently three cost-related objects with slightly different shapes:
- `agent.status.costConsumed`: `{ tokens, cost, currency, period }`
- `domain.status.costToDate`: `{ value, currency, period }`
- `workflow.status.costAccumulated`: `{ tokens, cost, currency }`
- `decision.status.executionCost`: `{ value, currency }`

Consider standardizing these to a single `IoaCostObject` with all fields: `{ tokens?, value?, cost?, currency?, period? }` or defining a shared `$ref` schema.
