/**
 * IOA Resource Type Definitions
 *
 * TypeScript interfaces matching each JSON Schema.
 * All K8s-style resources follow: apiVersion / kind / metadata / spec
 */

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export interface IoaMetadata {
  name: string;
  owner?: string;
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Domain
// ---------------------------------------------------------------------------

export interface IoaDomainSpec {
  purpose: string;
  kpis?: Array<{
    name: string;
    target: string;
    unit?: string;
  }>;
  dataOwnership?: string[];
  events?: {
    produces?: string[];
    consumes?: string[];
  };
  boundaries?: {
    includes?: string[];
    excludes?: string[];
  };
}

export interface IoaDomain {
  apiVersion: "ioa.dev/v0.1";
  kind: "Domain";
  metadata: IoaMetadata;
  spec: IoaDomainSpec;
}

// ---------------------------------------------------------------------------
// Agent
// ---------------------------------------------------------------------------

export interface IoaAgentTrigger {
  event: string;
  action: string;
}

export interface IoaAgentGovernance {
  escalatesTo?: string;
  requiresApproval?: boolean;
  auditLevel?: "full" | "summary" | "none";
}

export interface IoaAgentMemory {
  type?: "session" | "persistent" | "shared";
  retention?: string;
}

export interface IoaAgentSpec {
  domain: string;
  type: "autonomous" | "supervised" | "advisory" | "reactive";
  purpose: string;
  capabilities?: string[];
  constraints?: string[];
  triggers?: IoaAgentTrigger[];
  governance?: IoaAgentGovernance;
  memory?: IoaAgentMemory;
}

export interface IoaAgent {
  apiVersion: "ioa.dev/v0.1";
  kind: "Agent";
  metadata: IoaMetadata;
  spec: IoaAgentSpec;
}

// ---------------------------------------------------------------------------
// Decision
// ---------------------------------------------------------------------------

export interface IoaDecisionOption {
  name: string;
  description: string;
  pros?: string[];
  cons?: string[];
}

export interface IoaDecisionKpiImpact {
  kpi: string;
  expected: string;
}

export interface IoaDecisionSpec {
  id: string;
  status: "proposed" | "accepted" | "deprecated" | "superseded";
  domain: string;
  date?: string;
  deciders?: string[];
  context: string;
  options?: IoaDecisionOption[];
  chosen?: string;
  rationale?: string;
  kpiImpact?: IoaDecisionKpiImpact[];
  reversibility?: "easy" | "moderate" | "hard";
  supersededBy?: string | null;
}

export interface IoaDecision {
  apiVersion: "ioa.dev/v0.1";
  kind: "Decision";
  metadata: IoaMetadata;
  spec: IoaDecisionSpec;
}

// ---------------------------------------------------------------------------
// Telemetry
// ---------------------------------------------------------------------------

export interface IoaTelemetrySource {
  domain?: string;
  agent?: string;
}

export interface IoaTelemetryObservability {
  dashboard?: boolean;
  alertThreshold?: string;
}

export interface IoaTelemetrySpec {
  event: string;
  category: "metric" | "log" | "trace" | "alert";
  description?: string;
  payload?: Record<string, unknown>;
  metricsImpacted?: string[];
  source?: IoaTelemetrySource;
  observability?: IoaTelemetryObservability;
}

export interface IoaTelemetry {
  apiVersion: "ioa.dev/v0.1";
  kind: "Telemetry";
  metadata: IoaMetadata;
  spec: IoaTelemetrySpec;
}

// ---------------------------------------------------------------------------
// Governance
// ---------------------------------------------------------------------------

export interface IoaGovernanceRole {
  name: string;
  permissions: string[];
}

export interface IoaGovernanceAccessControl {
  roles?: IoaGovernanceRole[];
  defaultRole?: string;
}

export interface IoaGovernancePromptVersioning {
  enabled?: boolean;
  repository?: string;
}

export interface IoaGovernanceAudit {
  enabled?: boolean;
  retention?: string;
  level?: "full" | "summary" | "none";
}

export interface IoaGovernanceFailureMode {
  scenario: string;
  response: string;
  escalation: string;
}

export interface IoaGovernanceHumanOverride {
  enabled?: boolean;
  channels?: string[];
  maxResponseTime?: string;
}

export interface IoaGovernanceSpec {
  domain: string;
  accessControl?: IoaGovernanceAccessControl;
  promptVersioning?: IoaGovernancePromptVersioning;
  audit?: IoaGovernanceAudit;
  failureModes?: IoaGovernanceFailureMode[];
  humanOverride?: IoaGovernanceHumanOverride;
}

export interface IoaGovernance {
  apiVersion: "ioa.dev/v0.1";
  kind: "Governance";
  metadata: IoaMetadata;
  spec: IoaGovernanceSpec;
}

// ---------------------------------------------------------------------------
// Config (project-level, NOT a K8s-style resource)
// ---------------------------------------------------------------------------

export interface IoaConfigPaths {
  domains?: string;
  agents?: string;
  decisions?: string;
  telemetry?: string;
  governance?: string;
}

export interface IoaConfigOrganization {
  name?: string;
  domain?: string;
}

export interface IoaConfig {
  name: string;
  version: string;
  description?: string;
  organization?: IoaConfigOrganization;
  paths?: IoaConfigPaths;
}

// ---------------------------------------------------------------------------
// Union type for all K8s-style resources
// ---------------------------------------------------------------------------

export type IoaResource =
  | IoaDomain
  | IoaAgent
  | IoaDecision
  | IoaTelemetry
  | IoaGovernance;
