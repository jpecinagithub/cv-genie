import { CvData } from '@/types/cv';
import { TwoColumnBaseTemplate } from './TwoColumnBaseTemplate';

interface Props { data: CvData; }

export function TwoColumnBurgundyTemplate({ data }: Props) {
  return (
    <TwoColumnBaseTemplate
      data={data}
      theme={{
        sidebarWidth: '72mm',
        sidebarPadding: '20mm 9mm',
        sidebarBg: '#3f1728',
        sidebarText: '#fce7f3',
        photoBorder: '#9d174d',
        professionColor: '#f9a8d4',
        contactColor: '#fbcfe8',
        contactIconColor: '#fdf2f8',
        sidebarHeadingColor: '#f472b6',
        sidebarHeadingBorder: '#831843',
        sidebarItemColor: '#fce7f3',
        mainHeadingColor: '#9d174d',
        mainHeadingBorder: '#9d174d',
        summaryColor: '#4b5563',
        mainPrimaryText: '#374151',
        mainSecondaryText: '#6b7280',
      }}
    />
  );
}
