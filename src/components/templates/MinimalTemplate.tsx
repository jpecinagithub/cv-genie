import { CvData } from '@/types/cv';
import { getContactIcon } from '@/lib/contact-icons';
import { isSectionKey, translateSectionTitle } from '@/lib/section-title';

interface Props { data: CvData; }

export function MinimalTemplate({ data }: Props) {
  const lang = data.sectionLanguage || 'es';
  return (
    <div style={{
      width: '210mm', minHeight: '297mm', padding: '25mm 30mm',
      background: 'white', color: '#2d2d2d',
      fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif",
      fontSize: '10.5pt', lineHeight: '1.6', boxSizing: 'border-box',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '8mm' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '28pt', fontWeight: 600, margin: 0, color: '#1a1a2e', letterSpacing: '1px' }}>
          {data.name}
        </h1>
        {data.profession && (
          <p style={{ fontSize: '11.5pt', fontWeight: 600, color: '#1f2937', marginTop: '2mm', letterSpacing: '0.5px' }}>
            {data.profession}
          </p>
        )}
        {data.contactInfo.length > 0 && (
          <div style={{ fontSize: '9pt', color: '#666', marginTop: '3mm' }}>
            {data.contactInfo.map((c, i) => (
              <p key={i} style={{ margin: '0.7mm 0', display: 'flex', justifyContent: 'center', gap: '2mm', alignItems: 'center' }}>
                <span style={{ minWidth: '4mm', textAlign: 'center' }}>{getContactIcon(c)}</span>
                <span>{c}</span>
              </p>
            ))}
          </div>
        )}
      </div>

      {data.summary && (
        <div style={{ marginBottom: '6mm' }}>
          <p style={{ fontStyle: 'italic', color: '#444', textAlign: 'center', fontSize: '10pt' }}>
            {data.summary}
          </p>
        </div>
      )}

      {data.sections.map((section, i) => (
        <div key={i} style={{ marginBottom: '5mm' }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '13pt', fontWeight: 600, color: '#1a1a2e',
            borderBottom: '1px solid #ddd', paddingBottom: '2mm', marginBottom: '3mm',
            textTransform: 'uppercase', letterSpacing: '1.5px',
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
                margin: '1mm 0', paddingLeft: isSubItem ? '8mm' : '4mm',
                fontSize: isSubItem ? '9.5pt' : '10.5pt',
                color: isSubItem ? '#555' : '#2d2d2d',
              }}>
                {!isSubItem && '— '}
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
