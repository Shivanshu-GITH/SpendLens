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

      // Wait a bit to ensure dynamic content and animations are ready
      await new Promise(resolve => setTimeout(resolve, 800));

      const [jsPDF, html2canvas] = await Promise.all([
        import('jspdf').then(m => m.default),
        import('html2canvas').then(m => m.default)
      ]);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Use the modern .html() method for better rendering and page management
      await new Promise<void>((resolve, reject) => {
        pdf.html(originalElement, {
          callback: (doc) => {
            doc.save(`spendlens-audit-${auditId || 'report'}.pdf`);
            resolve();
          },
          x: 0,
          y: 0,
          width: pageWidth,
          windowWidth: 1024,
          autoPaging: 'text',
          html2canvas: {
            html2canvas: html2canvas, // Pass the imported reference
            scale: 2,
            useCORS: true,
            backgroundColor: '#020617',
            logging: false,
            onclone: (clonedDoc: Document) => {
              const report = clonedDoc.getElementById('audit-report-content');
              if (!report) return;

              // Helper to resolve oklch/lab colors to RGB
              const resolveColor = (color: string) => {
                if (!color || (!color.includes('oklch') && !color.includes('lab'))) return color;
                
                try {
                  const temp = clonedDoc.createElement('div');
                  temp.style.color = color;
                  clonedDoc.body.appendChild(temp);
                  const resolved = window.getComputedStyle(temp).color;
                  clonedDoc.body.removeChild(temp);
                  
                  // If it still contains oklch/lab (browser doesn't resolve it or returns same string)
                  // we must return a fallback hex to prevent html2canvas from crashing
                  if (resolved.includes('oklch') || resolved.includes('lab')) {
                    return '#1e293b'; // Default slate fallback
                  }
                  return resolved;
                } catch (e) {
                  return '#1e293b';
                }
              };

              // Fix for Tailwind v4 modern colors and gradients
              const allElements = report.getElementsByTagName('*');
              for (let i = 0; i < allElements.length; i++) {
                const el = allElements[i] as HTMLElement;
                const style = window.getComputedStyle(el);

                // Standard color properties
                const props = ['color', 'backgroundColor', 'borderColor', 'borderTopColor', 'borderBottomColor', 'fill', 'stroke', 'outlineColor'];
                props.forEach(prop => {
                  const val = style.getPropertyValue(prop);
                  if (val.includes('oklch') || val.includes('lab')) {
                    el.style.setProperty(prop, resolveColor(val), 'important');
                  }
                });

                // Background gradients
                const bgImg = style.backgroundImage;
                if (bgImg && (bgImg.includes('oklch') || bgImg.includes('lab'))) {
                  const resolvedBg = bgImg.replace(/(oklch|lab)\([^)]+\)/g, (match) => resolveColor(match));
                  el.style.backgroundImage = resolvedBg;
                }

                el.style.animation = 'none';
                el.style.transition = 'none';
                
                if (el.id === 'audit-report-content') {
                  el.style.height = 'auto';
                  el.style.overflow = 'visible';
                }
              }
            }
          }
        });
      });

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
