import { forwardRef } from 'react';
import { CvData, TemplateName } from '@/types/cv';
import { MinimalTemplate } from './MinimalTemplate';
import { TwoColumnTemplate } from './TwoColumnTemplate';
import { TwoColumnSapphireTemplate } from './TwoColumnSapphireTemplate';
import { TwoColumnEmeraldTemplate } from './TwoColumnEmeraldTemplate';
import { TwoColumnBurgundyTemplate } from './TwoColumnBurgundyTemplate';
import { ModernHeaderTemplate } from './ModernHeaderTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { CompactTemplate } from './CompactTemplate';
import { AuroraBandTemplate } from './AuroraBandTemplate';
import { LedgerLinesTemplate } from './LedgerLinesTemplate';
import { RetroGridTemplate } from './RetroGridTemplate';

interface Props {
  data: CvData;
  template: TemplateName;
}

const TEMPLATE_MAP: Record<TemplateName, React.ComponentType<{ data: CvData }>> = {
  'minimal': MinimalTemplate,
  'two-column': TwoColumnTemplate,
  'two-column-sapphire': TwoColumnSapphireTemplate,
  'two-column-emerald': TwoColumnEmeraldTemplate,
  'two-column-burgundy': TwoColumnBurgundyTemplate,
  'modern-header': ModernHeaderTemplate,
  'executive': ExecutiveTemplate,
  'compact': CompactTemplate,
  'aurora-band': AuroraBandTemplate,
  'ledger-lines': LedgerLinesTemplate,
  'retro-grid': RetroGridTemplate,
};

export const TemplateRenderer = forwardRef<HTMLDivElement, Props>(
  ({ data, template }, ref) => {
    const Component = TEMPLATE_MAP[template] ?? MinimalTemplate;
    return (
      <div ref={ref}>
        <Component data={data} />
      </div>
    );
  }
);

TemplateRenderer.displayName = 'TemplateRenderer';
