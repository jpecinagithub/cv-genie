import { CvSection, SectionKey } from '@/types/cv';

type Lang = 'es' | 'en';

const SECTION_TRANSLATIONS_BY_KEY: Record<SectionKey, { es: string; en: string }> = {
  summary: { es: 'Resumen', en: 'Summary' },
  experience: { es: 'Experiencia', en: 'Experience' },
  education: { es: 'Formación', en: 'Education' },
  skills: { es: 'Habilidades', en: 'Skills' },
  languages: { es: 'Idiomas', en: 'Languages' },
  projects: { es: 'Proyectos', en: 'Projects' },
  certifications: { es: 'Certificaciones', en: 'Certifications' },
  achievements: { es: 'Logros', en: 'Achievements' },
  references: { es: 'Referencias', en: 'References' },
  publications: { es: 'Publicaciones', en: 'Publications' },
  volunteer: { es: 'Voluntariado', en: 'Volunteer Work' },
  contact: { es: 'Contacto', en: 'Contact' },
  interests: { es: 'Intereses', en: 'Interests' },
  additional: { es: 'Información Adicional', en: 'Additional Information' },
  custom: { es: 'Sección', en: 'Section' },
};

const TITLE_TO_KEY: Record<string, SectionKey> = {
  'Resumen': 'summary',
  'Summary': 'summary',
  'Experiencia': 'experience',
  'Experience': 'experience',
  'Educación': 'education',
  'Formación': 'education',
  'Education': 'education',
  'Habilidades': 'skills',
  'Skills': 'skills',
  'Idiomas': 'languages',
  'Languages': 'languages',
  'Proyectos': 'projects',
  'Projects': 'projects',
  'Certificaciones': 'certifications',
  'Certifications': 'certifications',
  'Logros': 'achievements',
  'Achievements': 'achievements',
  'Referencias': 'references',
  'References': 'references',
  'Publicaciones': 'publications',
  'Publications': 'publications',
  'Voluntariado': 'volunteer',
  'Volunteer Work': 'volunteer',
  'Contacto': 'contact',
  'Contact': 'contact',
  'Intereses': 'interests',
  'Interests': 'interests',
  'Información Adicional': 'additional',
  'Additional Information': 'additional',
};

export function getSectionKey(input: string | undefined): SectionKey {
  if (!input) return 'custom';
  const normalized = input.trim();
  if (!normalized) return 'custom';
  if (SECTION_TRANSLATIONS_BY_KEY[normalized as SectionKey]) return normalized as SectionKey;
  return TITLE_TO_KEY[normalized] || 'custom';
}

export function isSectionKey(section: CvSection, key: SectionKey): boolean {
  return getSectionKey(section.key || section.title) === key;
}

export function translateSectionTitle(
  titleOrKey: string,
  lang: Lang,
  fallbackTitle?: string,
): string {
  const key = getSectionKey(titleOrKey);
  if (key === 'custom') return fallbackTitle || titleOrKey;
  return SECTION_TRANSLATIONS_BY_KEY[key][lang];
}

export function getSummaryTitle(lang: Lang): string {
  return SECTION_TRANSLATIONS_BY_KEY.summary[lang];
}
