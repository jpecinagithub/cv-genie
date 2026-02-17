import { forwardRef } from 'react';
import { CvData, TemplateName, Language } from '@/types/cv';
import { MinimalTemplate } from './MinimalTemplate';
import { TwoColumnTemplate } from './TwoColumnTemplate';
import { ModernHeaderTemplate } from './ModernHeaderTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { CompactTemplate } from './CompactTemplate';

interface Props {
  data: CvData;
  template: TemplateName;
  language: Language;
}

const TEMPLATE_MAP: Record<TemplateName, React.ComponentType<{ data: CvData; language: Language }>> = {
  'minimal': MinimalTemplate,
  'two-column': TwoColumnTemplate,
  'modern-header': ModernHeaderTemplate,
  'executive': ExecutiveTemplate,
  'compact': CompactTemplate,
};

export const TemplateRenderer = forwardRef<HTMLDivElement, Props>(
  ({ data, template, language }, ref) => {
    const Component = TEMPLATE_MAP[template];
    return (
      <div ref={ref}>
        <Component data={data} language={language} />
      </div>
    );
  }
);

TemplateRenderer.displayName = 'TemplateRenderer';
