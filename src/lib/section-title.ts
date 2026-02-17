type Lang = 'es' | 'en';

const SECTION_TRANSLATIONS: Record<string, { es: string; en: string }> = {
  'Resumen': { es: 'Resumen', en: 'Summary' },
  'Experiencia': { es: 'Experiencia', en: 'Experience' },
  'Educación': { es: 'Formación', en: 'Education' },
  'Formación': { es: 'Formación', en: 'Education' },
  'Habilidades': { es: 'Habilidades', en: 'Skills' },
  'Idiomas': { es: 'Idiomas', en: 'Languages' },
  'Proyectos': { es: 'Proyectos', en: 'Projects' },
  'Certificaciones': { es: 'Certificaciones', en: 'Certifications' },
  'Logros': { es: 'Logros', en: 'Achievements' },
  'Referencias': { es: 'Referencias', en: 'References' },
  'Publicaciones': { es: 'Publicaciones', en: 'Publications' },
  'Voluntariado': { es: 'Voluntariado', en: 'Volunteer Work' },
  'Contacto': { es: 'Contacto', en: 'Contact' },
  'Intereses': { es: 'Intereses', en: 'Interests' },
  'Información Adicional': { es: 'Información Adicional', en: 'Additional Information' },
};

export function translateSectionTitle(title: string, lang: Lang): string {
  return SECTION_TRANSLATIONS[title]?.[lang] || title;
}

export function getSummaryTitle(lang: Lang): string {
  return lang === 'en' ? 'Summary' : 'Resumen';
}
