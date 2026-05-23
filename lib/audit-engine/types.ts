export interface ToolInput {
  toolId: string;          // e.g. "cursor", "github_copilot"
  plan: string;            // e.g. "pro", "business"
  seats: number;
  monthlySpend: number;    // what they actually pay
}

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface AuditFormInput {
  tools: ToolInput[];
  teamSize: number;
  primaryUseCase: UseCase;
}

export interface ToolAudit {
  toolId: string;
  currentPlan: string;
  currentMonthlySpend: number;
  action: 'keep' | 'downgrade' | 'switch' | 'eliminate' | 'optimize';
  recommendedPlan?: string;
  recommendedTool?: string;
  savingsPerMonth: number;
  reason: string; // 1 sentence, finance-literate
}

export interface AuditResult {
  auditId: string;
  toolAudits: ToolAudit[];
  totalCurrentSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isAlreadyOptimal: boolean;
  spendPerDeveloper: number;
  benchmarkAverage: number;
  aiSummary?: string;
}
