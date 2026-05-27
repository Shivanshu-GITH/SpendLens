import { Metadata } from 'next';
import { devAuditStore, shouldUseDevAuditStore } from '@/lib/dev-audit-store';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { HeroSavings } from '@/components/Results/HeroSavings';
import { ToolBreakdown } from '@/components/Results/ToolBreakdown';
import { AISummary } from '@/components/Results/AISummary';
import { OptimizationCTA } from '@/components/Results/CredexCTA';
import { ShareButton } from '@/components/Results/ShareButton';
import { EmailReportButton } from '@/components/Results/EmailReportButton';
import { ExportPDFButton } from '@/components/Results/ExportPDFButton';
import { BenchmarkCard } from '@/components/Results/BenchmarkCard';
import { LeadCaptureModal } from '@/components/LeadCapture/LeadCaptureModal';
import Link from 'next/link';
import { ChevronLeft, Info } from 'lucide-react';
import { AuditResult } from '@/lib/audit-engine/types';

interface PageProps {
  params: Promise<{ auditId: string }>;
}

async function getAudit(auditId: string) {
  if (shouldUseDevAuditStore()) {
    const data = devAuditStore.get(auditId);
    if (!data) {
      console.log('[dev] No audit found in memory for ID:', auditId);
    }
    return data;
  }

  if (!isSupabaseConfigured()) {
    console.error('Supabase is not configured');
    return null;
  }

  console.log('Fetching audit from Supabase for ID:', auditId);
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from('audits')
    .select('*')
    .eq('id', auditId)
    .single();

  if (error) {
    console.error('Supabase fetch error details:', JSON.stringify(error, null, 2));
    return null;
  }
  if (!data) {
    console.log('No data found for audit ID:', auditId);
    return null;
  }
  console.log('Successfully fetched audit data for ID:', auditId);
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { auditId } = await params;
  const audit = await getAudit(auditId);
  if (!audit) return { title: 'Audit Not Found | SpendLens' };

  const savings = audit.total_monthly_savings;
  const annualSavings = audit.total_annual_savings;

  return {
    title: `Save $${savings}/mo on AI Tools | SpendLens Audit`,
    description: `We identified $${annualSavings.toLocaleString()} in potential annual savings for this team. Run your free audit now.`,
    openGraph: {
      title: `I found $${savings}/month in AI tool savings`,
      description: `Run your free AI spend audit at SpendLens`,
      images: [`/api/og?savings=${savings}`],
      type: 'website',
    },
  };
}

export default async function ResultsPage({ params }: PageProps) {
  const { auditId } = await params;
  const audit = await getAudit(auditId);

  if (!audit) {
    notFound();
  }

  const result = audit.audit_result as AuditResult;
  const showCredexCTA = result.totalMonthlySavings > 500;

  return (
    <div className="container max-w-4xl py-12 px-4 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <Link href="/audit" className="inline-flex items-center text-sm text-slate-400 hover:text-slate-100">
          <ChevronLeft className="w-4 h-4 mr-1" /> New Audit
        </Link>
        <div className="flex items-center gap-4">
          <EmailReportButton auditId={auditId} teamSize={audit.team_size} />
          <ExportPDFButton auditId={auditId} />
          <ShareButton />
        </div>
      </div>

      <div id="audit-report-content" className="space-y-12 bg-slate-950 p-4 rounded-3xl">
        <HeroSavings 
          monthlySavings={result.totalMonthlySavings} 
          annualSavings={result.totalAnnualSavings} 
        />

        <AISummary 
          auditResult={result} 
          teamSize={audit.team_size} 
          primaryUseCase={audit.primary_use_case} 
        />

        <BenchmarkCard 
          spendPerDeveloper={result.spendPerDeveloper}
          benchmarkAverage={result.benchmarkAverage}
          teamSize={audit.team_size}
        />

        {showCredexCTA && <OptimizationCTA />}

        <ToolBreakdown audits={result.toolAudits} />

        {result.isAlreadyOptimal && (
          <div className="p-6 rounded-xl border border-blue-500/20 bg-blue-500/5 flex gap-4">
            <Info className="w-6 h-6 text-blue-400 shrink-0" />
            <div>
              <h4 className="font-bold text-blue-100">You&apos;re spending well!</h4>
              <p className="text-blue-200/70 text-sm">
                Your current AI tool stack is highly optimized. We didn&apos;t find any significant overspending or redundant plans. 
                Check back in a few months as vendor pricing evolves.
              </p>
            </div>
          </div>
        )}
      </div>

      <LeadCaptureModal 
        auditId={auditId} 
        teamSize={audit.team_size} 
        isAlreadyOptimal={result.isAlreadyOptimal}
      />

      <footer className="pt-12 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>© 2026 SpendLens. All pricing data sourced directly from vendor pages.</p>
      </footer>
    </div>
  );
}
