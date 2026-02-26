"use client";

import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import CartDrawer from "@/components/shop/CartDrawer";
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
        ? topProducts.map(p => ({ name: p.title, href: `/${lang}/organica/${p.slug}` }))
        : [
            { name: t('products.essentialOils'), href: `/${lang}/organica/essential-oils-wholesale-suppliers` },
            { name: t('products.vegetableOils'), href: `/${lang}/organica/essential-oils-wholesale-suppliers` },
            { name: t('products.driedPlants'), href: `/${lang}/organica/essential-oils-wholesale-suppliers` },
            { name: t('products.wellness'), href: `/${lang}/organica/essential-oils-wholesale-suppliers` },
        ];

    const benefitsDropdownItems = [
        ...benefitsData.map(benefit => ({
            name: isRTL && benefit.title_ar ? benefit.title_ar : benefit.title,
            href: `/${lang}/benefits/${benefit.slug}`
        }))
    ];

    const navLinks = [
        { name: t('nav.home'), href: `/${lang}/`, isRoute: true, title: "Home page" },
        { name: t('nav.products'), href: `/${lang}/wholesale-of-moroccan-skincare`, isRoute: true, hasDropdown: true, dropdownItems: productDropdownItems, title: "Products" },
        { name: t('nav.about'), href: `/${lang}/about`, isRoute: true, title: "About our company" },
        { name: t('nav.blog'), href: `/${lang}/blog`, isRoute: true, title: "Blog" },
        { name: t('nav.privateLabel'), href: `/${lang}/private-label`, isRoute: true, title: "Private label" },
        { name: t('nav.benefits'), href: `/${lang}/benefits`, isRoute: true, hasDropdown: true, dropdownItems: benefitsDropdownItems, title: "Benefits" },
        { name: t('nav.shop'), href: `/${lang}/shop`, isRoute: true, title: "Shop" },
        { name: t('nav.contact'), href: `/${lang}/contact`, isRoute: true, title: "Get in touch" },
    ];

    const socialLinks = [
        {
            href: "https://www.facebook.com/moroccanorganica/", label: "Facebook", color: "#1877F2", icon: (className: string) => (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
                    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14-2.8 0-4.632 1.6-4.632 4.757V9.5h-3.2v4h3.2v9h4.8v-9z" />
                </svg>
            )
        },
        {
            href: "https://www.instagram.com/moroccanorganic/", label: "Instagram", color: "#E4405F", icon: (className: string) => (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
            )
        },
        {
            href: "https://wa.me/212648273228", label: "WhatsApp", color: "#25D366", icon: (className: string) => (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
            )
        },
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
                                            {link.dropdownItems?.map((item) => (
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
                    <div className="hidden lg:flex items-center gap-4">
                        <LanguageSwitcher />
                        <CartDrawer isRTL={isRTL} lang={lang} />
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social) => (
                                <Link
                                    key={social.href}
                                    href={social.href}
                                    target="_blank"
                                    className="w-11 h-11 flex items-center justify-center transition-transform duration-200 hover:scale-105"
                                    aria-label={social.label}
                                    title={social.label}
                                    style={{ color: social.color }}
                                >
                                    {social.icon("w-5 h-5")}
                                </Link>
                            ))}
                        </div>
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
                                                    {link.dropdownItems?.map((item) => (
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
                            <div className={`flex flex-col gap-3 pt-4 border-t border-gray-700 ${isRTL ? 'items-end' : 'items-start'}`}>
                                <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <LanguageSwitcher />
                                    <CartDrawer isRTL={isRTL} lang={lang} />
                                </div>
                                <div className="flex items-center gap-3">
                                    {socialLinks.map((social) => (
                                        <Link
                                            key={social.href}
                                            href={social.href}
                                            target="_blank"
                                            className="w-11 h-11 flex items-center justify-center transition-transform duration-200 hover:scale-105"
                                            aria-label={social.label}
                                            title={social.label}
                                            onClick={() => setIsMenuOpen(false)}
                                            style={{ color: social.color }}
                                        >
                                            {social.icon("w-5 h-5")}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
