import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(email: string, auditId: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'SpendLens <onboarding@resend.dev>', // Replace with your verified domain in production
      to: email,
      subject: 'Your AI Spend Audit Report is Ready',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="color: #10b981;">Your AI Spend Audit is Ready</h2>
          <p>Thank you for using SpendLens to audit your AI tool stack.</p>
          <p>You can view your full report at any time using the link below:</p>
          <div style="margin: 30px 0;">
            <a href="https://spendlens.vercel.app/results/${auditId}" 
               style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
               View My Audit Report
            </a>
          </div>
          <p>If your audit showed significant savings, the Credex team will reach out shortly about how to capture those savings through discounted AI credits.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #666;">SpendLens — Powered by Credex</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Resend catch error:', error);
    return { success: false, error };
  }
}
