'use client';

import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function ExportPDFButton() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const originalElement = document.getElementById('audit-report-content');
      if (!originalElement) return;

      // Dynamically import libraries
      const [jsPDF, html2canvas] = await Promise.all([
        import('jspdf').then(m => m.default),
        import('html2canvas').then(m => m.default)
      ]);

      // 1. Create a helper to convert any color to RGB
      const toRgb = (color: string) => {
        if (!color || color === 'transparent' || color === 'none') return color;
        if (color.startsWith('rgb')) return color;
        
        const temp = document.createElement('div');
        temp.style.color = color;
        document.body.appendChild(temp);
        const rgb = window.getComputedStyle(temp).color;
        document.body.removeChild(temp);
        
        // If the browser still returns oklch/lab, we need a hard fallback
        if (rgb.includes('oklch') || rgb.includes('lab')) {
          if (color.includes('emerald')) return 'rgb(52, 211, 153)';
          if (color.includes('slate')) return 'rgb(15, 23, 42)';
          if (color.includes('blue')) return 'rgb(59, 130, 246)';
          return 'rgb(255, 255, 255)';
        }
        return rgb;
      };

      // 2. Options for html2canvas
      const options = {
        scale: 2,
        useCORS: true,
        backgroundColor: '#020617',
        logging: false,
        onclone: (clonedDoc: Document) => {
          // Remove ALL style/link tags that might contain unsupported CSS functions
          const styles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
          styles.forEach(s => s.remove());

          const report = clonedDoc.getElementById('audit-report-content');
          if (!report) return;

          // Apply absolute basic styling to the report container
          report.style.backgroundColor = '#020617';
          report.style.color = '#f8fafc';
          report.style.fontFamily = 'sans-serif';
          report.style.padding = '40px';
          report.style.width = '800px';

          // Recursively sanitize every element
          const allElements = report.getElementsByTagName('*');
          for (let i = 0; i < allElements.length; i++) {
            const el = allElements[i] as HTMLElement;
            
            // Get computed style from the ORIGINAL element
            const originalEl = document.getElementsByTagName('*')[i]; // This is a bit risky but fallback
            const style = window.getComputedStyle(el);

            // Force convert critical properties to RGB
            const props = ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke'];
            props.forEach(prop => {
              const val = style.getPropertyValue(prop);
              if (val.includes('oklch') || val.includes('lab')) {
                el.style.setProperty(prop, toRgb(val), 'important');
              }
            });

            // Disable animations
            el.style.animation = 'none';
            el.style.transition = 'none';
          }
        }
      };

      const canvas = await html2canvas(originalElement, options);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('spendlens-audit-report.pdf');
    } catch (error) {
      console.error('PDF Export Error:', error);
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
