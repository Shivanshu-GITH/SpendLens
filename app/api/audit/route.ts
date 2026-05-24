import { NextRequest, NextResponse } from 'next/server';
import { runAudit } from '@/lib/audit-engine';
import { generateAuditSummary } from '@/lib/ai-summary';
import { devAuditStore, useDevAuditStore } from '@/lib/dev-audit-store';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tools, teamSize, primaryUseCase } = body;

    if (!tools || !Array.isArray(tools)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const result = runAudit({ tools, teamSize, primaryUseCase });

    let aiSummary = '';
    try {
      aiSummary = await generateAuditSummary(result, teamSize, primaryUseCase);
    } catch (e) {
      console.error('Failed to generate AI summary during audit:', e);
    }

    const auditResult = { ...result, aiSummary };
    const record = {
      id: result.auditId,
      tools_input: { tools, teamSize, primaryUseCase },
      audit_result: auditResult,
      total_monthly_savings: result.totalMonthlySavings,
      total_annual_savings: result.totalAnnualSavings,
      team_size: teamSize,
      primary_use_case: primaryUseCase,
    };

    if (useDevAuditStore()) {
      devAuditStore.save(record);
      console.log('[dev] Audit saved to in-memory store:', record.id);
      return NextResponse.json({ auditId: record.id, result: auditResult });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          error: 'Database not configured',
          message:
            'Add Supabase environment variables to .env.local (see .env.example), or run in development mode without them.',
        },
        { status: 503 },
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('audits')
      .insert({
        id: record.id,
        tools_input: record.tools_input,
        audit_result: record.audit_result,
        total_monthly_savings: record.total_monthly_savings,
        total_annual_savings: record.total_annual_savings,
        team_size: record.team_size,
        primary_use_case: record.primary_use_case,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        {
          error: 'Database error',
          message:
            'The audits table was not found. Please make sure you have run the SQL setup in Supabase.',
          details: error,
        },
        { status: 500 },
      );
    }

    console.log('Supabase insert success:', data.id);
    return NextResponse.json({ auditId: data.id, result: auditResult });
  } catch (error) {
    console.error('Audit API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
