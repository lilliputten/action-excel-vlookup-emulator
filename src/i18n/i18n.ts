import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { defaultLanguage } from '@/config/lang';

import translationEN from './locales/en.json';
import translationRU from './locales/ru.json';

const resources = {
  en: { translation: translationEN },
  ru: { translation: translationRU },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: defaultLanguage, // default language
    fallbackLng: defaultLanguage, // fallback language if translation is missing
    interpolation: {
      escapeValue: false, // react already escapes by default
    },
  });

export default i18n;
