import { Mail, Phone, MapPin, Facebook, Linkedin, Instagram } from "lucide-react";

const Footer = ({ dict }: { dict: any }) => {
    const content = dict.footer;
    const nav = dict.nav;

    const quickLinks = [
        { name: nav.home, href: "/" },
        { name: nav.about, href: "#about" },
        { name: nav.products, href: "#products" },
        { name: nav.contact, href: "#contact" },
    ];

    return (
        <footer className="bg-secondary text-secondary-foreground">
            {/* Certification Logos */}
            <div className="border-b border-secondary-foreground/10">
                <div className="container-main py-8">
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                        <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 rounded-full bg-secondary-foreground/10 flex items-center justify-center">
                                <span className="text-xs font-bold">USDA</span>
                            </div>
                            <span className="text-sm">Organic</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 rounded-full bg-secondary-foreground/10 flex items-center justify-center">
                                <span className="text-xs font-bold">ISO</span>
                            </div>
                            <span className="text-sm">9001:2015</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 rounded-full bg-secondary-foreground/10 flex items-center justify-center">
                                <span className="text-xs font-bold">ECO</span>
                            </div>
                            <span className="text-sm">CERT</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="container-main py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8">
                    {/* About Column */}
                    <div>
                        <h3 className="font-serif text-xl font-semibold mb-4">
                            {content.about.title}
                        </h3>
                        <p className="text-secondary-foreground/70 text-sm leading-relaxed mb-6">
                            {content.about.desc}
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-serif text-lg font-semibold mb-6">{content.links}</h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-serif text-lg font-semibold mb-6">{content.contact.title}</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-secondary-foreground/70 text-sm">
                                    {content.contact.location}
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                                <a href="tel:+212522000000" className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">
                                    +212 522 000 000
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                                <a href="mailto:export@moroccanorganica.com" className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">
                                    export@moroccanorganica.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-secondary-foreground/10">
                <div className="container-main py-6">
                    <p className="text-secondary-foreground/60 text-sm text-center">
                        {content.copyright}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
