"use client";

import { Menu, X, Leaf, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import CartDrawer from "@/components/shop/CartDrawer";

type Dict = Record<string, unknown>;

interface HeaderProps {
    dict: Dict;
    lang: string;
    topProducts?: { title: string; slug: string }[];
}

const Header = ({ dict, lang, topProducts = [] }: HeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isRTL = lang === 'ar';
    const t = (key: string): string => {
        // Simple property accessor for nested keys like 'nav.home'
        const keys = key.split('.');
        let value: unknown = dict;
        for (const k of keys) {
            value = (value as Dict | undefined)?.[k];
        }
        return typeof value === 'string' ? value : key;
    };

    const productDropdownItems = topProducts.length > 0
        ? topProducts.map(p => ({ name: p.title, href: `/${lang}/shop/${p.slug}` }))
        : [
            { name: t('products.essentialOils'), href: `/${lang}/products` },
            { name: t('products.vegetableOils'), href: `/${lang}/products` },
            { name: t('products.driedPlants'), href: `/${lang}/products` },
            { name: t('products.wellness'), href: `/${lang}/products` },
        ];

    const benefitsDropdownItems = [
        { name: t('nav.certifications'), href: "#trust" },
        { name: t('nav.sustainability'), href: "#about" },
        { name: t('nav.quality'), href: "#trust" },
    ];

    const navLinks = [
        { name: t('nav.home'), href: `/${lang}/`, isRoute: true },
        { name: t('nav.products'), href: `/${lang}/products`, isRoute: true, hasDropdown: true, dropdownItems: productDropdownItems },
        { name: t('nav.about'), href: `/${lang}/about`, isRoute: true },
        { name: t('nav.blog'), href: `/${lang}/blog`, isRoute: true },
        { name: t('nav.privateLabel'), href: `/${lang}/private-label`, isRoute: true }, // Added lang prefix to route
        { name: t('nav.benefits'), href: "#trust", hasDropdown: true, dropdownItems: benefitsDropdownItems },
        { name: t('nav.shop'), href: `/${lang}/shop`, isRoute: true },
        { name: t('nav.contact'), href: `/${lang}/contact`, isRoute: true },
    ];


    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 border-b border-white/5 transition-all duration-300 ${isScrolled
                ? "bg-[#1a1a1a]/95 backdrop-blur-md shadow-lg"
                : "bg-[#111111]/95"
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href={`/${lang}/`} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#118f14] flex items-center justify-center">
                            <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white text-lg leading-tight">
                                {isRTL ? (
                                    <>مغربي<span className="font-bold">أورغانيكا</span></>
                                ) : (
                                    <>Moroccan<span className="font-bold">Organica</span></>
                                )}
                            </span>
                            <span className="text-gray-400 text-xs">
                                {isRTL ? "إنتاج وتصدير" : "Production & export"}
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <div
                                key={link.href + link.name}
                                className="relative"
                                onMouseEnter={() => link.hasDropdown && setOpenDropdown(link.name)}
                                onMouseLeave={() => setOpenDropdown(null)}
                            >
                                {link.isRoute ? (
                                    <Link
                                        href={link.href}
                                        className={`flex items-center gap-1 text-xs font-medium text-white uppercase tracking-wide hover:text-[#118f14] transition-colors duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}
                                    >
                                        {link.name}
                                        {link.hasDropdown && (
                                            <ChevronDown
                                                className={`w-3 h-3 transition-transform duration-200 ${openDropdown === link.name ? 'rotate-180' : ''}`}
                                            />
                                        )}
                                    </Link>
                                ) : (
                                    <a
                                        href={link.href}
                                        className={`flex items-center gap-1 text-xs font-medium text-white uppercase tracking-wide hover:text-[#118f14] transition-colors duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}
                                    >
                                        {link.name}
                                        {link.hasDropdown && (
                                            <ChevronDown
                                                className={`w-3 h-3 transition-transform duration-200 ${openDropdown === link.name ? 'rotate-180' : ''}`}
                                            />
                                        )}
                                    </a>
                                )}

                                {/* Dropdown Menu */}
                                {link.hasDropdown && openDropdown === link.name && (
                                    <div
                                        className={`absolute top-full mt-2 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl min-w-[180px] z-50 animate-in fade-in slide-in-from-top-2 duration-200 ${isRTL ? 'right-0' : 'left-0'}`}
                                    >
                                        {link.dropdownItems?.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#118f14]/20 transition-colors duration-150 ${isRTL ? 'text-right' : 'text-left'}`}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Right Section */}
                    <div className="hidden lg:flex items-center gap-6">
                        <LanguageSwitcher />
                        <CartDrawer isRTL={isRTL} />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <nav className="lg:hidden py-4 border-t border-gray-700 bg-[#1a1a1a]">
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <div key={link.href + link.name}>
                                    {link.hasDropdown ? (
                                        <div>
                                            <button
                                                onClick={() => setOpenMobileDropdown(openMobileDropdown === link.name ? null : link.name)}
                                                className={`w-full flex items-center justify-between text-sm font-medium text-white uppercase tracking-wide hover:text-[#118f14] transition-colors duration-200 py-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                                            >
                                                {link.name}
                                                <ChevronDown
                                                    className={`w-4 h-4 transition-transform duration-200 ${openMobileDropdown === link.name ? 'rotate-180' : ''}`}
                                                />
                                            </button>

                                            {/* Mobile Dropdown Items */}
                                            <div
                                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openMobileDropdown === link.name ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                                                    }`}
                                            >
                                                <div className={`flex flex-col gap-1 py-2 ${isRTL ? 'pr-4' : 'pl-4'}`}>
                                                    {link.dropdownItems?.map((item) => (
                                                        <Link
                                                            key={item.name}
                                                            href={item.href}
                                                            className={`text-sm text-gray-400 hover:text-[#118f14] transition-colors duration-150 py-1.5 ${isRTL ? 'text-right' : 'text-left'}`}
                                                            onClick={() => setIsMenuOpen(false)}
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : link.isRoute ? (
                                        <Link
                                            href={link.href}
                                            className={`flex items-center gap-1 text-sm font-medium text-white uppercase tracking-wide hover:text-[#118f14] transition-colors duration-200 py-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    ) : (
                                        <a
                                            href={link.href}
                                            className={`flex items-center gap-1 text-sm font-medium text-white uppercase tracking-wide hover:text-[#118f14] transition-colors duration-200 py-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {link.name}
                                        </a>
                                    )}
                                </div>
                            ))}

                            {/* Mobile Utilities */}
                            <div className={`flex items-center gap-6 pt-4 border-t border-gray-700 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                                <LanguageSwitcher />
                                <CartDrawer isRTL={isRTL} />
                            </div>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
