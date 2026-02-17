import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { CvData, TemplateName } from '@/types/cv';
import { parseText } from '@/lib/parser';

const SESSION_DURATION_MS = 30 * 60 * 1000;
const SESSION_KEY = 'cv-session-expires-at';

interface CvContextType {
  rawText: string;
  setRawText: (text: string) => void;
  cvData: CvData | null;
  setCvDataDirectly: (data: CvData) => void;
  selectedTemplate: TemplateName;
  setSelectedTemplate: (t: TemplateName) => void;
  profileName: string;
  setProfileName: (n: string) => void;
  isGenerating: boolean;
  generate: () => void;
  reset: () => void;
  hasGenerated: boolean;
  sessionExpiresAt: number | null;
  startSession: () => void;
  sectionLanguage: 'es' | 'en';
  setSectionLanguage: (lang: 'es' | 'en') => void;
}

const CvContext = createContext<CvContextType | null>(null);

export function CvProvider({ children }: { children: ReactNode }) {
  const [rawText, setRawText] = useState(() => localStorage.getItem('cv-raw-text') || '');
  const [cvData, setCvData] = useState<CvData | null>(() => {
    const saved = localStorage.getItem('cv-data');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName>(
    () => (localStorage.getItem('cv-template') as TemplateName) || 'minimal'
  );
  const [profileName, setProfileName] = useState(() => localStorage.getItem('cv-profile') || '');
  const [sectionLanguage, setSectionLanguage] = useState<'es' | 'en'>(
    () => (localStorage.getItem('cv-section-language') as 'es' | 'en') || 'es'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(() => !!localStorage.getItem('cv-data'));
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (!saved) return null;
    const parsed = Number(saved);
    return Number.isFinite(parsed) ? parsed : null;
  });

  const clearCvStorage = () => {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('cv-'));
    for (const key of keys) localStorage.removeItem(key);
  };

  const clearAllState = () => {
    setRawText('');
    setCvData(null);
    setProfileName('');
    setSectionLanguage('es');
    setSelectedTemplate('minimal');
    setHasGenerated(false);
    setSessionExpiresAt(null);
  };

  const startSession = useCallback(() => {
    const expiresAt = Date.now() + SESSION_DURATION_MS;
    setSessionExpiresAt(expiresAt);
    localStorage.setItem(SESSION_KEY, String(expiresAt));
  }, []);

  useEffect(() => { localStorage.setItem('cv-raw-text', rawText); }, [rawText]);
  useEffect(() => { localStorage.setItem('cv-template', selectedTemplate); }, [selectedTemplate]);
  useEffect(() => { localStorage.setItem('cv-profile', profileName); }, [profileName]);
  useEffect(() => { localStorage.setItem('cv-section-language', sectionLanguage); }, [sectionLanguage]);
  useEffect(() => {
    if (sessionExpiresAt === null) {
      localStorage.removeItem(SESSION_KEY);
    } else {
      localStorage.setItem(SESSION_KEY, String(sessionExpiresAt));
    }
  }, [sessionExpiresAt]);
  useEffect(() => {
    if (cvData) localStorage.setItem('cv-data', JSON.stringify(cvData));
    else localStorage.removeItem('cv-data');
  }, [cvData]);
  useEffect(() => {
    if (!sessionExpiresAt) return;

    const msRemaining = sessionExpiresAt - Date.now();
    if (msRemaining <= 0) {
      clearCvStorage();
      clearAllState();
      window.dispatchEvent(new Event('cv-session-expired'));
      alert('Tu sesion de 30 minutos ha finalizado. Los datos locales se han borrado.');
      return;
    }

    const timer = window.setTimeout(() => {
      clearCvStorage();
      clearAllState();
      window.dispatchEvent(new Event('cv-session-expired'));
      alert('Tu sesion de 30 minutos ha finalizado. Los datos locales se han borrado.');
    }, msRemaining);

    return () => window.clearTimeout(timer);
  }, [sessionExpiresAt]);

  const generate = () => {
    if (!rawText.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const data = parseText(rawText);
      if (profileName && profileName.trim()) data.name = profileName;
      data.sectionLanguage = sectionLanguage;
      setCvData(data);
      setHasGenerated(true);
      setIsGenerating(false);
    }, 400);
  };

  const setCvDataDirectly = (data: CvData) => {
    setCvData({ ...data, sectionLanguage: data.sectionLanguage || sectionLanguage });
    setHasGenerated(true);
  };

  const reset = () => {
    clearCvStorage();
    clearAllState();
  };

  return (
    <CvContext.Provider value={{
      rawText, setRawText, cvData, setCvDataDirectly, selectedTemplate, setSelectedTemplate,
      profileName, setProfileName, sectionLanguage, setSectionLanguage,
      isGenerating, generate, reset, hasGenerated, sessionExpiresAt, startSession,
    }}>
      {children}
    </CvContext.Provider>
  );
}

export function useCv() {
  const ctx = useContext(CvContext);
  if (!ctx) throw new Error('useCv must be used within CvProvider');
  return ctx;
}
