# Principle 5: Governance by Design

**Statement:** Access control, prompt versioning, audit trails, and failure modes are designed upfront, not bolted on. Human override is always available.

## Rationale

Governance in most AI deployments follows a depressingly familiar pattern: the organization moves fast, ships agents into production, and then scrambles to add controls after the first incident. A customer-facing agent hallucinates pricing. An internal agent accesses data it should not have. A prompt change silently alters agent behavior in ways no one approved. The post-mortem invariably concludes: "We need better governance." IOA asserts that governance is not a post-mortem finding -- it is a design requirement.

Governance by Design means that every agent, every decision, and every data access path has explicit controls defined before deployment. Access control is scoped to domains, not granted ad hoc. Prompts are versioned artifacts with change history, review processes, and rollback capability. Audit trails capture not just what happened but who authorized it, what model version produced it, and what data informed it. Failure modes are enumerated and tested: what happens when the model is unavailable, when the data source is stale, when the agent exceeds its confidence threshold.

This is not about slowing down. Well-designed governance actually accelerates adoption because it reduces risk, builds trust, and prevents the catastrophic failures that cause organizations to retrench from AI entirely. The cost of designing governance upfront is always lower than the cost of retrofitting it after a breach.

## Guidelines

- Define access control policies at the domain level. Agents inherit the access scope of their domain and cannot exceed it without explicit escalation.
- Version all prompts and system instructions as tracked artifacts. Prompt changes follow the same review process as code changes.
- Implement audit trails for all agent actions, decision records, and data access events. Audit logs must be immutable and retained according to compliance requirements.
- Document failure modes for every agent: what happens when the model is down, when confidence is low, when inputs are adversarial. Define fallback behaviors explicitly.
- Conduct regular governance reviews. As agents gain new capabilities or domains evolve, governance rules must be updated accordingly.
- Ensure that human override paths exist for every automated decision (see Principle 9).

## Anti-Patterns

- **Bolt-on governance**: Deploying agents first and adding access controls, audit trails, and prompt versioning only after an incident forces the issue.
- **Security theater**: Implementing governance checkboxes that look good on paper but do not actually constrain agent behavior. A prompt review process that rubber-stamps every change is worse than no process, because it creates false confidence.
- **Implicit trust**: Assuming that because an agent worked correctly during testing, it will always work correctly in production. Governance must account for drift, adversarial inputs, and model behavior changes across versions.
- **Governance avoidance**: Treating governance as the enemy of velocity. Teams that skip governance do not move faster -- they accumulate risk debt that compounds with interest.

## Relationship to Other Principles

Governance by Design is the enforcement layer for **Agent Topology** (Principle 2) -- agent types determine governance requirements. It operationalizes the **Human Override Principle** (Principle 9) by ensuring override paths are defined and tested. **Decision Architecture** (Principle 3) requires governance around who can make and approve decisions. **Event-Driven Telemetry** (Principle 4) provides the audit event stream that governance depends on. **Observability First** (Principle 11) makes governance violations detectable.
