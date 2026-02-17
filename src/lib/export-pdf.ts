import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportToPdf(element: HTMLElement, filename: string) {
  const clone = element.cloneNode(true) as HTMLElement;
  Object.assign(clone.style, {
    position: 'absolute',
    left: '-9999px',
    top: '0',
    transform: 'none',
    width: '210mm',
  });
  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);
  } finally {
    document.body.removeChild(clone);
  }
}
