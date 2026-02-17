import { CvData } from '@/types/cv';
import { getContactIcon } from '@/lib/contact-icons';
import { isSectionKey, translateSectionTitle } from '@/lib/section-title';

interface Props { data: CvData; }

export function CompactTemplate({ data }: Props) {
  const lang = data.sectionLanguage || 'es';
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
        {data.profession && (
          <p style={{ fontSize: '10.5pt', fontWeight: 600, color: '#1e3a8a', marginTop: '0.5mm' }}>
            {data.profession}
          </p>
        )}
        {data.contactInfo.length > 0 && (
          <div style={{ fontSize: '8.5pt', color: '#64748b', marginTop: '1mm' }}>
            {data.contactInfo.map((c, i) => (
              <p key={i} style={{ margin: '0.5mm 0', display: 'flex', gap: '1.8mm', alignItems: 'center' }}>
                <span style={{ minWidth: '4mm', textAlign: 'center' }}>{getContactIcon(c)}</span>
                <span>{c}</span>
              </p>
            ))}
          </div>
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
                margin: '0.3mm 0', paddingLeft: isSubItem ? '5mm' : '2mm',
                fontSize: isSubItem ? '8.5pt' : '9.5pt',
                color: isSubItem ? '#64748b' : '#334155',
              }}>
                {!isSubItem && '› '}
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
  );
}
