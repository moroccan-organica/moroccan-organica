"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CheckoutClient } from "./CheckoutClient";
import { useMemo } from "react";

interface CheckoutWrapperProps {
    dict: any;
    lang: string;
}

export function CheckoutWrapper({ dict, lang }: CheckoutWrapperProps) {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) throw new Error("NEXT_PUBLIC_PAYPAL_CLIENT_ID is not set");

    const paypalOptions = useMemo(() => ({
        clientId: clientId,
        currency: "USD",
        intent: "capture",
        components: "buttons",
        locale: lang === "ar" ? "ar_EG" : "en_US",
        // remove buyer-country if not testing as it can cause issues in production
        // buyerCountry: "US", 
        enableFunding: "venmo,paylater",
        dataSdkIntegrationSource: "integrationbuilder_sc",
    }), [clientId, lang]);

    return (
        <PayPalScriptProvider options={paypalOptions}>
            <CheckoutClient dict={dict} lang={lang} />
        </PayPalScriptProvider>
    );
}

