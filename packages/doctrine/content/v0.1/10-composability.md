# Principle 10: Composability

**Statement:** Organizational components (domains, agents, decisions, events) are composable building blocks. Complex behaviors emerge from simple, well-defined primitives.

## Rationale

The most resilient systems in computing -- Unix pipes, TCP/IP, the web itself -- share a common property: they compose. Simple, well-defined components with clear interfaces combine to produce complex behaviors that no single component could achieve alone. Organizational architecture should follow the same principle. A domain is a building block. An agent is a building block. A decision record, an event, a feedback loop -- each is a self-contained unit with defined inputs, outputs, and interfaces.

Composability is the antidote to monolithic organizational design. A monolithic approach bundles capabilities, data, and logic into tightly coupled systems that are difficult to change, impossible to partially adopt, and fragile under stress. A composable approach defines small, reusable primitives that can be assembled in different configurations for different organizational contexts. A startup with three people and two domains uses the same primitives as an enterprise with fifty domains and two hundred agents -- the difference is in the composition, not the components.

This principle has a direct practical benefit: it enables incremental adoption. An organization can start with a single domain definition and one agent, prove value, and gradually compose additional components. Each new domain, agent, or event stream plugs into the existing architecture without requiring a redesign. This is how standards achieve adoption -- not by demanding complete transformation, but by offering composable value at every scale.

## Guidelines

- Design every organizational resource (domain, agent, decision, event) as a self-contained unit with a declared interface: what it exposes, what it consumes, and what it produces.
- Use standard resource definitions (apiVersion, kind, metadata, spec) to ensure that all components share a common structural vocabulary.
- Enable cross-domain composition through events and shared protocols, not through direct coupling. Two domains should interact through events, not by sharing agents or data stores.
- Support partial adoption. The architecture must deliver value with a single domain and one agent, not only when fully deployed across the entire organization.
- Provide composition patterns for common scenarios: domain federation (multiple domains coordinating), agent chains (one agent's output feeding another), and decision cascades (decisions that trigger downstream decisions).

## Anti-Patterns

- **Monolithic design**: Building a single, tightly coupled system that handles all organizational AI needs. Monoliths are easy to start but impossible to evolve.
- **Tight coupling**: Agents that directly call other agents, domains that share mutable state, or decisions that assume the existence of specific other decisions. Every coupling point is a change resistance point.
- **All-or-nothing adoption**: Architecture that requires full organizational commitment before delivering any value. If an organization cannot start with one domain and one agent, the architecture is not composable.
- **Custom everything**: Building bespoke solutions for each domain instead of composing from standard primitives. Custom components cannot be shared, replicated, or evolved independently.

## Relationship to Other Principles

Composability is the structural enabler for **Evolutionary Architecture** (Principle 12) -- you can only evolve what you can decompose and recompose. **Domain-First Architecture** (Principle 1) provides the primary compositional boundary. **Event-Driven Telemetry** (Principle 4) provides the composition mechanism between domains. **Agent Topology** (Principle 2) ensures that agents are composable units with bounded purpose. The standard resource model used throughout IOA is itself an expression of composability.
