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
    const currentLang = pathname.split('/')[1] === 'ar' ? 'ar' : 'en';

    const languages = [
        { code: 'en', name: 'English', icon: '🇬🇧', letter: 'E' },
        { code: 'ar', name: 'العربية', icon: '🇲🇦', letter: 'ع' },
    ];

    const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

    const changeLanguage = (langCode: string) => {
        const newPath = pathname.replace(`/${currentLang}`, `/${langCode}`);
        router.push(newPath);
        setIsOpen(false);
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                    aria-label="Select language"
                >
                    <span className="text-white text-sm font-medium">
                        {currentLanguage.code.toUpperCase()}
                    </span>
                    <div className="w-5 h-5 rounded-full bg-[#118f14] flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">
                            {currentLanguage.letter}
                        </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-white" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-gray-700">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`flex items-center gap-3 cursor-pointer hover:bg-[#118f14]/20 transition-colors ${
                            currentLang === lang.code ? 'bg-[#118f14]/30' : ''
                        }`}
                    >
                        <span className="text-lg">{lang.icon}</span>
                        <span className="text-white text-sm font-medium">{lang.name}</span>
                        {currentLang === lang.code && (
                            <span className="ms-auto text-[#118f14] text-xs">✓</span>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageSwitcher;
