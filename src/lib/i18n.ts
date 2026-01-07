import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en.json';
import ar from '../locales/ar.json';

const resources = {
    en: { translation: en },
    ar: { translation: ar }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

// Function to update document direction and font
export const updateDocumentDirection = (lang: string) => {
    if (typeof document === 'undefined') return;
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
};

// Initialize direction on load if client
if (typeof document !== 'undefined') {
    updateDocumentDirection(i18n.language);
}

// Listen for language changes
i18n.on('languageChanged', (lang) => {
    updateDocumentDirection(lang);
});

export default i18n;
