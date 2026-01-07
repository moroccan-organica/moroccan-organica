
export default async function PrivateLabelPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const isRTL = lang === "ar";

    return (
        <main className="container-main py-20 min-h-[60vh]">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="heading-display mb-6">
                    {isRTL ? "العلامة الخاصة" : "Private Label"}
                </h1>
                <p className="text-body text-muted-foreground">
                    {isRTL
                        ? "نحن نقدم خدمات التصنيع بالعلامة الخاصة لمنتجات التجميل العضوية. تواصل معنا للحصول على مزيد من التفاصيل."
                        : "We offer private label manufacturing for organic beauty products. Contact us for more details."}
                </p>
            </div>
        </main>
    );
}
