import { getDictionary } from "@/lib/dictionaries";
import ContactClient from "./ContactClient";
import { contactPageData } from "@/data/contact";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang, 'contact');

    return {
        title: dict.title || "Contact Us | MoroccanOrganica",
        description: dict.description || "Get in touch with MoroccanOrganica for wholesale premium Moroccan organic beauty products.",
    };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang, 'contact');

    return (
        <ContactClient
            data={contactPageData}
            dict={dict}
            lang={lang}
        />
    );
}
