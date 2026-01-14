import { getDictionary } from "@/lib/dictionaries";

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang, 'contact');

    return (
        <main className="container-main py-20 min-h-[60vh]">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="heading-display mb-6">
                    {dict.title}
                </h1>
                <p className="text-body text-muted-foreground">
                    {dict.content}
                </p>
            </div>
        </main>
    );
}
