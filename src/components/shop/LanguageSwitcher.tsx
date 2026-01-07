"use client";

import { usePathname, useRouter } from "next/navigation";

const LanguageSwitcher = () => {
    const pathname = usePathname();
    const router = useRouter();

    // Safely get current language from pathname (e.g. /en/...)
    // default to en if not found
    const currentLang = pathname.split('/')[1] === 'ar' ? 'ar' : 'en';

    const toggleLanguage = () => {
        const newLang = currentLang === 'ar' ? 'en' : 'ar';
        const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
        router.push(newPath);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            aria-label="Toggle language"
        >
            <span className="text-white text-sm font-medium">
                {currentLang === 'ar' ? 'AR' : 'EN'}
            </span>
            <div className="w-5 h-5 rounded-full bg-[#118f14] flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">
                    {currentLang === 'ar' ? 'ع' : 'E'}
                </span>
            </div>
        </button>
    );
};

export default LanguageSwitcher;
