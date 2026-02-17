import { useCv } from '@/context/CvContext';
import { TEMPLATES } from '@/types/cv';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function TemplateSelect() {
  const { selectedTemplate, setSelectedTemplate, sectionLanguage, setSectionLanguage } = useCv();
  const selected = TEMPLATES.find((t) => t.id === selectedTemplate);

  return (
    <div className="rounded-lg border-2 border-primary/30 bg-gradient-to-b from-primary/10 to-background p-2.5 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wide text-primary">Plantilla CV</p>
        {selected && (
          <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
            {selected.nameES}
          </span>
        )}
      </div>
      <Select value={selectedTemplate} onValueChange={(value) => setSelectedTemplate(value as typeof selectedTemplate)}>
        <SelectTrigger className="h-9 w-full border-primary/40 bg-background text-sm focus:ring-2 focus:ring-primary/30">
          <SelectValue placeholder="Selecciona una plantilla" />
        </SelectTrigger>
        <SelectContent>
          {TEMPLATES.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              {template.nameES}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="mt-2">
        <Select value={sectionLanguage} onValueChange={(value) => setSectionLanguage(value as 'es' | 'en')}>
          <SelectTrigger className="h-9 w-full border-primary/40 bg-background text-sm focus:ring-2 focus:ring-primary/30">
            <SelectValue placeholder="Idioma de titulos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="es">Titulos en Espanol</SelectItem>
            <SelectItem value="en">Titles in English</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
