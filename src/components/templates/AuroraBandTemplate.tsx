import { CvData } from '@/types/cv';
import { getContactIcon } from '@/lib/contact-icons';
import { isSectionKey, translateSectionTitle } from '@/lib/section-title';

interface Props { data: CvData; }

export function AuroraBandTemplate({ data }: Props) {
  const lang = data.sectionLanguage || 'es';

  return (
    <div style={{
      width: '210mm',
      minHeight: '297mm',
      background: '#ffffff',
      color: '#1f2937',
      fontFamily: "'Segoe UI', 'Trebuchet MS', sans-serif",
      fontSize: '10pt',
      lineHeight: '1.45',
      boxSizing: 'border-box',
    }}>
      <div style={{
        padding: '16mm 20mm 12mm',
        background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 45%, #7c3aed 100%)',
        color: '#f8fafc',
      }}>
        <h1 style={{ margin: 0, fontSize: '28pt', fontWeight: 800, letterSpacing: '0.5px' }}>{data.name}</h1>
        {data.profession && (
          <p style={{ margin: '2.2mm 0 0', fontSize: '11.2pt', fontWeight: 600, color: '#dbeafe' }}>
            {data.profession}
          </p>
        )}
        {data.contactInfo.length > 0 && (
          <div style={{ marginTop: '3.5mm', display: 'flex', flexWrap: 'wrap', gap: '2.2mm' }}>
            {data.contactInfo.map((c, i) => (
              <div key={i} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1.2mm',
                border: '0.3mm solid rgba(219,234,254,0.45)',
                background: 'rgba(15,23,42,0.18)',
                borderRadius: '999px',
                padding: '1mm 2mm',
                fontSize: '8.4pt',
              }}>
                <span>{getContactIcon(c)}</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '10mm 20mm 18mm' }}>
        {data.summary && (
          <div style={{
            marginBottom: '5mm',
            border: '0.3mm solid #dbeafe',
            background: '#f8fbff',
            borderRadius: '2mm',
            padding: '3.2mm 4mm',
            color: '#334155',
          }}>
            {data.summary}
          </div>
        )}

        {data.sections.map((section, i) => (
          <div key={i} style={{ marginBottom: '4.2mm' }}>
            <h2 style={{
              margin: '0 0 2mm',
              fontSize: '11pt',
              fontWeight: 800,
              color: '#1d4ed8',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
            }}>
              {translateSectionTitle(section.key || section.title, lang, section.title)}
            </h2>
            <div style={{
              borderLeft: '0.9mm solid #c7d2fe',
              paddingLeft: '3mm',
            }}>
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
                    margin: '0.8mm 0',
                    fontSize: isSubItem ? '9.2pt' : '9.9pt',
                    color: isSubItem ? '#64748b' : '#1f2937',
                    paddingLeft: isSubItem ? '4mm' : 0,
                  }}>
                    {!isSubItem && '● '}
                    {isEducation ? (
                      <><strong>{eduTitle.trim()}</strong>{eduSuffix}</>
                    ) : isExperience ? (
                      <><strong>{expMain}</strong>{expPeriod}{expDetails ? ` ${expDetails}` : ''}</>
                    ) : clean}
                  </p>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

