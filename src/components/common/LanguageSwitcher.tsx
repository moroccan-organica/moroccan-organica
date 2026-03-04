"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

const LanguageSwitcher = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    // Safely get current language from pathname (e.g. /en/...)
    // default to en if not found
    const pathLang = pathname.split('/')[1];
    const currentLang = ['ar', 'fr'].includes(pathLang) ? pathLang : 'en';

    const languages = [
        { code: 'en', name: 'English', countryCode: 'US' },
        { code: 'ma', name: 'العربية', countryCode: 'MA', langCode: 'ar' },
        { code: 'fr', name: 'Français', countryCode: 'FR' },
    ];

    const currentLanguage = languages.find(lang => (lang.langCode || lang.code) === currentLang) || languages[0];

    const changeLanguage = (langCode: string) => {
        let segments = pathname.split('/').filter(Boolean);

        // Remove existing locale if present
        if (['ar', 'fr', 'en'].includes(segments[0])) {
            segments.shift();
        }

        // Add new locale if not English
        if (langCode !== 'en') {
            segments.unshift(langCode);
        }

        const newPath = `/${segments.join('/')}`;
        router.push(newPath || '/');
        setIsOpen(false);
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity p-2 rounded-full hover:bg-white/10"
                    aria-label="Select language"
                >
                    <ReactCountryFlag
                        countryCode={currentLanguage.countryCode}
                        svg
                        style={{
                            width: '1.5em',
                            height: '1.5em',
                            borderRadius: '3px',
                        }}
                        aria-hidden="true"
                    />
                    <ChevronDown className="w-4 h-4 text-white" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-secondary border-border/20 min-w-[150px]">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => changeLanguage(lang.langCode || lang.code)}
                        className={`flex items-center gap-3 cursor-pointer hover:bg-primary/20 transition-colors py-2 ${currentLang === (lang.langCode || lang.code) ? 'bg-primary/30' : ''
                            }`}
                    >
                        <ReactCountryFlag
                            countryCode={lang.countryCode}
                            svg
                            style={{
                                width: '1.5em',
                                height: '1.5em',
                                borderRadius: '3px',
                            }}
                            aria-hidden="true"
                        />
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
