import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { SupportedLanguage, Masjid } from '../types';
import { TRANSLATIONS, TranslationSchema } from './translations';
import { storageService } from '../services/storageService';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  isRtl: boolean;
  t: TranslationSchema;
  getMasjidName: (masjid: Masjid) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const s = storageService.loadSettings();
    return s.language || 'en';
  });

  const isRtl = language === 'ar' || language === 'ur';

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    const settings = storageService.loadSettings();
    storageService.saveSettings({ ...settings, language: lang });
  };

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    
    // Set appropriate body font class
    document.body.classList.remove('font-sans', 'font-arabic', 'font-urdu', 'font-tamil');
    if (language === 'ar') {
      document.body.classList.add('font-arabic');
    } else if (language === 'ur') {
      document.body.classList.add('font-urdu');
    } else if (language === 'ta') {
      document.body.classList.add('font-tamil');
    } else {
      document.body.classList.add('font-sans');
    }
  }, [language, isRtl]);

  const t = useMemo(() => {
    return TRANSLATIONS[language] || TRANSLATIONS.en;
  }, [language]);

  const getMasjidName = (masjid: Masjid): string => {
    if (!masjid) return '';
    if (language === 'ta' && masjid.tamilName) return masjid.tamilName;
    if (language === 'ar' && masjid.arabicName) return masjid.arabicName;
    if (language === 'ur' && masjid.urduName) return masjid.urduName;
    return masjid.name;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRtl, t, getMasjidName }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
