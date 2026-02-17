import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { CvData, TemplateName } from '@/types/cv';
import { toast } from 'sonner';
/* eslint-disable react-refresh/only-export-components */

const SESSION_DURATION_MS = 30 * 60 * 1000;
const SESSION_KEY = 'cv-session-expires-at';

function safeSetItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore quota/storage errors to avoid breaking app flow
  }
}

function safeRemoveItem(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore storage errors
  }
}

interface CvContextType {
  cvData: CvData | null;
  setCvDataDirectly: (data: CvData) => void;
  selectedTemplate: TemplateName;
  setSelectedTemplate: (t: TemplateName) => void;
  profileName: string;
  setProfileName: (n: string) => void;
  reset: () => void;
  hasGenerated: boolean;
  sessionExpiresAt: number | null;
  startSession: () => void;
  sectionLanguage: 'es' | 'en';
  setSectionLanguage: (lang: 'es' | 'en') => void;
}

const CvContext = createContext<CvContextType | null>(null);

export function CvProvider({ children }: { children: ReactNode }) {
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
  const [hasGenerated, setHasGenerated] = useState(() => !!localStorage.getItem('cv-data'));
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (!saved) return null;
    const parsed = Number(saved);
    return Number.isFinite(parsed) ? parsed : null;
  });

  const clearCvStorage = () => {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('cv-'));
    for (const key of keys) safeRemoveItem(key);
  };

  const clearAllState = () => {
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
    safeSetItem(SESSION_KEY, String(expiresAt));
  }, []);

  useEffect(() => { safeSetItem('cv-template', selectedTemplate); }, [selectedTemplate]);
  useEffect(() => { safeSetItem('cv-profile', profileName); }, [profileName]);
  useEffect(() => { safeSetItem('cv-section-language', sectionLanguage); }, [sectionLanguage]);
  useEffect(() => {
    if (sessionExpiresAt === null) {
      safeRemoveItem(SESSION_KEY);
    } else {
      safeSetItem(SESSION_KEY, String(sessionExpiresAt));
    }
  }, [sessionExpiresAt]);
  useEffect(() => {
    if (cvData) safeSetItem('cv-data', JSON.stringify(cvData));
    else safeRemoveItem('cv-data');
  }, [cvData]);
  useEffect(() => {
    if (!sessionExpiresAt) return;

    const msRemaining = sessionExpiresAt - Date.now();
    const warnFiveMinutesMs = 5 * 60 * 1000;
    const warnOneMinuteMs = 60 * 1000;

    const expireSession = () => {
      clearCvStorage();
      clearAllState();
      window.dispatchEvent(new Event('cv-session-expired'));
      toast.error('Tu sesion ha finalizado. Los datos locales se han borrado.');
    };

    if (msRemaining <= 0) {
      expireSession();
      return;
    }

    const timers: number[] = [];

    if (msRemaining <= warnFiveMinutesMs) {
      toast.warning('Tu sesion vence en menos de 5 minutos.');
    } else {
      timers.push(window.setTimeout(() => {
        toast.warning('Tu sesion vence en 5 minutos.');
      }, msRemaining - warnFiveMinutesMs));
    }

    if (msRemaining <= warnOneMinuteMs) {
      toast.warning('Tu sesion vence en menos de 1 minuto.');
    } else {
      timers.push(window.setTimeout(() => {
        toast.warning('Tu sesion vence en 1 minuto.');
      }, msRemaining - warnOneMinuteMs));
    }

    timers.push(window.setTimeout(() => {
      expireSession();
    }, msRemaining));

    return () => {
      for (const t of timers) window.clearTimeout(t);
    };
  }, [sessionExpiresAt]);

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
      cvData, setCvDataDirectly, selectedTemplate, setSelectedTemplate,
      profileName, setProfileName, sectionLanguage, setSectionLanguage,
      reset, hasGenerated, sessionExpiresAt, startSession,
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
