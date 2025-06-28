import i18n from 'i18next';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const TranslationContext = createContext({});

export const useTranslationUpdate = () => useContext(TranslationContext);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [, forceUpdate] = useState(0);
  const [language, setLanguage] = useState(i18n.language);

  const t = useCallback((key: string, options?: Record<string, string>) => {
    return i18n.t(key, options);
  }, []);

  const updateLanguage = useCallback((lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  }, []);

  useEffect(() => {
    const onLanguageChanged = () => {
      forceUpdate((prev) => prev + 1);
    };

    i18n.on('loaded', onLanguageChanged);

    return () => {
      i18n.off('loaded', onLanguageChanged);
    };
  }, []);

  return <TranslationContext.Provider value={{
    language,
    updateLanguage,
    t,
  }}>{children}</TranslationContext.Provider>;
};
