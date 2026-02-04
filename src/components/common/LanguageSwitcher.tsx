"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, ChevronDown } from "lucide-react";

const LanguageSwitcher = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    // Safely get current language from pathname (e.g. /en/...)
    // default to en if not found
    const pathLang = pathname.split('/')[1];
    const currentLang = ['en', 'ar', 'fr'].includes(pathLang) ? pathLang : 'en';

    const languages = [
        { code: 'en', name: 'English', icon: '🇬🇧', letter: 'E' },
        { code: 'ar', name: 'العربية', icon: '🇲🇦', letter: 'ع' },
        { code: 'fr', name: 'Français', icon: '🇫🇷', letter: 'F' },
    ];

    const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

    const changeLanguage = (langCode: string) => {
        // If the path starts with a language code, replace it
        // Otherwise preped it (though usually middleware handles this)
        const segments = pathname.split('/');
        // segments[0] is empty string before first slash
        // segments[1] is the locale if present
        if (['en', 'ar', 'fr'].includes(segments[1])) {
            segments[1] = langCode;
        } else {
            segments.splice(1, 0, langCode);
        }
        const newPath = segments.join('/');
        router.push(newPath);
        setIsOpen(false);
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity p-2 rounded-full hover:bg-white/10"
                    aria-label="Select language"
                >
                    <span className="text-2xl leading-none filter drop-shadow-sm">
                        {currentLanguage.icon}
                    </span>
                    <ChevronDown className="w-4 h-4 text-white" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-secondary border-border/20 min-w-[150px]">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`flex items-center gap-3 cursor-pointer hover:bg-primary/20 transition-colors py-2 ${currentLang === lang.code ? 'bg-primary/30' : ''
                            }`}
                    >
                        <span className="text-2xl leading-none">{lang.icon}</span>
                        <span className="text-white text-sm font-medium">{lang.name}</span>
                        {currentLang === lang.code && (
                            <span className="ms-auto text-primary text-xs">✓</span>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageSwitcher;
