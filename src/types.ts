type EvidenceLevel = "Built/Deployed" | "Prototyped" | "Researched/Designed";
type FitStatus = "Strong Fit" | "Moderate Fit" | "Alternative Architecture Recommended";

export interface ServiceOffer {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  includedFeatures: string[];
  targetAudience: string;
  primaryOfferName: string;
  sprintOutputs: string[];
  iconName: string;
  evidenceBadge: EvidenceLevel;
}

export interface ProductSystem {
  id: string;
  name: string;
  evidenceLevel: EvidenceLevel;
  shortDesc: string;
  capabilities: string[];
  demonstrates: string[];
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
  fitStatus: FitStatus;
  recommendedSprint: string;
  estimatedDurationDays: string;
  keyRisksIdentified: string[];
  recommendedArchitecture: string;
  sprintDeliverables: string[];
  evidenceLevelToDeliver: EvidenceLevel;
  reasoning: string;
}
