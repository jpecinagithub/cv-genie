import { CvData } from '@/types/cv';

interface Props { data: CvData; }

export function ModernHeaderTemplate({ data }: Props) {
  return (
    <div style={{
      width: '210mm', minHeight: '297mm', background: 'white',
      fontFamily: "'Source Sans 3', sans-serif", fontSize: '10.5pt',
      lineHeight: '1.5', boxSizing: 'border-box',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #0f766e, #115e59)',
        color: 'white', padding: '15mm 25mm 12mm',
      }}>
        <h1 style={{ fontSize: '26pt', fontWeight: 700, margin: 0, letterSpacing: '0.5px' }}>
          {data.name}
        </h1>
        {data.contactInfo.length > 0 && (
          <p style={{ fontSize: '9pt', color: '#a7f3d0', marginTop: '3mm' }}>
            {data.contactInfo.join('  |  ')}
          </p>
        )}
        {data.summary && (
          <p style={{ fontSize: '10pt', color: '#d1fae5', marginTop: '4mm', maxWidth: '90%' }}>
            {data.summary}
          </p>
        )}
      </div>

      <div style={{ padding: '10mm 25mm 20mm' }}>
        {data.sections.map((section, i) => (
          <div key={i} style={{ marginBottom: '6mm' }}>
            <h2 style={{
              fontSize: '12pt', fontWeight: 700, color: '#0f766e',
              borderBottom: '2px solid #0f766e', paddingBottom: '1.5mm',
              marginBottom: '3mm', textTransform: 'uppercase', letterSpacing: '1px',
            }}>
              {section.title}
            </h2>
            {section.items.map((item, j) => {
              const isSubItem = item.startsWith('  ') || item.startsWith('\t');
              const clean = item.replace(/^[-•*]\s*/, '').trim();
              return (
                <p key={j} style={{
                  margin: '1mm 0', paddingLeft: isSubItem ? '6mm' : '3mm',
                  fontSize: isSubItem ? '9.5pt' : '10.5pt',
                  color: isSubItem ? '#6b7280' : '#374151',
                }}>
                  {!isSubItem && '● '}{clean}
                </p>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
