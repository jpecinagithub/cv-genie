import { CvData } from '@/types/cv';
import { TwoColumnBaseTemplate } from './TwoColumnBaseTemplate';

interface Props { data: CvData; }

export function TwoColumnEmeraldTemplate({ data }: Props) {
  return (
    <TwoColumnBaseTemplate
      data={data}
      theme={{
        sidebarWidth: '72mm',
        sidebarPadding: '20mm 9mm',
        sidebarBg: '#052e2b',
        sidebarText: '#d1fae5',
        photoBorder: '#0f766e',
        professionColor: '#a7f3d0',
        contactColor: '#99f6e4',
        contactIconColor: '#ccfbf1',
        sidebarHeadingColor: '#5eead4',
        sidebarHeadingBorder: '#115e59',
        sidebarItemColor: '#ccfbf1',
        mainHeadingColor: '#0f766e',
        mainHeadingBorder: '#0f766e',
        summaryColor: '#374151',
        mainPrimaryText: '#374151',
        mainSecondaryText: '#6b7280',
      }}
    />
  );
}
