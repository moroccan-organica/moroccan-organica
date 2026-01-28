import { getDictionary } from "@/lib/dictionaries";
import { CheckoutSuccessClient } from "./CheckoutSuccessClient";

type Params = Promise<{ lang: string }>;
type SearchParams = Promise<{ orderId?: string }>;

export default async function CheckoutSuccessPage({ 
    params,
    searchParams 
}: { 
    params: Params;
    searchParams: SearchParams;
}) {
    const { lang } = await params;
    const { orderId } = await searchParams;
    const dict = await getDictionary(lang, 'common');

    return <CheckoutSuccessClient dict={dict} lang={lang} orderId={orderId} />;
}
