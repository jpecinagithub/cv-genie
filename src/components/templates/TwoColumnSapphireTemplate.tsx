import { CvData } from '@/types/cv';
import { TwoColumnBaseTemplate } from './TwoColumnBaseTemplate';

interface Props { data: CvData; }

export function TwoColumnSapphireTemplate({ data }: Props) {
  return (
    <TwoColumnBaseTemplate
      data={data}
      theme={{
        sidebarWidth: '72mm',
        sidebarPadding: '20mm 9mm',
        sidebarBg: '#0f172a',
        sidebarText: '#e2e8f0',
        photoBorder: '#334155',
        professionColor: '#bfdbfe',
        contactColor: '#93c5fd',
        contactIconColor: '#dbeafe',
        sidebarHeadingColor: '#60a5fa',
        sidebarHeadingBorder: '#1e3a8a',
        sidebarItemColor: '#dbeafe',
        mainHeadingColor: '#1e3a8a',
        mainHeadingBorder: '#1e3a8a',
        summaryColor: '#334155',
        mainPrimaryText: '#1e293b',
        mainSecondaryText: '#64748b',
      }}
    />
  );
}
