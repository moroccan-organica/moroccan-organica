import 'server-only'

const dictionaries = {
    en: () => import('../locales/en.json').then((module) => module.default),
    ar: () => import('../locales/ar.json').then((module) => module.default),
}

export const getDictionary = async (locale: string) => {
    if (dictionaries[locale as keyof typeof dictionaries]) {
        return dictionaries[locale as keyof typeof dictionaries]()
    }
    return dictionaries['en']()
}
