import { describe, expect, it } from "vitest";
import { analyzeFitDiagnostic, buildFitCallMailto } from "./fitDiagnostic";
import type { FitDiagnosticInput } from "../types";

const baseInput: FitDiagnosticInput = {
  workflowType: "Unstructured AI Workflow",
  challenges: ["High manual review overhead"],
  currentWorkaround: "Spreadsheets and email",
  timeline: "1-2 Months",
  teamSize: "10-50 People",
};

describe.each([
  ["Document Intelligence & Reconciliation", "Reconciliation Opportunity Sprint"],
  ["AI Security, Testing & Compliance", "AI Agent Security Assessment"],
  ["Voice AI & Conversational Systems", "Voice AI Feasibility Sprint"],
  ["AI Sales & Revenue Automation", "Revenue Automation Diagnostic"],
  ["AI Product Research & Prototyping", "AI Product Discovery Sprint"],
])("fit diagnostic category: %s", (workflowType, recommendedSprint) => {
  it(`recommends ${recommendedSprint}`, () => {
    const analysis = analyzeFitDiagnostic({ ...baseInput, workflowType });

    expect(analysis).toMatchObject({
      fitScore: 92,
      fitStatus: "Strong Fit",
      recommendedSprint,
      estimatedDurationDays: "5-10 Business Days",
      evidenceLevelToDeliver: "Built/Deployed",
    });
    expect(analysis.keyRisksIdentified).toHaveLength(3);
    expect(analysis.sprintDeliverables).toHaveLength(4);
  });
});

it("builds an encoded email handoff from the diagnostic inputs", () => {
  const input = {
    ...baseInput,
    workflowType: "Voice AI & Conversational Systems",
    challenges: ["Hindi/Hinglish complexity", "Human handoff"],
  };
  const analysis = analyzeFitDiagnostic(input);
  const mailto = buildFitCallMailto(input, analysis);
  const url = new URL(mailto);

  expect(url.protocol).toBe("mailto:");
  expect(url.pathname).toBe("akhilesh@vipratech.in");
  expect(url.searchParams.get("subject")).toContain(input.workflowType);
  expect(url.searchParams.get("body")).toContain("Hindi/Hinglish complexity; Human handoff");
  expect(url.searchParams.get("body")).toContain("Voice AI Feasibility Sprint");
});
