"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Facebook, Instagram, Linkedin, Twitter, MessageCircle } from "lucide-react";

const Footer = ({ dict }: { dict: any }) => {
    const content = dict.footer;
    const lang = dict.languages.ar === "العربية" ? "ar" : "en";

    const socialLinks = [
        { icon: Facebook, href: "https://www.facebook.com/moroccanorganica/", label: "Facebook" },
        { icon: Twitter, href: "https://x.com/morocanorganica", label: "Twitter" },
        { icon: Instagram, href: "https://www.instagram.com/moroccanorganic/", label: "Instagram" },
        { icon: Linkedin, href: "https://www.linkedin.com/in/organicamoroccanorganica/", label: "LinkedIn" },
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
                            <div className="relative flex-grow">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-10">
                    {/* About Us */}
                    <div className="lg:col-span-3">
                        <h3 className="text-white font-serif text-base font-bold mb-4 uppercase tracking-wider relative inline-block">
                            {content.about.title}
                            <span className="absolute -bottom-2 left-0 w-12 h-px bg-[#b87717] border-b border-dashed border-[#b87717]"></span>
                        </h3>
                        <p className="text-xs leading-relaxed mb-4 italic text-white/80">
                            {content.about.description}
                        </p>
                        <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-4 hover:bg-white transition-all duration-500 group/contact shadow-lg">
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
                            <span className="absolute -bottom-2 left-0 w-12 h-px bg-[#b87717] border-b border-dashed border-[#b87717]"></span>
                        </h3>
                        <ul className="space-y-2">
                            {content.links.blog.items.map((item: any, i: number) => (
                                <li key={i}>
                                    <Link href={item.href} className="text-xs text-white/70 hover:text-white transition-colors flex items-center gap-2 group italic">
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
                            <span className="absolute -bottom-2 left-0 w-12 h-px bg-[#b87717] border-b border-dashed border-[#b87717]"></span>
                        </h3>
                        <ul className="space-y-2">
                            {content.links.policy.items.map((item: any, i: number) => (
                                <li key={i}>
                                    <Link href={item.href} className="text-xs text-white/70 hover:text-white transition-colors flex items-center gap-2 group italic">
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
                            <span className="absolute -bottom-2 left-0 w-12 h-px bg-[#b87717] border-b border-dashed border-[#b87717]"></span>
                        </h3>
                        <ul className="space-y-2 mb-6">
                            {content.links.products.items.map((item: any, i: number) => (
                                <li key={i}>
                                    <Link href={item.href} className="text-xs text-white/70 hover:text-white transition-colors flex items-center gap-2 group italic line-clamp-1">
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
                            <div className="p-2 bg-white/10 rounded-lg border border-white/10 hover:bg-white transition-all duration-500 group/partner max-w-[180px]">
                                <Image
                                    src="/images/footer/transport-partner.png"
                                    alt="Transport Partners"
                                    width={180}
                                    height={40}
                                    className="w-full h-auto object-contain opacity-90 group-hover/partner:opacity-100 transition-opacity"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment & App */}
                    <div className="lg:col-span-2">
                        <h3 className="text-white font-serif text-base font-bold mb-4 uppercase tracking-wider relative inline-block">
                            {content.partners.payment}
                            <span className="absolute -bottom-2 left-0 w-12 h-px bg-[#b87717] border-b border-dashed border-[#b87717]"></span>
                        </h3>
                        <div className="space-y-4">
                            <div className="p-2 bg-white/10 rounded-lg border border-white/10 space-y-2 hover:bg-white transition-all duration-500 group/payment">
                                <Image
                                    src="/images/footer/payment.png"
                                    alt="Payment Methods"
                                    width={150}
                                    height={40}
                                    className="w-full h-auto object-contain opacity-90 group-hover/payment:opacity-100 transition-opacity"
                                />
                                <Image
                                    src="/images/footer/62a382de6209494ec2b17086.webp"
                                    alt="Stripe"
                                    width={120}
                                    height={30}
                                    className="w-3/4 mx-auto h-auto object-contain opacity-90 group-hover/payment:opacity-100 transition-opacity"
                                />
                            </div>

                            <Link href="https://play.google.com/store/apps/details?id=com.moroccanorganica.argan.oil" target="_blank" className="block transform hover:scale-105 transition-all">
                                <Image
                                    src="/images/footer/google-play.png"
                                    alt="Get it on Google Play"
                                    width={130}
                                    height={40}
                                    className="w-full h-auto object-contain"
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
                                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#b87717] hover:text-white transition-all duration-300 group"
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
