export interface CvData {
  name: string;
  profession?: string;
  photoUrl?: string;
  sectionLanguage?: 'es' | 'en';
  contactInfo: string[];
  summary: string;
  sections: CvSection[];
}

export interface CvSection {
  title: string;
  items: string[];
}

export type TemplateName =
  | 'minimal'
  | 'two-column'
  | 'two-column-sapphire'
  | 'two-column-emerald'
  | 'two-column-burgundy'
  | 'modern-header'
  | 'executive'
  | 'compact';

export interface TemplateInfo {
  id: TemplateName;
  nameES: string;
  nameEN: string;
  description: string;
}

export const TEMPLATES: TemplateInfo[] = [
  { id: 'minimal', nameES: 'Minimal Clásico', nameEN: 'Classic Minimal', description: 'Columna única, elegante' },
  { id: 'two-column', nameES: 'Dos Columnas', nameEN: 'Two Columns', description: 'Sidebar + contenido' },
  { id: 'two-column-sapphire', nameES: 'Dos Columnas Zafiro', nameEN: 'Two Columns Sapphire', description: 'Sidebar azul intenso' },
  { id: 'two-column-emerald', nameES: 'Dos Columnas Esmeralda', nameEN: 'Two Columns Emerald', description: 'Sidebar verde profesional' },
  { id: 'two-column-burgundy', nameES: 'Dos Columnas Borgoña', nameEN: 'Two Columns Burgundy', description: 'Sidebar vino elegante' },
  { id: 'modern-header', nameES: 'Cabecera Moderna', nameEN: 'Modern Header', description: 'Header con color' },
  { id: 'executive', nameES: 'Ejecutivo', nameEN: 'Executive', description: 'Formal y elegante' },
  { id: 'compact', nameES: 'Compacto', nameEN: 'Compact', description: 'Denso y profesional' },
];


