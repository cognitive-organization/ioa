# Principle 6: Cognitive Load Distribution

**Statement:** AI agents reduce cognitive load on human teams. Work is distributed based on cognitive complexity, not just volume. Agents handle routine; humans handle novel.

## Rationale

The promise of AI in organizations is not simply "do more with less." It is to fundamentally change how cognitive work is allocated. Today, highly skilled humans spend enormous amounts of time on routine tasks: triaging tickets, formatting reports, reviewing boilerplate, monitoring dashboards. This is not a staffing problem -- it is a load distribution problem. The organization is allocating its most expensive and scarce resource (human judgment) to tasks that do not require it.

Cognitive Load Distribution introduces a deliberate framework for assigning work based on the type of thinking required. Routine, pattern-matching tasks with well-defined inputs and outputs are ideal for AI agents. Novel situations that require creativity, ethical judgment, stakeholder empathy, or cross-domain synthesis remain with humans. The boundary between these categories is not fixed -- it shifts as agents improve and as organizational context evolves. But the principle of conscious allocation remains constant.

This principle also addresses the inverse problem: AI agents that increase cognitive load rather than reducing it. An agent that generates 50 recommendations requiring human review may technically automate the analysis step, but it shifts the cognitive burden to evaluation and decision-making. Effective load distribution considers the entire cognitive pipeline, not just individual tasks.

## Guidelines

- Classify organizational tasks along a cognitive complexity spectrum: routine (pattern-matching), structured (rule-following), analytical (data-driven reasoning), and novel (creative or ethical judgment).
- Assign agents primarily to routine and structured tasks. Analytical tasks may be agent-assisted with human oversight. Novel tasks remain human-led.
- Measure cognitive load reduction, not just task throughput. An agent that processes 100 tickets per hour but generates 30 false positives requiring human review may be net-negative.
- Design agent outputs to minimize downstream cognitive effort. Summaries should be actionable, recommendations should include rationale, and escalations should include relevant context.
- Regularly reassess the routine-novel boundary. Tasks that were novel last year may be routine today as patterns emerge and agent capabilities improve.

## Anti-Patterns

- **Volume-only thinking**: Measuring AI success by the number of tasks automated rather than the cognitive load removed from human teams.
- **Cognitive shifting**: Automating task execution but creating new cognitive demands for oversight, review, and error correction that offset the gains.
- **Under-utilization of humans**: Assigning humans to routine monitoring tasks that agents could handle, while agents sit idle during the novel situations where human judgment is needed.
- **Blanket automation**: Automating all instances of a task type without distinguishing between routine cases (suitable for agents) and edge cases (requiring human judgment).

## Relationship to Other Principles

Cognitive Load Distribution builds on **Agent Topology** (Principle 2) by using agent types to match cognitive complexity: reactive agents for routine tasks, supervised agents for structured tasks, advisory agents for analytical support. **Domain-First Architecture** (Principle 1) provides the boundaries within which load is distributed. **Feedback Loops** (Principle 8) measure whether the distribution is actually reducing load. **Human Override Principle** (Principle 9) ensures that humans remain engaged in high-stakes decisions regardless of agent capability.
