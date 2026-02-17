import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useCv } from '@/context/CvContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Plus, X, RotateCcw } from 'lucide-react';
import { CvData, CvSection } from '@/types/cv';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ContactInfo {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  location: string;
  website: string;
}

interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

interface LanguageEntry {
  id: string;
  language: string;
  level: string;
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

const EMPTY_CONTACT: ContactInfo = { email: '', phone: '', linkedin: '', github: '', location: '', website: '' };
const EMPTY_EXPERIENCE: () => ExperienceEntry = () => ({ id: generateId(), title: '', company: '', period: '', description: '' });
const EMPTY_EDUCATION: () => EducationEntry = () => ({ id: generateId(), degree: '', institution: '', year: '' });
const EMPTY_LANGUAGE: () => LanguageEntry = () => ({ id: generateId(), language: '', level: '' });
const STRUCTURED_STORAGE_KEY = 'cv-structured-form';
const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB
const MAX_IMAGE_DIMENSION = 1024;
const MAX_IMAGE_DATAURL_CHARS = 2_000_000;

interface StructuredState {
  contact?: ContactInfo;
  summary?: string;
  experiences?: ExperienceEntry[];
  education?: EducationEntry[];
  skills?: string;
  languages?: LanguageEntry[];
  profession?: string;
  photoUrl?: string;
}

interface StructuredStateComplete {
  contact: ContactInfo;
  summary: string;
  experiences: ExperienceEntry[];
  education: EducationEntry[];
  skills: string;
  languages: LanguageEntry[];
  profession: string;
  photoUrl: string;
}

const IMPORT_MODEL_EVENT = 'cv-import-model';

const DEMO_MODEL: StructuredStateComplete = {
  contact: {
    email: 'alexander.p@design.com',
    phone: '+1 (555) 0123-4567',
    linkedin: 'https://linkedin.com/in/alexanderpierce',
    github: 'https://github.com/alexpierce',
    location: 'San Francisco, CA',
    website: 'https://alexdesign.studio',
  },
  summary: 'Senior Product Designer with 8+ years of experience leading product design for SaaS and fintech solutions. Specialized in translating complex business requirements into intuitive user journeys, scaling design systems, and driving measurable impact through experimentation. Strong background in cross-functional leadership with product, engineering, and data teams, combining strategic thinking with hands-on execution from discovery research to final UI delivery.',
  experiences: [
    {
      id: generateId(),
      title: 'Senior Product Designer',
      company: 'Pixel Perfect Solutions',
      period: '2021 - Present',
      description: 'Led end-to-end redesign of the onboarding and reporting experience for a B2B SaaS platform used by 20k+ monthly users. Defined product strategy with PM and engineering, built a modular design system adopted across 6 squads, and reduced implementation time by 28%. Improved activation rate from 41% to 57% through iterative UX experiments, and raised NPS by +12 points after launching a guided setup flow. Mentored 4 designers and established quality reviews that reduced post-release UI regressions by 35%.',
    },
    {
      id: generateId(),
      title: 'UI/UX Designer',
      company: 'Northstar Labs',
      period: '2018 - 2021',
      description: 'Designed mobile-first interfaces for fintech and e-commerce products, from discovery to production handoff. Conducted user interviews and usability tests to validate hypotheses and prioritize roadmap initiatives. Reworked checkout and account management journeys, increasing conversion by 18% and reducing support tickets by 22%. Built reusable Figma component libraries and documentation standards that improved team consistency and accelerated delivery cycles.',
    },
  ],
  education: [
    {
      id: generateId(),
      degree: 'Master of Interaction Design',
      institution: 'Stanford Graduate School of Design',
      year: '2018 - 2020',
    },
    {
      id: generateId(),
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of California, Berkeley',
      year: '2013 - 2017',
    },
    {
      id: generateId(),
      degree: 'Google UX Design Professional Certificate',
      institution: 'Google / Coursera',
      year: '2021',
    },
  ],
  skills: 'Product Design\nUX Research\nDesign Systems\nFigma\nPrototyping\nReact',
  languages: [
    { id: generateId(), language: 'English', level: 'Native' },
    { id: generateId(), language: 'Spanish', level: 'Fluent' },
  ],
  profession: 'Senior Product Designer',
  photoUrl: '',
};

function buildCvDataFromStructured(profileName: string, sectionLanguage: 'es' | 'en', state: StructuredStateComplete): CvData {
  const contactInfo: string[] = [];
  if (state.contact.email) contactInfo.push(state.contact.email);
  if (state.contact.phone) contactInfo.push(state.contact.phone);
  if (state.contact.linkedin) contactInfo.push(state.contact.linkedin);
  if (state.contact.github) contactInfo.push(state.contact.github);
  if (state.contact.location) contactInfo.push(state.contact.location);
  if (state.contact.website) contactInfo.push(state.contact.website);

  const sections: CvSection[] = [];

  const expItems = state.experiences
    .filter((e) => e.title || e.company)
    .map((e) => {
      let line = `${e.title}${e.company ? ' | ' + e.company : ''}${e.period ? ' (' + e.period + ')' : ''}`;
      if (e.description) line += '\n' + e.description;
      return line;
    });
  if (expItems.length) sections.push({ key: 'experience', title: 'Experiencia', items: expItems });

  const eduItems = state.education
    .filter((e) => e.degree || e.institution)
    .map((e) => `${e.degree}${e.institution ? ', ' + e.institution : ''}${e.year ? ' (' + e.year + ')' : ''}`);
  if (eduItems.length) sections.push({ key: 'education', title: 'Educación', items: eduItems });

  const skillItems = state.skills
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (skillItems.length) sections.push({ key: 'skills', title: 'Habilidades', items: skillItems });

  const langItems = state.languages
    .filter((l) => l.language)
    .map((l) => `${l.language}${l.level ? ': ' + l.level : ''}`);
  if (langItems.length) sections.push({ key: 'languages', title: 'Idiomas', items: langItems });

  return {
    name: profileName,
    profession: state.profession.trim(),
    photoUrl: state.photoUrl || undefined,
    sectionLanguage,
    contactInfo,
    summary: state.summary.trim(),
    sections,
  };
}

function readStructuredState(): StructuredState {
  const saved = localStorage.getItem(STRUCTURED_STORAGE_KEY);
  if (!saved) return {};
  try {
    return JSON.parse(saved) as StructuredState;
  } catch {
    return {};
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('No se pudo leer la imagen'));
    };
    reader.onerror = () => reject(new Error('No se pudo leer la imagen'));
    reader.readAsDataURL(file);
  });
}

function optimizeImageDataUrl(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(img.width, img.height));
      const targetW = Math.max(1, Math.round(img.width * scale));
      const targetH = Math.max(1, Math.round(img.height * scale));

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.drawImage(img, 0, 0, targetW, targetH);
      const optimized = canvas.toDataURL('image/jpeg', 0.82);
      resolve(optimized.length < dataUrl.length ? optimized : dataUrl);
    };
    img.onerror = () => reject(new Error('No se pudo procesar la imagen'));
    img.src = dataUrl;
  });
}

export function StructuredInputPanel() {
  const { reset, hasGenerated, profileName, setProfileName, setCvDataDirectly, sectionLanguage } = useCv();
  const initialState = useMemo(() => readStructuredState(), []);
  const storageWarningShownRef = useRef(false);

  const [contact, setContact] = useState<ContactInfo>(initialState.contact ?? { ...EMPTY_CONTACT });
  const [summary, setSummary] = useState(initialState.summary ?? '');
  const [experiences, setExperiences] = useState<ExperienceEntry[]>(
    initialState.experiences?.length ? initialState.experiences : [EMPTY_EXPERIENCE()]
  );
  const [education, setEducation] = useState<EducationEntry[]>(
    initialState.education?.length ? initialState.education : [EMPTY_EDUCATION()]
  );
  const [skills, setSkills] = useState(initialState.skills ?? '');
  const [languages, setLanguages] = useState<LanguageEntry[]>(
    initialState.languages?.length ? initialState.languages : [EMPTY_LANGUAGE()]
  );
  const [profession, setProfession] = useState(initialState.profession ?? '');
  const [photoUrl, setPhotoUrl] = useState<string>(initialState.photoUrl ?? '');

  useEffect(() => {
    try {
      localStorage.setItem(STRUCTURED_STORAGE_KEY, JSON.stringify({
        contact,
        profession,
        photoUrl,
        summary,
        experiences,
        education,
        skills,
        languages,
      }));
      storageWarningShownRef.current = false;
    } catch {
      if (!storageWarningShownRef.current) {
        toast.error('No hay espacio suficiente en el navegador para guardar todo el formulario.');
        storageWarningShownRef.current = true;
      }
    }
  }, [contact, profession, photoUrl, summary, experiences, education, skills, languages]);

  useEffect(() => {
    const onSessionExpired = () => {
      setContact({ ...EMPTY_CONTACT });
      setProfession('');
      setPhotoUrl('');
      setSummary('');
      setExperiences([EMPTY_EXPERIENCE()]);
      setEducation([EMPTY_EDUCATION()]);
      setSkills('');
      setLanguages([EMPTY_LANGUAGE()]);
    };
    window.addEventListener('cv-session-expired', onSessionExpired);
    return () => window.removeEventListener('cv-session-expired', onSessionExpired);
  }, []);

  useEffect(() => {
    const onImportModel = () => {
      const model: StructuredStateComplete = {
        ...DEMO_MODEL,
        experiences: DEMO_MODEL.experiences.map((exp) => ({ ...exp, id: generateId() })),
        education: DEMO_MODEL.education.map((edu) => ({ ...edu, id: generateId() })),
        languages: DEMO_MODEL.languages.map((lang) => ({ ...lang, id: generateId() })),
      };

      setContact(model.contact);
      setProfession(model.profession);
      setPhotoUrl(model.photoUrl);
      setSummary(model.summary);
      setExperiences(model.experiences);
      setEducation(model.education);
      setSkills(model.skills);
      setLanguages(model.languages);
      setProfileName('Alexander Pierce');
      setCvDataDirectly(buildCvDataFromStructured('Alexander Pierce', sectionLanguage, model));
      toast.success('Modelo importado. Ya puedes previsualizar todas las plantillas.');
    };

    window.addEventListener(IMPORT_MODEL_EVENT, onImportModel);
    return () => window.removeEventListener(IMPORT_MODEL_EVENT, onImportModel);
  }, [sectionLanguage, setCvDataDirectly, setProfileName]);

  const updateExperience = (id: string, field: keyof ExperienceEntry, value: string) => {
    setExperiences(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const updateEducation = (id: string, field: keyof EducationEntry, value: string) => {
    setEducation(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const updateLanguage = (id: string, field: keyof LanguageEntry, value: string) => {
    setLanguages(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const handleGenerate = () => {
    const state: StructuredStateComplete = {
      contact,
      profession,
      photoUrl,
      summary,
      experiences,
      education,
      skills,
      languages,
    };
    setCvDataDirectly(buildCvDataFromStructured(profileName || '', sectionLanguage, state));
  };

  const handleReset = () => {
    setContact({ ...EMPTY_CONTACT });
    setProfession('');
    setPhotoUrl('');
    setSummary('');
    setExperiences([EMPTY_EXPERIENCE()]);
    setEducation([EMPTY_EDUCATION()]);
    setSkills('');
    setLanguages([EMPTY_LANGUAGE()]);
    setProfileName('');
    localStorage.removeItem(STRUCTURED_STORAGE_KEY);
    reset();
  };

  const hasContent = profileName || profession || photoUrl || summary || skills ||
    experiences.some(e => e.title || e.company) ||
    education.some(e => e.degree || e.institution) ||
    languages.some(l => l.language) ||
    Object.values(contact).some(v => v);

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Selecciona un archivo de imagen valido.');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error('La imagen supera el limite de 2MB.');
      e.target.value = '';
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const optimized = await optimizeImageDataUrl(dataUrl);
      if (optimized.length > MAX_IMAGE_DATAURL_CHARS) {
        toast.error('La imagen sigue siendo grande. Usa una foto mas ligera.');
        return;
      }
      setPhotoUrl(optimized);
      toast.success('Foto cargada correctamente.');
    } catch {
      toast.error('No se pudo procesar la imagen.');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="cv-form flex flex-col gap-5">
      {/* Identity */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-slate-500">Nombre completo</label>
          <Input
            className="h-10 rounded-lg border-slate-200 bg-slate-50 text-sm"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            placeholder="Ej: María García López"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-slate-500">Profesión</label>
          <Input
            className="h-10 rounded-lg border-slate-200 bg-slate-50 text-sm"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            placeholder="Ej: Finance Manager"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-slate-500">Fotografía (opcional)</label>
        <div className="flex items-center gap-2">
          <Input type="file" accept="image/*" onChange={handlePhotoChange} className="h-10 rounded-lg border-slate-200 bg-slate-50 text-xs" />
          {photoUrl && (
            <Button type="button" variant="outline" size="sm" onClick={() => setPhotoUrl('')}>
              Quitar
            </Button>
          )}
        </div>
        {photoUrl && (
          <img
            src={photoUrl}
            alt="Foto de perfil"
            className="mt-2 h-20 w-20 rounded-full border object-cover"
          />
        )}
      </div>

      {/* Sections + actions */}
      <div className="-mx-1 rounded-xl border border-slate-200 bg-white px-2 py-1">
        <Accordion
          type="multiple"
          defaultValue={["contact", "summary", "experience", "education", "skills", "languages"]}
          className="w-full"
        >
          {/* Contact */}
          <AccordionItem value="contact">
            <AccordionTrigger className="py-2 text-sm font-bold text-slate-800">Información de contacto</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <Input className="h-10 rounded-lg border-slate-200 bg-slate-50 text-sm" placeholder="Email" value={contact.email} onChange={e => setContact(c => ({ ...c, email: e.target.value }))} />
                <Input className="h-10 rounded-lg border-slate-200 bg-slate-50 text-sm" placeholder="Teléfono" value={contact.phone} onChange={e => setContact(c => ({ ...c, phone: e.target.value }))} />
                <Input className="h-10 rounded-lg border-slate-200 bg-slate-50 text-sm" placeholder="LinkedIn" value={contact.linkedin} onChange={e => setContact(c => ({ ...c, linkedin: e.target.value }))} />
                <Input className="h-10 rounded-lg border-slate-200 bg-slate-50 text-sm" placeholder="GitHub" value={contact.github} onChange={e => setContact(c => ({ ...c, github: e.target.value }))} />
                <Input className="h-10 rounded-lg border-slate-200 bg-slate-50 text-sm" placeholder="Ubicación" value={contact.location} onChange={e => setContact(c => ({ ...c, location: e.target.value }))} />
                <Input className="h-10 rounded-lg border-slate-200 bg-slate-50 text-sm" placeholder="Web personal" value={contact.website} onChange={e => setContact(c => ({ ...c, website: e.target.value }))} />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Summary */}
          <AccordionItem value="summary">
            <AccordionTrigger className="py-2 text-sm font-bold text-slate-800">Resumen profesional</AccordionTrigger>
            <AccordionContent>
              <Textarea
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="Breve resumen de tu perfil profesional..."
                className="min-h-[96px] resize-none rounded-lg border-slate-200 bg-slate-50 text-sm"
              />
            </AccordionContent>
          </AccordionItem>

          {/* Experience */}
          <AccordionItem value="experience">
            <AccordionTrigger className="py-2 text-sm font-bold text-slate-800">Experiencia profesional</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-3">
                {experiences.map((exp, i) => (
                  <div key={exp.id} className="relative rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                    {experiences.length > 1 && (
                      <button onClick={() => setExperiences(prev => prev.filter(e => e.id !== exp.id))} className="absolute top-1.5 right-1.5 text-muted-foreground hover:text-destructive">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2">
                      <Input className="h-8 text-xs md:col-span-1" placeholder="Cargo" value={exp.title} onChange={e => updateExperience(exp.id, 'title', e.target.value)} />
                      <Input className="h-8 text-xs md:col-span-1" placeholder="Empresa" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} />
                      <Input className="h-8 text-xs" placeholder="Periodo (ej: 2020 - Presente)" value={exp.period} onChange={e => updateExperience(exp.id, 'period', e.target.value)} />
                      <Textarea className="min-h-[100px] resize-none text-xs md:col-span-2" placeholder="Descripción de responsabilidades y logros..." value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} />
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => setExperiences(prev => [...prev, EMPTY_EXPERIENCE()])} className="w-full">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Añadir experiencia
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Education */}
          <AccordionItem value="education">
            <AccordionTrigger className="py-2 text-sm font-bold text-slate-800">Formación</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-3">
                {education.map((edu) => (
                  <div key={edu.id} className="relative rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                    {education.length > 1 && (
                      <button onClick={() => setEducation(prev => prev.filter(e => e.id !== edu.id))} className="absolute top-1.5 right-1.5 text-muted-foreground hover:text-destructive">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <div className="grid grid-cols-1 gap-1.5 md:grid-cols-3">
                      <Input className="h-8 text-xs md:col-span-1" placeholder="Título / Grado" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} />
                      <Input className="h-8 text-xs md:col-span-1" placeholder="Institución" value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} />
                      <Input className="h-8 text-xs md:col-span-1" placeholder="Año" value={edu.year} onChange={e => updateEducation(edu.id, 'year', e.target.value)} />
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => setEducation(prev => [...prev, EMPTY_EDUCATION()])} className="w-full">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Añadir formación
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Skills */}
          <AccordionItem value="skills">
            <AccordionTrigger className="py-2 text-sm font-bold text-slate-800">Habilidades / Skills</AccordionTrigger>
            <AccordionContent>
              <Textarea
                value={skills}
                onChange={e => setSkills(e.target.value.replace(/,\s*/g, '\n'))}
                placeholder="Escribe skills separadas por coma: React, TypeScript, Node.js..."
                className="min-h-[160px] resize-y rounded-lg border-slate-200 bg-slate-50 text-sm"
              />
            </AccordionContent>
          </AccordionItem>

          {/* Languages */}
          <AccordionItem value="languages">
            <AccordionTrigger className="py-2 text-sm font-bold text-slate-800">Idiomas</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex gap-1.5 items-center">
                    <Input className="h-8 text-xs flex-1" placeholder="Idioma" value={lang.language} onChange={e => updateLanguage(lang.id, 'language', e.target.value)} />
                    <Select value={lang.level || undefined} onValueChange={(value) => updateLanguage(lang.id, 'level', value)}>
                      <SelectTrigger className="h-8 text-xs w-36">
                        <SelectValue placeholder="Nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Basic">Basic</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advance">Advance</SelectItem>
                        <SelectItem value="Fluent">Fluent</SelectItem>
                        <SelectItem value="Native">Native</SelectItem>
                      </SelectContent>
                    </Select>
                    {languages.length > 1 && (
                      <button onClick={() => setLanguages(prev => prev.filter(l => l.id !== lang.id))} className="text-muted-foreground hover:text-destructive">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => setLanguages(prev => [...prev, EMPTY_LANGUAGE()])} className="w-full">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Añadir idioma
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-4 pb-1 pt-2 flex flex-col gap-2 border-t">
          <Button onClick={handleGenerate} disabled={!hasContent} className="w-full">
            <Sparkles className="h-4 w-4 mr-2" />
            Generar 5 CVs
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleReset}
            disabled={!hasGenerated && !hasContent}
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
