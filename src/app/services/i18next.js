import 'intl-pluralrules'; // Import the polyfill for Intl.PluralRules
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/app/locales/en.json';
import pt from '@/app/locales/pt.json';
import { loadString, saveString } from '@/utils/storage/storage';

// Create a custom language detector
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    try {
      // Load the saved language from storage
      const savedLanguage = await loadString('user-language');
      if (savedLanguage) {
        callback(savedLanguage);
      } else {
        // Default to 'en' if no language is saved
        callback('en');
      }
    } catch (error) {
      console.error('Error loading language from storage:', error);
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: (language) => {
    // Save the selected language to storage
    saveString('user-language', language);
  },
};

export const languageResources = {
  en: { translation: en },
  pt: { translation: pt },
};

export const initI18next = i18next
  .use(languageDetector) // Use the custom language detector
  .use(initReactI18next)
  .init({
    fallbackLng: 'en', // Fallback language
    resources: languageResources,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  })
  .then(() => {
    console.log('i18next initialized successfully');
  })
  .catch((error) => {
    console.error('i18next initialization failed:', error);
  });

export default i18next;
