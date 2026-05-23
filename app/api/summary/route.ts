import { NextRequest, NextResponse } from 'next/server';
import { generateAuditSummary } from '@/lib/ai-summary';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { auditResult, teamSize, primaryUseCase } = body;

    if (!auditResult) {
      return NextResponse.json({ error: 'Missing audit result' }, { status: 400 });
    }

    const summary = await generateAuditSummary(auditResult, teamSize, primaryUseCase);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Summary API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
