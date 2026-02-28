"use client";

import { CheckoutClient } from "./CheckoutClient";

interface CheckoutWrapperProps {
    dict: any;
    lang: string;
}

export function CheckoutWrapper({ dict, lang }: CheckoutWrapperProps) {
    return <CheckoutClient dict={dict} lang={lang} />;
}

