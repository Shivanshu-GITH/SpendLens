import { AuditFormInput, AuditResult } from './types';
import { auditTool } from './rules';
import { v4 as uuidv4 } from 'uuid';

export function runAudit(input: AuditFormInput): AuditResult {
  const toolAudits = input.tools.map(tool => auditTool(tool, input));
  
  const totalCurrentSpend = input.tools.reduce((sum, t) => sum + t.monthlySpend, 0);
  const totalMonthlySavings = toolAudits.reduce((sum, t) => sum + t.savingsPerMonth, 0);
  
  // Calculate total seats across all tools for a more accurate spend-per-seat metric
  const totalSeats = input.tools.reduce((sum, t) => sum + t.seats, 0);
  const spendPerSeat = totalCurrentSpend / Math.max(1, totalSeats);
  
  // Benchmark logic: 
  // - Small teams (<10) usually pay more per user ($45-60)
  // - Mid teams (10-50) optimize more ($30-45)
  // - Large teams (50+) often have enterprise deals ($20-35)
  let benchmarkAverage = 45;
  if (input.teamSize >= 50) benchmarkAverage = 25;
  else if (input.teamSize >= 10) benchmarkAverage = 35;

  return {
    auditId: uuidv4(),
    toolAudits,
    totalCurrentSpend,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    isAlreadyOptimal: totalMonthlySavings < 10,
    spendPerDeveloper: spendPerSeat, // Using spend per actual tool seat
    benchmarkAverage,
  };
}
