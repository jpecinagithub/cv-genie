import { CvData } from '@/types/cv';

interface Props { data: CvData; }

export function ExecutiveTemplate({ data }: Props) {
  return (
    <div style={{
      width: '210mm', minHeight: '297mm', padding: '25mm 28mm',
      background: 'white', color: '#2c2c2c',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      fontSize: '11pt', lineHeight: '1.6', boxSizing: 'border-box',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '5mm' }}>
        <h1 style={{ fontSize: '30pt', fontWeight: 500, margin: 0, color: '#1a1a1a', letterSpacing: '3px', textTransform: 'uppercase' }}>
          {data.name}
        </h1>
        <div style={{ width: '30mm', height: '0.5mm', background: '#92764a', margin: '4mm auto' }} />
        {data.contactInfo.length > 0 && (
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '9pt', color: '#777', letterSpacing: '0.5px' }}>
            {data.contactInfo.join('   ◆   ')}
          </p>
        )}
      </div>

      {data.summary && (
        <div style={{ margin: '6mm 0', textAlign: 'center' }}>
          <p style={{ fontStyle: 'italic', color: '#555', fontSize: '10.5pt', maxWidth: '85%', margin: '0 auto' }}>
            {data.summary}
          </p>
        </div>
      )}

      {data.sections.map((section, i) => (
        <div key={i} style={{ marginBottom: '5mm' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3mm', marginBottom: '3mm' }}>
            <div style={{ flex: 1, height: '0.3mm', background: '#92764a' }} />
            <h2 style={{ fontSize: '12pt', fontWeight: 600, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '2px', whiteSpace: 'nowrap' }}>
              {section.title}
            </h2>
            <div style={{ flex: 1, height: '0.3mm', background: '#92764a' }} />
          </div>
          {section.items.map((item, j) => {
            const isSubItem = item.startsWith('  ') || item.startsWith('\t');
            const clean = item.replace(/^[-•*]\s*/, '').trim();
            return (
              <p key={j} style={{
                fontFamily: "'Source Sans 3', sans-serif",
                margin: '1mm 0', paddingLeft: isSubItem ? '8mm' : '4mm',
                fontSize: isSubItem ? '9.5pt' : '10.5pt',
                color: isSubItem ? '#666' : '#333',
              }}>
                {!isSubItem && '◇ '}{clean}
              </p>
            );
          })}
        </div>
      ))}
    </div>
  );
}
