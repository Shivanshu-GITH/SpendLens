import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AuditResult } from './audit-engine/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export async function generateAuditSummary(result: AuditResult, teamSize: number, primaryUseCase: string): Promise<string> {
  const toolDetails = result.toolAudits.map(t => 
    `- ${t.toolId}: Current plan "${t.currentPlan}" ($${t.currentMonthlySpend}/mo). Action: ${t.action}. Reason: ${t.reason}. Savings: $${t.savingsPerMonth}/mo.`
  ).join('\n');
  
  const prompt = `You are a senior financial analyst specializing in AI infrastructure costs for high-growth startups.

Given the following AI tool audit results, write a concise, punchy 100-word personalized summary paragraph.
Your goal is to explain the overall health of their AI stack and highlight the most critical actions they need to take.

Requirements:
1. Be direct, specific, and use actual numbers. 
2. Write in second person ("you", "your team").
3. Do not add headers, bullet points, or "Summary:" prefix.
4. Mention at least 3 specific tools from the list if available.
5. Highlight the total potential annual savings.
6. Be honest and professional—no fluff.

Audit context:
- Team size: ${teamSize}
- Primary use case: ${primaryUseCase}
- Total monthly savings identified: $${result.totalMonthlySavings}
- Total annual savings identified: $${result.totalAnnualSavings}

Detailed Tool Audits:
${toolDetails}

Write the summary paragraph now:`;

  // 1. Try Google Gemini (Free Tier)
  if (process.env.GOOGLE_GEMINI_API_KEY) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const response = await model.generateContent(prompt);
      const text = response.response.text();
      if (text) return text;
    } catch (error) {
      console.error('Gemini API error:', error);
    }
  }

  // 2. Try Anthropic (Paid)
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-haiku-latest',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      });
      const text = response.content[0].type === 'text' ? response.content[0].text : '';
      if (text) return text;
    } catch (error) {
      console.error('Anthropic API error:', error);
    }
  }

  // 3. Smart Fallback (Truly Free - No Key Required)
  return buildFallbackSummary(result, teamSize, primaryUseCase);
}

function buildFallbackSummary(result: AuditResult, teamSize: number, primaryUseCase: string): string {
  const topTool = result.toolAudits.find(t => t.savingsPerMonth > 0);
  
  if (result.totalMonthlySavings <= 0) {
    return `Your team of ${teamSize} is already using a highly optimized AI tool stack for ${primaryUseCase}. We didn't find any immediate redundant spending, but we recommend checking back quarterly as pricing plans change frequently.`;
  }

  return `Your team of ${teamSize} is currently spending $${result.totalCurrentSpend}/month on AI tools. We identified $${result.totalMonthlySavings}/month in potential savings — which adds up to $${result.totalAnnualSavings} annually. The biggest opportunity we found is with ${topTool?.toolId || 'your tools'}: ${topTool?.reason || 'optimizing your current plans'}.`;
}
