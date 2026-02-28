"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const STORAGE_KEY = "paypal_checkout_data";

interface PayPalReturnClientProps {
    dict: any;
    lang: string;
}

export function PayPalReturnClient({ dict, lang }: PayPalReturnClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [error, setError] = useState<string | null>(null);
    const isPopup = typeof window !== "undefined" && !!window.opener;

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            setError(dict?.paypalReturnError || "Missing PayPal token. Please try again.");
            setStatus("error");
            return;
        }

        const raw = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
        if (!raw) {
            setError(dict?.paypalReturnNoData || "Session expired. Please return to checkout and try again.");
            setStatus("error");
            return;
        }

        let orderData: any;
        try {
            orderData = JSON.parse(raw);
        } catch {
            setError(dict?.paypalReturnInvalidData || "Invalid session data.");
            setStatus("error");
            return;
        }

        sessionStorage.removeItem(STORAGE_KEY);

        fetch("/api/checkout/paypal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...orderData,
                paypalOrderId: token,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.success) {
                    setStatus("success");
                    const orderId = result.orderId || result.orderReference;
                    if (isPopup && window.opener) {
                        window.opener.postMessage(
                            { type: "PAYPAL_COMPLETE", orderId },
                            window.location.origin
                        );
                        window.close();
                    } else {
                        router.replace(`/${lang}/checkout/success?orderId=${orderId}`);
                    }
                } else {
                    setError(result.error || "Payment verification failed");
                    setStatus("error");
                }
            })
            .catch((err) => {
                setError(err?.message || "An error occurred");
                setStatus("error");
            });
    }, [searchParams, lang, router, dict]);

    if (status === "loading") {
        return (
            <div className="container mx-auto px-4 py-16 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">
                        {dict?.paypalReturnProcessing || "Completing your order..."}
                    </p>
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="container mx-auto px-4 py-16 min-h-screen flex items-center justify-center">
                <div className="max-w-md w-full text-center space-y-4">
                    <p className="text-destructive">{error}</p>
                    <button
                        onClick={() =>
                            isPopup ? window.close() : router.push(`/${lang}/checkout`)
                        }
                        className="btn-accent px-6 py-2 rounded"
                    >
                        {isPopup
                            ? (dict?.close || "Close")
                            : (dict?.backToCheckout || "Return to Checkout")}
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
