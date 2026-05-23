import { AuditFormInput, ToolAudit, ToolInput } from './types';
import { PRICING_DATA } from './pricing';

export function auditTool(tool: ToolInput, input: AuditFormInput): ToolAudit {
  const toolIds = input.tools.map(t => t.toolId);
  const toolPlans = input.tools.reduce((acc, t) => {
    acc[t.toolId] = t.plan;
    return acc;
  }, {} as Record<string, string>);

  const recommendations: ToolAudit[] = [];

  // Default: keep as is
  const defaultAudit: ToolAudit = {
    toolId: tool.toolId,
    currentPlan: tool.plan,
    currentMonthlySpend: tool.monthlySpend,
    action: 'keep',
    savingsPerMonth: 0,
    reason: 'Your current plan is optimal for your usage.',
  };

  const pricingInfo = PRICING_DATA[tool.toolId];

  // --- 1. REDUNDANCY RULES (Highest Priority - Potential 100% savings) ---

  // GitHub Copilot redundant with Cursor
  if (
    tool.toolId === 'github_copilot' &&
    (toolIds.includes('cursor') && (toolPlans['cursor'] === 'pro' || toolPlans['cursor'] === 'business'))
  ) {
    recommendations.push({
      ...defaultAudit,
      action: 'eliminate',
      reason: 'Cursor Pro/Business includes full LLM-assisted coding. GitHub Copilot is redundant for your workflow.',
      savingsPerMonth: tool.monthlySpend,
    });
  }

  // Windsurf/v0 redundant with Cursor
  if (
    (tool.toolId === 'windsurf' || tool.toolId === 'v0') &&
    toolIds.includes('cursor')
  ) {
    recommendations.push({
      ...defaultAudit,
      action: 'eliminate',
      reason: `You are using both Cursor and ${pricingInfo?.name}. These are competing AI development tools; consolidate into Cursor to save $${tool.monthlySpend}/mo.`,
      savingsPerMonth: tool.monthlySpend,
    });
  }

  // Claude redundant with Cursor (High overlap)
  if (tool.toolId === 'claude' && toolIds.includes('cursor')) {
    recommendations.push({
      ...defaultAudit,
      action: 'optimize',
      reason: 'Cursor includes Claude 3.5 Sonnet access. You can likely cancel your separate Claude Pro subscription.',
      savingsPerMonth: tool.monthlySpend,
    });
  }

  // Gemini redundant with ChatGPT/Claude
  if (
    tool.toolId === 'gemini' && 
    (toolIds.includes('chatgpt') || toolIds.includes('claude')) &&
    input.primaryUseCase !== 'research'
  ) {
    recommendations.push({
      ...defaultAudit,
      action: 'optimize',
      reason: 'You have multiple general-purpose Chat UIs. Consolidating Gemini usage into ChatGPT or Claude could save costs.',
      savingsPerMonth: tool.monthlySpend,
    });
  }

  // ChatGPT redundant with Claude for Writing
  if (tool.toolId === 'chatgpt' && toolIds.includes('claude') && input.primaryUseCase === 'writing') {
    recommendations.push({
      ...defaultAudit,
      action: 'switch',
      recommendedTool: 'claude',
      reason: `For writing-heavy use cases, Claude is superior to ChatGPT. Consolidate into Claude to save $${tool.monthlySpend}/mo.`,
      savingsPerMonth: tool.monthlySpend,
    });
  }

  // Perplexity Pro redundancy
  if (
    tool.toolId === 'perplexity' &&
    tool.plan === 'pro' &&
    (toolIds.includes('chatgpt') || toolIds.includes('claude') || toolIds.includes('gemini'))
  ) {
    recommendations.push({
      ...defaultAudit,
      action: 'optimize',
      reason: 'Modern LLMs now have built-in web search. You can likely replace Perplexity Pro ($20/mo) with your existing subscriptions.',
      savingsPerMonth: 20,
    });
  }

  // --- 2. PLAN OPTIMIZATION RULES (Medium Priority) ---

  // Catch extreme overspending
  if (pricingInfo) {
    const standardPlans = pricingInfo.plans.filter(p => !p.isCustom);
    if (standardPlans.length > 0) {
      const bestPlan = standardPlans.reduce((prev, curr) => 
        Math.abs(curr.pricePerUser * tool.seats - tool.monthlySpend) < Math.abs(prev.pricePerUser * tool.seats - tool.monthlySpend) ? curr : prev
      );
      
      const expectedCost = bestPlan.pricePerUser * tool.seats;
      if (tool.monthlySpend > expectedCost + 5) {
        recommendations.push({
          ...defaultAudit,
          action: 'optimize',
          reason: `You are paying $${tool.monthlySpend}/mo for ${tool.seats} seats. This should cost ~$${expectedCost}/mo on the ${bestPlan.name} plan.`,
          savingsPerMonth: tool.monthlySpend - expectedCost,
        });
      }
    }
  }

  // Claude Pro for 5+ seats -> Switch to Team
  if (tool.toolId === 'claude' && tool.plan === 'pro' && tool.seats >= 5) {
    const teamPrice = PRICING_DATA.claude.plans.find(p => p.name === 'team')?.pricePerUser || 25;
    const recommendedCost = tool.seats * teamPrice;
    if (recommendedCost < tool.monthlySpend) {
      recommendations.push({
        ...defaultAudit,
        action: 'downgrade',
        recommendedPlan: 'team',
        reason: `Claude Team ($${teamPrice}/user/mo) is more cost-effective and includes admin controls for ${tool.seats} seats.`,
        savingsPerMonth: tool.monthlySpend - recommendedCost,
      });
    }
  }

  // Team plan with < 3 users -> Suggest individual
  if (tool.seats < 3 && (tool.plan === 'team' || tool.plan === 'business' || tool.plan === 'teams')) {
    const individualPlan = pricingInfo?.plans.find(p => p.name === 'pro' || p.name === 'plus' || p.name === 'individual');
    if (individualPlan) {
      const recommendedCost = tool.seats * individualPlan.pricePerUser;
      if (recommendedCost < tool.monthlySpend) {
        recommendations.push({
          ...defaultAudit,
          action: 'downgrade',
          recommendedPlan: individualPlan.name,
          reason: `At ${tool.seats} seats, individual ${individualPlan.name} plans are more cost-effective than a team subscription.`,
          savingsPerMonth: tool.monthlySpend - recommendedCost,
        });
      }
    }
  }

  // Enterprise Security for larger teams
  if (tool.seats >= 50 && (tool.plan === 'pro' || tool.plan === 'business' || tool.plan === 'plus')) {
    recommendations.push({
      ...defaultAudit,
      action: 'optimize',
      reason: `At ${tool.seats} seats, consider an Enterprise plan for SSO and security—often negotiable at lower rates than public Pro plans.`,
      savingsPerMonth: 0,
    });
  }

  // --- 3. SELECTION ---
  
  // Return the recommendation with highest savings, or default if none
  if (recommendations.length === 0) return defaultAudit;
  
  return recommendations.sort((a, b) => b.savingsPerMonth - a.savingsPerMonth)[0];
}
