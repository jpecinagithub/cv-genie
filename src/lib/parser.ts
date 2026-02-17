import { CvData, CvSection } from '@/types/cv';

const EMAIL_RE = /[\w.-]+@[\w.-]+\.\w+/;
const PHONE_RE = /(\+?\d[\d\s\-().]{7,})/;
const URL_RE = /https?:\/\/[^\s]+|linkedin\.com\/\S+|github\.com\/\S+/i;

const SECTION_PATTERNS: [RegExp, string][] = [
  [/^#{0,3}\s*(resumen|summary|perfil profesional|professional summary|profile|about|sobre m[ií])/i, 'Resumen'],
  [/^#{0,3}\s*(experiencia|experience|trabajo|work|employment|historial laboral|professional experience)/i, 'Experiencia'],
  [/^#{0,3}\s*(educaci[oó]n|education|formaci[oó]n|academic|estudios|formación académica)/i, 'Educación'],
  [/^#{0,3}\s*(habilidades|skills|competencias|tecnolog[ií]as|tech|conocimientos)/i, 'Habilidades'],
  [/^#{0,3}\s*(idiomas|languages)/i, 'Idiomas'],
  [/^#{0,3}\s*(proyectos|projects)/i, 'Proyectos'],
  [/^#{0,3}\s*(certificaciones|certifications|cursos|courses)/i, 'Certificaciones'],
  [/^#{0,3}\s*(logros|achievements|premios|awards)/i, 'Logros'],
  [/^#{0,3}\s*(referencias|references)/i, 'Referencias'],
  [/^#{0,3}\s*(publicaciones|publications)/i, 'Publicaciones'],
  [/^#{0,3}\s*(voluntariado|volunteer)/i, 'Voluntariado'],
  [/^#{0,3}\s*(contacto|contact|datos personales|personal info)/i, 'Contacto'],
  [/^#{0,3}\s*(intereses|interests|hobbies)/i, 'Intereses'],
];

function isContactInfo(line: string): boolean {
  return EMAIL_RE.test(line) || PHONE_RE.test(line) || URL_RE.test(line);
}

function detectSectionHeader(line: string): string | null {
  const cleaned = line.replace(/[:：\-—]+$/, '').trim();
  for (const [re, name] of SECTION_PATTERNS) {
    if (re.test(cleaned)) return name;
  }
  if (cleaned.length > 2 && cleaned.length < 40 && cleaned === cleaned.toUpperCase() && !/\d{4}/.test(cleaned)) {
    return cleaned.charAt(0) + cleaned.slice(1).toLowerCase();
  }
  return null;
}

export function parseText(text: string): CvData {
  const lines = text.split('\n').map(l => l.trim());
  const nonEmpty = lines.filter(l => l.length > 0);

  if (nonEmpty.length === 0) {
    return { name: '', contactInfo: [], summary: '', sections: [] };
  }

  let name = '';
  let nameIdx = -1;
  for (let i = 0; i < Math.min(nonEmpty.length, 5); i++) {
    const line = nonEmpty[i];
    if (!isContactInfo(line) && !detectSectionHeader(line) && line.length < 50 && !/^\d/.test(line)) {
      name = line.replace(/^#+\s*/, '');
      nameIdx = i;
      break;
    }
  }

  const contactInfo: string[] = [];
  const contentLines: string[] = [];

  for (let i = 0; i < nonEmpty.length; i++) {
    if (i === nameIdx) continue;
    const line = nonEmpty[i];
    if (i < 6 && isContactInfo(line)) {
      const parts = line.split(/[|;]/).map(p => p.trim()).filter(Boolean);
      contactInfo.push(...parts);
    } else {
      contentLines.push(line);
    }
  }

  const sections: CvSection[] = [];
  let currentSection: CvSection | null = null;
  const summaryLines: string[] = [];

  for (const line of contentLines) {
    const header = detectSectionHeader(line);
    if (header) {
      if (currentSection && currentSection.items.length > 0) sections.push(currentSection);
      currentSection = { title: header, items: [] };
    } else if (currentSection) {
      if (line.length > 0) currentSection.items.push(line);
    } else {
      summaryLines.push(line);
    }
  }
  if (currentSection && currentSection.items.length > 0) sections.push(currentSection);

  const contactSectionIdx = sections.findIndex(s => s.title === 'Contacto');
  if (contactSectionIdx !== -1) {
    contactInfo.push(...sections[contactSectionIdx].items);
    sections.splice(contactSectionIdx, 1);
  }

  if (sections.length === 0 && contentLines.length > 0) {
    return createFallbackStructure(name, contactInfo, contentLines);
  }

  let summary = summaryLines.join(' ');
  const summarySectionIdx = sections.findIndex(s => s.title === 'Resumen');
  if (summarySectionIdx !== -1) {
    summary = sections[summarySectionIdx].items.join(' ');
    sections.splice(summarySectionIdx, 1);
  }

  return { name, contactInfo, summary, sections };
}

function createFallbackStructure(name: string, contactInfo: string[], lines: string[]): CvData {
  const summary = lines.slice(0, 2).join(' ');
  const rest = lines.slice(2);

  const bulletItems = rest.filter(l => /^[-•*]/.test(l));
  const yearItems = rest.filter(l => /\d{4}/.test(l) && !bulletItems.includes(l));
  const commaItems = rest.filter(l => l.includes(',') && l.split(',').length >= 3 && !bulletItems.includes(l) && !yearItems.includes(l));
  const otherItems = rest.filter(l => !bulletItems.includes(l) && !yearItems.includes(l) && !commaItems.includes(l));

  const sections: CvSection[] = [];
  if (bulletItems.length) sections.push({ title: 'Experiencia', items: bulletItems });
  if (yearItems.length) sections.push({ title: 'Educación', items: yearItems });
  if (commaItems.length) sections.push({ title: 'Habilidades', items: commaItems });
  if (otherItems.length) sections.push({ title: 'Información Adicional', items: otherItems });

  return { name, contactInfo, summary, sections };
}
