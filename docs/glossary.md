# IOA Glossary

All terms used in the IOA standard, alphabetically.

---

**Agent** — An intelligent participant (AI or hybrid) bound to a single domain. Has a type (autonomy level) and role (function). Declared as a YAML resource with spec/status.

**Agent Topology** — Principle #2. The design of agent types, roles, capabilities, and domain bindings within an organization.

**Anti-Pattern** — A common mistake in organizational design. See [Anti-Patterns Playbook](anti-patterns.md).

**apiVersion** — Version identifier for IOA resources. Current: `ioa.dev/v0.2`. Previous: `ioa.dev/v0.1`.

**Budget** — IOA resource (v0.2) that defines token and cost limits per domain. Includes alerts, enforcement mode, and per-agent allocations.

**Capabilities** — Declared abilities of an agent. Structured as name + type (analysis/generation/classification/monitoring/orchestration) + description.

**Cognitive Load** — Principle #6. The mental demand placed on participants. Measured as `cognitiveLoadScore` (0-1) in Domain.status. AI should handle routine work; humans handle novel work.

**Compensation** — In workflows, the reverse action that undoes a completed step. Compensations run in reverse order when a saga fails.

**Composability** — Principle #10. Complex organizational behaviors emerge from simple, well-defined resource primitives.

**Compounding Memory** — Memory that gains value over time as it is referenced by subsequent decisions, workflows, and observations. See [Compounding Patterns](memory/compounding-patterns.md).

**Condition** — K8s-style status condition: `{ type, status: True/False/Unknown, reason, message, lastTransitionTime }`. All IOA resources have conditions in their status block.

**Config** — Project-level configuration file (`.ioa/config.json`). NOT a K8s-style resource — does not have apiVersion/kind/metadata pattern.

**Controller** — IOA resource (v0.2) that implements the reconciliation loop. Watches resources, detects drift, and takes corrective actions.

**CorrelationId** — Unique identifier that links related telemetry events across a workflow execution. Format: UUID or ULID.

**Cross-Reference Validation** — Validation that ensures references between resources are valid (e.g., Agent.spec.domain must reference an existing Domain).

**DAG** — Directed Acyclic Graph. The execution model for IOA Workflows. Steps have dependencies but no cycles.

**Data Classification** — Security levels for data assets: public, internal, confidential, restricted. Defined in Domain.spec.dataOwnership and SecurityPolicy.spec.dataScopes.

**Decision** — IOA resource that records an architectural or organizational choice with full lifecycle (proposed → accepted → active → superseded/deprecated).

**Decision Architecture** — Principle #3. Decisions are first-class, tracked resources — not chat logs or meeting notes.

**Doctrine** — The 12 principles that form IOA's intellectual foundation. Versioned independently. Current: v0.1.

**Domain** — IOA resource representing a bounded organizational context. The primary isolation boundary. Contains KPIs, data ownership, events, and agent bindings.

**Domain-First Architecture** — Principle #1. Start with domain boundaries, not team hierarchies. Structure precedes intelligence.

**Drift** — The gap between spec (desired state) and status (actual state). Controllers detect and correct drift.

**Drift Score** — Numerical measure (0-1) of divergence between spec and status. Calculated by controllers.

**Enforcement Mode** — Graduated response levels: enforce (block), warn (allow + alert), advise (recommend), observe (log only).

**Error Budget** — The difference between 100% and the SLO target. Represents the acceptable amount of failure.

**Event-Driven Telemetry** — Principle #4. All organizational signals flow as structured, namespaced events.

**Evolutionary Architecture** — Principle #12. Architecture supports gradual, versioned change. No big-bang rewrites.

**Feedback Loops** — Principle #8. Every process has built-in measurement and improvement mechanisms.

**Governance** — IOA resource defining access control, audit policies, escalation paths, human override, and compliance requirements.

**Governance by Design** — Principle #5. Access control and audit trails are designed upfront, not added later.

**Human Override Principle** — Principle #9. Humans can override any AI decision at any time. Kill switches and override paths must be regularly tested.

**IOA** — Applied Organizational Intelligence. An open standard for designing, governing, and evolving AI-native organizations.

**Kind** — The type of an IOA resource: Domain, Agent, Decision, Telemetry, Governance, Workflow, SecurityPolicy, Budget, Memory, Controller, Config.

**KPI** — Key Performance Indicator. Defined in Domain.spec.kpis with structured targets (operator, value, unit).

**Memory** — IOA resource (v0.2) representing organizational knowledge. Has scope (agent/domain/organization), retention policies, and compounding value.

**Memory and Context** — Principle #7. Organizational knowledge is explicit, versioned, and queryable across sessions.

**Metadata** — Standard fields on all IOA resources: name, owner (structured), labels, annotations, version, createdAt, updatedAt.

**Observability First** — Principle #11. If you can't observe it, you can't manage it. All actions, decisions, and events must be observable.

**Reconciliation Loop** — The five-phase controller pattern: Watch → Diff → Plan → Act → Report. Converges actual state toward desired state.

**Resource** — A declarative YAML/JSON object following the IOA schema. All resources have apiVersion, kind, metadata, spec, and (optionally) status.

**Resource Model** — The complete set of IOA resource kinds and their relationships. See [Resource Model](resource-model.md).

**Retention** — How long data is kept. Defined in Telemetry and Memory resources. Format: duration string (e.g., "90d", "1y", "permanent").

**Role** — Agent function dimension: strategic, tactical, analytical, governance, observer. Orthogonal to type.

**Saga** — A workflow pattern where each step has a compensating action. If any step fails, completed steps are rolled back in reverse order.

**Schema** — JSON Schema definition for an IOA resource kind. Used for validation. Located in `packages/schemas/src/`.

**SecurityPolicy** — IOA resource (v0.2) defining security boundaries: agent identity, data scopes, zero-trust rules, prompt injection defense.

**SLI** — Service Level Indicator. A quantitative measure of resource health.

**SLO** — Service Level Objective. A target value for an SLI. Defines acceptable performance.

**Spec** — The desired state of a resource. Set by humans or higher-level controllers. "What you want."

**Status** — The actual/observed state of a resource. Updated by controllers. "What you have." Contains conditions array.

**Telemetry** — IOA resource defining an event contract with payload schema, metrics, and observability settings.

**Token Budget** — Per-agent token consumption limits. Defined in Agent.spec.tokenBudget (maxDaily, maxMonthly, alertAt).

**Type** — Agent autonomy dimension: autonomous (acts independently), supervised (needs approval), advisory (recommends only), reactive (responds to events).

**Workflow** — IOA resource (v0.2) modeling multi-agent, cross-domain orchestration as a DAG. Includes steps, compensation, retry policies, and timeout.

**Zero-Trust** — Security model where no agent is trusted by default. Every action requires verification. Configured in SecurityPolicy.spec.zeroTrust.
