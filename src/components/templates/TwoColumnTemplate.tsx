import { CvData } from '@/types/cv';
import { getContactIcon } from '@/lib/contact-icons';
import { getSummaryTitle, translateSectionTitle } from '@/lib/section-title';

interface Props { data: CvData; }

export function TwoColumnTemplate({ data }: Props) {
  const lang = data.sectionLanguage || 'es';
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
        {data.photoUrl && (
          <div style={{ marginBottom: '4mm', display: 'flex', justifyContent: 'center' }}>
            <img
              src={data.photoUrl}
              alt="Foto de perfil"
              style={{
                width: '28mm',
                height: '28mm',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid #475569',
              }}
            />
          </div>
        )}
        <h1 style={{ fontSize: '18pt', fontWeight: 700, color: 'white', marginBottom: '3mm', lineHeight: 1.2 }}>
          {data.name}
        </h1>
        {data.profession && (
          <p style={{ fontSize: '10.5pt', fontWeight: 600, color: '#e2e8f0', margin: '-1mm 0 2.5mm', letterSpacing: '0.5px', textAlign: 'center' }}>
            {data.profession}
          </p>
        )}
        {data.contactInfo.map((c, i) => (
          <p key={i} style={{ fontSize: '8.5pt', color: '#94a3b8', margin: '1mm 0', wordBreak: 'break-all', display: 'flex', gap: '2mm', alignItems: 'center' }}>
            <span style={{ fontSize: '8pt', color: '#cbd5e1', minWidth: '4mm', textAlign: 'center' }}>{getContactIcon(c)}</span>
            <span>{c}</span>
          </p>
        ))}
        {sidebar.map((section, i) => (
          <div key={i} style={{ marginTop: '6mm' }}>
            <h3 style={{ fontSize: '10pt', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2mm', borderBottom: '1px solid #334155', paddingBottom: '1mm' }}>
              {translateSectionTitle(section.title, lang)}
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
              {getSummaryTitle(lang)}
            </h2>
            <p style={{ color: '#475569', fontSize: '10pt' }}>{data.summary}</p>
          </div>
        )}
        {main.map((section, i) => (
          <div key={i} style={{ marginBottom: '5mm' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid #1e293b', paddingBottom: '1mm', marginBottom: '2mm' }}>
              {translateSectionTitle(section.title, lang)}
            </h2>
            {section.items.map((item, j) => {
              const isSubItem = item.startsWith('  ') || item.startsWith('\t');
              const clean = item.replace(/^[-•*]\s*/, '').trim();
              const isEducation = section.title === 'Educación' || section.title === 'Formación';
              const isExperience = section.title === 'Experiencia' || section.title === 'Experience';
              const [eduTitle, ...eduRest] = clean.split(',');
              const eduSuffix = eduRest.length ? `,${eduRest.join(',')}` : '';
              const [expHeaderRaw, ...expDetailParts] = clean.split('\n');
              const expHeader = expHeaderRaw?.trim() || clean;
              const expDetails = expDetailParts.join(' ').trim();
              const expMatch = expHeader.match(/^(.*?)(\s*\([^)]*\))?$/);
              const expMain = expMatch?.[1]?.trim() || expHeader;
              const expPeriod = expMatch?.[2] || '';
              return (
                <p key={j} style={{
                  margin: '0.5mm 0', paddingLeft: isSubItem ? '6mm' : '0',
                  fontSize: isSubItem ? '9pt' : '10pt',
                  color: isSubItem ? '#64748b' : '#334155',
                }}>
                  {!isSubItem && '▸ '}
                  {isEducation ? (
                    <>
                      <strong>{eduTitle.trim()}</strong>{eduSuffix}
                    </>
                  ) : isExperience ? (
                    <>
                      <strong>{expMain}</strong>{expPeriod}{expDetails ? ` ${expDetails}` : ''}
                    </>
                  ) : clean}
                </p>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
