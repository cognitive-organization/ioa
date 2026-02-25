# Principle 2: Agent Topology

**Statement:** Agents have explicit types (autonomous, supervised, advisory, reactive), defined capabilities, and clear domain bindings. No "general AI" -- every agent has a bounded purpose.

## Rationale

An AI agent without a defined type is a liability. When an organization deploys agents without classifying their autonomy level, capability scope, and domain binding, it creates an environment where no one knows what an agent can do, what it is allowed to do, or who is responsible when it acts incorrectly. Agent topology solves this by treating agent classification as a first-class architectural concern.

The four agent types form a spectrum of autonomy. **Autonomous** agents act without human approval within defined boundaries. **Supervised** agents propose actions that require human confirmation. **Advisory** agents provide analysis and recommendations but never take action. **Reactive** agents respond to specific triggers with predefined behaviors. Each type carries different governance requirements, different observability needs, and different failure modes.

Topology is not just about classification -- it is about constraint. A well-defined topology makes it impossible for an advisory agent to silently become autonomous. It ensures that every agent's capabilities are declared, versioned, and auditable. It prevents the organizational equivalent of privilege escalation: an agent gradually accumulating responsibilities that no one explicitly granted.

## Guidelines

- Every agent must declare its type (autonomous, supervised, advisory, reactive) and its domain binding in a structured resource definition.
- Agent capabilities must be explicitly enumerated. An agent that "helps with customer support" is underspecified; an agent that "classifies incoming tickets by priority and routes to the appropriate queue" is properly scoped.
- Autonomous agents require stricter governance than supervised agents. Define escalation thresholds: conditions under which an autonomous agent must defer to a human.
- Agent resource definitions must include version, owner, and a human-readable description of purpose.
- Prohibit "general-purpose" agents. If an agent cannot be described without the word "and" connecting unrelated capabilities, it should be split.

## Anti-Patterns

- **The Swiss Army Agent**: A single agent that handles email triage, report generation, meeting scheduling, and data analysis. This agent has no clear domain, no bounded purpose, and no meaningful governance.
- **Implicit autonomy**: An agent that starts as advisory but gradually begins taking actions because "it was faster." Autonomy level changes must be explicit architectural decisions.
- **Capability creep**: Adding new capabilities to an existing agent without updating its resource definition, governance rules, or observability configuration.
- **Orphan agents**: Agents that continue running after their domain has been restructured or their owner has changed roles. Every agent must have a current, accountable human owner.

## Relationship to Other Principles

Agent Topology operationalizes **Domain-First Architecture** (Principle 1) by binding agents to specific domains. It directly informs **Governance by Design** (Principle 5), since governance requirements differ by agent type. **Observability First** (Principle 11) depends on topology to determine what to observe. **Cognitive Load Distribution** (Principle 6) uses agent types to allocate work appropriately between humans and AI.
