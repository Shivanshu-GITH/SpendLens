import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendConfirmationEmail } from '@/lib/resend';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    if (!rateLimit(ip)) {
      return NextResponse.json({ error: 'Rate limited. Please try again later.' }, { status: 429 });
    }

    const body = await req.json();

    // Honeypot check
    if (body.website) {
      return NextResponse.json({ ok: true }); // Silent rejection
    }

    const { email, companyName, role, teamSize, auditId, referralCode } = body;

    if (!email || !auditId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save lead to Supabase
    const { error: dbError } = await supabaseAdmin
      .from('leads')
      .insert({
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
      // Continue to email even if DB fails
    }

    // Send confirmation email
    await sendConfirmationEmail(email, auditId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Leads API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
