import { AuditFormInput, AuditResult } from './types';
import { auditTool } from './rules';
import { v4 as uuidv4 } from 'uuid';

export function runAudit(input: AuditFormInput): AuditResult {
  const toolAudits = input.tools.map(tool => auditTool(tool, input));
  
  const totalCurrentSpend = input.tools.reduce((sum, t) => sum + t.monthlySpend, 0);
  const totalMonthlySavings = toolAudits.reduce((sum, t) => sum + t.savingsPerMonth, 0);
  
  const spendPerDeveloper = totalCurrentSpend / Math.max(1, input.teamSize);
  // Benchmark average: ~$45/dev/mo for small teams, ~$35/dev/mo for large teams
  const benchmarkAverage = input.teamSize < 10 ? 45 : 35;

  return {
    auditId: uuidv4(),
    toolAudits,
    totalCurrentSpend,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    isAlreadyOptimal: totalMonthlySavings < 10,
    spendPerDeveloper,
    benchmarkAverage,
  };
}
