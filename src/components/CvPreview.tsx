import { useRef, useState, useEffect } from 'react';
import { useCv } from '@/context/CvContext';
import { TemplateRenderer } from './templates/TemplateRenderer';
import { ExportButtons } from './ExportButtons';

export function CvPreview() {
  const { cvData, selectedTemplate, hasGenerated } = useCv();
  const containerRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const updateScale = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const scaleX = (width - 48) / 794;
      const scaleY = (height - 48) / 1123;
      setScale(Math.min(scaleX, scaleY, 1));
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  if (!hasGenerated || !cvData) {
    return (
      <div className="flex items-center justify-center h-full text-center p-8">
        <div>
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Vista previa del CV</h2>
          <p className="text-muted-foreground max-w-md">
            Completa el formulario del panel izquierdo y haz clic en
            &quot;Generar 5 CVs&quot; para ver el resultado aquí.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ExportButtons cvRef={cvRef} />
      <div ref={containerRef} className="flex-1 overflow-auto p-4 bg-muted/30">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            width: '210mm',
            margin: '0 auto',
          }}
        >
          <TemplateRenderer
            ref={cvRef}
            data={cvData}
            template={selectedTemplate}
          />
        </div>
      </div>
    </div>
  );
}
