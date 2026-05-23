'use client';

import { Button } from '@/components/ui/button';
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
      const originalElement = document.getElementById('audit-report-content');
      if (!originalElement) {
        throw new Error('Report content not found');
      }

      // Wait a bit to ensure AI Summary and other dynamic content are fully rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      const [jsPDF, html2canvas] = await Promise.all([
        import('jspdf').then(m => m.default),
        import('html2canvas').then(m => m.default)
      ]);

      const canvas = await html2canvas(originalElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#020617',
        logging: false,
        onclone: (clonedDoc: Document) => {
          const report = clonedDoc.getElementById('audit-report-content');
          if (!report) return;

          // Helper to convert modern colors to RGB
          const convertColor = (color: string) => {
            if (!color || (!color.includes('oklch') && !color.includes('lab'))) return color;
            const temp = document.createElement('div');
            temp.style.color = color;
            document.body.appendChild(temp);
            const resolved = window.getComputedStyle(temp).color;
            document.body.removeChild(temp);
            return resolved;
          };

          // Sanitize every element's colors without stripping styles
          const allElements = report.getElementsByTagName('*');
          for (let i = 0; i < allElements.length; i++) {
            const el = allElements[i] as HTMLElement;
            const style = window.getComputedStyle(el);

            ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke'].forEach(prop => {
              const val = style.getPropertyValue(prop);
              if (val.includes('oklch') || val.includes('lab')) {
                el.style.setProperty(prop, convertColor(val), 'important');
              }
            });

            // Handle gradients
            const bgImg = style.backgroundImage;
            if (bgImg && (bgImg.includes('oklch') || bgImg.includes('lab'))) {
              el.style.backgroundImage = 'none';
              if (!el.style.backgroundColor) el.style.backgroundColor = '#0f172a';
            }

            // Disable animations
            el.style.animation = 'none';
            el.style.transition = 'none';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Handle multi-page content
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`spendlens-audit-${auditId || 'report'}.pdf`);
      toast.success('PDF downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast.error('Failed to generate PDF. Please try again.', { id: toastId });
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
