type EvidenceLevel = "Built/Deployed" | "Prototyped" | "Researched/Designed";

export interface DiagnosticTriggerProps {
  onOpenDiagnostic: (workflow?: string) => void;
}

export interface ServiceOffer {
  id: string;
  title: string;
  diagnosticLabel: string;
  description: string;
  includedFeatures: string[];
  targetAudience: string;
  primaryOfferName: string;
  sprintOutputs: string[];
}

export interface ProductSystem {
  id: string;
  name: string;
  evidenceLevel: EvidenceLevel;
  shortDesc: string;
  capabilities: string[];
}

export interface FitDiagnosticInput {
  workflowType: string;
  challenges: string[];
  timeline: string;
  teamSize: string;
  currentWorkaround: string;
}

export interface DiagnosticAnalysis {
  fitScore: number;
  fitStatus: "Strong Fit";
  recommendedSprint: string;
  estimatedDurationDays: string;
  keyRisksIdentified: string[];
  recommendedArchitecture: string;
  sprintDeliverables: string[];
  evidenceLevelToDeliver: EvidenceLevel;
  reasoning: string;
}
