'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'EN' | 'ID';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  isEn: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'EN',
  setLang: () => {},
  isEn: true,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default is ENGLISH (EN)
  const [lang, setLangState] = useState<Language>('EN');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('itcg_lang');
      if (stored === 'ID' || stored === 'EN') {
        setLangState(stored);
      } else {
        // Default to EN
        setLangState('EN');
      }
    } catch (e) {}
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('itcg_lang', newLang);
    } catch (e) {}
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, isEn: lang === 'EN' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
