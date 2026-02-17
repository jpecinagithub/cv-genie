export interface CvData {
  name: string;
  contactInfo: string[];
  summary: string;
  sections: CvSection[];
}

export interface CvSection {
  title: string;
  items: string[];
}

export type TemplateName = 'minimal' | 'two-column' | 'modern-header' | 'executive' | 'compact';

export interface TemplateInfo {
  id: TemplateName;
  nameES: string;
  nameEN: string;
  description: string;
}

export const TEMPLATES: TemplateInfo[] = [
  { id: 'minimal', nameES: 'Minimal Clásico', nameEN: 'Classic Minimal', description: 'Columna única, elegante' },
  { id: 'two-column', nameES: 'Dos Columnas', nameEN: 'Two Columns', description: 'Sidebar + contenido' },
  { id: 'modern-header', nameES: 'Cabecera Moderna', nameEN: 'Modern Header', description: 'Header con color' },
  { id: 'executive', nameES: 'Ejecutivo', nameEN: 'Executive', description: 'Formal y elegante' },
  { id: 'compact', nameES: 'Compacto', nameEN: 'Compact', description: 'Denso y profesional' },
];

export type Language = 'es' | 'en';
