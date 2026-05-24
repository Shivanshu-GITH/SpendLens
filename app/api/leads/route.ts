import { NextRequest, NextResponse } from 'next/server';
import { sendConfirmationEmail } from '@/lib/resend';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    const { email, companyName, role, teamSize, auditId, referralCode } = body;

    if (!email || !auditId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const supabaseAdmin = getSupabaseAdmin();
      const { error: dbError } = await supabaseAdmin.from('leads').insert({
        audit_id: auditId,
        email,
        company_name: companyName,
        role,
        team_size: teamSize,
        referral_code: referralCode,
        created_at: new Date().toISOString(),
      });

      if (dbError) {
        console.error('Supabase leads error:', dbError);
      }
    } else if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        {
          error: 'Database not configured',
          message: 'Add Supabase environment variables to enable lead capture.',
        },
        { status: 503 },
      );
    } else {
      console.log('[dev] Lead captured (not persisted):', email, auditId);
    }

    await sendConfirmationEmail(email, auditId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Leads API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
