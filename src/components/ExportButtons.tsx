import { useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useCv } from '@/context/CvContext';
import { exportToPdf } from '@/lib/export-pdf';
import { exportToDocx } from '@/lib/export-docx';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TEMPLATES } from '@/types/cv';
import { FileText, FileDown, Printer, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  cvRef: React.RefObject<HTMLDivElement | null>;
}

export function ExportButtons({ cvRef }: Props) {
  const {
    cvData,
    selectedTemplate,
    setSelectedTemplate,
    sectionLanguage,
    setSectionLanguage,
    profileName,
  } = useCv();
  const [exporting, setExporting] = useState<string | null>(null);

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
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur">
      <Select value={selectedTemplate} onValueChange={(value) => setSelectedTemplate(value as typeof selectedTemplate)}>
        <SelectTrigger className="h-9 w-[180px] border-slate-300 bg-white text-xs font-semibold">
          <SelectValue placeholder="Plantilla" />
        </SelectTrigger>
        <SelectContent>
          {TEMPLATES.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              {template.nameES}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sectionLanguage} onValueChange={(value) => setSectionLanguage(value as 'es' | 'en')}>
        <SelectTrigger className="h-9 w-[170px] border-slate-300 bg-white text-xs font-semibold">
          <SelectValue placeholder="Idioma" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="es">Títulos en español</SelectItem>
          <SelectItem value="en">Títulos en inglés</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" className="h-9 border-slate-300 bg-white font-semibold" onClick={handlePdf} disabled={!!exporting}>
        {exporting === 'pdf' ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <FileText className="h-4 w-4 mr-1" />}
        PDF
      </Button>
      <Button variant="outline" size="sm" className="h-9 border-slate-300 bg-white font-semibold" onClick={handleDocx} disabled={!!exporting}>
        {exporting === 'docx' ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <FileDown className="h-4 w-4 mr-1" />}
        DOCX
      </Button>
      <Button variant="outline" size="sm" className="h-9 border-slate-300 bg-white font-semibold" onClick={() => handlePrint()} disabled={!!exporting}>
        <Printer className="h-4 w-4 mr-1" /> Imprimir
      </Button>
    </div>
  );
}
