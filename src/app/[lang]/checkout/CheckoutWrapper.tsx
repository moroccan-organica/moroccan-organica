"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CheckoutClient } from "./CheckoutClient";

interface CheckoutWrapperProps {
    dict: any;
    lang: string;
}

// PayPal sandbox client ID - replace with your production client ID via env
const FALLBACK_CLIENT_ID = "ASHlp4YnXU8iZ1q6czZhX8Xc1k2HsHooFqbTUk1VsCFUAanzz-J-mX6Y5pB0M53_oBap69CarTdEXSUM";

export function CheckoutWrapper({ dict, lang }: CheckoutWrapperProps) {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || FALLBACK_CLIENT_ID;

    return (
        <PayPalScriptProvider
            options={{
                clientId: clientId,
                currency: "USD",
                intent: "capture",
                components: "buttons",
            }}
        >
            <CheckoutClient dict={dict} lang={lang} />
        </PayPalScriptProvider>
    );
}
