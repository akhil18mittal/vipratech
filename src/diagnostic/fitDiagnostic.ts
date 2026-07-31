import type { DiagnosticAnalysis, FitDiagnosticInput } from "../types";

const COMMON_ANALYSIS: Omit<DiagnosticAnalysis, "recommendedSprint" | "sprintDeliverables"> = {
  fitScore: 92,
  fitStatus: "Strong Fit",
  estimatedDurationDays: "5-10 Business Days",
  keyRisksIdentified: [
    "Unclear boundary between deterministic rules and AI model judgment",
    "Lack of structured audit trail or human review gate in current workaround",
    "Potential exception handling overhead at operational scale",
  ],
  recommendedArchitecture:
    "Hybrid deterministic-first pipeline: rule engine processes known standard inputs, while AI handles ambiguous edge-cases paired with explicit human-in-the-loop review gates and durable evidence logs.",
  evidenceLevelToDeliver: "Built/Deployed",
  reasoning:
    "VipraTech's evidence-first applied AI approach aligns directly with your requirement for accuracy, auditability, and operational reliability.",
};

const DEFAULT_RECOMMENDATION = {
  recommendedSprint: "AI Product Discovery Sprint",
  sprintDeliverables: [
    "Current workflow and source exception map",
    "Evidence taxonomy & error leakage review",
    "Deterministic boundary vs model decision framework",
    "Target system architecture & pilot scope",
  ],
};

const RECOMMENDATIONS = [
  {
    matches: ["document", "reconciliation"],
    recommendedSprint: "Reconciliation Opportunity Sprint",
    sprintDeliverables: [
      "Line-item document extraction & normalization scheme",
      "Deterministic matching rule set & ambiguity taxonomy",
      "Human-in-the-loop exception dashboard mockup",
      "Audit-friendly traceability schema & pilot plan",
    ],
  },
  {
    matches: ["security", "agent"],
    recommendedSprint: "AI Agent Security Assessment",
    sprintDeliverables: [
      "System and agent threat model register",
      "Controlled multi-turn adversarial prompt test sample",
      "Tool-use authorization & permission boundaries",
      "Prioritized findings & remediation roadmap",
    ],
  },
  {
    matches: ["voice", "telephony"],
    recommendedSprint: "Voice AI Feasibility Sprint",
    sprintDeliverables: [
      "Call-flow & Hindi/Hinglish code-switching exception matrix",
      "Telephony provider & latency evaluation record",
      "Interruption, retry & human handoff escalation rules",
      "Measured voice prototype & rollout plan",
    ],
  },
  {
    matches: ["sales", "marketing", "revenue"],
    recommendedSprint: "Revenue Automation Diagnostic",
    sprintDeliverables: [
      "Funnel, research & drafting workflow audit",
      "Human approval gate & identity suppression rules",
      "CRM integration & multi-tenant attribution map",
      "Phased implementation & ROI benchmark",
    ],
  },
] as const;

export function analyzeFitDiagnostic(input: FitDiagnosticInput): DiagnosticAnalysis {
  const workflowType = input.workflowType.toLowerCase();
  const recommendation =
    RECOMMENDATIONS.find(({ matches }) =>
      matches.some((keyword) => workflowType.includes(keyword)),
    ) ?? DEFAULT_RECOMMENDATION;

  return {
    ...COMMON_ANALYSIS,
    recommendedSprint: recommendation.recommendedSprint,
    sprintDeliverables: [...recommendation.sprintDeliverables],
  };
}

export function buildFitCallMailto(
  input: FitDiagnosticInput,
  analysis: DiagnosticAnalysis,
): string {
  const subject = `VipraTech fit call request: ${input.workflowType}`;
  const body = [
    "Hello VipraTech,",
    "",
    "I would like to discuss this workflow:",
    `Workflow area: ${input.workflowType}`,
    `Challenges: ${input.challenges.length > 0 ? input.challenges.join("; ") : "Not specified"}`,
    `Current workaround: ${input.currentWorkaround || "Not specified"}`,
    `Expected timeline: ${input.timeline}`,
    `Team size: ${input.teamSize}`,
    "",
    `Diagnostic result: ${analysis.fitStatus} (${analysis.fitScore}%)`,
    `Recommended sprint: ${analysis.recommendedSprint}`,
    "",
    "Please share the next available time for a 30-minute fit call.",
  ].join("\n");

  return `mailto:akhilesh@vipratech.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
