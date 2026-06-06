"use client";

import { motion } from "framer-motion";
import { 
    Shield, 
    Database, 
    Lock, 
    UserCheck, 
    Cookie, 
    Clock, 
    Mail,
    Globe
} from "lucide-react";
import InnerHero from "@/components/common/InnerHero";
import CertificationSlider from "@/components/common/CertificationSlider";

interface PrivacyPolicyClientProps {
    lang: string;
}

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

const sectionIcons = [
    Shield,     // Intro
    Database,   // Information We Collect
    Lock,       // How We Use
    UserCheck,  // Payments
    Globe,      // Sharing
    Cookie,     // Cookies
    Clock,      // Retention
    Mail        // Contact / Your Rights
];

export default function PrivacyPolicyClient({ lang }: PrivacyPolicyClientProps) {
    const isAr = lang === 'ar';
    const isFr = lang === 'fr';

    const content = {
        en: {
            heroTitle: "Privacy Policy",
            heroDesc: "Your privacy matters to us",
            breadcrumbCurrent: "Privacy Policy",
            
            intro: "At Moroccan Organica, accessible at moroccanorganica.com, we respect your privacy and protect your personal information.",

            sections: [
                {
                    title: "Information We Collect",
                    body: "We may collect your name, company name, email address, phone number, billing address, shipping address, and order details when you contact us, request a quote, or place an order."
                },
                {
                    title: "How We Use Your Information",
                    body: "We use this information only to:",
                    bullets: [
                        "Respond to your requests",
                        "Prepare quotations and invoices",
                        "Process and deliver your orders",
                        "Provide customer support",
                        "Improve our services",
                        "Comply with legal and accounting obligations"
                    ]
                },
                {
                    title: "Payments",
                    body: "Payments are made by bank wire transfer. We do not collect or store credit card information on our website."
                },
                {
                    title: "Sharing Your Information",
                    body: "We do not sell, rent, or trade your personal information. We may share necessary information only with trusted service providers, such as shipping companies, accounting services, IT providers, or legal authorities when required by law."
                },
                {
                    title: "Cookies",
                    body: "Our website may use cookies to improve browsing, analyze website traffic, and remember user preferences. You can disable cookies in your browser settings."
                },
                {
                    title: "Data Retention",
                    body: "We keep your personal information only as long as necessary for business, legal, tax, and accounting purposes."
                },
                {
                    title: "Your Rights",
                    body: "You may contact us at any time to access, correct, or request deletion of your personal information."
                }
            ],

            contactTitle: "For privacy questions, contact us at:",
            contactEmail: "contact@moroccanorganica.com",
            contactWebsite: "moroccanorganica.com",
            updateNote: "This policy may be updated from time to time."
        },
        fr: {
            heroTitle: "Politique de confidentialité",
            heroDesc: "Votre vie privée nous tient à cœur",
            breadcrumbCurrent: "Politique de confidentialité",

            intro: "Chez Moroccan Organica, accessible à moroccanorganica.com, nous respectons votre vie privée et protégeons vos informations personnelles.",

            sections: [
                {
                    title: "Informations que nous collectons",
                    body: "Nous pouvons collecter votre nom, le nom de votre entreprise, votre adresse e-mail, votre numéro de téléphone, votre adresse de facturation, votre adresse de livraison et les détails de votre commande lorsque vous nous contactez, demandez un devis ou passez une commande."
                },
                {
                    title: "Comment nous utilisons vos informations",
                    body: "Nous utilisons ces informations uniquement pour :",
                    bullets: [
                        "Répondre à vos demandes",
                        "Préparer les devis et les factures",
                        "Traiter et livrer vos commandes",
                        "Fournir un support client",
                        "Améliorer nos services",
                        "Respecter les obligations légales et comptables"
                    ]
                },
                {
                    title: "Paiements",
                    body: "Les paiements sont effectués par virement bancaire. Nous ne collectons ni ne stockons les informations de carte de crédit sur notre site web."
                },
                {
                    title: "Partage de vos informations",
                    body: "Nous ne vendons, ne louons et n'échangeons pas vos informations personnelles. Nous pouvons partager les informations nécessaires uniquement avec des prestataires de confiance, tels que les sociétés de transport, les services comptables, les fournisseurs informatiques ou les autorités légales lorsque la loi l'exige."
                },
                {
                    title: "Cookies",
                    body: "Notre site web peut utiliser des cookies pour améliorer la navigation, analyser le trafic du site et mémoriser les préférences des utilisateurs. Vous pouvez désactiver les cookies dans les paramètres de votre navigateur."
                },
                {
                    title: "Conservation des données",
                    body: "Nous conservons vos informations personnelles uniquement aussi longtemps que nécessaire à des fins commerciales, légales, fiscales et comptables."
                },
                {
                    title: "Vos droits",
                    body: "Vous pouvez nous contacter à tout moment pour accéder à vos informations personnelles, les corriger ou en demander la suppression."
                }
            ],

            contactTitle: "Pour toute question relative à la confidentialité, contactez-nous à :",
            contactEmail: "contact@moroccanorganica.com",
            contactWebsite: "moroccanorganica.com",
            updateNote: "Cette politique peut être mise à jour de temps à autre."
        },
        ar: {
            heroTitle: "سياسة الخصوصية",
            heroDesc: "خصوصيتكم تهمنا",
            breadcrumbCurrent: "سياسة الخصوصية",

            intro: "في Moroccan Organica، المتاح على moroccanorganica.com، نحترم خصوصيتك ونحمي معلوماتك الشخصية.",

            sections: [
                {
                    title: "المعلومات التي نجمعها",
                    body: "قد نجمع اسمك، واسم شركتك، وعنوان بريدك الإلكتروني، ورقم هاتفك، وعنوان الفوترة، وعنوان الشحن، وتفاصيل الطلب عند الاتصال بنا أو طلب عرض أسعار أو تقديم طلب شراء."
                },
                {
                    title: "كيف نستخدم معلوماتك",
                    body: "نستخدم هذه المعلومات فقط من أجل:",
                    bullets: [
                        "الرد على طلباتك",
                        "إعداد عروض الأسعار والفواتير",
                        "معالجة وتسليم طلباتك",
                        "تقديم الدعم للعملاء",
                        "تحسين خدماتنا",
                        "الامتثال للالتزامات القانونية والمحاسبية"
                    ]
                },
                {
                    title: "المدفوعات",
                    body: "تتم المدفوعات عن طريق التحويل البنكي. نحن لا نجمع أو نخزن معلومات بطاقات الائتمان على موقعنا الإلكتروني."
                },
                {
                    title: "مشاركة معلوماتك",
                    body: "نحن لا نبيع أو نؤجر أو نتبادل معلوماتك الشخصية. قد نشارك المعلومات الضرورية فقط مع مقدمي خدمات موثوقين، مثل شركات الشحن، وخدمات المحاسبة، ومقدمي خدمات تكنولوجيا المعلومات، أو السلطات القانونية عند الطلب بموجب القانون."
                },
                {
                    title: "ملفات تعريف الارتباط (Cookies)",
                    body: "قد يستخدم موقعنا ملفات تعريف الارتباط لتحسين التصفح وتحليل حركة المرور على الموقع وتذكر تفضيلات المستخدم. يمكنك تعطيل ملفات تعريف الارتباط في إعدادات المتصفح الخاص بك."
                },
                {
                    title: "الاحتفاظ بالبيانات",
                    body: "نحتفظ بمعلوماتك الشخصية فقط طالما كان ذلك ضرورياً لأغراض تجارية وقانونية وضريبية ومحاسبية."
                },
                {
                    title: "حقوقك",
                    body: "يمكنك الاتصال بنا في أي وقت للوصول إلى معلوماتك الشخصية أو تصحيحها أو طلب حذفها."
                }
            ],

            contactTitle: "لأي استفسار يتعلق بالخصوصية، تواصل معنا على:",
            contactEmail: "contact@moroccanorganica.com",
            contactWebsite: "moroccanorganica.com",
            updateNote: "قد يتم تحديث هذه السياسة من وقت لآخر."
        }
    };

    const t = content[lang as keyof typeof content] || content.en;
    const homeLabel = isAr ? "الصفحة الرئيسية" : isFr ? "Accueil" : "Home";
    const organicaLabel = isAr ? "أورغانيكا" : "Organica";

    // Map sections to icons (skip first icon which is for intro)
    const getSectionIcon = (idx: number) => sectionIcons[idx + 1] || Shield;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <InnerHero
                title={t.heroTitle}
                description={t.heroDesc}
                backgroundImage="/images/slider/hero-authentic-argan-oil.webp"
                breadcrumbs={[
                    { label: homeLabel, href: `/${lang}` },
                    { label: organicaLabel, href: `/${lang}/organica` },
                    { label: t.breadcrumbCurrent },
                ]}
            />

            <section className="py-16 md:py-24" dir={isAr ? "rtl" : "ltr"}>
                <div className="container-main max-w-4xl mx-auto px-4 space-y-12">

                    {/* Intro Card */}
                    <motion.div
                        className="bg-card border border-border/60 rounded-3xl p-8 md:p-10 shadow-sm flex items-start gap-5 relative overflow-hidden"
                        {...fadeInUp}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground">
                                {t.heroTitle}
                            </h2>
                            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                                {t.intro}
                            </p>
                        </div>
                    </motion.div>

                    {/* Policy Sections */}
                    <div className="space-y-6">
                        {t.sections.map((section, idx) => {
                            const Icon = getSectionIcon(idx);
                            return (
                                <motion.div
                                    key={idx}
                                    className="bg-card border border-border/50 hover:border-primary/20 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 group"
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-3 flex-1">
                                            <h3 className="font-serif text-lg md:text-xl font-bold text-foreground">
                                                {section.title}
                                            </h3>
                                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                                {section.body}
                                            </p>
                                            {section.bullets && (
                                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                                                    {section.bullets.map((bullet, bIdx) => (
                                                        <li key={bIdx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                                            <span>{bullet}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Contact & Update Note */}
                    <motion.div
                        className="bg-secondary text-secondary-foreground rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden border border-border/10"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div
                            className="absolute inset-0 opacity-5 pointer-events-none"
                            style={{
                                backgroundImage: 'url(/images/footer/footer-map-bg.png)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />
                        <div className="relative z-10 text-center space-y-5 max-w-lg mx-auto">
                            <h3 className="font-serif text-xl md:text-2xl font-bold text-white">
                                {t.contactTitle}
                            </h3>
                            <div className="space-y-2">
                                <p className="text-gray-300 text-sm md:text-base">
                                    {isAr ? "البريد الإلكتروني" : "Email"}: <a href={`mailto:${t.contactEmail}`} className="text-white font-semibold underline underline-offset-2 hover:text-primary transition-colors">{t.contactEmail}</a>
                                </p>
                                <p className="text-gray-300 text-sm md:text-base">
                                    {isAr ? "الموقع" : isFr ? "Site web" : "Website"}: <a href="https://moroccanorganica.com" target="_blank" rel="noopener noreferrer" className="text-white font-semibold underline underline-offset-2 hover:text-primary transition-colors">{t.contactWebsite}</a>
                                </p>
                            </div>
                            <p className="text-xs text-gray-400 italic pt-4 border-t border-white/10">
                                {t.updateNote}
                            </p>
                        </div>
                    </motion.div>

                </div>
            </section>

            <CertificationSlider />
        </div>
    );
}
