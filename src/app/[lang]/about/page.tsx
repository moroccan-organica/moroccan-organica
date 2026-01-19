import { getDictionary } from "@/lib/dictionaries";
import AboutClient from "./AboutClient";
import { Metadata } from "next";
import { aboutPageData } from "@/data/about";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang, 'about');

    return {
        title: dict.hero?.title || aboutPageData.hero.title,
        description: dict.hero?.description || aboutPageData.hero.description,
    };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang, 'about');

    return (
        <main>
            <AboutClient data={aboutPageData} dict={dict} lang={lang} />
        </main>
    );
}
