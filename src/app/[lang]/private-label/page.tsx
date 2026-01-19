import { getDictionary } from "@/lib/dictionaries";
import PrivateLabelClient from "./PrivateLabelClient";
import { privateLabelData } from "@/data/private-label";

export default async function PrivateLabelPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang, 'private-label');

    return (
        <PrivateLabelClient
            data={privateLabelData}
            dict={dict}
            lang={lang}
        />
    );
}
