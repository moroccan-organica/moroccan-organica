"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface DirectPayPalButtonsProps {
    clientId: string;
    total: number;
    disabled: boolean;
    locale?: string;
    onApprove: (orderId: string) => Promise<void>;
    onError: (err: unknown) => void;
    onCancel?: () => void;
    onClick?: () => Promise<boolean>;
}

const LOAD_TIMEOUT_MS = 20000;
const DEBUG = true;

let paypalLoadPromise: Promise<any> | null = null;

/** Load PayPal SDK - uses Next.js preloaded script or adds own. Polls for Buttons (SDK init can be async). */
function loadPayPalScript(clientId: string, locale: string): Promise<any> {
    const w = typeof window !== "undefined" ? (window as any) : null;
    if (w?.paypal?.Buttons) {
        return Promise.resolve(w.paypal);
    }

    if (paypalLoadPromise) return paypalLoadPromise;

    const params = new URLSearchParams({
        "client-id": clientId,
        currency: "USD",
        intent: "capture",
        components: "buttons",
        "disable-funding": "venmo,paylater",
        locale,
    });
    const src = `https://www.paypal.com/sdk/js?${params}`;

    function pollForButtons(attempts: number, resolve: (p: any) => void, reject: (e: Error) => void): void {
        const paypal = (window as any).paypal;
        if (paypal?.Buttons) {
            resolve(paypal);
            return;
        }
        if (attempts >= 80) {
            reject(new Error("PayPal indisponible. Avec Edge, désactivez \"Suivi empêché\" (paramètres) ou utilisez Chrome."));
            return;
        }
        setTimeout(() => pollForButtons(attempts + 1, resolve, reject), 150);
    }

    const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
    if (existingScript) {
        paypalLoadPromise = new Promise((resolve, reject) => {
            const paypal = (window as any).paypal;
            if (paypal?.Buttons) resolve(paypal);
            else if (paypal) pollForButtons(0, resolve, reject);
            else setTimeout(() => pollForButtons(0, resolve, reject), 200);
        });
        return paypalLoadPromise;
    }

    paypalLoadPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => {
            const paypal = (window as any).paypal;
            if (paypal?.Buttons) resolve(paypal);
            else if (paypal) pollForButtons(0, resolve, reject);
            else reject(new Error("Script chargé mais window.paypal absent - vérifiez bloqueurs de pub"));
        };
        script.onerror = () => reject(new Error("Échec du chargement du script PayPal"));
        document.head.appendChild(script);
    });
    return paypalLoadPromise;
}

function useDebugLog() {
    const [logs, setLogs] = useState<{ t: number; msg: string }[]>([]);
    const log = useCallback((msg: string) => {
        const entry = { t: Date.now(), msg };
        setLogs((prev) => [...prev.slice(-19), entry]);
        console.log(`[PayPal Debug] ${msg}`);
    }, []);
    return { logs, log };
}

export function DirectPayPalButtons({
    clientId,
    total,
    disabled,
    locale = "en_US",
    onApprove,
    onError,
    onCancel,
    onClick,
}: DirectPayPalButtonsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonsRef = useRef<{ close: () => Promise<void> } | null>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const [loadError, setLoadError] = useState<string | null>(null);
    const totalRef = useRef(total);
    totalRef.current = total;
    const { logs, log } = useDebugLog();

    const handleRetry = useCallback(() => {
        window.location.reload();
    }, []);

    useEffect(() => {
        log("1. useEffect started");
        if (typeof window === "undefined") {
            log("2. ABORT: window undefined (SSR)");
            return;
        }
        if (!clientId) {
            log("2. ABORT: clientId manquant! Vérifiez NEXT_PUBLIC_PAYPAL_CLIENT_ID");
            setLoadError("PayPal clientId non configuré");
            setStatus("error");
            return;
        }
        log(`2. clientId OK (${clientId.slice(0, 10)}...)`);

        let cancelled = false;
        const timer = setTimeout(() => {
            if (!cancelled) {
                log("TIMEOUT: Script PayPal n'a pas chargé en 20s");
                setLoadError("PayPal is taking too long to load. Please refresh or try another payment method.");
                setStatus("error");
            }
        }, LOAD_TIMEOUT_MS);

        log("3. loadPayPalScript() via script tag...");
        loadPayPalScript(clientId, locale)
            .then((paypal) => {
                log(`4. Script loaded. paypal=${!!paypal}, Buttons=${!!paypal?.Buttons}`);
                if (cancelled) {
                    log("4. CANCELLED - ignoré");
                    return;
                }
                if (!containerRef.current) {
                    log("4. ERREUR: containerRef.current est null! Le DOM n'est pas prêt.");
                    setLoadError("Container ref null - DOM not ready");
                    setStatus("error");
                    return;
                }
                if (!paypal?.Buttons) {
                    log("4. ERREUR: paypal.Buttons manquant");
                    setLoadError("PayPal.Buttons is undefined");
                    setStatus("error");
                    return;
                }
                log("5. Création des boutons...");
                setLoadError(null);

                const buttons = paypal.Buttons({
                    style: {
                        layout: "vertical",
                        color: "gold",
                        shape: "rect",
                        label: "paypal",
                        height: 45,
                    },
                    createOrder: (_data, actions) => {
                        return actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [
                                {
                                    amount: {
                                        currency_code: "USD",
                                        value: totalRef.current.toFixed(2),
                                    },
                                },
                            ],
                        });
                    },
                    onClick: async (_data, actions) => {
                        if (onClick) {
                            const isValid = await onClick();
                            if (!isValid) return actions.reject();
                        }
                        return actions.resolve();
                    },
                    onApprove: async (_data, actions) => {
                        if (!actions.order) return;
                        try {
                            const order = await actions.order.capture();
                            await onApprove(order.id || "");
                        } catch (err) {
                            console.error("Error capturing PayPal order:", err);
                            onError(err);
                        }
                    },
                    onError: (err) => {
                        console.error("PayPal button error:", err);
                        onError(err);
                    },
                    onCancel: () => {
                        onCancel?.();
                    },
                });

                buttonsRef.current = buttons;
                log("6. buttons.render() appelé...");
                return buttons.render(containerRef.current!);
            })
            .then(() => {
                log("7. buttons.render() SUCCESS - boutons affichés");
                if (!cancelled) setStatus("ready");
            })
            .catch((err) => {
                if (!cancelled) {
                    const msg = err?.message || String(err);
                    log(`7. ERREUR: ${msg}`);
                    console.error("PayPal load error:", err);
                    setLoadError(msg || "Failed to load PayPal. Please refresh or use another payment method.");
                    setStatus("error");
                }
            });

        return () => {
            cancelled = true;
            clearTimeout(timer);
            buttonsRef.current?.close().catch(() => {});
            buttonsRef.current = null;
        };
    }, [clientId, locale, onApprove, onError, onCancel, onClick, log]);

    if (status === "error" || loadError) {
        return (
            <div className="space-y-3">
                <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-lg text-destructive text-sm space-y-3">
                    <p>{loadError || "Failed to load PayPal. Please refresh or use another payment method."}</p>
                    <p className="text-muted-foreground">
                        Si vous utilisez Microsoft Edge : Paramètres → Confidentialité → désactivez &quot;Suivi empêché&quot;, ou essayez Chrome.
                    </p>
                    <button
                        type="button"
                        onClick={handleRetry}
                        className="text-sm underline hover:no-underline font-medium"
                    >
                        Retry
                    </button>
                </div>
                {DEBUG && logs.length > 0 && (
                    <details className="text-xs bg-muted/50 p-3 rounded border">
                        <summary className="cursor-pointer font-medium">Debug PayPal ({logs.length} logs)</summary>
                        <pre className="mt-2 overflow-auto max-h-32 font-mono whitespace-pre-wrap wrap-break-word">
                            {logs.map((l, i) => `[${i + 1}] ${l.msg}`).join("\n")}
                        </pre>
                    </details>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className={`min-h-[150px] w-full relative ${disabled ? "pointer-events-none opacity-60" : ""}`}>
                {/* Container must always be in DOM so buttons.render() has a target */}
                <div ref={containerRef} className="min-h-[120px]" />
                {status === "loading" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/90 rounded-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                        <span className="ml-2 text-sm text-muted-foreground">Loading PayPal...</span>
                    </div>
                )}
            </div>
            {DEBUG && logs.length > 0 && (
                <details className="text-xs bg-muted/50 p-3 rounded border">
                    <summary className="cursor-pointer font-medium">Debug PayPal (status: {status})</summary>
                    <pre className="mt-2 overflow-auto max-h-32 font-mono whitespace-pre-wrap wrap-break-word">
                        {logs.map((l, i) => `[${i + 1}] ${l.msg}`).join("\n")}
                    </pre>
                </details>
            )}
        </div>
    );
}
