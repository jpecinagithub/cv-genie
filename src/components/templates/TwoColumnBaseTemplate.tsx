import { CvData } from '@/types/cv';
import { getContactIcon } from '@/lib/contact-icons';
import { getSummaryTitle, getSectionKey, isSectionKey, translateSectionTitle } from '@/lib/section-title';

interface Props {
  data: CvData;
  theme: TwoColumnTheme;
}

export interface TwoColumnTheme {
  sidebarWidth: string;
  sidebarPadding: string;
  sidebarBg: string;
  sidebarText: string;
  photoBorder: string;
  professionColor: string;
  contactColor: string;
  contactIconColor: string;
  sidebarHeadingColor: string;
  sidebarHeadingBorder: string;
  sidebarItemColor: string;
  mainHeadingColor: string;
  mainHeadingBorder: string;
  summaryColor: string;
  mainPrimaryText: string;
  mainSecondaryText: string;
}

const SIDEBAR_KEYS = new Set(['skills', 'languages', 'certifications', 'interests']);

function renderMainItem(item: string, section: CvData['sections'][number]) {
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

  return {
    isSubItem,
    content: isEducation
      ? (
          <>
            <strong>{eduTitle.trim()}</strong>
            {eduSuffix}
          </>
        )
      : isExperience
      ? (
          <>
            <strong>{expMain}</strong>
            {expPeriod}
            {expDetails ? ` ${expDetails}` : ''}
          </>
        )
      : clean,
  };
}

export function TwoColumnBaseTemplate({ data, theme }: Props) {
  const lang = data.sectionLanguage || 'es';
  const sidebar = data.sections.filter((s) => SIDEBAR_KEYS.has(getSectionKey(s.key || s.title)));
  const main = data.sections.filter((s) => !SIDEBAR_KEYS.has(getSectionKey(s.key || s.title)));

  return (
    <div style={{ width: '210mm', minHeight: '297mm', display: 'flex', background: 'white', fontFamily: "'Source Sans 3', sans-serif", fontSize: '10pt', lineHeight: '1.5', boxSizing: 'border-box' }}>
      <div style={{ width: theme.sidebarWidth, background: theme.sidebarBg, color: theme.sidebarText, padding: theme.sidebarPadding, boxSizing: 'border-box' }}>
        {data.photoUrl && (
          <div style={{ marginBottom: '4mm', display: 'flex', justifyContent: 'center' }}>
            <img
              src={data.photoUrl}
              alt="Foto de perfil"
              style={{ width: '28mm', height: '28mm', borderRadius: '50%', objectFit: 'cover', border: `1px solid ${theme.photoBorder}` }}
            />
          </div>
        )}
        <h1 style={{ fontSize: '18pt', fontWeight: 700, color: 'white', marginBottom: '3mm', lineHeight: 1.2 }}>{data.name}</h1>
        {data.profession && (
          <p style={{ fontSize: '10.5pt', fontWeight: 600, color: theme.professionColor, margin: '-1mm 0 2.5mm', letterSpacing: '0.5px', textAlign: 'center' }}>
            {data.profession}
          </p>
        )}
        {data.contactInfo.map((c, i) => (
          <p key={i} style={{ fontSize: '8.5pt', color: theme.contactColor, margin: '1mm 0', wordBreak: 'break-all', display: 'flex', gap: '2mm', alignItems: 'center' }}>
            <span style={{ fontSize: '8pt', color: theme.contactIconColor, minWidth: '4mm', textAlign: 'center' }}>{getContactIcon(c)}</span>
            <span>{c}</span>
          </p>
        ))}
        {sidebar.map((section, i) => (
          <div key={i} style={{ marginTop: '6mm' }}>
            <h3 style={{ fontSize: '10pt', fontWeight: 700, color: theme.sidebarHeadingColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2mm', borderBottom: `1px solid ${theme.sidebarHeadingBorder}`, paddingBottom: '1mm' }}>
              {translateSectionTitle(section.key || section.title, lang, section.title)}
            </h3>
            {section.items.map((item, j) => (
              <p key={j} style={{ fontSize: '9pt', margin: '1mm 0', color: theme.sidebarItemColor }}>
                {item.replace(/^[-•*]\s*/, '')}
              </p>
            ))}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, padding: '20mm 15mm', boxSizing: 'border-box' }}>
        {data.summary && (
          <div style={{ marginBottom: '6mm' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 700, color: theme.mainHeadingColor, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: `2px solid ${theme.mainHeadingBorder}`, paddingBottom: '1mm', marginBottom: '2mm' }}>
              {getSummaryTitle(lang)}
            </h2>
            <p style={{ color: theme.summaryColor, fontSize: '10pt' }}>{data.summary}</p>
          </div>
        )}
        {main.map((section, i) => (
          <div key={i} style={{ marginBottom: '5mm' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 700, color: theme.mainHeadingColor, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: `2px solid ${theme.mainHeadingBorder}`, paddingBottom: '1mm', marginBottom: '2mm' }}>
              {translateSectionTitle(section.key || section.title, lang, section.title)}
            </h2>
            {section.items.map((item, j) => {
              const parsed = renderMainItem(item, section);
              return (
                <p key={j} style={{ margin: '0.5mm 0', paddingLeft: parsed.isSubItem ? '6mm' : '0', fontSize: parsed.isSubItem ? '9pt' : '10pt', color: parsed.isSubItem ? theme.mainSecondaryText : theme.mainPrimaryText }}>
                  {!parsed.isSubItem && '▸ '}
                  {parsed.content}
                </p>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
