import { useCv } from '@/context/CvContext';
import { DEMO_TEXT } from '@/lib/demo-text';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RotateCcw, Sparkles, FileText } from 'lucide-react';

export function InputPanel() {
  const {
    rawText, setRawText, profileName, setProfileName,
    generate, reset, isGenerating, hasGenerated,
  } = useCv();

  return (
    <div className="flex flex-col gap-4 h-full">
      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">
          Nombre del perfil <span className="text-muted-foreground font-normal">(opcional)</span>
        </label>
        <Input
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          placeholder="Ej: María García López"
        />
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <label className="text-sm font-medium text-foreground mb-1.5 block">
          Pega tu información profesional
        </label>
        <Textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Pega aquí toda tu información: nombre, experiencia, educación, skills, idiomas, certificaciones..."
          className="flex-1 min-h-[180px] resize-none font-mono text-xs leading-relaxed"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={generate} disabled={!rawText.trim() || isGenerating} className="w-full">
          <Sparkles className="h-4 w-4 mr-2" />
          {isGenerating ? 'Generando...' : 'Generar 5 CVs'}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => setRawText(DEMO_TEXT)}>
            <FileText className="h-3.5 w-3.5 mr-1" />
            Cargar demo
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={reset}
            disabled={!hasGenerated && !rawText}
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
