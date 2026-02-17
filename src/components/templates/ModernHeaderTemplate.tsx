import { CvData } from '@/types/cv';
import { getContactIcon } from '@/lib/contact-icons';
import { isSectionKey, translateSectionTitle } from '@/lib/section-title';

interface Props { data: CvData; }

export function ModernHeaderTemplate({ data }: Props) {
  const lang = data.sectionLanguage || 'es';
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
        {data.profession && (
          <p style={{ fontSize: '12pt', fontWeight: 600, color: '#ccfbf1', marginTop: '1.5mm', letterSpacing: '0.7px' }}>
            {data.profession}
          </p>
        )}
        {data.contactInfo.length > 0 && (
          <div style={{ fontSize: '9pt', color: '#a7f3d0', marginTop: '3mm' }}>
            {data.contactInfo.map((c, i) => (
              <p key={i} style={{ margin: '0.7mm 0', display: 'flex', gap: '2mm', alignItems: 'center' }}>
                <span style={{ minWidth: '4mm', textAlign: 'center' }}>{getContactIcon(c)}</span>
                <span>{c}</span>
              </p>
            ))}
          </div>
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
              {translateSectionTitle(section.key || section.title, lang, section.title)}
            </h2>
            {section.items.map((item, j) => {
              const isSubItem = item.startsWith('  ') || item.startsWith('\t');
              const clean = item.replace(/^[-•*]\s*/, '').trim();
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
              return (
                <p key={j} style={{
                  margin: '1mm 0', paddingLeft: isSubItem ? '6mm' : '3mm',
                  fontSize: isSubItem ? '9.5pt' : '10.5pt',
                  color: isSubItem ? '#6b7280' : '#374151',
                }}>
                  {!isSubItem && '● '}
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
