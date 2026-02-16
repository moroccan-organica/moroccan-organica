import { getDictionary } from "@/lib/dictionaries";
import { CheckoutWrapper } from "@/features/checkout/components/CheckoutWrapper";

type Params = Promise<{ lang: string }>;

export default async function CheckoutPage({ params }: { params: Params }) {
    const { lang } = await params;
    const dict = await getDictionary(lang, 'common');

    return <CheckoutWrapper dict={dict.checkout as any} lang={lang} />;
}
