"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, MessageCircle, type LucideProps } from "lucide-react";

type LinkItem = { href: string; name: string };

type FooterContent = {
    newsletter: { title: string; description: string; placeholder: string; button: string };
    about: { title: string; description: string };
    contact: { phone: string; email: string; address: string; factory: string };
    links: {
        blog: { title: string; items: LinkItem[] };
        policy: { title: string; items: LinkItem[] };
        products: { title: string; items: LinkItem[] };
    };
    partners: { transport: string; payment: string };
    rights: string;
};

const FacebookIcon = (props: LucideProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="none"
        {...props}
    >
        <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14-2.8 0-4.632 1.6-4.632 4.757V9.5h-3.2v4h3.2v9h4.8v-9z" />
    </svg>
);

const InstagramIcon = (props: LucideProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="none"
        {...props}
    >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
);

const LinkedinIcon = (props: LucideProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="none"
        {...props}
    >
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

const PinterestIcon = (props: LucideProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="none"
        {...props}
    >
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 2.663 9.603 6.706 11.775-.093-.998-.177-2.525.038-3.61.196-.986 1.267-5.368 1.267-5.368s-.323-.645-.323-1.6c0-1.503.869-2.626 1.951-2.626.92 0 1.365.69 1.365 1.517 0 .925-.589 2.311-.892 3.595-.253 1.075.539 1.95 1.6 1.95 1.921 0 3.397-2.025 3.397-4.945 0-2.583-1.859-4.388-4.512-4.388-3.072 0-4.876 2.305-4.876 4.69 0 .928.357 1.921.803 2.459.088.107.1.2.074.364-.081.336-.262 1.064-.297 1.213-.047.202-.159.245-.366.148-1.366-.636-2.218-2.636-2.218-4.244 0-3.456 2.513-6.629 7.245-6.629 3.804 0 6.762 2.712 6.762 6.336 0 3.781-2.385 6.824-5.694 6.824-1.112 0-2.156-.577-2.513-1.258l-.684 2.6c-.248.948-.918 2.136-1.368 2.862 1.042.31 2.152.479 3.297.479 6.643 0 12.03-5.365 12.03-11.987C24.033 5.367 18.654 0 12.017 0z" />
    </svg>
);

const TikTokIcon = (props: LucideProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="none"
        {...props}
    >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

const XIcon = (props: LucideProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="none"
        {...props}
    >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const Footer = ({ dict, lang, topProducts = [] }: { dict: FooterContent | { footer?: FooterContent }, lang: string, topProducts?: { title: string; slug: string }[] }) => {
    const content = (dict as { footer?: FooterContent }).footer ?? (dict as FooterContent);

    const productLinks = topProducts.length > 0
        ? topProducts.map(p => ({ name: p.title, href: `/${lang}/wholesale-of-moroccan-skincare/${p.slug}` }))
        : content.links.products.items;

    const socialLinks = [
        { icon: FacebookIcon, href: "https://www.facebook.com/moroccanorganica/", label: "Facebook" },
        { icon: XIcon, href: "https://x.com/morocanorganica", label: "X (Twitter)" },
        { icon: PinterestIcon, href: "https://www.pinterest.com/moroccanorganicproducts/", label: "Pinterest" },
        { icon: InstagramIcon, href: "https://www.instagram.com/moroccanorganic/", label: "Instagram" },
        { icon: LinkedinIcon, href: "https://www.linkedin.com/in/organicamoroccanorganica/", label: "LinkedIn" },
        { icon: TikTokIcon, href: "https://www.tiktok.com/@moroccanbeauty_shop", label: "TikTok" },
    ];

    return (
        <footer className="relative bg-[#5d6b82] text-white/90 pt-12 pb-6 overflow-hidden">
            {/* Background Texture Overlay */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none z-0"
                style={{
                    backgroundImage: 'url(/images/footer/footer-map-bg.png)',
                    backgroundSize: '90% auto',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            />

            <div className="container-main relative z-10">
                {/* Newsletter Section */}
                <div className="grid lg:grid-cols-2 gap-8 items-center mb-10 pb-10 relative">
                    <div
                        className="absolute bottom-0 left-0 w-full h-px opacity-50"
                        style={{ backgroundImage: 'url(/images/footer/footer-border.png)', backgroundRepeat: 'repeat-x' }}
                    />
                    <div>
                        <h2 className="text-xl font-serif font-bold text-white mb-2">
                            {content.newsletter.title}
                        </h2>
                        <p className="text-sm text-white/80 italic">
                            {content.newsletter.description}
                        </p>
                    </div>
                    <div className="relative group">
                        <form className="flex flex-col sm:flex-row gap-3">
                            <div className="relative grow">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                                <input
                                    type="email"
                                    placeholder={content.newsletter.placeholder}
                                    className="w-full bg-white/10 border border-white/20 rounded-full py-3 pl-11 pr-5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm text-white placeholder:text-white/40"
                                />
                            </div>
                            <button className="bg-[#b87717] hover:bg-[#a66a15] text-white font-bold py-3 px-8 rounded-full transition-all hover:scale-105 active:scale-95 whitespace-nowrap shadow-lg text-sm">
                                {content.newsletter.button}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 mb-10 text-center sm:text-left">
                    {/* About Us */}
                    <div className="sm:col-span-2 lg:col-span-3">
                        <h3 className="text-white font-serif text-base font-bold mb-4 uppercase tracking-wider relative inline-block">
                            {content.about.title}
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-12 h-px bg-[#b87717] border-b border-dashed border-[#b87717]"></span>
                        </h3>
                        <p className="text-xs leading-relaxed mb-4 italic text-white/80 max-w-md mx-auto sm:mx-0">
                            {content.about.description}
                        </p>
                        <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-4 hover:bg-white transition-all duration-500 group/contact shadow-lg text-left max-w-sm mx-auto sm:mx-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/10 group-hover/contact:bg-[#b87717]/10 flex items-center justify-center transition-colors">
                                    <MessageCircle className="w-4 h-4 text-white group-hover/contact:text-[#b87717] transition-colors" />
                                </div>
                                <span className="text-xs text-white group-hover/contact:text-[#1a1a1a] font-bold transition-colors">{content.contact.phone}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/10 group-hover/contact:bg-[#b87717]/10 flex items-center justify-center transition-colors">
                                    <Mail className="w-4 h-4 text-white group-hover/contact:text-[#b87717] transition-colors" />
                                </div>
                                <span className="text-xs text-white group-hover/contact:text-[#1a1a1a] font-bold transition-colors">{content.contact.email}</span>
                            </div>

                            <div className="pt-3 border-t border-white/20 group-hover/contact:border-gray-200 transition-colors">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/10 group-hover/contact:bg-[#b87717]/10 flex items-center justify-center transition-colors shrink-0">
                                        <MapPin className="w-4 h-4 text-white group-hover/contact:text-[#b87717] transition-colors" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-[11px] leading-snug text-white/90 group-hover/contact:text-gray-700 font-medium transition-colors">
                                            {content.contact.address}
                                        </p>
                                        <div className="inline-block px-2 py-0.5 bg-[#b87717] rounded text-[9px] font-bold text-white uppercase tracking-wider shadow-sm">
                                            {content.contact.factory}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Blog/Articles */}
                    <div className="lg:col-span-2">
                        <h3 className="text-white font-serif text-base font-bold mb-4 uppercase tracking-wider relative inline-block">
                            {content.links.blog.title}
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-12 h-px bg-[#b87717] border-b border-dashed border-[#b87717]"></span>
                        </h3>
                        <ul className="space-y-2">
                            {content.links.blog.items.map((item: LinkItem, i: number) => (
                                <li key={i}>
                                    <Link href={item.href} className="text-xs text-white/70 hover:text-white transition-colors flex items-center justify-center sm:justify-start gap-2 group italic">
                                        <span className="w-1 h-1 bg-white/30 rounded-full group-hover:w-2 group-hover:bg-white transition-all duration-300"></span>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Policy */}
                    <div className="lg:col-span-2">
                        <h3 className="text-white font-serif text-base font-bold mb-4 uppercase tracking-wider relative inline-block">
                            {content.links.policy.title}
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-12 h-px bg-[#b87717] border-b border-dashed border-[#b87717]"></span>
                        </h3>
                        <ul className="space-y-2">
                            {content.links.policy.items.map((item: LinkItem, i: number) => (
                                <li key={i}>
                                    <Link href={item.href} className="text-xs text-white/70 hover:text-white transition-colors flex items-center justify-center sm:justify-start gap-2 group italic">
                                        <span className="w-1 h-1 bg-white/30 rounded-full group-hover:w-2 group-hover:bg-white transition-all duration-300"></span>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Products */}
                    <div className="lg:col-span-3">
                        <h3 className="text-white font-serif text-base font-bold mb-4 uppercase tracking-wider relative inline-block">
                            {content.links.products.title}
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-12 h-px bg-[#b87717] border-b border-dashed border-[#b87717]"></span>
                        </h3>
                        <ul className="space-y-2 mb-6">
                            {productLinks.map((item: LinkItem, i: number) => (
                                <li key={i}>
                                    <Link href={item.href} className="text-xs text-white/70 hover:text-white transition-colors flex items-center justify-center sm:justify-start gap-2 group italic line-clamp-1">
                                        <span className="w-1 h-1 bg-white/30 rounded-full group-hover:w-2 group-hover:bg-white transition-all duration-300"></span>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Transport Partner Widget */}
                        <div className="mt-6">
                            <h3 className="text-white font-serif text-[10px] font-bold mb-3 uppercase tracking-wider">
                                {content.partners.transport}
                            </h3>
                            <div className="p-4 bg-white/10 rounded-lg border border-white/10 hover:bg-white transition-all duration-500 group/partner w-full max-w-[260px] sm:max-w-full mx-auto sm:mx-0">
                                <Image
                                    src="/images/footer/transport-partner.png"
                                    alt="transport-partner"
                                    width={640}
                                    height={160}
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment & App */}
                    <div className="sm:col-span-2 lg:col-span-2">
                        <h3 className="text-white font-serif text-base font-bold mb-4 uppercase tracking-wider relative inline-block">
                            {content.partners.payment}
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-12 h-px bg-[#b87717] border-b border-dashed border-[#b87717]"></span>
                        </h3>
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-4 items-stretch sm:items-start justify-center sm:justify-start">
                            <div className="p-4 bg-white/10 rounded-lg border border-white/10 space-y-4 hover:bg-white transition-all duration-500 group/payment w-full max-w-[260px] sm:max-w-full overflow-hidden mx-auto sm:mx-0">
                                <Image
                                    src="/images/footer/payment.png"
                                    alt="paypal"
                                    width={640}
                                    height={160}
                                    className="w-full h-auto object-contain scale-110 sm:scale-125"
                                />
                                <Image
                                    src="/images/footer/62a382de6209494ec2b17086.webp"
                                    alt="stripe"
                                    width={640}
                                    height={160}
                                    className="w-full h-auto object-contain scale-110 sm:scale-125"
                                />
                            </div>

                            <Link href="https://play.google.com/store/apps/details?id=com.moroccanorganica.argan.oil" target="_blank" className="block transform hover:scale-105 transition-all w-full max-w-[260px] sm:max-w-full mx-auto sm:mx-0">
                                <Image
                                    src="/images/footer/google-play.png"
                                    alt="google play"
                                    width={260}
                                    height={90}
                                    className="h-20 lg:h-[88px] w-auto object-contain"
                                />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Copyright Bar */}
                <div className="pt-6 relative flex flex-col md:flex-row justify-between items-center gap-4">
                    <div
                        className="absolute top-0 left-0 w-full h-px opacity-50"
                        style={{ backgroundImage: 'url(/images/footer/footer-border.png)', backgroundRepeat: 'repeat-x' }}
                    />
                    <p className="text-[10px] sm:text-xs text-white/60 font-medium">
                        © {new Date().getFullYear()} {content.rights}
                    </p>

                    <div className="flex items-center gap-3">
                        {socialLinks.map((social, i) => (
                            <Link
                                key={i}
                                href={social.href}
                                target="_blank"
                                className="w-10 h-10 rounded-full bg-white/15 text-white/80 flex items-center justify-center ring-1 ring-white/10 hover:bg-white/30 hover:text-white transition-all duration-300 group"
                                aria-label={social.label}
                            >
                                <social.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
