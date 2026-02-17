import { CvData } from '@/types/cv';
import { TwoColumnBaseTemplate } from './TwoColumnBaseTemplate';

interface Props { data: CvData; }

export function TwoColumnTemplate({ data }: Props) {
  return (
    <TwoColumnBaseTemplate
      data={data}
      theme={{
        sidebarWidth: '70mm',
        sidebarPadding: '20mm 8mm',
        sidebarBg: '#1e293b',
        sidebarText: '#e2e8f0',
        photoBorder: '#475569',
        professionColor: '#e2e8f0',
        contactColor: '#94a3b8',
        contactIconColor: '#cbd5e1',
        sidebarHeadingColor: '#38bdf8',
        sidebarHeadingBorder: '#334155',
        sidebarItemColor: '#cbd5e1',
        mainHeadingColor: '#1e293b',
        mainHeadingBorder: '#1e293b',
        summaryColor: '#475569',
        mainPrimaryText: '#334155',
        mainSecondaryText: '#64748b',
      }}
    />
  );
}
