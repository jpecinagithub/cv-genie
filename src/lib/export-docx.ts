import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { CvData } from '@/types/cv';
import { getSummaryTitle, isSectionKey, translateSectionTitle } from '@/lib/section-title';

export async function exportToDocx(data: CvData, filename: string) {
  const children: Paragraph[] = [];
  const lang = data.sectionLanguage || 'es';

  children.push(new Paragraph({
    children: [new TextRun({ text: data.name, bold: true, size: 32, font: 'Calibri' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
  }));

  if (data.profession) {
    children.push(new Paragraph({
      children: [new TextRun({ text: data.profession, size: 22, font: 'Calibri', color: '555555' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }));
  }

  if (data.contactInfo.length > 0) {
    children.push(new Paragraph({
      children: [new TextRun({ text: data.contactInfo.join(' | '), size: 20, font: 'Calibri', color: '666666' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }));
  }

  if (data.summary) {
    children.push(new Paragraph({
      children: [new TextRun({ text: getSummaryTitle(lang), bold: true, size: 24, font: 'Calibri' })],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' } },
    }));
    children.push(new Paragraph({
      children: [new TextRun({ text: data.summary, size: 22, font: 'Calibri' })],
      spacing: { after: 200 },
    }));
  }

  for (const section of data.sections) {
    children.push(new Paragraph({
      children: [new TextRun({ text: translateSectionTitle(section.key || section.title, lang, section.title), bold: true, size: 24, font: 'Calibri' })],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' } },
    }));

    for (const item of section.items) {
      const clean = item.replace(/^[-•*]\s*/, '').trim();
      const isSubItem = item.startsWith('  ') || item.startsWith('\t');
      const isEducation = isSectionKey(section, 'education');
      const isExperience = isSectionKey(section, 'experience');
      const [eduTitle, ...eduRest] = clean.split(',');
      const eduSuffix = eduRest.length ? `,${eduRest.join(',')}` : '';
      const [expHeaderRaw, ...expDetailParts] = clean.split('\n');
      const expHeader = expHeaderRaw?.trim() || clean;
      const expDetails = expDetailParts.join(' ').trim();
      const expMatch = expHeader.match(/^(.*?)(\s*\([^)]*\))?$/);
      const expMain = expMatch?.[1]?.trim() || expHeader;
      const expPeriod = expMatch?.[2] || '';
      children.push(new Paragraph({
        children: isEducation
          ? [
              new TextRun({
                text: isSubItem ? '' : '• ',
                size: 22,
                font: 'Calibri',
              }),
              new TextRun({
                text: eduTitle.trim(),
                bold: true,
                size: 22,
                font: 'Calibri',
              }),
              new TextRun({
                text: eduSuffix,
                size: 22,
                font: 'Calibri',
              }),
            ]
          : isExperience
          ? [
              new TextRun({
                text: isSubItem ? '' : '• ',
                size: 22,
                font: 'Calibri',
              }),
              new TextRun({
                text: expMain,
                bold: true,
                size: 22,
                font: 'Calibri',
              }),
              new TextRun({
                text: expPeriod,
                size: 22,
                font: 'Calibri',
              }),
              new TextRun({
                text: expDetails ? ` ${expDetails}` : '',
                size: 22,
                font: 'Calibri',
              }),
            ]
          : [new TextRun({
              text: isSubItem ? clean : `• ${clean}`,
              size: 22,
              font: 'Calibri',
            })],
        spacing: { after: 60 },
        indent: { left: isSubItem ? 720 : 360 },
      }));
    }
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}
