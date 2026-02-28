"use client";

import { motion } from "framer-motion";
import InnerHero from "@/components/common/InnerHero";
import CertificationSlider from "@/components/common/CertificationSlider";
import Image from "next/image";

interface HowToOrderPayClientProps {
    lang: string;
}

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

export default function HowToOrderPayClient({ lang }: HowToOrderPayClientProps) {
    const isAr = lang === 'ar';

    const content = {
        en: {
            heroTitle: "How to Order & Pay",
            heroDesc: "Follow our simple guide for a seamless ordering process",
            breadcrumbCurrent: "How to Order & Pay",
            overviewText: (
                <>
                    <p>
                        After you place your order, Once your payment is processed, the pressing date of that order is assigned according to the actual orders' queue, you can get your Argan oil with its full shelf-life.
                        Once the oil is pressed, and the sediment settled down, it is forwarded to the customs so they can perform tests on a sample to confirm the origin and the purity of the product before setting it up for export.
                        And when your delivery is handed over to the shipping carrier, you'll be updated on a timely manner with the proper tracking information so you can have an estimate delivery time (in case you have clients commitments etc..)
                    </p>
                    <p>
                        Note that the pressing duration depends on the actual orders' queue.
                        Immediately after you confirm your order, I'll proceed with you, and if there's anything I can assist you with.
                        Thank you for considering to support the traditional and organic Argan oil.
                    </p>
                </>
            ),
            payTitle: "Pay without PayPal account",
            payDesc: "Don't have a PayPal account? Want to pay with Credit/Debit Card? No Problem! We got you covered.",
            acceptedCards: "We accept all payment from major Credit Cards: VISA, MASTERCARD, AMEX, DISCOVER",
            noAccountNeeded: "You do not need an account for PayPal Checkout.",
            simpleStep1: "If you want to pay using Credit Card or you don't have a PayPal Account... It's Super Simple!",
            simpleStep2: "Simply Click on PayPal Checkout and then 'Check Out as a Guest'",
            otherOption: "Sometimes it will say, \"Pay with Debit or Credit Card\" instead, so click that.",
            followProcedure: "And then Follow Normal Procedure to Checkout",
            happyShopping: "Click Continue... Happy Shopping!"
        },
        fr: {
            heroTitle: "Comment commander et payer",
            heroDesc: "Suivez notre guide simple pour une commande sans accroc",
            breadcrumbCurrent: "Comment commander et payer",
            overviewText: (
                <>
                    <p>
                        Après avoir passé commande, une fois votre paiement traité, la date de pression de l&apos;huile est fixée selon la file des commandes en cours. Vous recevez ainsi une huile d&apos;argan avec sa durée de conservation complète.
                        Une fois l&apos;huile pressée et les sédiments déposés, elle est envoyée aux douanes pour des analyses sur échantillon afin de confirmer l&apos;origine et la pureté du produit avant export.
                        Lorsque votre colis est remis au transporteur, vous êtes informé en temps utile du suivi pour estimer la date de livraison (idéal si vous avez des engagements clients, etc.).
                    </p>
                    <p>
                        La durée de pression dépend de la file des commandes. Dès que vous confirmez votre commande, nous avançons avec vous et restons disponibles pour toute question.
                        Merci de soutenir l&apos;huile d&apos;argan traditionnelle et biologique.
                    </p>
                </>
            ),
            payTitle: "Payer sans compte PayPal",
            payDesc: "Vous n'avez pas de compte PayPal ? Vous souhaitez payer par carte bancaire ? Aucun problème, c'est possible.",
            acceptedCards: "Nous acceptons les paiements par cartes majeures : VISA, MASTERCARD, AMEX, DISCOVER",
            noAccountNeeded: "Vous n'avez pas besoin de compte pour le paiement PayPal.",
            simpleStep1: "Pour payer par carte ou si vous n'avez pas de compte PayPal, c'est très simple !",
            simpleStep2: "Cliquez sur Paiement PayPal puis sur « Payer en tant qu'invité »",
            otherOption: "Parfois le libellé affiche « Payer par carte de débit ou de crédit » : cliquez dessus.",
            followProcedure: "Puis suivez la procédure habituelle pour finaliser la commande",
            happyShopping: "Cliquez sur Continuer... Bon shopping !"
        },
        ar: {
            heroTitle: "الطلب والدفع",
            heroDesc: "اتبع دليلنا البسيط لعملية طلب سلسة",
            breadcrumbCurrent: "الطلب والدفع",
            overviewText: (
                <>
                    <p>
                        <bdi>بعد تقديم طلبك ، بمجرد معالجة دفعتك ، يتم تعيين تاريخ الضغط لهذا الطلب وفقًا لقائمة انتظار الطلبات الفعلية ، يمكنك الحصول على زيت الأركان بفترة صلاحيته الكاملة.</bdi>
                    </p>
                    <p>
                        <bdi>بمجرد عصر الزيت ، واستقرار الرواسب ، يتم إرسالها إلى الجمارك حتى يتمكنوا من إجراء اختبارات على عينة لتأكيد أصل المنتج ونقاوته قبل إعداده للتصدير.</bdi>
                    </p>
                    <p>
                        <bdi>وعندما يتم تسليم شحنتك إلى شركة الشحن ، سيتم إطلاعك في الوقت المناسب بمعلومات التتبع المناسبة حتى تتمكن من الحصول على وقت تسليم تقديري (في حالة التزامات عملائك وما إلى ذلك ..)</bdi>
                    </p>
                    <p>
                        <bdi>لاحظ أن مدة الضغط تعتمد على قائمة انتظار الطلبات الفعلية.</bdi>
                    </p>
                    <p>
                        <bdi>مباشرة بعد تأكيد طلبك ، سأتابع معك ، وإذا كان هناك أي شيء يمكنني مساعدتك به.</bdi>
                    </p>
                    <p>
                        <bdi>نشكرك على التفكير في دعم زيت الأركان التقليدي والعضوي.</bdi>
                    </p>
                </>
            ),
            payTitle: "ادفع بدون حساب PayPal",
            payDesc: "ليس لديك حساب PayPal؟ هل تريد الدفع ببطاقة الائتمان / الخصم؟ لا مشكلة! لقد جئنا لك.",
            acceptedCards: "نقبل جميع المدفوعات من بطاقات الائتمان الرئيسية: VISA و MASTERCARD و AMEX و DISCOVER",
            noAccountNeeded: "لا تحتاج إلى حساب لـ PayPal Checkout.",
            simpleStep1: "إذا كنت ترغب في الدفع باستخدام بطاقة الائتمان أو لم يكن لديك حساب PayPal ... الأمر بسيط للغاية!",
            simpleStep2: "بساطة انقر على PayPal Checkout ثم \"الدفع كضيف\"",
            otherOption: "في بعض الأحيان سيقول ، \"الدفع ببطاقة الخصم أو الائتمان\" بدلاً من ذلك ، لذا انقر فوق ذلك.",
            followProcedure: "وبعد ذلك اتبع الإجراء العادي للسداد",
            happyShopping: "انقر فوق متابعة ... تسوق سعيد!"
        }
    };

    const t = content[lang as keyof typeof content] || content.en;
    const homeLabel = isAr ? "الصفحة الرئيسية" : lang === "fr" ? "Accueil" : "Home";

    return (
        <div className="min-h-screen bg-background text-foreground">
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
                <div className="container-main max-w-4xl mx-auto space-y-16">

                    {/* Process Overview */}
                    <motion.div className="rich-text-content" {...fadeInUp}>
                        {t.overviewText}
                    </motion.div>

                    {/* How to pay section */}
                    <motion.div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm space-y-8" {...fadeInUp}>
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">{t.payTitle}</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                                {t.payDesc}
                            </p>
                        </div>

                        <div className="rich-text-content space-y-12">
                            <div className="space-y-4">
                                <p>{t.acceptedCards.split('VISA')[0]} <strong>VISA, MASTERCARD, AMEX, DISCOVER</strong></p>
                                <p><strong>{t.noAccountNeeded}</strong></p>
                                <p>{t.simpleStep1}</p>
                                <p>{t.simpleStep1.includes('Super Simple') ? t.simpleStep2.replace('Simply ', '') : <u>{t.simpleStep2}</u>}</p>

                                <div className="border border-border p-2 rounded-xl bg-muted/20">
                                    <Image
                                        src="/images/how-to-pay/Check_out_as_a_Guest.jpg"
                                        width={800}
                                        height={400}
                                        alt="Check Out as a Guest Step 1"
                                        className="rounded-lg shadow-md w-full"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p> {t.otherOption}</p>
                                <div className="border border-border p-2 rounded-xl bg-muted/20">
                                    <Image
                                        src="/images/how-to-pay/paypal_Guest_Checkout_1.1.jpg"
                                        width={800}
                                        height={400}
                                        alt="PayPal Guest Checkout Step 1.1"
                                        className="rounded-lg shadow-md w-full"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p><u>{t.followProcedure}</u></p>
                                <div className="border border-border p-2 rounded-xl bg-muted/20">
                                    <Image
                                        src="/images/how-to-pay/Paypal_Guest_Checkout_2.jpg"
                                        width={800}
                                        height={400}
                                        alt="PayPal Guest Checkout Step 2"
                                        className="rounded-lg shadow-md w-full"
                                    />
                                </div>
                            </div>

                            <div className="text-center pt-8">
                                <p className="text-2xl font-bold text-primary">{t.happyShopping}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <CertificationSlider />
        </div>
    );
}
