import 'intl-pluralrules'; // Import the polyfill for Intl.PluralRules
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import pt from '../locales/pt.json';

export const languageResources = {
  en: { translation: en },
  pt: { translation: pt },
};

i18next.use(initReactI18next).init({
  lng: 'en', // Default language
  fallbackLng: 'en', // Fallback language
  resources: languageResources,
  interpolation: {
    escapeValue: false, // React already escapes
  },
});

export default i18next;
