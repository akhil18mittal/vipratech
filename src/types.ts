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
  /** The matching /solutions/{slug}/ page, if there is one. */
  solutionSlug?: string;
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

export interface NavLink {
  name: string;
  href: string;
}

export interface SolutionLink extends NavLink {
  headline: string;
}

/** Links to the content pages, passed from src/pages/index.astro to the homepage app. */
export interface HomeLinks {
  solutions: SolutionLink[];
  industries: NavLink[];
}

/** A card on a content page. Without `href` the card is shown without a link (its page isn't published yet). */
export interface CardItem {
  label?: string;
  title: string;
  text: string;
  href?: string;
  featured?: boolean;
}

/** A pre-rendered diagram in public/diagrams/, with its natural size. */
export interface Diagram {
  src: string;
  width: number;
  height: number;
}

export interface ContactLinks {
  call: string;
  whatsapp: string;
}
