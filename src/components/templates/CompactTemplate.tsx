import { CvData } from '@/types/cv';

interface Props { data: CvData; }

export function CompactTemplate({ data }: Props) {
  return (
    <div style={{
      width: '210mm', minHeight: '297mm', padding: '15mm 18mm',
      background: 'white', color: '#333',
      fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif",
      fontSize: '9.5pt', lineHeight: '1.4', boxSizing: 'border-box',
    }}>
      <div style={{
        background: '#f1f5f9', padding: '5mm 8mm', marginBottom: '5mm',
        borderLeft: '3px solid #3b82f6',
      }}>
        <h1 style={{ fontSize: '20pt', fontWeight: 700, margin: 0, color: '#1e293b' }}>
          {data.name}
        </h1>
        {data.contactInfo.length > 0 && (
          <p style={{ fontSize: '8.5pt', color: '#64748b', marginTop: '1mm' }}>
            {data.contactInfo.join('  •  ')}
          </p>
        )}
      </div>

      {data.summary && (
        <p style={{ fontSize: '9.5pt', color: '#475569', marginBottom: '4mm', paddingLeft: '2mm' }}>
          {data.summary}
        </p>
      )}

      {data.sections.map((section, i) => (
        <div key={i} style={{ marginBottom: '3.5mm' }}>
          <h2 style={{
            fontSize: '10pt', fontWeight: 700, color: '#1e40af',
            borderBottom: '1px solid #dbeafe', paddingBottom: '0.5mm',
            marginBottom: '1.5mm', textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            {section.title}
          </h2>
          {section.items.map((item, j) => {
            const isSubItem = item.startsWith('  ') || item.startsWith('\t');
            const clean = item.replace(/^[-•*]\s*/, '').trim();
            return (
              <p key={j} style={{
                margin: '0.3mm 0', paddingLeft: isSubItem ? '5mm' : '2mm',
                fontSize: isSubItem ? '8.5pt' : '9.5pt',
                color: isSubItem ? '#64748b' : '#334155',
              }}>
                {!isSubItem && '› '}{clean}
              </p>
            );
          })}
        </div>
      ))}
    </div>
  );
}
