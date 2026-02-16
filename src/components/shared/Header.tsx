"use client";

import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import CartDrawer from "@/features/shop/components/CartDrawer";
import { benefitsData } from "@/data/benefits";


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
        ...benefitsData.map(benefit => ({
            name: isRTL && benefit.title_ar ? benefit.title_ar : benefit.title,
            href: `/${lang}/benefits/${benefit.slug}`
        }))
    ];

    const navLinks = [
        { name: t('nav.home'), href: `/${lang}/`, isRoute: true, title: "Home page" },
        { name: t('nav.products'), href: `/${lang}/products`, isRoute: true, hasDropdown: true, dropdownItems: productDropdownItems, title: "Products" },
        { name: t('nav.about'), href: `/${lang}/about`, isRoute: true, title: "About our company" },
        { name: t('nav.blog'), href: `/${lang}/blog`, isRoute: true, title: "Blog" },
        { name: t('nav.privateLabel'), href: `/${lang}/private-label`, isRoute: true, title: "Private label" },
        { name: t('nav.benefits'), href: `/${lang}/benefits`, isRoute: true, hasDropdown: true, dropdownItems: benefitsDropdownItems, title: "Benefits" },
        { name: t('nav.shop'), href: `/${lang}/shop`, isRoute: true, title: "Shop" },
        { name: t('nav.contact'), href: `/${lang}/contact`, isRoute: true, title: "Get in touch" },
    ];


    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 border-b border-border/10 transition-all duration-300 ${isScrolled
                ? "bg-secondary/95 backdrop-blur-md shadow-lg"
                : "bg-secondary/95"
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href={`/${lang}/`} className="flex items-center cursor-pointer">
                        <Image
                            src="/images/logo.png"
                            alt="Moroccan Organica"
                            width={160}
                            height={48}
                            priority
                            className="h-10 md:h-12 w-auto object-contain"
                        />
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
                                        title={link.title}
                                        className={`flex items-center gap-1 text-base md:text-lg font-semibold text-white uppercase tracking-wide hover:text-primary transition-colors duration-200 cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}
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
                                        title={link.title}
                                        className={`flex items-center gap-1 text-sm md:text-base font-semibold text-white uppercase tracking-wide hover:text-primary transition-colors duration-200 cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}
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
                                        className={`absolute top-full pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200 ${isRTL ? 'right-0' : 'left-0'}`}
                                    >
                                        <div className="bg-secondary border border-border/20 rounded-lg shadow-xl min-w-[240px] max-h-[400px] overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                                            {link.dropdownItems?.map((item, index) => (
                                                <Link
                                                    key={`${item.href}-${item.name}`}
                                                    href={item.href}
                                                    onClick={() => setOpenDropdown(null)}
                                                    className={`block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-primary/20 transition-colors duration-150 cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`}
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Right Section */}
                    <div className="hidden lg:flex items-center gap-6">
                        <LanguageSwitcher />
                        <CartDrawer isRTL={isRTL} lang={lang} />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 text-white cursor-pointer"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <nav className="lg:hidden py-4 border-t border-border/20 bg-secondary">
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <div key={link.href + link.name}>
                                    {link.hasDropdown ? (
                                        <div>
                                            <button
                                                onClick={() => setOpenMobileDropdown(openMobileDropdown === link.name ? null : link.name)}
                                                className={`w-full flex items-center justify-between text-sm font-medium text-white uppercase tracking-wide hover:text-primary transition-colors duration-200 py-2 cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}
                                            >
                                                {link.name}
                                                <ChevronDown
                                                    className={`w-4 h-4 transition-transform duration-200 ${openMobileDropdown === link.name ? 'rotate-180' : ''}`}
                                                />
                                            </button>

                                            {/* Mobile Dropdown Items */}
                                            <div
                                                className={`transition-all duration-300 ease-in-out ${openMobileDropdown === link.name ? 'max-h-[300px] overflow-y-auto opacity-100' : 'max-h-0 overflow-hidden opacity-0'
                                                    }`}
                                            >
                                                <div className={`flex flex-col gap-1 py-2 ${isRTL ? 'pr-4' : 'pl-4'}`}>
                                                    {link.dropdownItems?.map((item, index) => (
                                                        <Link
                                                            key={`${item.href}-${item.name}`}
                                                            href={item.href}
                                                            className={`text-sm text-gray-400 hover:text-primary transition-colors duration-150 py-1.5 cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`}
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
                                            title={link.title}
                                            className={`flex items-center gap-1 text-sm font-medium text-white uppercase tracking-wide hover:text-primary transition-colors duration-200 py-2 cursor-pointer ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    ) : (
                                        <a
                                            href={link.href}
                                            title={link.title}
                                            className={`flex items-center gap-1 text-sm font-medium text-white uppercase tracking-wide hover:text-primary transition-colors duration-200 py-2 cursor-pointer ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
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
                                <CartDrawer isRTL={isRTL} lang={lang} />
                            </div>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
