import { CvData } from '@/types/cv';
import { getContactIcon } from '@/lib/contact-icons';
import { isSectionKey, translateSectionTitle } from '@/lib/section-title';

interface Props { data: CvData; }

export function LedgerLinesTemplate({ data }: Props) {
  const lang = data.sectionLanguage || 'es';

  return (
    <div style={{
      width: '210mm',
      minHeight: '297mm',
      padding: '18mm 18mm 16mm',
      boxSizing: 'border-box',
      background: 'repeating-linear-gradient(180deg, #ffffff 0, #ffffff 6.4mm, #f5f5f5 6.4mm, #f5f5f5 6.6mm)',
      color: '#222222',
      fontFamily: "'Palatino Linotype', 'Book Antiqua', serif",
      fontSize: '10pt',
      lineHeight: '1.45',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'end',
        columnGap: '8mm',
        marginBottom: '6mm',
        borderBottom: '0.45mm solid #5f5f5f',
        paddingBottom: '3mm',
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '25pt', fontWeight: 700, letterSpacing: '0.5px' }}>{data.name}</h1>
          {data.profession && (
            <p style={{ margin: '1.6mm 0 0', fontSize: '11pt', color: '#444444', fontStyle: 'italic' }}>{data.profession}</p>
          )}
        </div>
        {data.contactInfo.length > 0 && (
          <div style={{ fontSize: '8.8pt', textAlign: 'right' }}>
            {data.contactInfo.map((c, i) => (
              <p key={i} style={{ margin: '0.6mm 0', display: 'flex', justifyContent: 'flex-end', gap: '1.8mm', alignItems: 'center' }}>
                <span>{getContactIcon(c)}</span>
                <span>{c}</span>
              </p>
            ))}
          </div>
        )}
      </div>

      {data.summary && (
        <p style={{
          margin: '0 0 5mm',
          padding: '2.4mm 3mm',
          borderLeft: '1mm solid #9ca3af',
          background: 'rgba(255,255,255,0.75)',
          fontStyle: 'italic',
          color: '#374151',
        }}>
          {data.summary}
        </p>
      )}

      {data.sections.map((section, i) => (
        <section key={i} style={{ marginBottom: '4.6mm' }}>
          <h2 style={{
            margin: '0 0 2mm',
            fontSize: '11.2pt',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: '#111827',
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
              <div key={j} style={{
                display: 'grid',
                gridTemplateColumns: '3.5mm 1fr',
                alignItems: 'start',
                columnGap: '2.2mm',
                margin: '0.8mm 0',
              }}>
                <div style={{
                  width: '2.2mm',
                  height: '2.2mm',
                  marginTop: '1.2mm',
                  borderRadius: '50%',
                  background: isSubItem ? '#9ca3af' : '#111827',
                }} />
                <p style={{
                  margin: 0,
                  fontSize: isSubItem ? '9.1pt' : '9.9pt',
                  color: isSubItem ? '#4b5563' : '#111827',
                }}>
                  {isEducation ? (
                    <><strong>{eduTitle.trim()}</strong>{eduSuffix}</>
                  ) : isExperience ? (
                    <><strong>{expMain}</strong>{expPeriod}{expDetails ? ` ${expDetails}` : ''}</>
                  ) : clean}
                </p>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}

