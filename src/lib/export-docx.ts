import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { CvData } from '@/types/cv';

export async function exportToDocx(data: CvData, filename: string) {
  const children: Paragraph[] = [];

  children.push(new Paragraph({
    children: [new TextRun({ text: data.name, bold: true, size: 32, font: 'Calibri' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
  }));

  if (data.contactInfo.length > 0) {
    children.push(new Paragraph({
      children: [new TextRun({ text: data.contactInfo.join(' | '), size: 20, font: 'Calibri', color: '666666' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }));
  }

  if (data.summary) {
    children.push(new Paragraph({
      children: [new TextRun({ text: 'Resumen', bold: true, size: 24, font: 'Calibri' })],
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
      children: [new TextRun({ text: section.title, bold: true, size: 24, font: 'Calibri' })],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' } },
    }));

    for (const item of section.items) {
      const clean = item.replace(/^[-•*]\s*/, '').trim();
      const isSubItem = item.startsWith('  ') || item.startsWith('\t');
      children.push(new Paragraph({
        children: [new TextRun({
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
