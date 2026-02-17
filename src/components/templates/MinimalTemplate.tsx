import { CvData, Language } from '@/types/cv';
import { translateSection } from '@/lib/translations';

interface Props { data: CvData; language: Language; }

export function MinimalTemplate({ data, language }: Props) {
  return (
    <div style={{
      width: '210mm', minHeight: '297mm', padding: '25mm 30mm',
      background: 'white', color: '#2d2d2d',
      fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif",
      fontSize: '10.5pt', lineHeight: '1.6', boxSizing: 'border-box',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '8mm' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '28pt', fontWeight: 600, margin: 0, color: '#1a1a2e', letterSpacing: '1px' }}>
          {data.name}
        </h1>
        {data.contactInfo.length > 0 && (
          <p style={{ fontSize: '9pt', color: '#666', marginTop: '3mm' }}>
            {data.contactInfo.join('  ·  ')}
          </p>
        )}
      </div>

      {data.summary && (
        <div style={{ marginBottom: '6mm' }}>
          <p style={{ fontStyle: 'italic', color: '#444', textAlign: 'center', fontSize: '10pt' }}>
            {data.summary}
          </p>
        </div>
      )}

      {data.sections.map((section, i) => (
        <div key={i} style={{ marginBottom: '5mm' }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '13pt', fontWeight: 600, color: '#1a1a2e',
            borderBottom: '1px solid #ddd', paddingBottom: '2mm', marginBottom: '3mm',
            textTransform: 'uppercase', letterSpacing: '1.5px',
          }}>
            {translateSection(section.title, language)}
          </h2>
          {section.items.map((item, j) => {
            const isSubItem = item.startsWith('  ') || item.startsWith('\t');
            const clean = item.replace(/^[-•*]\s*/, '').trim();
            return (
              <p key={j} style={{
                margin: '1mm 0', paddingLeft: isSubItem ? '8mm' : '4mm',
                fontSize: isSubItem ? '9.5pt' : '10.5pt',
                color: isSubItem ? '#555' : '#2d2d2d',
              }}>
                {!isSubItem && '— '}{clean}
              </p>
            );
          })}
        </div>
      ))}
    </div>
  );
}
