export { DOCTRINE_VERSION, DOCTRINE_CODENAME, DOCTRINE_DATE } from "./version.js";

export const PRINCIPLES = [
  "Domain-First Architecture",
  "Agent Topology",
  "Decision Architecture",
  "Event-Driven Telemetry",
  "Governance by Design",
  "Cognitive Load Distribution",
  "Memory and Context",
  "Feedback Loops",
  "Human Override Principle",
  "Composability",
  "Observability First",
  "Evolutionary Architecture",
] as const;

export type Principle = (typeof PRINCIPLES)[number];
