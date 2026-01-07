
export default async function ProductsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const isRTL = lang === "ar";

    return (
        <main className="container-main py-20 min-h-[60vh]">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="heading-display mb-6">
                    {isRTL ? "منتجاتنا" : "Our Products"}
                </h1>
                <p className="text-body text-muted-foreground">
                    {isRTL ? "اكتشف مجموعتنا الكاملة من المنتجات العضوية." : "Explore our full range of organic products."}
                </p>
            </div>
        </main>
    );
}
