"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    MessageSquare, 
    FileText, 
    Palette, 
    CreditCard, 
    Factory, 
    Camera, 
    Truck, 
    Check, 
    ChevronDown, 
    Sparkles, 
    ShieldCheck, 
    Package, 
    Globe, 
    ArrowRight
} from "lucide-react";
import InnerHero from "@/components/common/InnerHero";
import CertificationSlider from "@/components/common/CertificationSlider";
import Link from "next/link";

interface HowToOrderPayClientProps {
    lang: string;
}

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

const stepIcons = [
    MessageSquare, // Step 1: Tell Us What You Need
    FileText,      // Step 2: We Confirm
    Palette,       // Step 3: Label Design
    CreditCard,    // Step 4: Payment Confirmation
    Factory,       // Step 5: Production
    Camera,        // Step 6: Photo Before Shipping
    Truck          // Step 7: Shipping & Delivery
];

const whyIcons = [
    Sparkles,
    ShieldCheck,
    Palette,
    Camera,
    Package,
    Globe
];

export default function HowToOrderPayClient({ lang }: HowToOrderPayClientProps) {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const isAr = lang === 'ar';
    const isFr = lang === 'fr';

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const content = {
        en: {
            heroTitle: "How to Order & Pay",
            heroDesc: "Private Label Moroccan Beauty Products, Made Simple",
            breadcrumbCurrent: "How to Order & Pay",
            
            // Intro
            introTitle: "Private Label Moroccan Beauty Products, Made Simple",
            introP1: "Ordering from Organica Group is designed to be clear, professional, and stress-free.",
            introP2: "Whether you are launching your first skincare brand, expanding your beauty line, or sourcing Moroccan cosmetic products in bulk, our process helps you move from idea to ready-for-sale products with confidence.",
            introP3: "We work with beauty brands, spas, wholesalers, distributors, Amazon sellers, Shopify stores, concept stores, and private label companies looking for authentic Moroccan products such as argan oil, prickly pear seed oil, black soap, ghassoul clay, rose water, orange blossom water, henna, aker fassi, blue nila, and other natural Moroccan beauty essentials.",
            introP4: "Our process is simple: you choose the product, we prepare your private label order, and before shipping, we send you a real photo of your finished product so you can see exactly what is leaving our facility.",

            // Quick Stats
            statsTitle: "Our Promise",
            statsItems: [
                { label: "Steps to Market", val: "7" },
                { label: "Quality Checks", val: "100%" },
                { label: "Label Design Support", val: "Free" },
                { label: "Photo Verification", val: "Pre-Ship" }
            ],

            // Steps
            stepsTitle: "Our Step-by-Step Process",
            stepsSubtitle: "From initial request to global delivery, we guide you through every stage",
            steps: [
                {
                    number: "01",
                    title: "Step 1: Tell Us What You Need",
                    desc: "Start by sending us your request. You do not need to have everything ready from day one. Many of our clients come to us with only a product idea, and we help them structure the order step by step.",
                    bulletsTitle: "You can contact us with:",
                    bullets: [
                        "The product or products you want",
                        "The quantity you need",
                        "Your target market",
                        "Your preferred packaging style",
                        "Your label or brand name",
                        "Any specific formula, certification, or export requirement"
                    ],
                    extra: "If you already have your label design, you can send it to us. If you do not have a designer, Organica Group can create a clean and professional label design for you free of charge. This is one of the things that makes our service different. We do not just supply products; we help your brand look ready for the market."
                },
                {
                    number: "02",
                    title: "Step 2: We Confirm Product, Quantity, Packaging, and Price",
                    desc: "After receiving your request, our team reviews the details and prepares a clear quotation. We make sure everything is confirmed before production starts. This avoids confusion and helps you plan your launch, stock, or wholesale order properly.",
                    bulletsTitle: "Your quotation may include:",
                    bullets: [
                        "Product name & product type",
                        "Packaging option & quantity",
                        "Private label service details",
                        "Estimated production time",
                        "Shipping options & payment terms",
                        "Total price"
                    ],
                    extra: "For private label orders, we can help you choose between different packaging formats depending on the product, such as bottles, jars, pouches, tubes, or bulk containers."
                },
                {
                    number: "03",
                    title: "Step 3: Label Design and Approval",
                    desc: "Your label is a key part of your brand identity. Before printing, we send you the label design for approval. Production only continues after you confirm the final label.",
                    bulletsTitle: "Our label design support can include:",
                    bullets: [
                        "Front label layout & product name placement",
                        "Ingredient & brand name placement",
                        "Basic visual identity adaptation",
                        "Packaging-size adjustment",
                        "Print-ready label preparation"
                    ],
                    extra: "If you already have a finished label file, our team checks it before printing to make sure it fits the selected packaging. If you do not have a designer, we can create a simple, professional label design for your product free of charge."
                },
                {
                    number: "04",
                    title: "Step 4: Payment Confirmation",
                    desc: "Once all order details are approved, we send you the payment information. After payment is confirmed, your order moves into production.",
                    bulletsTitle: "Payment details:",
                    bullets: [
                        "Payment terms depend on the type and size of the order",
                        "For most orders, payment is required before production or before shipment",
                        "We accept secure payment methods suitable for international B2B orders"
                    ]
                },
                {
                    number: "05",
                    title: "Step 5: Production and Private Label Preparation",
                    desc: "After payment confirmation, we prepare your products according to the approved specifications. Our goal is to deliver products that are clean, professional, and ready to sell. We pay attention not only to the formula but also to the final presentation.",
                    bulletsTitle: "This stage may include:",
                    bullets: [
                        "Product filling & packaging preparation",
                        "Label printing & label application",
                        "Batch preparation & quality checking",
                        "Export packaging & final order inspection"
                    ]
                },
                {
                    number: "06",
                    title: "Step 6: We Send You a Photo Before Shipping",
                    desc: "Before your order leaves our facility, we send you a real photo of the finished product. This allows you to see your product exactly as it is prepared, labelled, packed, and ready for sale.",
                    bulletsTitle: "This step allows you to verify:",
                    bullets: [
                        "The product appearance & label placement",
                        "The packaging style & final presentation",
                        "The ready-for-sale look representing your brand"
                    ],
                    extra: "Many suppliers ship without showing the final result. At Organica Group, we believe you should see your finished product before it is shipped. This is especially important for private label clients, because the final product represents your brand."
                },
                {
                    number: "07",
                    title: "Step 7: Shipping and Delivery",
                    desc: "After final approval, we prepare your order for shipping. Once the shipment is confirmed, we provide the available tracking or shipping details.",
                    bulletsTitle: "Shipping and logistics options:",
                    bullets: [
                        "Shipping arranged based on destination, order size, and preference",
                        "Options include express courier, air freight, or sea freight",
                        "Global delivery to Europe, USA, Canada, Middle East, and other markets"
                    ]
                }
            ],

            // Why Us
            whyTitle: "Why Brands Choose Organica Group",
            whyDesc: "We support brands that want authentic products, professional presentation, and a practical ordering process.",
            whyItems: [
                { title: "Authentic Moroccan products", desc: "Pure argan oil, prickly pear seed oil, black soap, ghassoul clay, and more." },
                { title: "Private label support", desc: "Full brand personalization with custom styling and packaging options." },
                { title: "Free label design", desc: "Complete professional design support from scratch at no extra charge." },
                { title: "Photo approval before shipping", desc: "See the exact real product leaving our facility before shipment." },
                { title: "Flexible packaging options", desc: "Choose from bottles, jars, pouches, tubes, or wholesale bulk." },
                { title: "International B2B experience", desc: "Proven logistics experience shipping to Europe, USA, Canada, and Middle East." }
            ],

            // Products
            productsTitle: "Moroccan Beauty Products You Can Order",
            productsDesc: "Select from our range of authentic natural ingredients and finished cosmetic formulations",
            productsList: [
                "Moroccan Argan Oil", "Prickly Pear Seed Oil", "Moroccan Black Soap", "Ghassoul Clay",
                "Rose Water", "Orange Blossom Water", "Henna Powder", "Blue Nila Powder",
                "Aker Fassi", "Sidr Powder", "Natural Soaps", "Essential Oils",
                "Carrier Oils", "Hammam & Spa Products", "Bulk Cosmetic Ingredients", "Private Label Skincare"
            ],
            productsFooter: "If you are building a full Moroccan beauty line, we can help you select complementary products for your brand.",

            // Order types
            orderTypesTitle: "Choose Your Order Format",
            orderTypesSubtitle: "We accommodate both custom-branded retail lines and raw bulk cosmetic supply",
            
            plTitle: "Private Label Orders",
            plDesc: "Ideal if you want to sell Moroccan beauty products under your own brand name. Choose the product, packaging, label style, and quantity according to your business needs.",
            plBulletsTitle: "Perfect for:",
            plBullets: [
                "Skincare & haircare brands",
                "Spa, hammam & hotel wellness brands",
                "E-commerce, Shopify, Amazon, and TikTok Shop sellers",
                "Wholesale distributors and concept stores"
            ],
            plFooter: "You can start with a simple product line or develop a more complete collection over time.",

            bulkTitle: "Bulk & Wholesale Orders",
            bulkDesc: "If you do not need private label packaging, we also supply Moroccan cosmetic products in bulk and wholesale formats.",
            bulkBulletsTitle: "Perfect for:",
            bulkBullets: [
                "Manufacturers & cosmetic laboratories",
                "Formulators & ingredient distributors",
                "Resellers needing finished products in larger quantities"
            ],
            bulkFooter: "Tell us your target quantity and destination, and we will recommend the most suitable format.",

            // CTA
            ctaTitle: "Ready to Start Your Order?",
            ctaDesc: "Send us your product list, quantity, and packaging preference. If you have your brand label, send it over. If not, our team can help you create one free of charge.",
            ctaBtn: "Contact Us to Start",

            // FAQ
            faqTitle: "Frequently Asked Questions",
            faqItems: [
                { q: "How do I place an order with Organica Group?", a: "You can place an order by contacting us with the product name, quantity, packaging preference, and destination country. Our team will review your request and send you a quotation with the next steps." },
                { q: "Can I order private label Moroccan beauty products?", a: "Yes. Organica Group offers private label services for Moroccan beauty products, including oils, powders, soaps, floral waters, clay, and hammam products." },
                { q: "Do I need to have my own label design?", a: "No. If you do not have a designer, Organica Group can create a professional label design for your product free of charge." },
                { q: "Will I see the finished product before shipping?", a: "Yes. Before shipping, we send you a real photo of your finished product so you can see the label, packaging, and final ready-for-sale appearance." },
                { q: "What products can I order?", a: "You can order Moroccan argan oil, prickly pear seed oil, black soap, ghassoul clay, rose water, orange blossom water, henna, blue nila, aker fassi, sidr powder, natural soaps, essential oils, and other Moroccan cosmetic products." },
                { q: "Do you accept small private label orders?", a: "Yes, depending on the product and packaging type. Contact us with your product idea and quantity, and we will confirm the available options." },
                { q: "Do you ship internationally?", a: "Yes. Organica Group works with international B2B clients and can arrange shipping depending on the destination, order size, and logistics requirements." },
                { q: "How long does production take?", a: "Production time depends on the product, quantity, packaging, and label requirements. We confirm the estimated production time in your quotation before starting the order." },
                { q: "Can you help me choose products for my brand?", a: "Yes. If you are not sure which products to start with, we can recommend best-selling Moroccan beauty products based on your target market and business model." },
                { q: "Do you supply bulk cosmetic ingredients?", a: "Yes. Organica Group supplies selected Moroccan cosmetic ingredients in bulk for manufacturers, brands, laboratories, and professional buyers." }
            ]
        },
        fr: {
            heroTitle: "Comment commander et payer",
            heroDesc: "Produits de beauté marocains en marque privée, en toute simplicité",
            breadcrumbCurrent: "Comment commander et payer",

            // Intro
            introTitle: "Produits cosmétiques marocains en marque privée, en toute simplicité",
            introP1: "Commander chez Organica Group est conçu pour être clair, professionnel et sans stress.",
            introP2: "Que vous lanciez votre première marque de soins de la peau, élargissiez votre gamme de produits de beauté ou achetiez des produits cosmétiques marocains en vrac, notre processus vous aide à passer de l'idée aux produits prêts à la vente en toute confiance.",
            introP3: "Nous travaillons avec des marques de beauté, des spas, des grossistes, des distributeurs, des vendeurs Amazon, des boutiques Shopify, des concept stores et des entreprises de marque privée à la recherche de produits marocains authentiques tels que l'huile d'argan, l'huile de pépins de figue de barbarie, le savon noir, l'argile ghassoul, l'eau de rose, l'eau de fleur d'oranger, le henné, l'aker fassi, le nila bleu et d'autres essentiels de beauté marocains naturels.",
            introP4: "Notre processus est simple : vous choisissez le produit, nous préparons votre commande en marque privée et, avant l'expédition, nous vous envoyons une vraie photo de votre produit fini afin que vous puissiez voir exactement ce qui sort de notre établissement.",

            // Quick Stats
            statsTitle: "Notre Promesse",
            statsItems: [
                { label: "Étapes vers le Marché", val: "7" },
                { label: "Contrôles Qualité", val: "100%" },
                { label: "Design d'Étiquette", val: "Gratuit" },
                { label: "Validation Photo", val: "Avant Envoi" }
            ],

            // Steps
            stepsTitle: "Notre processus étape par étape",
            stepsSubtitle: "De la demande initiale à la livraison mondiale, nous vous accompagnons à chaque étape",
            steps: [
                {
                    number: "01",
                    title: "Étape 1 : Dites-nous ce dont vous avez besoin",
                    desc: "Commencez par nous envoyer votre demande. Vous n'avez pas besoin de tout avoir de prêt dès le premier jour. Beaucoup de nos clients viennent à nous avec seulement une idée de produit, et nous les aidons à structurer la commande étape par étape.",
                    bulletsTitle: "Vous pouvez nous contacter avec :",
                    bullets: [
                        "Le produit ou les produits que vous souhaitez",
                        "La quantité dont vous avez besoin",
                        "Votre marché cible",
                        "Votre style d'emballage préféré",
                        "Votre étiquette ou nom de marque",
                        "Toute formule, certification ou exigence d'exportation spécifique"
                    ],
                    extra: "Si vous avez déjà le design de votre étiquette, vous pouvez nous l'envoyer. Si vous n'avez pas de designer, Organica Group peut concevoir gratuitement pour vous une étiquette propre et professionnelle. C'est l'une des choses qui différencie notre service. Nous ne nous contentons pas de fournir des produits ; nous aidons votre marque à être prête pour le marché."
                },
                {
                    number: "02",
                    title: "Étape 2 : Nous confirmons le produit, la quantité, l'emballage et le prix",
                    desc: "Après réception de votre demande, notre équipe examine les détails et prépare un devis clair. Nous nous assurons que tout est confirmé avant le début de la production. Cela évite les confusions et vous aide à planifier correctement votre lancement, votre stock ou votre commande en gros.",
                    bulletsTitle: "Votre devis peut inclure :",
                    bullets: [
                        "Nom du produit et type de produit",
                        "Option d'emballage et quantité",
                        "Détails du service de marque privée",
                        "Délai de production estimé",
                        "Options d'expédition et conditions de paiement",
                        "Prix total"
                    ],
                    extra: "Pour les commandes de marque privée, nous pouvons vous aider à choisir entre différents formats d'emballage selon le produit, tels que des flacons, des pots, des sachets, des tubes ou des contenants en vrac."
                },
                {
                    number: "03",
                    title: "Étape 3 : Conception de l'étiquette et approbation",
                    desc: "Votre étiquette est un élément clé de l'identité de votre marque. Avant l'impression, nous vous envoyons la maquette pour approbation. La production ne se poursuit qu'après votre confirmation de l'étiquette finale.",
                    bulletsTitle: "Notre assistance à la conception d'étiquettes comprend :",
                    bullets: [
                        "Mise en page de l'étiquette avant et placement du nom du produit",
                        "Placement de la liste des ingrédients et du nom de la marque",
                        "Adaptation de base à l'identité visuelle",
                        "Ajustement à la taille de l'emballage",
                        "Préparation du fichier prêt pour l'impression"
                    ],
                    extra: "Si vous possédez déjà un fichier d'étiquette finalisé, notre équipe le vérifie avant l'impression pour s'assurer qu'il s'adapte à l'emballage sélectionné. Si vous n'avez pas de designer, nous pouvons concevoir gratuitement pour vous une étiquette simple et professionnelle."
                },
                {
                    number: "04",
                    title: "Étape 4 : Confirmation du paiement",
                    desc: "Une fois tous les détails de la commande approuvés, nous vous envoyons les informations de paiement. Une fois le paiement confirmé, votre commande passe en production.",
                    bulletsTitle: "Détails de paiement :",
                    bullets: [
                        "Les conditions de paiement dépendent du type et de la taille de la commande",
                        "Pour la plupart des commandes, le paiement est requis avant la production ou avant l'expédition",
                        "Nous acceptons des modes de paiement sécurisés adaptés aux transactions B2B internationales"
                    ]
                },
                {
                    number: "05",
                    title: "Étape 5 : Production et préparation de la marque privée",
                    desc: "Après la confirmation du paiement, nous préparons vos produits selon les spécifications approuvées. Notre objectif est de livrer des produits propres, professionnels et prêts à être vendus. Nous accordons une attention particulière non seulement à la formule mais aussi à la présentation finale.",
                    bulletsTitle: "Cette étape peut inclure :",
                    bullets: [
                        "Remplissage du produit et préparation des emballages",
                        "Impression et application des étiquettes",
                        "Préparation des lots et contrôle de qualité",
                        "Emballage pour l'exportation et inspection finale"
                    ]
                },
                {
                    number: "06",
                    title: "Étape 6 : Nous vous envoyons une photo avant l'expédition",
                    desc: "Avant que votre commande ne quitte notre établissement, nous vous envoyons une vraie photo du produit fini. Cela vous permet de voir votre produit exactement tel qu'il est préparé, étiqueté, emballé et prêt à la vente.",
                    bulletsTitle: "Cette étape vous permet de vérifier :",
                    bullets: [
                        "L'aspect du produit et le placement de l'étiquette",
                        "Le style d'emballage et la présentation finale",
                        "L'aspect prêt pour la vente représentant votre marque"
                    ],
                    extra: "De nombreux fournisseurs expédient sans montrer le résultat final. Chez Organica Group, nous pensons que vous devez voir votre produit fini avant qu'il ne soit expédié. Ceci est particulièrement important pour les clients en marque privée, car le produit fini représente votre marque."
                },
                {
                    number: "07",
                    title: "Étape 7 : Expédition et livraison",
                    desc: "Après approbation finale, nous préparons votre commande pour l'expédition. Une fois l'expédition confirmée, nous vous fournissons les détails de suivi ou d'expédition disponibles.",
                    bulletsTitle: "Options d'expédition et logistique :",
                    bullets: [
                        "Expédition organisée en fonction de la destination, de la taille et des préférences",
                        "Options comprenant le transport express par coursier, le fret aérien ou maritime",
                        "Livraison mondiale en Europe, aux États-Unis, au Canada, au Moyen-Orient, etc."
                    ]
                }
            ],

            // Why Us
            whyTitle: "Pourquoi les marques choisissent Organica Group",
            whyDesc: "Nous soutenons les marques qui recherchent des produits authentiques, une présentation professionnelle et un processus de commande pratique.",
            whyItems: [
                { title: "Produits marocains authentiques", desc: "Huile d'argan pure, huile de pépins de figue de barbarie, savon noir, argile ghassoul, etc." },
                { title: "Support pour marque privée", desc: "Personnalisation complète de la marque avec des styles et emballages sur mesure." },
                { title: "Design d'étiquette gratuit", desc: "Assistance complète de conception professionnelle à partir de zéro, sans frais supplémentaires." },
                { title: "Photo avant expédition", desc: "Visualisez le produit fini exact qui quitte nos locaux avant son expédition." },
                { title: "Emballages flexibles", desc: "Flacons, pots, sachets, tubes ou approvisionnement en vrac pour grossistes." },
                { title: "Expérience internationale", desc: "Logistique éprouvée et livraisons régulières en Europe, USA, Canada et Moyen-Orient." }
            ],

            // Products
            productsTitle: "Produits de beauté marocains que vous pouvez commander",
            productsDesc: "Faites votre choix parmi notre gamme d'ingrédients naturels et de formulations cosmétiques finies",
            productsList: [
                "Huile d'argan du Maroc", "Huile de pépins de figue de barbarie", "Savon noir marocain", "Argile ghassoul",
                "Eau de rose", "Eau de fleur d'oranger", "Poudre de henné", "Poudre de nila bleu",
                "Aker fassi", "Poudre de sidr", "Savons naturels", "Huiles essentielles",
                "Huiles végétales supports", "Produits de hammam & spa", "Ingrédients cosmétiques en vrac", "Soin de la peau en marque privée"
            ],
            productsFooter: "Si vous créez une gamme complète de produits de beauté marocains, nous pouvons vous aider à sélectionner des produits complémentaires pour votre marque.",

            // Order types
            orderTypesTitle: "Choisissez votre format de commande",
            orderTypesSubtitle: "Nous répondons aussi bien aux besoins de marques de détail sur mesure qu'à l'approvisionnement en matières premières",

            plTitle: "Commandes en marque privée",
            plDesc: "Idéal si vous souhaitez vendre des produits sous votre propre marque. Choisissez le produit, l'emballage, le style d'étiquette et la quantité en fonction de vos besoins.",
            plBulletsTitle: "Parfait pour :",
            plBullets: [
                "Marques de soins capillaires et de la peau",
                "Centres de bien-être, spas, hammams et hôtels",
                "Vendeurs e-commerce, Shopify, Amazon et TikTok Shop",
                "Distributeurs en gros et concept stores"
            ],
            plFooter: "Vous pouvez commencer avec une gamme de produits simple ou développer une collection complète au fil du temps.",

            bulkTitle: "Commandes en gros et en vrac",
            bulkDesc: "Si vous n'avez pas besoin d'emballage en marque privée, nous fournissons également nos produits cosmétiques marocains en vrac.",
            bulkBulletsTitle: "Parfait pour :",
            bulkBullets: [
                "Fabricants et laboratoires de cosmétiques",
                "Formulateurs et distributeurs d'ingrédients",
                "Revendeurs ayant besoin de produits finis en grandes quantités"
            ],
            bulkFooter: "Dites-nous votre quantité cible et votre destination, et nous vous recommanderons le format le plus adapté.",

            // CTA
            ctaTitle: "Prêt à commencer votre commande ?",
            ctaDesc: "Envoyez-nous votre liste de produits, la quantité et vos préférences d'emballage. Si vous possédez votre étiquette, partagez-la. Sinon, notre équipe peut vous aider à en concevoir une gratuitement.",
            ctaBtn: "Contactez-nous pour commencer",

            // FAQ
            faqTitle: "Questions fréquemment posées",
            faqItems: [
                { q: "Comment puis-je passer commande auprès d'Organica Group ?", a: "Vous pouvez passer commande en nous contactant avec le nom du produit, la quantité, vos préférences d'emballage et le pays de destination. Notre équipe étudiera votre demande et vous enverra un devis détaillant les étapes suivantes." },
                { q: "Puis-je commander des produits cosmétiques marocains en marque privée ?", a: "Oui. Organica Group propose des services de marque privée pour les produits de beauté marocains, notamment les huiles, poudres, savons, eaux florales, argiles et produits de hammam." },
                { q: "Dois-je disposer de mon propre design d'étiquette ?", a: "Non. Si vous n'avez pas de designer, Organica Group peut créer gratuitement un design de qualité professionnelle pour votre produit." },
                { q: "Verrai-je le produit fini avant l'expédition ?", a: "Oui. Avant l'expédition, nous vous envoyons une photo réelle de votre produit fini afin de valider l'étiquette, l'emballage et la présentation finale." },
                { q: "Quels produits puis-je commander ?", a: "Vous pouvez commander de l'huile d'argan, de l'huile de pépins de figue de barbarie, du savon noir, de l'argile ghassoul, de l'eau de rose, de l'eau de fleur d'oranger, du henné, de la nila bleue, de l'aker fassi, de la poudre de sidr, des savons naturels, des huiles essentielles, etc." },
                { q: "Acceptez-vous les petites commandes en marque privée ?", a: "Oui, selon le type de produit et de conditionnement. Contactez-nous avec votre idée de produit et la quantité souhaitée, et nous vous confirmerons les options disponibles." },
                { q: "Expédiez-vous à l'international ?", a: "Oui. Organica Group collabore avec des clients B2B du monde entier et organise l'expédition selon la destination, le volume de commande et vos exigences logistiques." },
                { q: "Combien de temps prend la production ?", a: "Le délai dépend du produit, de la quantité, de l'emballage et du travail d'étiquetage. Nous vous confirmons le délai estimé sur votre devis avant de lancer la production." },
                { q: "Pouvez-vous m'aider à choisir des produits pour ma marque ?", a: "Oui. Si vous hésitez sur les produits de départ, nous pouvons vous recommander nos meilleures ventes de cosmétiques marocains selon votre marché cible et votre modèle commercial." },
                { q: "Fournissez-vous des ingrédients cosmétiques en vrac ?", a: "Oui. Organica Group fournit des ingrédients cosmétiques marocains sélectionnés en vrac pour les fabricants, marques, laboratoires et acheteurs professionnels." }
            ]
        },
        ar: {
            heroTitle: "كيفية الطلب والدفع",
            heroDesc: "منتجات التجميل المغربية بالماركة الخاصة، بكل سهولة",
            breadcrumbCurrent: "كيفية الطلب والدفع",

            // Intro
            introTitle: "منتجات التجميل المغربية بالماركة الخاصة، بكل سهولة",
            introP1: "تم تصميم عملية الطلب من مجموعة أورجانيكا لتكون واضحة، مهنية وخالية من التوتر.",
            introP2: "سواء كنت تطلق علامتك التجارية الأولى للعناية بالبشرة، أو توسع خط منتجات التجميل الخاص بك، أو تستورد منتجات التجميل المغربية بالجملة، فإن عمليتنا تساعدك على الانتقال من الفكرة إلى منتجات جاهزة للبيع بكل ثقة.",
            introP3: "نحن نعمل مع العلامات التجارية للتجميل، والمنتجعات الصحية (السبا)، وتجار الجملة، والموزعين، وبائعي أمازون، ومتاجر شوبيفاي، والمحلات التجارية المبتكرة (Concept stores)، وشركات الماركات الخاصة التي تبحث عن منتجات مغربية أصلية مثل زيت الأركان، وزيت بذور التين الشوكي، والصابون البلدي، وطين الغاسول، وماء الورد، وماء زهر البرتقال، والحناء، والعكر الفاسي، والنيلة الزرقاء، وغيرها من أساسيات الجمال المغربية الطبيعية.",
            introP4: "عمليتنا بسيطة: تختار المنتج، ونحن نجهز طلب الماركة الخاصة بك، وقبل الشحن، نرسل لك صورة حقيقية لمنتجك النهائي حتى تتمكن من رؤية ما يغادر منشأتنا بالضبط.",

            // Quick Stats
            statsTitle: "وعدنا لكم",
            statsItems: [
                { label: "خطوات حتى السوق", val: "7" },
                { label: "فحص الجودة", val: "100%" },
                { label: "تصميم الملصقات", val: "مجاني" },
                { label: "الموافقة بالصورة", val: "قبل الشحن" }
            ],

            // Steps
            stepsTitle: "عملية الطلب خطوة بخطوة",
            stepsSubtitle: "من الطلب الأول إلى التسليم العالمي، نرافقك في كل مرحلة",
            steps: [
                {
                    number: "01",
                    title: "الخطوة 1: أخبرنا بما تحتاجه",
                    desc: "ابدأ بإرسال طلبك إلينا. لا تحتاج إلى تجهيز كل شيء من اليوم الأول. يأتي إلينا العديد من العملاء بفكرة منتج فقط، ونحن نساعدهم في هيكلة الطلب خطوة بخطوة.",
                    bulletsTitle: "يمكنك الاتصال بنا مع تحديد:",
                    bullets: [
                        "المنتج أو المنتجات التي تريدها",
                        "الكمية التي تحتاجها",
                        "سوقك المستهدف",
                        "نمط التغليف المفضل لديك",
                        "ملصقك أو اسم علامتك التجارية",
                        "أي تركيبة محددة، شهادة، أو متطلبات تصدير خاصة"
                    ],
                    extra: "إذا كان لديك تصميم الملصق الخاص بك بالفعل، يمكنك إرساله إلينا. إذا لم يكن لديك مصمم، يمكن لمجموعة أورجانيكا إنشاء تصميم ملصق نظيف واحترافي لك مجانًا. هذا أحد الأشياء التي تجعل خدمتنا مختلفة. نحن لا نورد المنتجات فقط؛ بل نساعد علامتك التجارية لتبدو جاهزة للسوق."
                },
                {
                    number: "02",
                    title: "الخطوة 2: نؤكد المنتج، الكمية، التعبئة، والسعر",
                    desc: "بعد استلام طلبك، يراجع فريقنا التفاصيل ويعد عرض سعر واضحًا. نتأكد من تأكيد كل شيء قبل بدء الإنتاج. هذا يتجنب الارتباك ويساعدك على التخطيط للإطلاق، المخزون، أو طلب الجملة بشكل صحيح.",
                    bulletsTitle: "قد يشمل عرض السعر الخاص بك:",
                    bullets: [
                        "اسم المنتج ونوع المنتج",
                        "خيارات التعبئة والتغليف والكمية",
                        "تفاصيل خدمة الماركة الخاصة",
                        "الوقت المقدر للإنتاج",
                        "خيارات الشحن وشروط الدفع",
                        "السعر الإجمالي"
                    ],
                    extra: "بالنسبة لطلبات الماركة الخاصة، يمكننا مساعدتك في الاختيار بين أشكال التغليف المختلفة حسب المنتج، مثل الزجاجات، المرطبانات، الأكياس، الأنابيب، أو الحاويات الكبيرة (الجملة)."
                },
                {
                    number: "03",
                    title: "الخطوة 3: تصميم الملصق والموافقة عليه",
                    desc: "الملصق الخاص بك هو جزء أساسي من هوية علامتك التجارية. قبل الطباعة، نرسل لك تصميم الملصق للموافقة عليه. يستمر الإنتاج فقط بعد تأكيدك للملصق النهائي.",
                    bulletsTitle: "يمكن أن يشمل دعم تصميم الملصقات لدينا:",
                    bullets: [
                        "تخطيط الملصق الأمامي ووضع اسم المنتج",
                        "وضع نص المكونات واسم العلامة التجارية",
                        "تعديل الهوية البصرية الأساسية للماركة",
                        "ضبط مقاسات العبوة",
                        "إعداد ملف الملصق الجاهز للطباعة"
                    ],
                    extra: "إذا كان لديك ملف ملصق جاهز بالفعل، يقوم فريقنا بمراجعته قبل الطباعة للتأكد من ملاءمته للتغليف المحدد. إذا لم يكن لديك مصمم، يمكننا إنشاء تصميم ملصق بسيط واحترافي لمنتجك مجانًا."
                },
                {
                    number: "04",
                    title: "الخطوة 4: تأكيد الدفع",
                    desc: "بمجرد الموافقة على جميع تفاصيل الطلب، نرسل لك معلومات الدفع. بعد تأكيد الدفع، ينتقل طلبك إلى مرحلة الإنتاج.",
                    bulletsTitle: "تفاصيل الدفع:",
                    bullets: [
                        "تعتمد شروط الدفع على نوع وحجم الطلب",
                        "بالنسبة لمعظم الطلبات، يكون الدفع مطلوبًا قبل الإنتاج أو قبل الشحن",
                        "نحن نقبل طرق دفع آمنة ومناسبة لطلبات B2B الدولية"
                    ]
                },
                {
                    number: "05",
                    title: "الخطوة 5: الإنتاج وتجهيز الماركة الخاصة",
                    desc: "بعد تأكيد الدفع، نقوم بإعداد منتجاتك وفقًا للمواصفات المعتمدة. هدفنا هو تقديم منتجات نظيفة، احترافية، وجاهزة للبيع. نحن لا نهتم فقط بالتركيبة ولكن أيضًا بالتقديم النهائي للعبوة.",
                    bulletsTitle: "قد تشمل هذه المرحلة:",
                    bullets: [
                        "تعبئة المنتج وتجهيز العبوات",
                        "طباعة الملصقات ولصقها",
                        "تجهيز الدفعات وفحص الجودة",
                        "تغليف التصدير والتفتيش النهائي للطلب"
                    ]
                },
                {
                    number: "06",
                    title: "الخطوة 6: نرسل لك صورة قبل الشحن",
                    desc: "قبل أن يغادر طلبك منشأتنا، نرسل لك صورة حقيقية للمنتج النهائي. هذا يتيح لك رؤية منتجك تمامًا كما تم إعداده، وضع ملصقه، تعبئته، وجعله جاهزًا للبيع.",
                    bulletsTitle: "تتيح لك هذه الخطوة التحقق من:",
                    bullets: [
                        "مظهر المنتج ووضع الملصق",
                        "نمط التغليف والتقديم النهائي",
                        "المظهر الجاهز للبيع الذي يمثل علامتك التجارية"
                    ],
                    extra: "يقوم العديد من الموردين بالشحن دون إظهار النتيجة النهائية. في مجموعة أورجانيكا، نؤمن بأنه يجب عليك رؤية منتجك النهائي قبل شحنه. هذا مهم بشكل خاص لعملاء الماركة الخاصة، لأن المنتج النهائي يمثل علامتك التجارية."
                },
                {
                    number: "07",
                    title: "الخطوة 7: الشحن والتسليم",
                    desc: "بعد الموافقة النهائية، نجهز طلبك للشحن. بمجرد تأكيد الشحن، نقدم تفاصيل التتبع أو الشحن المتاحة.",
                    bulletsTitle: "خيارات الشحن والخدمات اللوجستية:",
                    bullets: [
                        "يتم ترتيب الشحن حسب وجهتك، حجم الطلب، وطريقة التسليم المفضلة",
                        "تشمل خيارات الشحن البريد السريع، الشحن الجوي، أو الشحن البحري",
                        "شحن دولي إلى أوروبا، الولايات المتحدة، كندا، الشرق الأوسط، وأسواق أخرى"
                    ]
                }
            ],

            // Why Us
            whyTitle: "لماذا تختار العلامات التجارية مجموعة أورجانيكا",
            whyDesc: "نحن ندعم العلامات التجارية التي تريد منتجات أصلية، تقديمًا احترافيًا، وعملية طلب عملي وسلسة.",
            whyItems: [
                { title: "منتجات مغربية أصلية", desc: "زيت أركان نقي، زيت بذور التين الشوكي، الصابون البلدي، طين الغاسول، وغيرها." },
                { title: "دعم الماركة الخاصة", desc: "تخصيص كامل للعلامة التجارية مع خيارات تصميم وتغليف مخصصة." },
                { title: "تصميم مجاني للملصقات", desc: "دعم كامل ومحترف لتصميم الملصقات من الصفر دون تكاليف إضافية." },
                { title: "صورة للمنتج قبل الشحن", desc: "شاهد المنتج النهائي الحقيقي تمامًا قبل مغادرته لمنشأتنا." },
                { title: "خيارات تعبئة مرنة", desc: "اختر من بين الزجاجات، المرطبانات، الأكياس، الأنابيب، أو التوريد بالجملة." },
                { title: "خبرة دولية في B2B", desc: "خدمات لوجستية مجربة وشحن موثوق إلى أوروبا، أمريكا، كندا، والشرق الأوسط." }
            ],

            // Products
            productsTitle: "منتجات التجميل المغربية التي يمكنك طلبها",
            productsDesc: "اختر من بين مجموعتنا الواسعة من المكونات الطبيعية والتركيبات التجميلية الجاهزة",
            productsList: [
                "زيت الأركان المغربي", "زيت بذور التين الشوكي", "الصابون البلدي المغربي", "طين الغاسول",
                "ماء الورد", "ماء زهر البرتقال", "بودرة الحناء", "بودرة النيلة الزرقاء",
                "العكر الفاسي", "بودرة السدر", "الصابون الطبيعي", "الزيوت الأساسية",
                "الزيوت الناقلة", "منتجات الحمام والسبا", "المكونات التجميلية بالجملة", "مستحضرات العناية بالبشرة بالماركة الخاصة"
            ],
            productsFooter: "إذا كنت تقوم ببناء خط متكامل من منتجات التجميل المغربية، يمكننا مساعدتك في اختيار المنتجات المتكاملة لعلامتك التجارية.",

            // Order types
            orderTypesTitle: "اختر شكل ونمط طلبك",
            orderTypesSubtitle: "نلبي متطلبات كل من خطوط التجزئة المخصصة والمكونات الخام بالجملة",

            plTitle: "طلبات الماركة الخاصة (Private Label)",
            plDesc: "مثالي إذا كنت ترغب في بيع منتجات التجميل المغربية تحت اسم علامتك التجارية الخاصة. اختر المنتج، التعبئة، نمط الملصق والكمية وفقًا لاحتياجات عملك.",
            plBulletsTitle: "ممتاز لـ:",
            plBullets: [
                "علامات العناية بالبشرة والشعر",
                "المنتجعات الصحية (السبا) والفنادق ومراكز العافية",
                "بائعي المتاجر الإلكترونية، شوبيفاي، أمازون، وتيك توك شوب",
                "موزعي الجملة والمحلات التجارية المبتكرة (Concept stores)"
            ],
            plFooter: "يمكنك البدء بخط منتجات بسيط أو تطوير مجموعة كاملة ومتكاملة بمرور الوقت.",

            bulkTitle: "طلبات الجملة والكميات الكبيرة",
            bulkDesc: "إذا كنت لا تحتاج لتغليف الماركة الخاصة، فنحن نوفر أيضًا منتجات التجميل المغربية بأحجام وكميات كبيرة للجملة.",
            bulkBulletsTitle: "ممتاز لـ:",
            bulkBullets: [
                "المصانع ومختبرات مستحضرات التجميل",
                "مركّبي وموزعي المواد التجميلية الخام",
                "الموزعين الذين يحتاجون لمنتجات نهائية بكميات كبيرة"
            ],
            bulkFooter: "أخبرنا بالكمية المستهدفة والوجهة، وسنوصيك بالتنسيق والشكل الأنسب لطلبك.",

            // CTA
            ctaTitle: "جاهز لبدء طلبك؟",
            ctaDesc: "أرسل لنا قائمة المنتجات، الكمية، والتغليف المفضل لديك. إذا كان لديك ملصق علامتك التجارية بالفعل، أرسله إلينا. وإلا، يمكن لفريقنا مساعدتك في إنشاء ملصق مجانًا.",
            ctaBtn: "اتصل بنا لبدء الطلب",

            // FAQ
            faqTitle: "الأسئلة الشائعة",
            faqItems: [
                { q: "كيف يمكنني تقديم طلب مع مجموعة أورجانيكا؟", a: "يمكنك تقديم طلب عن طريق الاتصال بنا وتحديد اسم المنتج، الكمية، التغليف المفضل، والبلد المستهدف. سيقوم فريقنا بمراجعة طلبك وإرسال عرض سعر بالخطوات التالية." },
                { q: "هل يمكنني طلب منتجات التجميل المغربية بالماركة الخاصة؟", a: "نعم. تقدم مجموعة أورجانيكا خدمات الماركة الخاصة لمنتجات التجميل المغربية بما في ذلك الزيوت، المساحيق، الصابون، المياه المقطرة، الطين، ومنتجات الحمام المغربي." },
                { q: "هل أحتاج إلى تصميم ملصق خاص بي؟", a: "لا. إذا لم يكن لديك مصمم، يمكن لمجموعة أورجانيكا إنشاء تصميم ملصق احترافي لمنتجك مجانًا." },
                { q: "هل سأرى المنتج النهائي قبل شحنه؟", a: "نعم. قبل الشحن، نرسل لك صورة حقيقية لمنتجك النهائي لكي تتحقق من الملصق، التغليف، والمظهر النهائي الجاهز للبيع." },
                { q: "ما هي المنتجات التي يمكنني طلبها؟", a: "يمكنك طلب زيت الأركان المغربي، زيت بذور التين الشوكي، الصابون البلدي، طين الغاسول، ماء الورد، ماء زهر البرتقال، الحناء، النيلة الزرقاء، العكر الفاسي، بودرة السدر، الصابون الطبيعي، الزيوت الأساسية، وغيرها." },
                { q: "هل تقبلون طلبات الماركة الخاصة الصغيرة؟", a: "نعم، وذلك يعتمد على نوع المنتج والتغليف. اتصل بنا مع توضيح فكرة منتجك والكمية، وسنؤكد لك الخيارات المتاحة." },
                { q: "هل تشحنون دوليًا؟", a: "نعم. تعمل مجموعة أورجانيكا مع عملاء B2B دوليين ويمكنها ترتيب الشحن حسب الوجهة وحجم الطلب والمتطلبات اللوجستية." },
                { q: "كم من الوقت يستغرق الإنتاج؟", a: "يعتمد وقت الإنتاج على المنتج، الكمية، نوع التعبئة، ومتطلبات الملصق. نؤكد وقت الإنتاج المقدر في عرض السعر قبل بدء الطلب." },
                { q: "هل يمكنكم مساعدتي في اختيار المنتجات لعلامتي التجارية؟", a: "نعم. إذا لم تكن متأكدًا من المنتجات التي تبدأ بها، يمكننا أن نوصي بمنتجات التجميل المغربية الأكثر مبيعًا بناءً على سوقك المستهدف ونموذج عملك." },
                { q: "هل توفرون مكونات تجميلية بكميات كبيرة؟", a: "نعم. توفر مجموعة أورجانيكا مكونات تجميلية مغربية مختارة بكميات كبيرة للمصنعين، المختبرات، العلامات التجارية، والمشترين المهنيين." }
            ]
        }
    };

    const t = content[lang as keyof typeof content] || content.en;
    const homeLabel = isAr ? "الصفحة الرئيسية" : isFr ? "Accueil" : "Home";
    const organicaLabel = isAr ? "أورغانيكا" : "Organica";

    // Build the dynamic SEO schema objects
    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": t.heroTitle + " - " + t.heroDesc,
        "description": t.introP1 + " " + t.introP2,
        "step": t.steps.map((step, idx) => ({
            "@type": "HowToStep",
            "position": idx + 1,
            "name": step.title.replace(/^Step \d+: |^Étape \d+ : |^الخطوة \d+: /, ""),
            "text": step.desc
        }))
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": t.faqItems.map((item) => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.a
            }
        }))
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            {/* Schema Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

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

            {/* Introduction Section */}
            <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20" dir={isAr ? "rtl" : "ltr"}>
                <div className="container-main max-w-6xl mx-auto px-4 space-y-12">
                    <motion.div 
                        className="text-center space-y-4 max-w-4xl mx-auto"
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <span className="text-primary font-bold uppercase tracking-wider text-xs md:text-sm block">
                            {isAr ? "دليل الشركاء B2B" : isFr ? "Guide Partenaires B2B" : "B2B Partner Guide"}
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground leading-tight text-center">
                            {t.introTitle}
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <motion.div 
                            className="lg:col-span-7 space-y-6"
                            initial="initial"
                            whileInView="whileInView"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {t.introP1}
                            </p>
                            <p className="text-base text-muted-foreground/90 leading-relaxed">
                                {t.introP2}
                            </p>
                            <p className={`text-sm text-muted-foreground/80 leading-relaxed italic ${isAr ? "border-r-2 pr-4" : "border-l-2 pl-4"} border-primary/40 py-1`}>
                                {t.introP3}
                            </p>
                            <p className="text-base font-semibold text-primary/90 leading-relaxed pt-2">
                                {t.introP4}
                            </p>
                        </motion.div>

                        {/* Quick Stats Grid */}
                        <motion.div 
                            className="lg:col-span-5 bg-card border border-border/80 rounded-3xl p-8 shadow-sm relative overflow-hidden"
                            initial={{ opacity: 0, x: isAr ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                            <h3 className="font-serif text-xl font-bold text-foreground mb-6 pb-2 border-b border-border/60">
                                {t.statsTitle}
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                {t.statsItems.map((stat, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                                        <p className="text-2xl md:text-3xl font-serif font-bold text-primary">{stat.val}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Timeline Steps Section */}
            <section className="py-16 md:py-24 bg-background" dir={isAr ? "rtl" : "ltr"}>
                <div className="container-main max-w-4xl mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                            {t.stepsTitle}
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            {t.stepsSubtitle}
                        </p>
                    </div>

                    {/* Timeline Line Container */}
                    <div className={`relative ${isAr ? "border-r-2 pr-8 md:pr-12 mr-4 md:mr-8" : "border-l-2 pl-8 md:pl-12 ml-4 md:ml-8"} border-gradient-to-b from-primary via-primary/40 to-muted/20 space-y-16 py-4`}>
                        {t.steps.map((step, idx) => {
                            const StepIcon = stepIcons[idx];
                            const nodePositionClass = isAr ? "-right-[25px] md:-right-[29px]" : "-left-[25px] md:-left-[29px]";
                            
                            return (
                                <motion.div 
                                    key={idx}
                                    className="relative"
                                    initial="initial"
                                    whileInView="whileInView"
                                    viewport={{ once: true, margin: "-100px" }}
                                    variants={fadeInUp}
                                >
                                    {/* Timeline Node */}
                                    <div className={`absolute top-1 ${nodePositionClass} w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary flex items-center justify-center text-white border-4 border-background shadow-md transition-all duration-300 hover:scale-110 z-10`}>
                                        <StepIcon className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>

                                    {/* Step Card Content */}
                                    <div className="bg-card border border-border/60 hover:border-primary/30 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 relative group overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                        
                                        <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                                            {isAr ? `الخطوة ${step.number}` : isFr ? `Étape ${step.number}` : `Step ${step.number}`}
                                        </span>
                                        
                                        <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground mt-4 mb-3">
                                            {step.title.replace(/^Step \d+: |^Étape \d+ : |^الخطوة \d+: /, "")}
                                        </h3>
                                        
                                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base mb-6">
                                            {step.desc}
                                        </p>

                                        {step.bullets && (
                                            <div className="space-y-3 pt-2">
                                                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider opacity-85">
                                                    {step.bulletsTitle}
                                                </h4>
                                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                                                    {step.bullets.map((bullet, bIdx) => (
                                                        <li key={bIdx} className="flex items-start gap-2.5">
                                                            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                            <span className="leading-snug">{bullet}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {step.extra && (
                                            <div className="mt-6 p-4 rounded-2xl bg-muted/40 border border-border/30 text-xs md:text-sm text-muted-foreground/90 italic leading-relaxed">
                                                {step.extra}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Why Brands Choose Us Section */}
            <section className="py-16 md:py-24 bg-muted/20" dir={isAr ? "rtl" : "ltr"}>
                <div className="container-main max-w-6xl mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                            {t.whyTitle}
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            {t.whyDesc}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {t.whyItems.map((item, idx) => {
                            const Icon = whyIcons[idx];
                            return (
                                <motion.div
                                    key={idx}
                                    className="bg-card border border-border/60 hover:border-primary/40 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 relative group"
                                    initial="initial"
                                    whileInView="whileInView"
                                    viewport={{ once: true }}
                                    variants={fadeInUp}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-serif text-lg font-bold text-foreground">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Products Showcase Section */}
            <section className="py-16 md:py-24 bg-background" dir={isAr ? "rtl" : "ltr"}>
                <div className="container-main max-w-5xl mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                            {t.productsTitle}
                        </h2>
                        <p className="text-muted-foreground text-md md:text-lg">
                            {t.productsDesc}
                        </p>
                    </div>

                    <motion.div 
                        className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto"
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        {t.productsList.map((product, idx) => (
                            <div 
                                key={idx} 
                                className="px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wide border border-border bg-card hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 flex items-center gap-2 cursor-default"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                <span>{product}</span>
                            </div>
                        ))}
                    </motion.div>

                    <p className="text-center text-muted-foreground italic text-sm mt-10 max-w-lg mx-auto leading-relaxed border-t border-border/40 pt-6">
                        {t.productsFooter}
                    </p>
                </div>
            </section>

            {/* Order Formats Comparison Section */}
            <section className="py-16 md:py-24 bg-muted/10 border-y border-border/40" dir={isAr ? "rtl" : "ltr"}>
                <div className="container-main max-w-6xl mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                            {t.orderTypesTitle}
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            {t.orderTypesSubtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Private Label Card */}
                        <motion.div 
                            className="bg-card border-t-4 border-t-primary border-x border-b border-border/80 rounded-3xl p-8 md:p-10 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300"
                            initial={{ opacity: 0, x: isAr ? 30 : -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="space-y-6">
                                <span className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Package className="w-5 h-5" />
                                </span>
                                <h3 className="font-serif text-2xl font-bold text-foreground">
                                    {t.plTitle}
                                </h3>
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                    {t.plDesc}
                                </p>
                                <div className="space-y-3 pt-2">
                                    <p className="text-xs font-bold text-foreground uppercase tracking-wider">
                                        {t.plBulletsTitle}
                                    </p>
                                    <ul className="space-y-2.5 text-sm text-muted-foreground">
                                        {t.plBullets.map((bullet, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground/80 mt-8 italic pt-4 border-t border-border/40">
                                {t.plFooter}
                            </p>
                        </motion.div>

                        {/* Bulk & Wholesale Card */}
                        <motion.div 
                            className="bg-card border-t-4 border-t-muted-foreground/60 border-x border-b border-border/80 rounded-3xl p-8 md:p-10 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300"
                            initial={{ opacity: 0, x: isAr ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="space-y-6">
                                <span className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                    <Globe className="w-5 h-5" />
                                </span>
                                <h3 className="font-serif text-2xl font-bold text-foreground">
                                    {t.bulkTitle}
                                </h3>
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                    {t.bulkDesc}
                                </p>
                                <div className="space-y-3 pt-2">
                                    <p className="text-xs font-bold text-foreground uppercase tracking-wider">
                                        {t.bulkBulletsTitle}
                                    </p>
                                    <ul className="space-y-2.5 text-sm text-muted-foreground">
                                        {t.bulkBullets.map((bullet, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <Check className="w-4 h-4 text-muted-foreground/80 shrink-0 mt-0.5" />
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground/80 mt-8 italic pt-4 border-t border-border/40">
                                {t.bulkFooter}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Accordion FAQ Section */}
            <section className="py-16 md:py-24 bg-background" dir={isAr ? "rtl" : "ltr"}>
                <div className="container-main max-w-4xl mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                            {t.faqTitle}
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {t.faqItems.map((item, idx) => {
                            const isOpen = openFaqIndex === idx;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-card border border-border/70 hover:border-primary/30 rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
                                >
                                    <button
                                        onClick={() => toggleFaq(idx)}
                                        className="w-full flex items-center justify-between p-6 text-left font-serif text-base md:text-lg font-bold text-foreground hover:text-primary transition-colors cursor-pointer gap-4"
                                        style={{ textAlign: isAr ? "right" : "left" }}
                                    >
                                        <span className="leading-snug">{item.q}</span>
                                        <ChevronDown
                                            className={`w-5 h-5 text-primary shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                    
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                            >
                                                <div className="px-6 pb-6 text-sm md:text-base text-muted-foreground leading-relaxed border-t border-border/30 pt-4 bg-muted/10">
                                                    {item.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Box Section */}
            <section className="py-16 md:py-20 bg-background" dir={isAr ? "rtl" : "ltr"}>
                <div className="container-main max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-secondary text-secondary-foreground rounded-3xl p-8 md:p-12 text-center shadow-xl relative overflow-hidden border border-border/10"
                    >
                        <div
                            className="absolute inset-0 opacity-5 pointer-events-none"
                            style={{
                                backgroundImage: 'url(/images/footer/footer-map-bg.png)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />
                        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                            <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-white uppercase tracking-wide leading-tight">
                                {t.ctaTitle}
                            </h3>
                            <p className="text-sm md:text-base text-gray-300 leading-relaxed italic max-w-xl mx-auto">
                                {t.ctaDesc}
                            </p>
                            <div className="pt-4">
                                <Link
                                    href={`/${lang}/contact`}
                                    className="inline-flex items-center gap-2 btn-accent hover:scale-105 transition-all text-white font-bold py-3.5 px-8 rounded-full shadow-lg text-sm uppercase tracking-wider"
                                >
                                    <span>{t.ctaBtn}</span>
                                    <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <CertificationSlider />
        </div>
    );
}
