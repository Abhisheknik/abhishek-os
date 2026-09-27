export type View = "lab" | "terminal" | "network" | "projects" | "challenge" | "hire";

export type AgentStep = {
  label: string;
  tool?: string;
  detail?: string;
};

export type AgentResult = {
  steps: AgentStep[];
  answer: string;
  projectId?: string;
  action?: { type: "navigate"; target: View; projectId?: string };
};

export type RoleFitScore = {
  dimension: string;
  score: number; // 0-5
  label: "Strong" | "Good" | "Fair" | "Limited";
};

export type RoleFitResult = {
  role: string;
  overall: "Strong Match" | "Good Match" | "Partial Match";
  scores: RoleFitScore[];
  evidence: string[];
};
