import { Language } from '@/types/cv';

const MAP: Record<string, Record<Language, string>> = {
  'resumen': { es: 'Resumen', en: 'Summary' },
  'experiencia': { es: 'Experiencia', en: 'Experience' },
  'educacion': { es: 'Educación', en: 'Education' },
  'habilidades': { es: 'Habilidades', en: 'Skills' },
  'idiomas': { es: 'Idiomas', en: 'Languages' },
  'proyectos': { es: 'Proyectos', en: 'Projects' },
  'certificaciones': { es: 'Certificaciones', en: 'Certifications' },
  'logros': { es: 'Logros', en: 'Achievements' },
  'referencias': { es: 'Referencias', en: 'References' },
  'publicaciones': { es: 'Publicaciones', en: 'Publications' },
  'voluntariado': { es: 'Voluntariado', en: 'Volunteer Work' },
  'intereses': { es: 'Intereses', en: 'Interests' },
  'informacion adicional': { es: 'Información Adicional', en: 'Additional Information' },
};

export function translateSection(title: string, lang: Language): string {
  const normalized = title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [key, translations] of Object.entries(MAP)) {
    if (normalized === key || normalized.includes(key)) {
      return translations[lang];
    }
  }
  return title;
}
