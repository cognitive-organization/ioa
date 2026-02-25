# IOA Doctrine v0.1 "Foundation" -- Critical Review

**Reviewer:** Senior Systems Architect
**Date:** 2026-02-25
**Scope:** All 12 principles, 6 schemas, example implementation
**Posture:** Adversarial-constructive. The goal is to stress-test the doctrine against real-world organizational complexity.

---

## 1. Strengths

### 1.1 The Kubernetes Analogy is the Right Analogy

The decision to model organizational resources using the Kubernetes `apiVersion/kind/metadata/spec` pattern (Preamble) is arguably the single best architectural choice in the entire doctrine. It achieves three things simultaneously:

- **Familiarity**: Any engineer who has written a Kubernetes manifest immediately understands the IOA resource model. This dramatically reduces onboarding friction.
- **Toolability**: The declarative, structured format enables validation, diffing, linting, and automation -- the exact properties IOA needs to move from "nice documentation" to "enforceable standard."
- **Precedent**: Kubernetes proved that a declarative resource model can scale from a single-node cluster to planet-scale infrastructure. By borrowing the pattern, IOA inherits the conceptual scalability argument.

This is not accidental cleverness. The Preamble explicitly frames IOA as "Kubernetes for organizations" and the schemas deliver on that promise. The `config.schema.json` even mirrors a kubeconfig. This is a strong foundation.

### 1.2 Domain-First Architecture is Correct and Boldly Stated (Principle 1)

Principle 1 makes a strong, non-obvious claim: design around domains, not teams. This is the organizational equivalent of the "Inverse Conway Maneuver," and the doctrine articulates it with genuine conviction. The anti-patterns section is excellent -- "org-chart mirroring" and "God domains" are precisely the mistakes organizations make. The guideline that agents bind to exactly one domain is a clean, enforceable constraint.

The emphasis on domain boundaries as the primary unit of autonomy, accountability, and composability establishes a coherent thread that runs through the entire doctrine. Principles 2-12 all reference domain boundaries, making Principle 1 the true load-bearing wall.

### 1.3 Decision Architecture as First-Class Resources (Principle 3)

Treating decisions as structured, versioned resources with lifecycle states (`proposed -> accepted -> active -> superseded | deprecated`) is intellectually rigorous and practically valuable. Most frameworks ignore decision-making entirely or relegate it to informal ADRs. IOA goes further by requiring assumptions, options, rationale, KPI impact, and reversibility assessment.

The decision schema (`decision.schema.json`) includes `reversibility` as an enum (`easy`, `moderate`, `hard`), which is a surprisingly mature design choice. This forces decision-makers to confront the cost of being wrong -- a discipline most organizations lack entirely.

### 1.4 The Agent Taxonomy is Crisp (Principle 2)

The four-type taxonomy (autonomous, supervised, advisory, reactive) is clean, covers the relevant autonomy spectrum, and -- critically -- is an enumerated constraint in the schema rather than a suggested guideline. Each type maps naturally to different governance requirements, which Principle 5 leverages. The "Swiss Army Agent" anti-pattern is well-named and immediately recognizable.

### 1.5 Human Override is a Principle, Not a Feature (Principle 9)

Making human override a first-class principle rather than a checkbox is a significant philosophical choice. The distinction between a "kill switch" (stops the system) and an "override path" (redirects it) demonstrates genuine depth of thinking. The requirement to test override paths regularly -- not just document them -- shows awareness that untested safety mechanisms are performative, not protective.

### 1.6 The Anti-Pattern Sections are Consistently Strong

Every principle includes well-chosen anti-patterns. These are not generic warnings; they are specific, named failure modes that experienced practitioners will immediately recognize. "Decision amnesia," "silent agents," "bolt-on governance," "automation addiction," "permanent prototypes" -- these names are precise enough to enter organizational vocabulary. This is one of the most practically useful features of the entire doctrine.

---

## 2. Gaps and Blind Spots

### 2.1 MISSING PRINCIPLE: Security and Trust Model

This is the most significant omission. The doctrine mentions "access control" within Governance by Design (Principle 5) but never elevates security to a principle. In a framework where AI agents access organizational data, make decisions, and communicate across domain boundaries, the absence of a dedicated security principle is a serious gap.

What is missing:
- **Agent identity and authentication.** How does one agent prove it is who it claims to be to another agent or to a domain? The schemas have no concept of agent credentials, certificates, or identity verification.
- **Data classification.** Domains own data, but there is no schema for classifying data sensitivity. An agent in the "growth" domain should not be able to access customer PII the same way it accesses campaign metrics. The `dataOwnership` field in the domain schema is a flat list of strings -- it has no sensitivity tiering.
- **Zero-trust boundaries.** Cross-domain event communication is described but there is no mechanism for verifying event provenance or ensuring events have not been tampered with. In a real system, a malicious or misconfigured agent could emit events that look like they come from a different domain.
- **Prompt injection defense.** For a framework about AI agents, the complete absence of adversarial input handling at the principle level is notable. Governance mentions "adversarial inputs" once in passing. This deserves its own treatment.
- **Secret management.** The agent schema has no concept of how agents obtain credentials for external services.

**Recommendation:** Add a "Security and Trust" principle covering agent identity, data classification, zero-trust event verification, and adversarial input defense.

### 2.2 MISSING PRINCIPLE: Cost and Economics

The doctrine is silent on the economics of AI-native organizations. This is surprising given that AI agent costs (API calls, compute, tokens) can scale unpredictably. A real-world implementation of IOA at a 50-person company could easily spend $50,000/month on LLM API calls without any cost governance.

What is missing:
- **Cost budgets per domain.** Domains have KPIs but no cost constraints. An agent optimizing growth could burn through an unlimited API budget chasing marginal returns.
- **Token/compute accounting.** The agent schema has no field for cost tracking, rate limits, or budget allocation.
- **ROI measurement.** Cognitive Load Distribution (Principle 6) discusses reducing cognitive burden but never frames this in economic terms. How does an organization measure whether an agent is worth its cost?
- **Cost as a telemetry dimension.** The telemetry schema has no way to associate events with cost data.

**Recommendation:** Add an "Operational Economics" principle, or at minimum, extend the agent schema and telemetry schema with cost-related fields.

### 2.3 MISSING PRINCIPLE: Inter-Organizational Collaboration

IOA models a single organization. But modern organizations operate in ecosystems: partners, vendors, platforms, regulators. The doctrine has no concept of:
- Sharing domain definitions or event contracts across organizational boundaries.
- Federated governance: an agent operating under two organizations' governance policies simultaneously.
- External trust boundaries: when an event crosses an organizational boundary, what trust model applies?

This may be out of scope for v0.1, but it should be explicitly acknowledged as a future concern. Currently, the doctrine is silent, which could be mistaken for "it is not needed."

### 2.4 MISSING PRINCIPLE: Culture and Adoption

The doctrine is technically sophisticated but says nothing about how organizations actually adopt it. This is not a soft concern -- it is the primary failure mode for standards.

- How does an organization transition from no-IOA to IOA? The Preamble mentions incremental adoption, but there is no principle about change management.
- What about resistance? Principle 9 (Human Override) addresses the human-AI trust boundary, but not the human-human dynamics of adopting a new organizational framework.
- What about organizational roles? Who is the "IOA owner" in a company? The domain owner role is defined, but who governs the IOA implementation itself?

### 2.5 Principle Overlap: Observability First (P11) vs. Event-Driven Telemetry (P4)

These two principles share significant conceptual territory. Principle 4 says all signals flow as structured events. Principle 11 says all actions must be observable. The "Relationship to Other Principles" section of P11 explicitly states that it "builds directly on Event-Driven Telemetry (Principle 4) as its data source."

If one principle is the data source and the other is the consumption layer of the same system, the question becomes: are these genuinely two principles or two aspects of one principle?

**Counter-argument:** They serve different audiences. Telemetry is for the system architect who designs event schemas; Observability is for the operator who builds dashboards and alerts. The separation is defensible, but the overlap should be more explicitly acknowledged and the boundaries more crisply drawn. As written, both principles end up making similar recommendations about structured data and alerting.

### 2.6 Principle Vagueness: Cognitive Load Distribution (P6)

Principle 6 is the most aspirational and least actionable of the twelve. The four-level cognitive complexity spectrum (routine, structured, analytical, novel) is a reasonable taxonomy, but the principle provides no mechanism for measuring cognitive load, no schema for representing it, and no tooling path for implementing it.

Compare this to Principle 3 (Decision Architecture), which has a corresponding schema, lifecycle states, and concrete fields. Principle 6 has no corresponding schema at all. How does an organization declare which tasks are routine vs. novel? How is this classification versioned? Who decides when a task transitions from "novel" to "routine"?

### 2.7 Principle Vagueness: Feedback Loops (P8)

Similar to P6, Feedback Loops is conceptually sound but lacks operational specificity. The principle says "define measurable success criteria for every agent at deployment time," but the agent schema has no field for success criteria. The principle says "implement automated feedback collection," but there is no feedback schema, no feedback event type, and no mechanism for agents to ingest and act on feedback data.

### 2.8 Memory and Context (P7) Has No Schema

Principle 7 describes organizational knowledge as "explicit, versioned, and queryable." But there is no Memory or Context schema in the schema package. The agent schema has a `memory` field with type and retention, but this is a superficial pointer -- it does not define what context is stored, how it is structured, or how it is queried. A real implementation would need a Context resource type with its own schema, versioning, and query interface.

### 2.9 The Doctrine Says Nothing About Workflow Orchestration

The doctrine defines agents, events, and domains, but says nothing about how multi-step workflows are defined, executed, or monitored. Consider a real scenario: "When a user churns, the growth agent detects the signal, the analytics agent compiles the churn context, the product agent generates a retention offer, and the growth agent delivers it." This is a four-agent, cross-domain workflow. The current architecture can model each step as a trigger-action pair, but there is no resource for defining the workflow as a whole, no mechanism for tracking workflow state, no way to handle partial failures within a workflow, and no concept of workflow timeout or compensation.

This is a serious gap. Without workflow orchestration, IOA organizations will reinvent this primitive ad hoc in every implementation.

### 2.10 The Doctrine Ignores Agent-to-Agent Communication

The only communication mechanism between agents is indirect: Agent A emits an event, Agent B subscribes to it. This is good for loose coupling, but insufficient for scenarios requiring coordination:

- Request-response patterns (Agent A asks Agent B a question and needs the answer before proceeding).
- Negotiation patterns (two agents need to agree on a shared resource allocation).
- Delegation patterns (Agent A assigns a sub-task to Agent B and monitors its completion).

These patterns exist in every multi-agent system beyond trivial scale. The doctrine's silence on them will force implementers to invent proprietary solutions.

### 2.11 No Concept of Agent Lifecycle

The agent schema defines an agent's static configuration, but there is no concept of agent state or lifecycle. Is the agent running? Paused? Degraded? Being upgraded? Decommissioned? In Kubernetes terms, we have the Deployment spec but no Pod status. An `AgentStatus` resource or status subresource is needed.

---

## 3. Schema Critique

### 3.1 Can the Schemas Model a Real 50-Person Company?

**Short answer: Barely.**

A 50-person company would typically have 8-15 domains, 20-40 agents, hundreds of decision records, and thousands of telemetry events per day. The current schemas can represent the static configuration, but they cannot represent the runtime state. There is no:

- Agent status (running, stopped, degraded)
- Event instance (individual event occurrences vs. event type definitions)
- Workflow definition
- Context/memory resource
- Team or person resource
- Cost or budget resource

The schemas model the *design* of an organization but not its *operation*. For a framework that claims to be executable, this is a significant gap.

### 3.2 Domain Schema Critique

**Strengths:**
- Clean structure with purpose, KPIs, data ownership, events, and boundaries.
- The `events.produces` / `events.consumes` contract is excellent for dependency mapping.

**Weaknesses:**
- `metadata.owner` is a free-text string. In the example, every resource has owner `"Acme AI"` -- the organization name, not a person. Principle 1 explicitly states "each domain must have a single human owner." The schema does not enforce this. Owner should be a structured field referencing a person, not a company name.
- `spec.kpis[].target` is a string (`"<1h"`, `">90%"`, `"10000"`). These cannot be programmatically evaluated. A proper KPI target should have a numeric value and a comparison operator, enabling automated threshold checking.
- No concept of domain dependencies or parent/child relationships. A "Platform" domain that supports other domains cannot express that relationship.
- No `status` field. Is this domain active? Being split? Deprecated?

### 3.3 Agent Schema Critique

**Strengths:**
- The four-type enum is properly constrained.
- Triggers with event-action pairs are a clean primitive.
- The governance sub-object (escalatesTo, requiresApproval, auditLevel) is practical.

**Weaknesses:**
- `capabilities` is an array of free-text strings. These cannot be validated, matched, or composed programmatically. If you want to ask "which agents can do sentiment analysis?", you are doing substring matching on prose. Capabilities should have a structured vocabulary or at minimum a `type` + `description` structure.
- No `status` or `state` field. An agent definition without runtime state is a blueprint without a building.
- No `model` field. For an AI agent framework, the schema does not record which model(s) the agent uses. This is critical for governance (Principle 5), audit trails, and reproducibility.
- No `version` field in spec. You cannot track which version of an agent definition is deployed.
- No `dependencies` field. An agent might depend on external APIs, databases, or other agents. These dependencies are invisible.
- No `schedule` or `cadence` field. Some agents run continuously; others run on a schedule. The schema cannot distinguish between them.
- No `cost` or `budget` field.
- No `inputs`/`outputs` formal declaration. The purpose is prose, but there is no structured way to declare what data an agent consumes and what it produces (beyond triggers).
- `memory.type` has only three values: `session`, `persistent`, `shared`. This is too coarse. Real memory systems need scope (domain, organization, agent-private), storage backend references, and size limits.

### 3.4 Decision Schema Critique

**Strengths:**
- The lifecycle (`proposed`, `accepted`, `deprecated`, `superseded`) is sound.
- The options array with pros/cons is well-structured.
- `reversibility` is a genuinely useful field.
- `supersededBy` enables decision chain tracking.

**Weaknesses:**
- The status enum is missing `active`. The doctrine text (Principle 3) defines the lifecycle as `proposed -> accepted -> active -> superseded | deprecated`, but the schema enum only has `proposed`, `accepted`, `deprecated`, `superseded`. The `active` state is absent from the schema, contradicting the principle it implements.
- No `assumptions` field. Principle 3 explicitly requires "documented assumptions," but the schema only has `context` (a single string). Assumptions should be a structured array so they can be individually reviewed and invalidated.
- No `outcome` or `result` field. The schema records the decision but not its outcome. Feedback Loops (Principle 8) require measuring decision outcomes against predicted KPI impact, but the schema has no place to record actual impact.
- No `madeBy` field distinguishing human decisions from agent decisions. Principle 3 says agent decisions must include model version and confidence level, but the schema has no fields for this.
- `deciders` is an array of strings. Like `owner`, these should reference structured person/role resources.
- No `expiry` or `reviewDate` field. The doctrine says decisions should be reviewed regularly, but the schema provides no mechanism for scheduling reviews.

### 3.5 Governance Schema Critique

**Strengths:**
- Failure modes with scenario/response/escalation is a practical, tested pattern.
- Human override with channels and max response time is well-thought-out.
- Prompt versioning as a governance concern is a correct placement.

**Weaknesses:**
- `accessControl.roles[].permissions` is an array of free-text strings (`"read"`, `"write"`, `"deploy"`, `"override"`). There is no enum constraint. Organizations will invent inconsistent permission names. This should be either a controlled vocabulary or have validation.
- Governance is scoped to a single domain, but the example shows only one governance policy for the `product` domain. What about cross-domain governance? What about organization-wide policies that apply to all domains?
- No concept of policy inheritance or layering. In a real organization, there would be a base governance policy, domain-specific overrides, and possibly agent-specific exceptions. The schema supports none of this.
- No `compliance` or `regulatory` fields. For organizations in regulated industries (finance, healthcare), governance policies must reference specific compliance requirements.
- `failureModes[].escalation` is a free-text string describing an action. This should reference a structured escalation path (who, how, when, what happens if they do not respond).

### 3.6 Telemetry Schema Critique

**Strengths:**
- The event naming convention (`domain.event_name`) enforces namespace discipline.
- Linking events to `metricsImpacted` connects signals to outcomes.
- The `source` with domain and agent references enables provenance tracking.

**Weaknesses:**
- The schema defines event *types*, not event *instances*. There is no schema for an actual event occurrence (with timestamp, correlation ID, payload data). This means IOA can validate event type definitions but cannot validate or structure actual telemetry data in transit.
- `payload` is described as a "JSON Schema fragment" but has no validation constraints. Any object passes.
- `observability.alertThreshold` is a free-text string (`"< 10 signups/day"`). This cannot be machine-evaluated. A proper threshold should be a structured object with metric, operator, value, and time window.
- No `severity` or `priority` field for categorizing event importance.
- No `retention` or `TTL` field, despite the doctrine (Principle 4) explicitly calling for retention policies.
- No `correlationId` pattern definition, despite the doctrine (Principle 11) calling for correlation IDs.
- The category enum (`metric`, `log`, `trace`, `alert`) is reasonable but missing `event` (generic business event) and `audit` (governance-specific event).

### 3.7 Config Schema Critique

The config schema is minimal -- just `name`, `version`, `description`, `organization`, and `paths`. For a project-level configuration file, it should also include:
- Default governance policy reference
- Schema validation settings (strict vs. lenient)
- IOA doctrine version pin (separate from the resource apiVersion)
- Extension points for custom resource types

### 3.8 Agent-to-Agent Communication: How Would You Model It?

The current model has no primitive for this. To properly model agent-to-agent communication, IOA would need:

1. **A Channel resource type**: Named communication channels with message schemas, access control, and ordering guarantees.
2. **Message patterns in the Agent spec**: Request-response, publish-subscribe (already partially covered by events), and streaming.
3. **Coordination protocols**: For multi-agent workflows, a protocol resource that defines the sequence, participants, and compensation logic.

Without these, any multi-agent system built on IOA will need to invent its own communication layer, defeating the purpose of a standard.

---

## 4. Doctrine Maturity Assessment

Rating scale: 1 = Needs fundamental rework, 2 = Significant gaps, 3 = Adequate foundation, 4 = Solid with minor gaps, 5 = Production-ready.

| # | Principle | Clarity | Actionability | Necessity | Notes |
|---|-----------|---------|---------------|-----------|-------|
| 1 | Domain-First Architecture | 5 | 4 | 5 | Excellent. Actionability loses one point because domain decomposition guidance is abstract. |
| 2 | Agent Topology | 5 | 5 | 5 | The strongest principle. Clear taxonomy, schema-backed, immediately implementable. |
| 3 | Decision Architecture | 4 | 4 | 5 | Schema does not fully implement the principle (missing `active` status, `assumptions`). |
| 4 | Event-Driven Telemetry | 4 | 3 | 4 | Schema models event types but not event instances. Overlaps with P11. |
| 5 | Governance by Design | 4 | 4 | 5 | Strong, but governance schema lacks inheritance/layering. |
| 6 | Cognitive Load Distribution | 3 | 2 | 3 | Aspirational. No schema, no measurement mechanism, no tooling path. Could be folded into P2 guidelines. |
| 7 | Memory and Context | 3 | 2 | 4 | No schema. Agent memory field is too thin. Critical concept, weak implementation path. |
| 8 | Feedback Loops | 3 | 2 | 4 | No schema, no feedback event type, no mechanism for structured retrospection data. |
| 9 | Human Override Principle | 5 | 4 | 5 | Philosophically excellent. Governance schema partially implements it. |
| 10 | Composability | 4 | 3 | 4 | The resource model delivers composability by default. The principle restates what the architecture already provides. |
| 11 | Observability First | 4 | 3 | 3 | Significant overlap with P4. Could be merged or the boundary sharpened. |
| 12 | Evolutionary Architecture | 4 | 3 | 4 | Versioning is in every schema. Migration tooling and deprecation mechanics need more specification. |

**Aggregate scores:**
- Mean Clarity: 4.0 -- Strong. The principles are well-written.
- Mean Actionability: 3.25 -- The gap. Several principles lack schema backing or implementation guidance.
- Mean Necessity: 4.25 -- Mostly essential. A few could be merged.

---

## 5. Recommendations for v0.2

Prioritized by impact and urgency.

### P0 -- Must Have (blocks real-world adoption)

**5.1 Add a Security and Trust Principle (new Principle 13)**

Without agent identity, data classification, and adversarial input defense, no security-conscious organization will adopt IOA. This is the single highest-priority addition.

Includes:
- Agent identity and authentication model
- Data sensitivity classification in the Domain schema (`dataOwnership` becomes structured objects with classification levels)
- Event provenance verification
- Prompt injection defense patterns
- Secret management guidance

**5.2 Add `status` subresource to Agent, Domain, and Governance schemas**

The current schemas model design-time configuration but not runtime state. Add a `status` block (inspired by Kubernetes status subresource) to every resource that has a runtime lifecycle:
- Agent: `status: { state: running|paused|degraded|stopped, lastHealthCheck, currentLoad, errorRate }`
- Domain: `status: { state: active|transitioning|deprecated, agentCount, eventRate }`

**5.3 Fix the Decision schema to match the doctrine**

- Add `active` to the status enum (the doctrine defines it; the schema omits it).
- Add `assumptions` as a structured array (the doctrine requires it; the schema has only `context`).
- Add `outcome` / `actualImpact` fields to close the feedback loop.
- Add `madeBy` with type `human | agent` and optional model metadata.
- Add `reviewDate` for scheduled re-evaluation.

**5.4 Add a Workflow/Pipeline resource type**

Define a `Workflow` resource that specifies multi-agent, multi-domain processes:
```yaml
apiVersion: ioa.dev/v0.2
kind: Workflow
metadata:
  name: churn-response
spec:
  trigger: growth.churn_signal
  steps:
    - agent: growth-optimizer
      action: classify-churn-risk
      timeout: 5m
    - agent: product-analyst
      action: generate-retention-offer
      requires: [classify-churn-risk]
    - agent: growth-optimizer
      action: deliver-offer
      requires: [generate-retention-offer]
  failurePolicy: compensate
  timeout: 30m
```

### P1 -- Should Have (significant quality improvement)

**5.5 Add Operational Economics fields across schemas**

- Agent schema: `spec.budget: { maxMonthlyCost, tokenLimit, alertThreshold }`
- Domain schema: `spec.budget: { allocated, consumed, period }`
- Telemetry schema: `spec.costDimensions: { estimatedCostPerEvent }`
- New principle or doctrine appendix on cost governance

**5.6 Create a Memory/Context resource schema**

Principle 7 needs a schema. Proposed structure:
```json
{
  "kind": "Context",
  "spec": {
    "domain": "string",
    "scope": "domain | organization | agent-private",
    "entries": [{
      "key": "string",
      "value": "any",
      "source": "decision | event | human",
      "validUntil": "date",
      "confidence": "number"
    }],
    "retention": "string",
    "queryInterface": "string"
  }
}
```

**5.7 Sharpen the boundary between Telemetry (P4) and Observability (P11)**

Option A: Merge them into a single "Observability and Telemetry" principle with clear subsections (event design, dashboards, alerts).

Option B (preferred): Reframe P4 as "Signal Architecture" (the design of events and metrics) and P11 as "Operational Observability" (the consumption, dashboarding, alerting, and incident response layer). Make the producer-consumer relationship explicit and non-overlapping.

**5.8 Evaluate whether Cognitive Load Distribution (P6) should be a standalone principle**

P6 is a design philosophy more than an architectural constraint. Consider:
- Folding its key insights into P2 (Agent Topology) as guidelines for matching agent types to task complexity.
- Retaining it as a principle but adding a corresponding schema (task classification resource) to make it actionable.

If retained, it needs teeth: a schema, measurement guidance, or at minimum, a required field in the agent spec for `cognitiveLoadProfile`.

**5.9 Structure the KPI target field in the Domain schema**

Replace the free-text `target` with a structured object:
```json
{
  "name": "data-freshness",
  "target": {
    "operator": "lt",
    "value": 1,
    "unit": "hours"
  }
}
```
This enables automated KPI threshold checking and alerting.

### P2 -- Nice to Have (polish and completeness)

**5.10 Add a Feedback resource schema**

Principle 8 needs a schema for structured feedback data: agent performance reviews, retrospection records, and human satisfaction scores. This connects P8 to the rest of the resource model.

**5.11 Add `model` and `version` fields to the Agent spec**

For AI agent governance and reproducibility:
```yaml
spec:
  model:
    provider: anthropic
    name: claude-sonnet-4
    version: "2025-05-14"
  agentVersion: "1.2.0"
```

**5.12 Add governance policy inheritance**

Allow governance policies to extend a base policy:
```yaml
spec:
  extends: default-policy
  overrides:
    audit:
      level: full  # override base policy's summary level
```

**5.13 Constrain permission strings in the Governance schema**

Define a vocabulary of standard permissions (`read`, `write`, `deploy`, `override`, `delete`, `admin`) as an enum, with an `additionalPermissions` escape hatch for custom extensions.

**5.14 Add `correlationId` and `retention` to the Telemetry schema**

The doctrine calls for both; the schema implements neither:
```json
{
  "correlationId": { "type": "string", "format": "uuid" },
  "retention": { "type": "string", "pattern": "^[0-9]+[dhmy]$" }
}
```

**5.15 Add a Person/Role resource or reference type**

The `owner`, `deciders`, and `escalatesTo` fields throughout the schemas are all free-text strings. Either:
- Define a `Person` or `Role` resource with structured identity.
- Define a reference pattern: `{ "ref": "person/jane-doe", "role": "domain-owner" }`.

This is necessary for any organization that wants to enforce accountability programmatically.

**5.16 Document cross-domain governance scenarios**

The current governance schema is scoped to a single domain. Add guidance and schema support for:
- Organization-wide base policies
- Cross-domain decision approval workflows
- Shared-data governance agreements between domains

---

## Summary

IOA v0.1 "Foundation" earns its subtitle. The Kubernetes-inspired resource model is the right foundation. The twelve principles cover the critical dimensions of AI-native organization design with genuine intellectual rigor. The writing is clear, the anti-patterns are sharp, and the philosophy is sound.

But a foundation is not a building. The gap between the doctrine's aspirations and the schemas' expressiveness is the primary weakness. Principles 6, 7, and 8 are under-specified. Security is absent. Economics are absent. Runtime state is absent. Agent communication and workflow orchestration are absent. The schemas model organizational design but not organizational operation.

The path from v0.1 to v0.2 should close these gaps in priority order: security first (it is a blocker for adoption), then runtime state (status subresources), then schema alignment with principles (Decision schema fixes), then new resource types (Workflow, Context, Feedback).

The doctrine is a credible starting point. With the improvements outlined above, it could become a genuine standard.
