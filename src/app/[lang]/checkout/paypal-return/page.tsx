import { Suspense } from "react";
import { getDictionary } from "@/lib/dictionaries";
import { PayPalReturnClient } from "./PayPalReturnClient";

type Params = Promise<{ lang: string }>;

export default async function PayPalReturnPage({ params }: { params: Params }) {
    const { lang } = await params;
    const dict = await getDictionary(lang, "common") as any;

    return (
        <Suspense fallback={
            <div className="container mx-auto px-4 py-16 min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
        }>
            <PayPalReturnClient dict={dict?.checkout} lang={lang} />
        </Suspense>
    );
}
