"use client";

import { motion } from "framer-motion";
import InnerHero from "@/components/common/InnerHero";
import CertificationSlider from "@/components/common/CertificationSlider";

interface DeliveryInformationClientProps {
    lang: string;
}

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

export default function DeliveryInformationClient({ lang }: DeliveryInformationClientProps) {
    const isAr = lang === 'ar';

    const content = {
        en: {
            heroTitle: "Delivery Information",
            heroDesc: "Shipping policies, delivery locations, and estimated times",
            breadcrumbCurrent: "Delivery Information",
            generalInfoTitle: "General Information",
            generalInfoText: "All orders are subject to product availability. If an item is not in stock at the time you place your order, we will notify you and refund the total amount of your order, using the original method of payment. Please note, that all products are sold “as is”. You assume the responsibility for your purchase, and no returns or refunds will be issued, once the order is processed and payment done.",
            deliveryLocationTitle: "Delivery Location",
            deliveryLocationText: "Items offered on our website are available for Worldwide delivery.",
            deliveryTimeTitle: "Delivery Time",
            deliveryTimeText: "An estimated delivery time will be provided to you once you place your order. It starts from the date of shipping, rather than the date of order. Delivery times are to be used as an indication only and are subject to the acceptance and approval of your order. Unless there are exceptional circumstances, we make every effort to fulfill your order within [3] business days (from Monday to Friday except holidays) of the date of your order. Please note we do not ship on weekends.",
            shippingCostsTitle: "Shipping Costs",
            shippingCostsText: "Shipping costs are based on the weight of your order and the delivery method. To find out how much your order will cost, please add the items you would like to purchase to your cart, and proceed to the my cart page. Once you are there, shipping charges will be displayed. Additional shipping charges may apply to remote areas or for large or heavy items. You will be advised of any charges on the my cart page. Sales tax is charged according to the province or territory to which the item is shipped.",
            damagedItemsTitle: "Damaged Items in Transport",
            damagedItemsText: "If there is any damage to the packaging on delivery, contact us immediately on Whatsapp at +212 777 000 897",
            questionsTitle: "Questions",
            questionsText: "If you have any questions about the order, the delivery or shipment, please contact us at contact@moroccanorganica.com"
        },
        fr: {
            heroTitle: "Informations de livraison",
            heroDesc: "Politiques d'expédition, zones de livraison et délais estimés",
            breadcrumbCurrent: "Informations de livraison",
            generalInfoTitle: "Informations générales",
            generalInfoText: "Toutes les commandes sont soumises à la disponibilité des produits. Si un article n'est pas en stock au moment de votre commande, nous vous en informerons et rembourserons le montant total selon le mode de paiement d'origine. Tous les produits sont vendus « tels quels ». Vous assumez la responsabilité de votre achat ; aucun retour ni remboursement ne sera effectué une fois la commande traitée et le paiement effectué.",
            deliveryLocationTitle: "Zone de livraison",
            deliveryLocationText: "Les articles proposés sur notre site sont disponibles pour une livraison dans le monde entier.",
            deliveryTimeTitle: "Délai de livraison",
            deliveryTimeText: "Un délai de livraison estimé vous sera communiqué une fois votre commande passée. Il est calculé à partir de la date d'expédition, et non de la date de commande. Les délais sont donnés à titre indicatif et sont subordonnés à l'acceptation de votre commande. Sauf circonstances exceptionnelles, nous nous efforçons de traiter votre commande dans un délai de [3] jours ouvrés (du lundi au vendredi, hors jours fériés). Nous n'expédions pas le week-end.",
            shippingCostsTitle: "Frais de livraison",
            shippingCostsText: "Les frais de livraison dépendent du poids de votre commande et du mode d'expédition. Pour les connaître, ajoutez les articles souhaités au panier et rendez-vous sur la page panier : les frais s'afficheront. Des frais supplémentaires peuvent s'appliquer pour les zones éloignées ou les articles volumineux ou lourds. La TVA est appliquée selon le pays ou la région de livraison.",
            damagedItemsTitle: "Colis endommagé pendant le transport",
            damagedItemsText: "En cas de dommage à l'emballage à la livraison, contactez-nous immédiatement sur WhatsApp au +212 777 000 897",
            questionsTitle: "Questions",
            questionsText: "Pour toute question concernant la commande, la livraison ou l'expédition, contactez-nous à contact@moroccanorganica.com"
        },
        ar: {
            heroTitle: "معلومات التسليم",
            heroDesc: "سياسات الشحن ومواقع التسليم والأوقات المقدرة",
            breadcrumbCurrent: "معلومات التسليم",
            generalInfoTitle: "معلومات عامة",
            generalInfoText: "تخضع جميع الطلبات لتوفر المنتج. إذا لم يكن العنصر في المخزن في الوقت الذي تضع فيه طلبك ، فسنقوم بإخطارك ورد المبلغ الإجمالي لطلبك ، باستخدام طريقة الدفع الأصلية. يرجى ملاحظة أن جميع المنتجات تباع \"كما هي\". أنت تتحمل مسؤولية شرائك ، ولن يتم إصدار أي مرتجعات أو مبالغ مستردة ، بمجرد معالجة الطلب وإتمام الدفع.",
            deliveryLocationTitle: "التسليم الموقع",
            deliveryLocationText: "الأصناف المعروضة على موقعنا متوفرة للتوصيل في جميع أنحاء العالم.",
            deliveryTimeTitle: "موعد التسليم",
            deliveryTimeText: "سيتم توفير وقت تسليم تقديري لك بمجرد تقديم طلبك. يبدأ من تاريخ الشحن وليس من تاريخ الطلب. يجب استخدام أوقات التسليم كإشارة فقط وهي تخضع لقبول طلبك والموافقة عليه. ما لم تكن هناك ظروف استثنائية ، فإننا نبذل قصارى جهدنا لتلبية طلبك في غضون [3] أيام عمل (من الاثنين إلى الجمعة باستثناء العطلات) من تاريخ طلبك. يرجى ملاحظة أننا لا نشحن في عطلات نهاية الأسبوع.",
            shippingCostsTitle: "تكلفت الشحن",
            shippingCostsText: "تعتمد تكاليف الشحن على وزن طلبك وطريقة التسليم. لمعرفة تكلفة طلبك ، يرجى إضافة العناصر التي ترغب في شرائها إلى عربة التسوق الخاصة بك ، والمتابعة إلى صفحة سلة التسوق الخاصة بي بمجرد وصولك إلى هناك ، سيتم عرض رسوم الشحن. قد يتم تطبيق رسوم شحن إضافية على المناطق النائية أو للعناصر الكبيرة أو الثقيلة. سيتم إخطارك بأي رسوم في صفحة عربة التسوق الخاصة بي. تفرض ضريبة المبيعات وفقًا للمقاطعة أو الإقليم الذي يتم شحن العنصر إليه.",
            damagedItemsTitle: "العناصر المتضررة في النقل",
            damagedItemsText: "إذا كان هناك أي تلف في العبوة عند التسليم ، فاتصل بنا على الفور على Whatsapp على الرقم 897 000 777 212+",
            questionsTitle: "أسئلة",
            questionsText: "إذا كان لديك أي أسئلة حول الطلب أو التسليم أو الشحن ، يرجى الاتصال بنا على contact@moroccanorganica.com"
        }
    };

    const t = content[lang as keyof typeof content] || content.en;
    const homeLabel = isAr ? "الصفحة الرئيسية" : lang === "fr" ? "Accueil" : "Home";

    return (
        <div className="min-h-screen bg-background">
            <InnerHero
                title={t.heroTitle}
                description={t.heroDesc}
                backgroundImage="/images/slider/hero-authentic-argan-oil.webp"
                breadcrumbs={[
                    { label: homeLabel, href: `/${lang}` },
                    { label: isAr ? "أورغانيكا" : "Organica", href: `/${lang}/organica` },
                    { label: t.breadcrumbCurrent },
                ]}
            />

            <section className="py-16 md:py-24" dir={isAr ? "rtl" : "ltr"}>
                <div className="container-main max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">
                        <motion.div className="rich-text-content" {...fadeInUp}>
                            <h4>{t.generalInfoTitle}</h4>
                            <p>{t.generalInfoText}</p>

                            <h4>{t.deliveryLocationTitle}</h4>
                            <p>{t.deliveryLocationText}</p>

                            <h4>{t.deliveryTimeTitle}</h4>
                            <p>{t.deliveryTimeText}</p>
                        </motion.div>

                        <motion.div className="rich-text-content" {...fadeInUp} transition={{ delay: 0.1 }}>
                            <h4>{t.shippingCostsTitle}</h4>
                            <p>{t.shippingCostsText}</p>

                            <h4>{t.damagedItemsTitle}</h4>
                            <p>{t.damagedItemsText}</p>

                            <h4>{t.questionsTitle}</h4>
                            <p>
                                {t.questionsText.split('contact@moroccanorganica.com')[0]}
                                <a href="mailto:contact@moroccanorganica.com?subject=Delivery issues" target="_self" title="Delivery issues">contact@moroccanorganica.com</a>
                                {t.questionsText.split('contact@moroccanorganica.com')[1]}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <CertificationSlider />
        </div>
    );
}
