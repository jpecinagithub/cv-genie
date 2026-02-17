import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CvData, TemplateName } from '@/types/cv';
import { parseText } from '@/lib/parser';

interface CvContextType {
  rawText: string;
  setRawText: (text: string) => void;
  cvData: CvData | null;
  selectedTemplate: TemplateName;
  setSelectedTemplate: (t: TemplateName) => void;
  profileName: string;
  setProfileName: (n: string) => void;
  isGenerating: boolean;
  generate: () => void;
  reset: () => void;
  hasGenerated: boolean;
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(() => !!localStorage.getItem('cv-data'));

  useEffect(() => { localStorage.setItem('cv-raw-text', rawText); }, [rawText]);
  useEffect(() => { localStorage.setItem('cv-template', selectedTemplate); }, [selectedTemplate]);
  useEffect(() => { localStorage.setItem('cv-profile', profileName); }, [profileName]);
  useEffect(() => {
    if (cvData) localStorage.setItem('cv-data', JSON.stringify(cvData));
    else localStorage.removeItem('cv-data');
  }, [cvData]);

  const generate = () => {
    if (!rawText.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const data = parseText(rawText);
      if (profileName && profileName.trim()) data.name = profileName;
      setCvData(data);
      setHasGenerated(true);
      setIsGenerating(false);
    }, 400);
  };

  const reset = () => {
    setRawText('');
    setCvData(null);
    setProfileName('');
    setHasGenerated(false);
    localStorage.removeItem('cv-raw-text');
    localStorage.removeItem('cv-data');
    localStorage.removeItem('cv-profile');
  };

  return (
    <CvContext.Provider value={{
      rawText, setRawText, cvData, selectedTemplate, setSelectedTemplate,
      profileName, setProfileName,
      isGenerating, generate, reset, hasGenerated,
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
