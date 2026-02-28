import { getDictionary } from "@/lib/dictionaries";
import { CheckoutWrapper } from "./CheckoutWrapper";

type Params = Promise<{ lang: string }>;

export default async function CheckoutPage({ params }: { params: Params }) {
    const { lang } = await params;
    const dict = await getDictionary(lang, 'common') as any;

    return <CheckoutWrapper dict={dict.checkout as any} lang={lang} />;
}
