# Principle 9: Human Override Principle

**Statement:** Humans can override any AI decision at any time. Override paths are explicit, tested, and exercised regularly. The system degrades gracefully without AI.

## Rationale

Every system that delegates decision-making authority must answer a non-negotiable question: What happens when the system is wrong? For AI-augmented organizations, the answer must always be the same: a human steps in, overrides the decision, and the organization continues to function. This is not a theoretical safeguard -- it is a practical design requirement that must be tested, maintained, and exercised.

The Human Override Principle is stronger than a simple "kill switch." A kill switch stops the system. An override path redirects it. When a human overrides an agent's decision, the override itself is recorded as a structured event with rationale, the agent's original recommendation is preserved for analysis, and the system adapts its future behavior based on the correction. Overrides are not failures -- they are the mechanism through which human judgment refines organizational intelligence.

This principle also demands graceful degradation. If every AI agent in the organization stopped functioning simultaneously, the organization should still be able to operate -- perhaps at reduced efficiency, but without catastrophic breakdown. This means that core processes cannot depend exclusively on AI agents with no human fallback. The degree of degradation tolerance should be explicitly designed and periodically tested, much like disaster recovery exercises for infrastructure.

## Guidelines

- Define explicit override paths for every autonomous and supervised agent. The override path must specify: who can override, how to trigger the override, what happens to in-flight work, and how the override is recorded.
- Record every override as a structured event including: the agent's original decision, the human's replacement decision, the rationale for the override, and the domain context.
- Test override paths regularly. An override mechanism that has never been exercised may not work when needed. Include override exercises in regular operational reviews.
- Design for graceful degradation. Document what happens when each agent is unavailable and ensure that manual fallback procedures exist and are understood by the responsible humans.
- Use override data as a feedback signal. Frequent overrides in a specific domain or agent may indicate misconfiguration, poor prompt design, or misaligned success criteria.

## Anti-Patterns

- **Theoretical override**: Override paths that exist in documentation but have never been tested and may not function in practice. Untested overrides are not overrides.
- **Override stigma**: Organizational culture that treats overrides as agent failures rather than healthy system behavior. If humans hesitate to override because it reflects poorly on the AI initiative, the override mechanism is socially disabled.
- **Automation addiction**: Processes that have been automated for so long that no human remembers how to perform them manually. Graceful degradation requires maintained human capability.
- **Silent override**: Overriding an agent's decision without recording the override, losing both the learning opportunity and the audit trail.

## Relationship to Other Principles

The Human Override Principle is enforced through **Governance by Design** (Principle 5), which ensures override paths are defined and access-controlled. Override events flow through **Event-Driven Telemetry** (Principle 4) and contribute to **Feedback Loops** (Principle 8). **Agent Topology** (Principle 2) determines which agents require which level of override capability. **Cognitive Load Distribution** (Principle 6) ensures that humans retain the skills and context needed to exercise overrides effectively.
