import { useCv } from '@/context/CvContext';
import { TEMPLATES } from '@/types/cv';
import { Check } from 'lucide-react';

export function CvList() {
  const { selectedTemplate, setSelectedTemplate, hasGenerated } = useCv();

  if (!hasGenerated) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
        Plantillas
      </h3>
      {TEMPLATES.map((tmpl) => {
        const isSelected = selectedTemplate === tmpl.id;
        return (
          <button
            key={tmpl.id}
            onClick={() => setSelectedTemplate(tmpl.id)}
            className={`text-left p-2.5 rounded-lg border transition-all ${
              isSelected
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-transparent hover:border-border hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center gap-2">
              {isSelected && <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />}
              <div>
                <div className="font-medium text-sm text-foreground">{tmpl.nameES}</div>
                <div className="text-xs text-muted-foreground">{tmpl.description}</div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
