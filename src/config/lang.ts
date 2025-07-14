export const usedLanguages = ['en', 'ru'] as const;
export type TLang = (typeof usedLanguages)[number];
export const languageNames: Record<TLang, string> = {
  en: 'English',
  ru: 'Русский',
};
const hashLanguage = window.location.search.substring(1) as TLang;
const isValidHashLanguage = usedLanguages.includes(hashLanguage);
const failbackLanguage: TLang = 'ru';
export const defaultLanguage: TLang = isValidHashLanguage ? hashLanguage : failbackLanguage;
export const allowedLanguageSwitch = isValidHashLanguage;

/* // DEBUG
 * console.log('[lang]', {
 *   hashLanguage,
 *   allowedLanguageSwitch,
 *   search: window.location.search,
 * });
 */
// history.replaceState({}, '', '?xx'); // A method to update location search string
