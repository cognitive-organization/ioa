# Principle 1: Domain-First Architecture

**Statement:** Organization design starts with domain boundaries, not team hierarchies. Each domain owns its data, decisions, and KPIs. AI agents serve domains, not reporting lines.

## Rationale

The most common mistake in AI-augmented organizations is mapping agents to teams or departments. This mirrors the same error that plagued enterprise software for decades: building systems around org charts instead of business capabilities. Org charts change with every reorg. Domains persist.

A domain is a bounded area of organizational responsibility with clear ownership over its data, its decisions, and the metrics that define success. When you design domains first, you create stable boundaries that agents can bind to, that telemetry can flow through, and that governance can enforce. Domains become the unit of autonomy, accountability, and composability.

Domain-first architecture also prevents the "shadow AI" problem. When domains are well-defined, it is immediately clear which domain an agent belongs to, which data it can access, and which decisions it is authorized to make. Without domain boundaries, agents proliferate in the gaps between teams, accumulating access and influence that no one explicitly granted.

## Guidelines

- Define domains based on business capabilities and value streams, not current team structure.
- Each domain must have a single human owner accountable for its outcomes, data, and agents.
- Domains declare explicit interfaces: what data they expose, what events they emit, and what decisions they own.
- AI agents are assigned to exactly one domain. Cross-domain coordination happens through events and shared protocols, not shared agents.
- Domain boundaries should align with data ownership boundaries. If two domains need the same data, define a clear producer-consumer relationship.
- Review domain boundaries quarterly. Domains that grow too large should be split; domains that shrink should be merged.

## Anti-Patterns

- **Org-chart mirroring**: Defining domains as "Marketing AI" and "Sales AI" because those are the departments. Domains should reflect capabilities (e.g., "Lead Qualification", "Content Pipeline"), not reporting lines.
- **God domains**: A single domain that owns "all customer data" or "all analytics." If a domain cannot be described in one sentence, it is too broad.
- **Agent-first design**: Buying or building an AI agent and then looking for a domain to put it in. Agents serve domains, not the other way around.
- **Implicit boundaries**: Domains that exist in conversation but are never formally declared with ownership, data scope, and KPI definitions.

## Relationship to Other Principles

Domain-First Architecture is the foundational structural principle. **Agent Topology** (Principle 2) defines how agents bind to domains. **Decision Architecture** (Principle 3) scopes decisions within domain boundaries. **Event-Driven Telemetry** (Principle 4) uses domain namespaces for event routing. **Governance by Design** (Principle 5) enforces access control at the domain level. Nearly every other principle references domain boundaries as the primary unit of organization.
