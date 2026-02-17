import { CvData, Language } from '@/types/cv';
import { translateSection } from '@/lib/translations';

interface Props { data: CvData; language: Language; }

export function TwoColumnTemplate({ data, language }: Props) {
  const sidebarTitles = ['Habilidades', 'Idiomas', 'Certificaciones', 'Intereses'];
  const sidebar = data.sections.filter(s => sidebarTitles.includes(s.title));
  const main = data.sections.filter(s => !sidebarTitles.includes(s.title));

  return (
    <div style={{
      width: '210mm', minHeight: '297mm', display: 'flex',
      background: 'white', fontFamily: "'Source Sans 3', sans-serif",
      fontSize: '10pt', lineHeight: '1.5', boxSizing: 'border-box',
    }}>
      <div style={{
        width: '70mm', background: '#1e293b', color: '#e2e8f0',
        padding: '20mm 8mm', boxSizing: 'border-box',
      }}>
        <h1 style={{ fontSize: '18pt', fontWeight: 700, color: 'white', marginBottom: '3mm', lineHeight: 1.2 }}>
          {data.name}
        </h1>
        {data.contactInfo.map((c, i) => (
          <p key={i} style={{ fontSize: '8.5pt', color: '#94a3b8', margin: '1mm 0', wordBreak: 'break-all' }}>{c}</p>
        ))}
        {sidebar.map((section, i) => (
          <div key={i} style={{ marginTop: '6mm' }}>
            <h3 style={{ fontSize: '10pt', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2mm', borderBottom: '1px solid #334155', paddingBottom: '1mm' }}>
              {translateSection(section.title, language)}
            </h3>
            {section.items.map((item, j) => (
              <p key={j} style={{ fontSize: '9pt', margin: '1mm 0', color: '#cbd5e1' }}>
                {item.replace(/^[-•*]\s*/, '')}
              </p>
            ))}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, padding: '20mm 15mm', boxSizing: 'border-box' }}>
        {data.summary && (
          <div style={{ marginBottom: '6mm' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid #1e293b', paddingBottom: '1mm', marginBottom: '2mm' }}>
              {translateSection('Resumen', language)}
            </h2>
            <p style={{ color: '#475569', fontSize: '10pt' }}>{data.summary}</p>
          </div>
        )}
        {main.map((section, i) => (
          <div key={i} style={{ marginBottom: '5mm' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid #1e293b', paddingBottom: '1mm', marginBottom: '2mm' }}>
              {translateSection(section.title, language)}
            </h2>
            {section.items.map((item, j) => {
              const isSubItem = item.startsWith('  ') || item.startsWith('\t');
              const clean = item.replace(/^[-•*]\s*/, '').trim();
              return (
                <p key={j} style={{
                  margin: '0.5mm 0', paddingLeft: isSubItem ? '6mm' : '0',
                  fontSize: isSubItem ? '9pt' : '10pt',
                  color: isSubItem ? '#64748b' : '#334155',
                }}>
                  {!isSubItem && '▸ '}{clean}
                </p>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
