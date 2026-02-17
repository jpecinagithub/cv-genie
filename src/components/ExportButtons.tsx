import { useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useCv } from '@/context/CvContext';
import { exportToPdf } from '@/lib/export-pdf';
import { exportToDocx } from '@/lib/export-docx';
import { Button } from '@/components/ui/button';
import { TEMPLATES } from '@/types/cv';
import { FileText, FileDown, Printer, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  cvRef: React.RefObject<HTMLDivElement | null>;
}

export function ExportButtons({ cvRef }: Props) {
  const { cvData, selectedTemplate, profileName } = useCv();
  const [exporting, setExporting] = useState<string | null>(null);

  const templateName = TEMPLATES.find(t => t.id === selectedTemplate)?.nameES || selectedTemplate;
  const baseName = (profileName || cvData?.name || 'cv').replace(/\s+/g, '_');
  const filename = `${baseName}_${selectedTemplate}`;

  const handlePrint = useReactToPrint({
    contentRef: cvRef as React.RefObject<HTMLElement>,
  });

  const handlePdf = async () => {
    if (!cvRef.current) return;
    setExporting('pdf');
    try {
      await exportToPdf(cvRef.current, filename);
      toast.success('PDF descargado');
    } catch (err) {
      toast.error('Error al exportar PDF');
      console.error(err);
    } finally {
      setExporting(null);
    }
  };

  const handleDocx = async () => {
    if (!cvData) return;
    setExporting('docx');
    try {
      await exportToDocx(cvData, filename);
      toast.success('DOCX descargado');
    } catch (err) {
      toast.error('Error al exportar DOCX');
      console.error(err);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 border-b bg-card">
      <span className="text-sm font-medium text-muted-foreground mr-auto">{templateName}</span>
      <Button variant="outline" size="sm" onClick={handlePdf} disabled={!!exporting}>
        {exporting === 'pdf' ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <FileText className="h-4 w-4 mr-1" />}
        PDF
      </Button>
      <Button variant="outline" size="sm" onClick={handleDocx} disabled={!!exporting}>
        {exporting === 'docx' ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <FileDown className="h-4 w-4 mr-1" />}
        DOCX
      </Button>
      <Button variant="outline" size="sm" onClick={() => handlePrint()} disabled={!!exporting}>
        <Printer className="h-4 w-4 mr-1" /> Imprimir
      </Button>
    </div>
  );
}
