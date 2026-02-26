/**
 * IOA Resource Type Definitions — v0.2 "Runtime Architecture"
 *
 * TypeScript interfaces matching each JSON Schema.
 * All K8s-style resources follow: apiVersion / kind / metadata / spec / status
 * Backward compatible with v0.1 resources.
 */

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export interface IoaOwner {
  name: string;
  role?: string;
}

export interface IoaCondition {
  type: string;
  status: "True" | "False" | "Unknown";
  reason?: string;
  message?: string;
  lastTransitionTime?: string;
}

export interface IoaMetadata {
  name: string;
  owner?: string | IoaOwner;
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ---------------------------------------------------------------------------
// Domain
// ---------------------------------------------------------------------------

export interface IoaKpiTarget {
  operator: "gt" | "lt" | "eq" | "gte" | "lte";
  value: number;
  unit?: string;
}

export interface IoaKpi {
  name: string;
  target: string | IoaKpiTarget;
  unit?: string;
  window?: string;
}

export interface IoaDataOwnershipItem {
  name: string;
  classification: "public" | "internal" | "confidential" | "restricted";
}

export interface IoaDomainSpec {
  purpose: string;
  kpis?: IoaKpi[];
  dataOwnership?: string[] | IoaDataOwnershipItem[];
  events?: {
    produces?: string[];
    consumes?: string[];
  };
  boundaries?: {
    includes?: string[];
    excludes?: string[];
  };
  budgetRef?: string;
  securityPolicyRef?: string;
  agents?: string[];
}

export interface IoaDomainStatus {
  health?: "healthy" | "degraded" | "critical";
  costToDate?: { value?: number; currency?: string; period?: string };
  decisionVelocity?: { decisionsPerWeek?: number; avgLeadTimeDays?: number };
  cognitiveLoadScore?: number;
  activeAgents?: number;
  activeIncidents?: number;
  lastEvaluation?: string;
  conditions?: IoaCondition[];
}

export interface IoaDomain {
  apiVersion: "ioa.dev/v0.1" | "ioa.dev/v0.2";
  kind: "Domain";
  metadata: IoaMetadata;
  spec: IoaDomainSpec;
  status?: IoaDomainStatus;
}

// ---------------------------------------------------------------------------
// Agent
// ---------------------------------------------------------------------------

export interface IoaAgentTrigger {
  event: string;
  action: string;
  condition?: string;
}

export interface IoaAgentGovernance {
  escalatesTo?: string;
  requiresApproval?: boolean;
  auditLevel?: "full" | "summary" | "none";
}

export interface IoaAgentMemory {
  type?: "session" | "persistent" | "shared";
  retention?: string;
  scope?: "agent-private" | "domain" | "organization";
}

export interface IoaAgentModel {
  provider?: string;
  name?: string;
  version?: string;
}

export interface IoaAgentCapability {
  name: string;
  type: "analysis" | "generation" | "classification" | "monitoring" | "orchestration";
  description?: string;
}

export interface IoaAgentController {
  watches?: string[];
  reconcileInterval?: string;
  driftThreshold?: number;
}

export interface IoaAgentTokenBudget {
  maxDaily?: number;
  maxMonthly?: number;
  alertAt?: number;
}

export interface IoaAgentSchedule {
  type?: "continuous" | "cron" | "event-driven";
  cron?: string;
}

export interface IoaAgentIO {
  name: string;
  schema?: string;
}

export interface IoaAgentSpec {
  domain: string;
  type: "autonomous" | "supervised" | "advisory" | "reactive";
  role?: "strategic" | "tactical" | "analytical" | "governance" | "observer";
  purpose: string;
  model?: IoaAgentModel;
  capabilities?: string[] | IoaAgentCapability[];
  inputs?: IoaAgentIO[];
  outputs?: IoaAgentIO[];
  constraints?: string[];
  triggers?: IoaAgentTrigger[];
  controller?: IoaAgentController;
  governance?: IoaAgentGovernance;
  memory?: IoaAgentMemory;
  tokenBudget?: IoaAgentTokenBudget;
  schedule?: IoaAgentSchedule;
}

export interface IoaAgentStatus {
  state?: "running" | "paused" | "degraded" | "failed" | "learning" | "idle";
  lastExecution?: string;
  avgLatency?: string;
  costConsumed?: { tokens?: number; cost?: number; currency?: string; period?: string };
  overrideRate?: number;
  errorRate?: number;
  healthScore?: number;
  conditions?: IoaCondition[];
}

export interface IoaAgent {
  apiVersion: "ioa.dev/v0.1" | "ioa.dev/v0.2";
  kind: "Agent";
  metadata: IoaMetadata;
  spec: IoaAgentSpec;
  status?: IoaAgentStatus;
}

// ---------------------------------------------------------------------------
// Decision
// ---------------------------------------------------------------------------

export interface IoaDecisionOption {
  name: string;
  description: string;
  pros?: string[];
  cons?: string[];
  estimatedCost?: string;
}

export interface IoaDecisionKpiImpact {
  kpi: string;
  expected: string;
}

export interface IoaDecisionKpiActualImpact {
  kpi: string;
  expected: string;
  actual: string;
  variance?: string;
}

export interface IoaDecisionInitiatedBy {
  type: "human" | "agent";
  name: string;
  model?: string;
  confidence?: number;
}

export interface IoaDecisionAssumption {
  id: string;
  statement: string;
  status: "valid" | "invalidated" | "untested";
  validatedAt?: string;
}

export interface IoaDecisionDecider {
  name: string;
  role?: string;
}

export interface IoaDecisionSpec {
  id: string;
  status: "proposed" | "accepted" | "active" | "deprecated" | "superseded" | "reversed";
  domain: string;
  date?: string;
  reviewDate?: string;
  initiatedBy?: IoaDecisionInitiatedBy;
  deciders?: string[] | IoaDecisionDecider[];
  context: string;
  assumptions?: IoaDecisionAssumption[];
  options?: IoaDecisionOption[];
  chosen?: string;
  rationale?: string;
  kpiImpact?: IoaDecisionKpiImpact[];
  reversibility?: "easy" | "moderate" | "hard" | "irreversible";
  relatedWorkflow?: string;
  supersededBy?: string | null;
}

export interface IoaDecisionStatus {
  state?: "proposed" | "active" | "reversed" | "archived";
  actualOutcome?: string;
  kpiActualImpact?: IoaDecisionKpiActualImpact[];
  executionCost?: { value?: number; currency?: string };
  closedAt?: string;
  conditions?: IoaCondition[];
}

export interface IoaDecision {
  apiVersion: "ioa.dev/v0.1" | "ioa.dev/v0.2";
  kind: "Decision";
  metadata: IoaMetadata;
  spec: IoaDecisionSpec;
  status?: IoaDecisionStatus;
}

// ---------------------------------------------------------------------------
// Telemetry
// ---------------------------------------------------------------------------

export interface IoaTelemetrySource {
  domain?: string;
  agent?: string;
}

export interface IoaTelemetryAlertRule {
  condition?: {
    metric?: string;
    operator?: "gt" | "lt" | "eq" | "gte" | "lte";
    value?: number;
    window?: string;
  };
  severity?: "info" | "warning" | "error" | "critical";
  channels?: string[];
}

export interface IoaTelemetryCorrelationId {
  required?: boolean;
  format?: "uuid" | "ulid" | "custom";
}

export interface IoaTelemetryRetention {
  duration?: string;
  archiveAfter?: string;
}

export interface IoaTelemetryObservability {
  dashboard?: boolean;
  alertThreshold?: string;
  alertRule?: IoaTelemetryAlertRule;
}

export interface IoaTelemetrySpec {
  event: string;
  category: "metric" | "log" | "trace" | "alert" | "audit";
  description?: string;
  severity?: "info" | "warning" | "error" | "critical";
  payload?: Record<string, unknown>;
  metricsImpacted?: string[];
  source?: IoaTelemetrySource;
  correlationId?: IoaTelemetryCorrelationId;
  retention?: IoaTelemetryRetention;
  observability?: IoaTelemetryObservability;
}

export interface IoaTelemetryStatus {
  eventRate?: number;
  lastEmitted?: string;
  errorRate?: number;
  avgPayloadSize?: number;
  conditions?: IoaCondition[];
}

export interface IoaTelemetry {
  apiVersion: "ioa.dev/v0.1" | "ioa.dev/v0.2";
  kind: "Telemetry";
  metadata: IoaMetadata;
  spec: IoaTelemetrySpec;
  status?: IoaTelemetryStatus;
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

export interface IoaGovernanceEscalationPath {
  level: number;
  role: string;
  channel?: string;
  timeout?: string;
}

export interface IoaGovernanceEscalation {
  paths?: IoaGovernanceEscalationPath[];
  defaultPath?: string;
}

export interface IoaGovernanceCompliance {
  standards?: string[];
  requirements?: string[];
}

export interface IoaGovernanceSpec {
  domain: string;
  extends?: string;
  accessControl?: IoaGovernanceAccessControl;
  promptVersioning?: IoaGovernancePromptVersioning;
  audit?: IoaGovernanceAudit;
  escalation?: IoaGovernanceEscalation;
  compliance?: IoaGovernanceCompliance;
  failureModes?: IoaGovernanceFailureMode[];
  humanOverride?: IoaGovernanceHumanOverride;
}

export interface IoaGovernanceStatus {
  activePolicies?: number;
  overrideFrequency?: number;
  escalationRate?: number;
  complianceStatus?: "compliant" | "non-compliant" | "under-review";
  conditions?: IoaCondition[];
}

export interface IoaGovernance {
  apiVersion: "ioa.dev/v0.1" | "ioa.dev/v0.2";
  kind: "Governance";
  metadata: IoaMetadata;
  spec: IoaGovernanceSpec;
  status?: IoaGovernanceStatus;
}

// ---------------------------------------------------------------------------
// Workflow (NEW in v0.2)
// ---------------------------------------------------------------------------

export interface IoaWorkflowStep {
  name: string;
  agent: string;
  action: string;
  dependsOn?: string[];
  timeout?: string;
  retryPolicy?: {
    maxRetries?: number;
    backoff?: string;
  };
  onFailure?: "abort" | "skip" | "compensate";
}

export interface IoaWorkflowCompensation {
  step: string;
  action: string;
  agent: string;
}

export interface IoaWorkflowTrigger {
  event?: string;
  condition?: string;
  schedule?: string;
}

export interface IoaWorkflowSpec {
  description: string;
  domainsInvolved: string[];
  trigger?: IoaWorkflowTrigger;
  steps: IoaWorkflowStep[];
  compensation?: IoaWorkflowCompensation[];
  timeout?: string;
  failurePolicy?: "compensate" | "retry" | "abort";
}

export interface IoaWorkflowStatus {
  state?: "idle" | "queued" | "executing" | "blocked" | "completed" | "failed" | "compensating";
  currentStep?: string;
  completedSteps?: string[];
  failedSteps?: string[];
  startedAt?: string;
  completedAt?: string | null;
  retries?: number;
  latency?: string;
  costAccumulated?: { tokens?: number; cost?: number; currency?: string };
  conditions?: IoaCondition[];
}

export interface IoaWorkflow {
  apiVersion: "ioa.dev/v0.2";
  kind: "Workflow";
  metadata: IoaMetadata;
  spec: IoaWorkflowSpec;
  status?: IoaWorkflowStatus;
}

// ---------------------------------------------------------------------------
// SecurityPolicy (NEW in v0.2)
// ---------------------------------------------------------------------------

export interface IoaSecurityPolicyDataScope {
  resource: string;
  classification: "public" | "internal" | "confidential" | "restricted";
  allowedAgents?: string[];
  allowedOperations?: ("read" | "write" | "delete" | "execute")[];
}

export interface IoaSecurityPolicyAgentIdentity {
  required?: boolean;
  method?: "certificate" | "token" | "api-key";
}

export interface IoaSecurityPolicyZeroTrust {
  enabled?: boolean;
  verifyOnEveryCall?: boolean;
  maxSessionDuration?: string;
}

export interface IoaSecurityPolicyAuditTrail {
  immutable?: boolean;
  retention?: string;
  events?: string[];
}

export interface IoaSecurityPolicyPromptInjectionDefense {
  enabled?: boolean;
  sanitizeInputs?: boolean;
  detectPatterns?: string[];
  onDetection?: "block" | "warn" | "log";
}

export interface IoaSecurityPolicySpec {
  domain: string;
  agentIdentity?: IoaSecurityPolicyAgentIdentity;
  dataScopes?: IoaSecurityPolicyDataScope[];
  zeroTrust?: IoaSecurityPolicyZeroTrust;
  auditTrail?: IoaSecurityPolicyAuditTrail;
  promptInjectionDefense?: IoaSecurityPolicyPromptInjectionDefense;
  enforcementMode?: "enforce" | "warn" | "advise" | "observe";
}

export interface IoaSecurityPolicyStatus {
  activePolicies?: number;
  violations?: number;
  lastAudit?: string;
  threatLevel?: "none" | "low" | "medium" | "high" | "critical";
  blockedOperations?: number;
  conditions?: IoaCondition[];
}

export interface IoaSecurityPolicy {
  apiVersion: "ioa.dev/v0.2";
  kind: "SecurityPolicy";
  metadata: IoaMetadata;
  spec: IoaSecurityPolicySpec;
  status?: IoaSecurityPolicyStatus;
}

// ---------------------------------------------------------------------------
// Budget (NEW in v0.2)
// ---------------------------------------------------------------------------

export interface IoaBudgetLimitsTokens {
  daily?: number;
  monthly?: number;
  quarterly?: number;
}

export interface IoaBudgetLimitsCost {
  daily?: number;
  monthly?: number;
  quarterly?: number;
  currency?: string;
}

export interface IoaBudgetLimits {
  tokens?: IoaBudgetLimitsTokens;
  cost?: IoaBudgetLimitsCost;
}

export interface IoaBudgetAlert {
  threshold: number;
  channels?: string[];
  severity?: "info" | "warning" | "error" | "critical";
}

export interface IoaBudgetAgentAllocation {
  name: string;
  allocation?: number;
}

export interface IoaBudgetSpec {
  domain: string;
  period: string;
  limits?: IoaBudgetLimits;
  alerts?: IoaBudgetAlert[];
  enforcement?: "enforce" | "warn" | "observe";
  agents?: IoaBudgetAgentAllocation[];
}

export interface IoaBudgetStatusConsumed {
  tokens?: number;
  cost?: number;
  currency?: string;
}

export interface IoaBudgetStatus {
  consumed?: IoaBudgetStatusConsumed;
  utilizationRate?: number;
  alertsTriggered?: number;
  projectedOverrun?: boolean;
  projectedEndOfPeriod?: { tokens?: number; cost?: number };
  conditions?: IoaCondition[];
}

export interface IoaBudget {
  apiVersion: "ioa.dev/v0.2";
  kind: "Budget";
  metadata: IoaMetadata;
  spec: IoaBudgetSpec;
  status?: IoaBudgetStatus;
}

// ---------------------------------------------------------------------------
// Memory (NEW in v0.2)
// ---------------------------------------------------------------------------

export interface IoaMemoryRetention {
  duration?: string;
  archiveAfter?: string;
  autoExpire?: boolean;
}

export interface IoaMemoryIndexing {
  searchable?: boolean;
  embeddings?: boolean;
  keywords?: string[];
}

export interface IoaMemoryReference {
  kind: string;
  name: string;
}

export interface IoaMemorySpec {
  scope: "agent" | "domain" | "organization";
  sourceAgent?: string;
  sourceDomain?: string;
  entryType: "decision" | "observation" | "learning" | "context" | "pattern" | "error";
  content: string;
  summary?: string;
  tags?: string[];
  retention?: IoaMemoryRetention;
  indexing?: IoaMemoryIndexing;
  references?: IoaMemoryReference[];
  confidence?: number;
  supersedes?: string;
}

export interface IoaMemoryStatus {
  accessCount?: number;
  lastAccessed?: string;
  relevanceScore?: number;
  compoundingValue?: number;
  expiresAt?: string;
  state?: "active" | "archived" | "expired" | "superseded";
  conditions?: IoaCondition[];
}

export interface IoaMemory {
  apiVersion: "ioa.dev/v0.2";
  kind: "Memory";
  metadata: IoaMetadata;
  spec: IoaMemorySpec;
  status?: IoaMemoryStatus;
}

// ---------------------------------------------------------------------------
// Controller (NEW in v0.2 — draft)
// ---------------------------------------------------------------------------

export interface IoaControllerAction {
  type: "alert" | "reconcile" | "pause" | "log" | "escalate" | "block";
  severity?: "info" | "warning" | "error" | "critical";
  channels?: string[];
  strategy?: "gradual" | "immediate";
  reason?: string;
}

export interface IoaControllerHook {
  name: string;
  action: string;
}

export interface IoaControllerSpec {
  targetKind: string;
  targetSelector?: {
    matchLabels?: Record<string, string>;
  };
  reconcileInterval: string;
  driftThreshold?: number;
  actions?: {
    onDrift?: IoaControllerAction[];
    onError?: IoaControllerAction[];
    onHealthy?: IoaControllerAction[];
  };
  hooks?: {
    preReconcile?: IoaControllerHook[];
    postReconcile?: IoaControllerHook[];
  };
  enforcementMode?: "enforce" | "warn" | "advise" | "observe";
}

export interface IoaControllerActionPerformed {
  type: string;
  target: string;
  at: string;
  result: "success" | "failure" | "skipped";
}

export interface IoaControllerStatus {
  lastReconcile?: string;
  reconcileCount?: number;
  driftDetected?: boolean;
  lastDriftAt?: string;
  actionsPerformed?: IoaControllerActionPerformed[];
  healthyResources?: number;
  unhealthyResources?: number;
  conditions?: IoaCondition[];
}

export interface IoaController {
  apiVersion: "ioa.dev/v0.2";
  kind: "Controller";
  metadata: IoaMetadata;
  spec: IoaControllerSpec;
  status?: IoaControllerStatus;
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
  workflows?: string;
  security?: string;
  budgets?: string;
  memory?: string;
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
  | IoaGovernance
  | IoaWorkflow
  | IoaSecurityPolicy
  | IoaBudget
  | IoaMemory
  | IoaController;
