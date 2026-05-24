'use client';

import { Button } from '@/components/ui/button';
import { exportElementToPdf, waitForReportReady } from '@/lib/export-pdf';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ExportPDFButtonProps {
  auditId?: string;
}

export function ExportPDFButton({ auditId }: ExportPDFButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    const toastId = toast.loading('Generating your PDF report...');

    try {
      const reportElement = document.getElementById('audit-report-content');
      if (!reportElement) {
        throw new Error('Report content not found');
      }

      await waitForReportReady(reportElement);

      const filename = `spendlens-audit-${auditId || 'report'}.pdf`;
      await exportElementToPdf(reportElement, filename);

      toast.success('PDF downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error('PDF Export Error:', error);
      const message =
        error instanceof Error && error.message.includes('still loading')
          ? error.message
          : 'Failed to generate PDF. Please try again.';
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={handleExport}
      disabled={loading}
      className="border-slate-800 bg-slate-900 hover:bg-slate-800 h-12 px-6"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Exporting...
        </>
      ) : (
        <>
          <Download className="w-5 h-5 mr-2" /> Export PDF
        </>
      )}
    </Button>
  );
}
