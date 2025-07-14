import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

export const usedLanguages = ['en', 'ru'] as const;
export type TLng = (typeof usedLanguages)[number];
export type TLngOpts = { lng: TLng };
export const languageNames: Record<TLng, string> = {
  en: 'English',
  ru: 'Русский',
};
const hashLanguage = window.location.search.substring(1) as TLng;
const isValidHashLanguage = usedLanguages.includes(hashLanguage);
const failbackLanguage: TLng = 'ru';
export const defaultLanguage: TLng = isValidHashLanguage ? hashLanguage : failbackLanguage;
export const allowedLanguageSwitch = isValidHashLanguage;

export function useLanguage() {
  const { i18n } = useTranslation();
  return i18n.language as TLng;
}

export function getLanguage() {
  return i18n.language as TLng;
}
