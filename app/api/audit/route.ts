import { NextRequest, NextResponse } from 'next/server';
import { runAudit } from '@/lib/audit-engine';
import { supabaseAdmin } from '@/lib/supabase';
import { generateAuditSummary } from '@/lib/ai-summary';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    if (!rateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const { tools, teamSize, primaryUseCase } = body;

    if (!tools || !Array.isArray(tools)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const result = runAudit({ tools, teamSize, primaryUseCase });

    // Generate AI Summary once at audit time
    let aiSummary = '';
    try {
      aiSummary = await generateAuditSummary(result, teamSize, primaryUseCase);
    } catch (e) {
      console.error('Failed to generate AI summary during audit:', e);
    }

    // Save to Supabase
    const { data, error } = await supabaseAdmin
      .from('audits')
      .insert({
        id: result.auditId,
        tools_input: { tools, teamSize, primaryUseCase },
        audit_result: { ...result, aiSummary }, // Persist summary in the result object
        total_monthly_savings: result.totalMonthlySavings,
        total_annual_savings: result.totalAnnualSavings,
        team_size: teamSize,
        primary_use_case: primaryUseCase,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error details:', JSON.stringify(error, null, 2));
      return NextResponse.json({ 
        error: 'Database error', 
        message: 'The audits table was not found. Please make sure you have run the SQL setup in Supabase.',
        details: error 
      }, { status: 500 });
    }

    console.log('Supabase insert success:', data.id);
    return NextResponse.json({ auditId: data.id, result });
  } catch (error) {
    console.error('Audit API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
