import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export enum languages {
  en = 'en',
  ptBr = 'pt',
}

const supportedLngs = Object.values(languages);

export const initializeI18n = () => i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: supportedLngs[0],
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
    detection: {
      order: ['queryString', 'cookie'],
      caches: ['cookie']
    },
    supportedLngs,
  });

