import { getDictionary } from "@/lib/dictionaries";
import { PayPalReturnClient } from "./PayPalReturnClient";

type Params = Promise<{ lang: string }>;

export default async function PayPalReturnPage({ params }: { params: Params }) {
    const { lang } = await params;
    const dict = await getDictionary(lang, "common") as any;

    return <PayPalReturnClient dict={dict?.checkout} lang={lang} />;
}
