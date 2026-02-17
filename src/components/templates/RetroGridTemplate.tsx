import { CvData } from '@/types/cv';
import { getContactIcon } from '@/lib/contact-icons';
import { isSectionKey, translateSectionTitle } from '@/lib/section-title';

interface Props { data: CvData; }

export function RetroGridTemplate({ data }: Props) {
  const lang = data.sectionLanguage || 'es';

  return (
    <div style={{
      width: '210mm',
      minHeight: '297mm',
      padding: '14mm',
      boxSizing: 'border-box',
      background: '#f3f4f6',
      color: '#111827',
      fontFamily: "'Consolas', 'Courier New', monospace",
      fontSize: '9.3pt',
      lineHeight: '1.42',
    }}>
      <div style={{
        border: '0.5mm solid #111827',
        background: '#ffffff',
        padding: '3mm 4mm',
        marginBottom: '3mm',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'center',
          gap: '3mm',
        }}>
          <h1 style={{ margin: 0, fontSize: '16pt', fontWeight: 700 }}>{data.name}</h1>
          {data.profession && (
            <span style={{
              fontSize: '8.5pt',
              fontWeight: 700,
              border: '0.35mm solid #111827',
              padding: '0.8mm 1.5mm',
              background: '#e5e7eb',
            }}>
              {data.profession}
            </span>
          )}
        </div>
      </div>

      {data.contactInfo.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.2mm 2.5mm',
          border: '0.35mm solid #9ca3af',
          background: '#ffffff',
          padding: '2mm 3mm',
          marginBottom: '3mm',
        }}>
          {data.contactInfo.map((c, i) => (
            <p key={i} style={{ margin: 0, fontSize: '8.2pt', display: 'flex', gap: '1.4mm', alignItems: 'center' }}>
              <span>{getContactIcon(c)}</span>
              <span>{c}</span>
            </p>
          ))}
        </div>
      )}

      {data.summary && (
        <div style={{
          border: '0.35mm dashed #6b7280',
          background: '#ffffff',
          padding: '2.2mm 3mm',
          marginBottom: '3mm',
        }}>
          <p style={{ margin: 0 }}>{data.summary}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5mm' }}>
        {data.sections.map((section, i) => (
          <section key={i} style={{
            border: '0.35mm solid #6b7280',
            background: '#ffffff',
            minHeight: '26mm',
          }}>
            <div style={{
              padding: '1.6mm 2.2mm',
              background: '#111827',
              color: '#f9fafb',
              fontWeight: 700,
              fontSize: '8.4pt',
              textTransform: 'uppercase',
              letterSpacing: '0.7px',
            }}>
              {translateSectionTitle(section.key || section.title, lang, section.title)}
            </div>
            <div style={{ padding: '1.8mm 2.2mm' }}>
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
                    margin: '0.5mm 0',
                    fontSize: isSubItem ? '8.4pt' : '8.9pt',
                    color: isSubItem ? '#4b5563' : '#111827',
                    paddingLeft: isSubItem ? '3.6mm' : 0,
                    wordBreak: 'break-word',
                  }}>
                    {!isSubItem && '>> '}
                    {isEducation ? (
                      <><strong>{eduTitle.trim()}</strong>{eduSuffix}</>
                    ) : isExperience ? (
                      <><strong>{expMain}</strong>{expPeriod}{expDetails ? ` ${expDetails}` : ''}</>
                    ) : clean}
                  </p>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

